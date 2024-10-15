import * as THREE from 'three'
import {
    getDatabase,
    ref as ref_database,
    set
} from 'firebase/database'


export default class Raycaster {
    constructor(experience) {
        this.experience = experience

        this.oldName = ''
        this.isSynch = false
        this.animation = 'none'
        this.isRotating = false

        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.camera = this.experience.camera.instance

        this.buttonArray = this.experience.buttonArray

        this.model = this.experience.world.card.model.children

        this.rotationLED = this.model.find(child => child.name === 'RotationLED')
        this.synchroniserLED = this.model.find(child => child.name === 'SynchroniserLED')
        this.rotationLED.material.color = new THREE.Color(0x000000)
        this.synchroniserLED.material.color = new THREE.Color(0x000000)

        this.rotation = this.model.find(child => child.name === 'Rotation')
        this.spin = this.model.find(child => child.name === 'Spin')
        this.synchroniser = this.model.find(child => child.name === 'Synchroniser')

        this.rotation.userData.name = 'Rotation'
        this.spin.userData.name = 'Spin'
        this.synchroniser.userData.name = 'Synchroniser'

        this.buttonArray.push({ object: this.spin }, { object: this.rotation }, { object: this.synchroniser })

        this.setInstance()
    }

    setInstance() {

        this.raycaster = new THREE.Raycaster()
        this.rayOrigin = new THREE.Vector3(- 3, 0, 0)
        this.rayDirection = new THREE.Vector3(10, 0, 0)
        this.rayDirection.normalize()

        /**
         * Mouse
         */
        this.mouse = new THREE.Vector2()

        // get the offset of the canvas relative to the document
        function getOffset(experience) {
            const bounds = experience.canvas.getBoundingClientRect()
            return {
                x: bounds.left + window.scrollX,
                y: bounds.top + window.scrollY,
            }
        }

        window.addEventListener('wheel', (event) => {
            if (this.experience.groups.length > 3) {
                if (((this.experience.groups[0].position.y + 0.35 + event.deltaY / 1000) > 0.35)
                    && ((this.experience.groups[this.experience.groups.length - 1].position.y + 0.35 - this.experience.groups.length * 0.22 + event.deltaY / 1000) < -0.45)) {

                    this.experience.groups.forEach((group, index) => {
                        group.position.y += event.deltaY / 1000
                        const text = this.experience.animationsNames[index]
                        if (
                            (group.position.y + 0.35 - index * 0.22) > 0.48
                            || (group.position.y + 0.35 - index * 0.22) < -0.45
                        )
                            text.cube.visible = false

                        else
                            text.cube.visible = true
                    })
                }
            }
        })


        window.addEventListener('mousemove', (event) => {
            if (this.experience) {
                const bounds = getOffset(this.experience)
                this.mouse.x = (event.clientX - bounds.x + window.scrollX) / this.sizes.width * 2 - 1
                this.mouse.y = - ((event.clientY - bounds.y + window.scrollY) / this.sizes.height) * 2 + 1
            }
        })

        window.addEventListener('click', () => {
            if (this.currentIntersect && this.experience.camera.controls) {
                if (Math.abs(this.experience.camera.controls.getAzimuthalAngle()) > 1.5) {

                    // SYNCHRO
                    if (this.currentIntersect === 'Synchroniser') {
                        if (this.synchroniserLED.material.color.getHexString() === '000000') {
                            this.isSynch = true
                            this.synchroniserLED.material.color.setHex(0xff0000)
                        }
                        else {
                            this.isSynch = false
                            this.synchroniserLED.material.color.setHex(0x000000)
                        }
                    }

                    // ROTATION
                    if (this.currentIntersect === 'Rotation')
                        if (this.rotationLED.material.color.getHexString() === '000000') {
                            this.isRotating = true
                            this.rotationLED.material.color.setHex(0xff0000)
                        }
                        else {
                            this.isRotating = false
                            this.rotationLED.material.color.setHex(0x000000)
                        }

                    // ANIMATIONS
                    this.experience.animationsNames.forEach((animation, index) => {
                        console.log(this.currentIntersect, animation.animationName)
                        if (this.currentIntersect === animation.animationName) {
                            if (this.experience.groups[index].children[2].material.color.getHexString() === 'ff0000') {
                                this.animation = 'none'
                                this.experience.groups[index].children[2].material.color.setHex(0x000000)
                            }
                            else {
                                this.animation = animation.animationName
                                console.log(this.animation)
                                this.experience.groups[index].children[2].material.color.setHex(0xff0000)
                            }
                        }
                        else {
                            this.experience.groups[index].children[2].material.color.setHex(0x000000)
                        }
                    })
                    console.log(this.animation)

                    // SYNCH DATABASE
                    if (this.isSynch) {
                        const db = getDatabase()
                        set(ref_database(db, `/display`), {
                            id: this.experience.id,
                            animation: this.animation,
                            rotation: this.isRotating,
                            modelType: this.experience.modelType,
                        })
                    }
                    this.oldName = this.currentIntersect
                }
            }
        })

    }
    update() {
        // Cast a ray from the mouse and handle events
        this.raycaster.setFromCamera(this.mouse, this.camera)

        this.objectsToTest = Object.keys(this.experience.buttonArray).map(key => this.experience.buttonArray[key].object)
        const intersects = this.raycaster.intersectObjects(this.objectsToTest)

        let name
        const inter = intersects.find(intersect => intersect.object.name === 'Button'
            || intersect.object.name === 'Rotation'
            || intersect.object.name === 'Spin'
            || intersect.object.name === 'Synchroniser')
        if (inter) {
            name = (inter.object.name === 'Rotation'
                || inter.object.name === 'Spin'
                || inter.object.name === 'Synchroniser'
            )
                ? inter.object.name
                : inter.object.userData.name
        }
        this.currentIntersect = name
    }
}