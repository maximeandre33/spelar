import * as THREE from 'three'
import EventEmitter from './EventEmitter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

// import { WebIO } from '@gltf-transform/core'
// import { DocumentView } from '@gltf-transform/view';
import pako from 'pako'


export default class Resources extends EventEmitter {
    constructor(sources, experience) {
        super()
        this.sources = sources
        this.experience = experience

        window.createImageBitmap = undefined
        this.video = null
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0
        this.ratio = 1
        this.modelActive = false
        this.time = experience.time

        this.setLoaders()
        this.startLoading()
    }


    setLoaders() {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.fbxLoader = new FBXLoader()
        this.loaders.objLoader = new OBJLoader()

        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    // setModel(model) {
    //     console.log()
    //     // console.log(this.experience)
    //     if (this.experience.modelType === 'obj')
    //         this.addOBJ(model)
    //     else if (this.experience.modelType === 'img')
    //         this.addImg(model)
    //     else if (this.experience.modelType === 'vid')
    //         this.addVid(model)
    //     else if (this.experience.modelType === 'gltf')
    //         this.addGLTF(model)
    //     else if (this.experience.modelType === 'fbx')
    //         this.addFBX(model)
    // }

    setImgModel(model) {
        console.log('setImgModel', model)
        const decompressed = pako.inflate(model)
        this.addImg(decompressed)

        // this.items['file'] = decompressed
        // this.modelActive = true

        // this.trigger('importedReady')
    }

    setVidModel(model) {
        console.log('setVidModel', model)
        const decompressed = pako.inflate(model)
        this.addVid(decompressed)
    }


    setModel(model) {
        console.log(model)
        const decompressed = pako.inflate(model)
        const uint8View = new Uint8Array(decompressed)
        // const io = new WebIO()

        const url = window.URL.createObjectURL(new Blob([uint8View.buffer]));

        const createScene = async () => {
            // const document = await io.readBinary(uint8View)
            // const documentView = new DocumentView(document);
            // const sceneDef = document.getRoot().listScenes()[0]
            // this.sceneGroup = documentView.view(sceneDef)

            this.loaders.gltfLoader.load(url, (gltf) => {

                console.log(gltf)
                this.sceneGroup = gltf

                this.experience.scene.add(this.sceneGroup.scene)

                this.items['file'] = this.sceneGroup
                this.modelActive = true

                this.trigger('importedReady')
            })
        }

        createScene()
    }

    addGLTF(arrayBuffer) {
        // const binaryData = [];
        // binaryData.push(arrayBuffer);
        const url = window.URL.createObjectURL(new Blob(arrayBuffer));
        this.loaders.gltfLoader.load(
            url,
            (file) => {
                console.log(file)
                this.importedLoaded(file)
            }
        )
    }

    addOBJ(arrayBuffer) {
        const url = window.URL.createObjectURL(new Blob(arrayBuffer))

        this.loaders.objLoader.load(
            url,
            (file) => {
                this.importedLoaded(file)
            }
        )
    }

    addFBX(arrayBuffer) {
        const url = window.URL.createObjectURL(new Blob(arrayBuffer))

        this.loaders.fbxLoader.load(
            url,
            (file) => {
                this.importedLoaded(file)
            }
        )
    }

    addImg(arrayBuffer) {
        console.log('addImg', arrayBuffer)
        // console.log(arrayBuffer)
        // const buffer = new ArrayBuffer(arrayBuffer.length)
        // arrayBuffer.forEach((value, i) => { buffer[i] = value });

        let url = window.URL.createObjectURL(new Blob([arrayBuffer.buffer]))
        // if (this.experience.type === 'triple')
        //     url = window.URL.createObjectURL(new Blob(arrayBuffer))

        this.loaders.textureLoader.load(
            url,
            (file) => {
                console.log('K')
                this.ratio = file.source.data.width / file.source.data.height
                this.importedLoaded(file)
            }
        )
    }

    addVid(arrayBuffer) {
        // this.experience.files
        const blob = new Blob([arrayBuffer.buffer])
        const url = window.URL.createObjectURL(blob)

        if (this.experience.type === 'simple') {
            const video = document.createElement('video')
            const img = document.createElement('img')

            const setTexture = (url) => {
                console.log(url)
                this.loaders.textureLoader.load(
                    url,
                    (file) => {
                        // this.ratio = file.source.data.width / file.source.data.height
                        this.importedLoaded(file)
                    }
                )
            }
            const timeupdate = function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate)
                    video.pause()
                }
            }
            video.addEventListener('loadeddata', function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate)
                    setTexture(img.src)
                }
            })
            const snapImage = function () {
                const canvas = document.createElement('canvas')
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
                const image = canvas.toDataURL()
                const success = image.length > 100000
                if (success) {
                    img.src = image
                    // document.getElementsByTagName('div')[0].appendChild(img) 
                    // URL.revokeObjectURL(url) 
                }
                return success
            }

            video.addEventListener('timeupdate', timeupdate)
            video.preload = 'metadata'
            video.src = url
            // Load video in Safari / IE11
            video.muted = true
            video.playsInline = true
            video.play()
        }
        else {
            this.video = document.createElement('video')
            this.video.src = URL.createObjectURL(blob)
            this.video.load()
            this.video.loop = true
            this.video.play()

            this.importedLoaded(this.video)
        }
    }


    startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }
    }

    importedLoaded(file) {
        console.log('ojo')
        this.items['file'] = file
        this.modelActive = true
        // this.trigger('ready')
        this.trigger('importedReady')
    }
}
