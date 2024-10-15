import * as THREE from 'three'


export default class Card {
    constructor(experience) {
        // if (num === 0)
        this.experience = experience
        // else if (num === 1)
        // this.experience = new Experience2()

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Resource
        this.resource = this.resources.items.nftCard

        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {

                if (child.name === 'Button' || child.name === 'AnimationLED') {
                    child.material.visible = false
                }
                if (child.name === 'Background' || child.name === 'Back' || child.name === 'LOGO' || child.name === 'AnimationLED' || child.name === 'Button') {

                    child.material.onBeforeCompile = (shader) => {
                        shader.precision = 'lowp'

                        shader.shadowMapEnabled = false
                        shader.uniforms.face = { value: 0 }
                        shader.vertexShader = shader.vertexShader.replace(
                            '#include <common>',
                            `
                        #include <common>
                         out vec3 worldPosition;
                         `
                        )
                        shader.vertexShader = shader.vertexShader.replace(
                            '#include <begin_vertex>',
                            `
                        #include <begin_vertex>
                        worldPosition = vec3(modelMatrix * vec4(position, 1.0));
                        `
                        )
                        shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <common>',
                            `
                        #include <common>
                        
                        in vec3 worldPosition;
                        uniform int face;
                        
                        const vec2 corners[4] = vec2[](vec2(0.5, 0.5), vec2(-0.5, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5));
                        bool order(vec2 A, vec2 B, vec2 C) {
                            return (C.y-A.y) * (B.x-A.x) > (B.y-A.y) * (C.x-A.x);
                        }
                        bool intersect(vec2 A, vec2 B, vec2 C, vec2 D) {
                            return order(A,C,D) != order(B,C,D) && order(A,B,C) != order(A,B,D);
                        }
                        `
                        )
                        shader.fragmentShader = shader.fragmentShader.replace(
                            '#include <clipping_planes_fragment>',
                            `
                        #include <clipping_planes_fragment>
                        vec2 a = worldPosition.xz;
                        vec2 b = cameraPosition.xz;
                        vec2 aa ;
                        vec2 bb ; 
                        if (bool(mod(float(face),2.0))){
                            aa = worldPosition.xy;
                            bb = cameraPosition.xy; 
                        }
                        else{
                            aa = worldPosition.yz;
                            bb = cameraPosition.yz;
                        }
                        int next = int(mod(float(face + 1), 4.0));
                        vec2 c = corners[face];
                        vec2 d = corners[next];
                        if (!(intersect(a, b, c, d) && intersect(aa, bb, c, d))) {
                            discard;
                        }
                        `
                        )
                    }
                }
            }
        })
        this.scene.add(this.model)
        // window.requestAnimationFrame(() => {
        //     this.experience.time.tick()
        // })
        this.experience.time.trigger('tick')
    }
}

