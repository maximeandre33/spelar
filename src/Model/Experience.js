import * as THREE from 'three'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import Resources from './Utils/Resources.js'

import Debug from './Debug.js'
import LoadModel from './LoadModel.js'
import Environment from './Environment.js'
import EventEmitter from './Utils/EventEmitter.js'


export default class Experience extends EventEmitter {
    constructor(type) {
        super()

        this.source = []
        // this.num = num

        this.files = null
        this.materialsFiles = null
        this.animationsFiles = null
        this.modelType = type
        this.type = 'triple'

        this.settings = {
            scale: 1,
            modelPositionX: 0,
            modelPositionY: -0.25,
            modelPositionZ: 0,
            rotation: 0,
        }

        this.display = window.location.pathname === '/display'
        // Setup
        // if (!this.display) {
        this.guiPannel = new Debug(this)
        this.debug = this.guiPannel.debug.addFolder('Edit').close()
        this.debug.domElement.id = 'gui'
        // }


        this.onSelect = true
        this.sizes = new Sizes()
        this.time = new Time(this)
        this.scene = new THREE.Scene()

        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.resources = new Resources(this.source, this)
        this.loadModel = new LoadModel(false, this)
        this.environment = new Environment(this)

        console.log('EXPERIENCE')

        this.canvas = document.createElement('canvas')

        // this.canvas = document.

        this.Rotate = true

        if (this.display) {


            this.guiPannel.debug.add(this, 'Rotate').onFinishChange(() => {
                if (this.guiPannel.debugObject.SendToHologram) {
                    this.guiPannel.rotate()
                }
            })
        }

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })
    }
    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    removeLoadingBox() {
        this.scene.remove(this.loadingMesh)
    }

    update() {

        // if (!this.display)
        this.guiPannel.stats.begin();

        // this.guiPannel.update()

        // if (this.files)
        //     this.trigger('ready')

        if (this.Rotate) {
            this.scene.rotation.y += 0.01
        }

        this.camera.update()
        this.renderer.update()
        this.loadModel.update()

        // if (!this.display)
        this.guiPannel.stats.end();
    }

    removeModel() {
        console.log('remove model', this.scene)
        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                console.log(child.geometry.dispose)
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        // this.scene.remove(child)
    }


    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) => {
            // Test if it's a mesh
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose()
                    }
                }
            }
        })

        // this.camera.controls.dispose()
        // const test = document.getElementById('backButton').remove()
        // this.guiPannel.statsFolder.domElement.removeChild(test)
        // document.getElementById

        // if (!this.display)
        document.body.removeChild(this.guiPannel.debug.domElement)
        document.body.removeChild(this.renderer.instance.domElement)
        this.renderer.instance.dispose()
        // document.getElementById('webgl0').
    }
}
