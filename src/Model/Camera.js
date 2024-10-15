import * as THREE from 'three'



export default class Camera {
    constructor(experience) {
        this.experience = experience
        this.debug = this.experience.debug
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.isVid = this.experience.modelType === 'vid'

        this.views = {
            right: {
                left: 0.6,
                bottom: 0.5,
                width: window.innerWidth > 600 ? 0.4 : 0.5,
                height: 0.5,
                background: new THREE.Color(0.5, 0.5, 0.7),
                eye: { x: 0, y: 0, z: -2 },
                up: [-1, 0, 0],
                fov: 55,
            },
            left: {
                left: 0,
                bottom: 0.5,
                width: window.innerWidth > 600 ? 0.4 : 0.5,
                height: 0.5,
                background: new THREE.Color(0.7, 0.5, 0.5),
                eye: { x: 0, y: 0, z: 2 },
                up: [-1, 0, 0],
                fov: 55,
            },
            top: {
                left: 0,
                bottom: 0,
                width: window.innerWidth > 600 ? 0.5 : 1,
                height: 0.5,
                background: new THREE.Color(0.5, 0.7, 0.7),
                eye: { x: 2, y: 0, z: 0 },
                up: [0, 1, 0],
                fov: 55,
            }
        }
        // Debug
        this.debugFolder = this.debug.addFolder('Cameras').close()
        this.rightFolder = this.debugFolder.addFolder('Right').close()
        this.leftFolder = this.debugFolder.addFolder('Left').close()
        this.topFolder = this.debugFolder.addFolder('Top').close()


        this.setInstance()
    }

    setInstance() {
        this.right = new THREE.PerspectiveCamera(this.views.right.fov, this.sizes.width / this.sizes.height, 1, 10000)
        this.left = new THREE.PerspectiveCamera(this.views.left.fov, this.sizes.width / this.sizes.height, 1, 10000)
        this.top = new THREE.PerspectiveCamera(this.views.top.fov, this.sizes.width / this.sizes.height, 1, 10000)

        this.right.position.fromArray([this.views.right.eye.x, this.views.right.eye.y, this.views.right.eye.z])
        this.left.position.fromArray([this.views.left.eye.x, this.views.left.eye.y, this.views.left.eye.z])
        this.top.position.fromArray([this.views.top.eye.x, this.views.top.eye.y, this.views.top.eye.z])

        this.right.up.fromArray(this.views.right.up)
        this.left.up.fromArray(this.views.left.up)
        this.top.up.fromArray(this.views.top.up)


        for (let i = 0; i < 3; i++) {

            const folder = i === 0 ? this.rightFolder : i === 1 ? this.leftFolder : this.topFolder
            const camera = i === 0 ? this.right : i === 1 ? this.left : this.top

            // Debug
            folder
                .add(camera, 'fov')
                // .name('envMapIntensity')
                .min(0)
                .max(200)
                .step(1)
            folder
                .add(camera.position, 'x')
                // .name('envMapIntensity')
                .min(-100)
                .max(100)
                .step(0.5)
            folder
                .add(camera.position, 'y')
                // .name('envMapIntensity')
                .min(-100)
                .max(100)
                .step(0.5)
            folder
                .add(camera.position, 'z')
                // .name('envMapIntensity')
                .min(-100)
                .max(100)
                .step(0.5)

        }
    }

    resize() {
        this.right.aspect = this.sizes.width / this.sizes.height
        this.right.updateProjectionMatrix()
        this.left.aspect = this.sizes.width / this.sizes.height
        this.left.updateProjectionMatrix()
        this.top.aspect = this.sizes.width / this.sizes.height
        this.top.updateProjectionMatrix()
    }

    update() {
        this.right.lookAt(0, 0, 0)
        this.left.lookAt(0, 0, 0)
        this.top.lookAt(0, 0, 0)
    }
}