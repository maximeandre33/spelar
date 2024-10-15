import * as THREE from 'three'
import shaderMaterial from './CardShader.js'

import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './SimpleCamera.js'
import Renderer from './BasicRenderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import LoadModel from './LoadModel.js'
import EventEmitter from './Utils/EventEmitter.js'
// import sources from './sources'


export default class CardExperience extends EventEmitter {
    constructor() {
        super()

        this.files = null
        this.modelType = ''
        this.videoUrl = null
        this.type = 'simple'

        this.isCard = true
        // this.num = num
        // console.log(this.num)

        // this.firebaseLoader = null

        // this.userSource = userSource
        // if (userSource)
        //     this.source = userSource
        // else

        this.source = [
            {
                name: 'environmentMapTexture',
                type: 'cubeTexture',
                path:
                    [
                        `/environmentMaps/2/px.jpg`,
                        `/environmentMaps/2/nx.jpg`,
                        `/environmentMaps/2/py.jpg`,
                        `/environmentMaps/2/ny.jpg`,
                        `/environmentMaps/2/pz.jpg`,
                        `/environmentMaps/2/nz.jpg`
                    ]
            },
            {
                name: 'nftCard',
                type: 'gltfModel',
                path: '/nftCard.glb',
            }
        ]



        this.settings = {
            scale: 1,
            modelPositionX: 0,
            modelPositionY: -0.25,
            modelPositionZ: 0,
            rotation: 0,
        }


        this.cardName = ''
        this.cardDescription = ''
        // Singleton
        // if (instance) {
        //     return instance
        // }
        // instance = this

        // Global access
        // window.experience = this

        // Options

        this.onSelect = false
        this.clicked = false
        this.id = null

        this.canvas = document.createElement('canvas')
        this.canvas.style.paddingBottom = '5px'

        // this.canvas.className = `webgl${this.num}`
        // button.innerHTML = "Retour"
        // const button = document.getElementById('backButton')
        // document.getElementById('root').appendChild(this.canvas)

        // this.webglCanvas = `canvas.webgl${this.num}`
        // this.canvas = document.querySelector(this.webglCanvas)
        // console.log(this, this.canvas)

        // this.webglCanvas = document.a

        // Setup
        this.sizes = new Sizes()
        this.time = new Time(this)
        this.scene = new THREE.Scene()
        this.resources = new Resources(this.source, this)
        this.camera = new Camera(this)
        this.renderer = new Renderer(this)
        this.world = new World(this)
        this.loaded = false

        this.animationsNames = []
        this.buttonArray = []
        this.groups = []

        this.loadModel = new LoadModel(true, this)

        this.loadingBox = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2)
        this.loadingBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
        this.loadingBoxMaterial.wireframe = true
        this.loadingBoxMaterial.onBeforeCompile = shaderMaterial
        this.loadingMesh = new THREE.Mesh(this.loadingBox, this.loadingBoxMaterial)
        this.loadingMesh.position.y = 0.125
        this.scene.add(this.loadingMesh)

        // Resize event
        this.sizes.on('resize', () => {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () => {
            this.update()
        })

    }

    removeLoadingBox() {
        this.scene.remove(this.loadingMesh)
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
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

        if (this.camera.controls)
            this.camera.controls.dispose()
        this.renderer.instance.dispose()
        document.body.removeChild(this.canvas)
    }



    update() {
        // if (this.files)
        //     this.trigger('ready')
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.loadModel.update()

        this.loadingMesh.rotation.z += 0.005
        this.loadingMesh.rotation.x += 0.005
    }
}