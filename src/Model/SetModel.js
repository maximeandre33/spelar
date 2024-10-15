
import * as THREE from 'three'
import shaderMaterial from './CardShader'
// import setAnimation from './SetAnimation'


export default function setModel(experience) {
    const exp = experience

    // if (window.location.pathname.includes('import')) {
    //     exp.model = exp.model.scene
    //     console.log(exp.resources.items['file'])
    //     // if (exp.resources.items['file'].animations.length > 0)
    //     // exp.model.animations = exp.resources.items['file'].animations
    // }
    // else {
    //     console.log(exp.model)
    // }

    exp.model.rotation.x = -Math.PI
    exp.model.children[0].visible = true
    const borderBox = new THREE.Box3().setFromObject(exp.model)
    const center = borderBox.getCenter(new THREE.Vector3())
    const size = borderBox.getSize(new THREE.Vector3())

    const maxAxis = Math.max(size.x, size.y, size.z)
    exp.model.scale.multiplyScalar(1 / maxAxis)
    borderBox.setFromObject(exp.model)
    borderBox.getCenter(center)
    borderBox.getSize(size)
    exp.model.position.copy(center).multiplyScalar(-1)
    exp.model.position.y = -(size.y * 0.5)
    exp.model.position.y = -1
    // updateAllMaterials(exp.scene, debugObject, environmentMap)
    exp.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            // console.log(child)
            child.material.envMap = exp.resources.environmentMapTexture
            // child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
            // if (child.material.map) {
            //     console.log(child.material)
            //     child.material.map.magFilter = THREE.NearestFilter;
            //     child.material.map.minFilter = THREE.LinearMipMapLinearFilter;
            //     child.material.map.needsUpdate = true
            // }
        }
    })
    console.log(exp.model)

    if (exp.isCard) {
        exp.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.onBeforeCompile = (shader) => { shaderMaterial(shader) }
                // child.material.map.transparent = true
                // console.log(child.material)
            }
        })
        exp.scene.add(exp.model)
        exp.experience.removeLoadingBox()
        exp.time.trigger('tick')
        // exp.model.scale.multiplyScalar(10)

        // exp.time.trigger('tick')




        // window.requestAnimationFrame(() => {
        //     exp.time.tick()
        // })

    }
    else {
        exp.scene.add(exp.model)
        if (exp.isCard)
            exp.time.trigger('tick')
        // window.requestAnimationFrame(() => {
        //     exp.time.tick()
        // })
    }

    // const button = exp.experience.world.card.model.children.find(child => child.name === 'Button')
    // button.material.visible = false
    // const buttonLED = exp.experience.world.card.model.children.find(child => child.name === 'AnimationLED')
    // buttonLED.material.visible = false

    exp.setSettings()

    // exp.model.position.y = -0.35
    // if (exp.isCard)
    //     exp.model.position.z = -0.2
    // else
    //     exp.model.position.z = 0

    if (exp.debug) {
        exp.debugObject = {
            scale: 1,
            rotation: 0,
        }

        exp.debugModelFolder.add(exp.debugObject, 'scale')
            .min(0)
            .max(1.3)
            .name('scale')
            .onChange((event) => {
                exp.experience.settings.scale = event
                exp.model.scale.set(exp.debugObject.scale, exp.debugObject.scale, exp.debugObject.scale)
            })


        // if (exp.experience.display)
        // exp.experience.guiPannel.getRotate()

        exp.debug.add(exp.debugObject, 'rotation')
            .min(-Math.PI)
            .max(Math.PI)
            .name('rotation')
            .onChange((event) => {
                exp.experience.settings.rotation = event
                exp.model.rotation.y = exp.debugObject.rotation
                // if (exp)
                // exp.experience.guiPannel.rotate()
            }
            )
        exp.debugModelFolder.add(exp.model.position, 'x')
            .min(-1)
            .max(1)
            .name('positionX')
            .onChange((event) => { exp.experience.settings.modelPositionX = event })
        exp.debugModelFolder.add(exp.model.position, 'y')
            .min(-1)
            .max(1)
            .name('positionY')
            .onChange((event) => { exp.experience.settings.modelPositionY = event })

        exp.debugModelFolder.add(exp.model.position, 'z')
            .min(-1)
            .max(1)
            .name('positionZ')
            .onChange((event) => { exp.experience.settings.modelPositionZ = event })
    }


    // if (window.location.pathname.includes('import'))
    //     setAnimation(exp)

    if (exp.isCard)
        exp.time.trigger('tick')
}
