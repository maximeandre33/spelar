import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera {
    constructor(experience) {
        this.experience = experience

        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        if (window.location.pathname !== '/')
            this.setControls()

    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        if (window.location.pathname === '/')
            this.instance.position.set(0, -0.225, 3)
        else
            this.instance.position.set(0, -0.225, 4)
        this.scene.add(this.instance)
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.target.set(0, -0.225, 0.5)
        this.controls.enableZoom = false;


        if (window.location.pathname === '/' && !this.experience.onSelect) {
            this.controls.maxDistance = 2.5
            this.controls.minDistance = 2.5
        }
        else {
            this.controls.maxDistance = 5
            this.controls.minDistance = 1.75
        }

        // this.controls.addEventListener('change', () => {
        //     window.requestAnimationFrame(() => {
        //         this.experience.time.tick()
        //     })
        // })
    }

    removeControls() {
        this.controls.dispose()
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        if (this.controls)
            this.controls.update()
    }
}