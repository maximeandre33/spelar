import '../App.css'

import * as THREE from 'three'
import setModel from './SetModel'
import shaderMaterial from './CardShader'
import getMaterials from './GetMaterials'
import setAnimation from '../Model/SetAnimation'


export default class LoadModel {
    constructor(IsCard, experience) {
        this.isCard = IsCard
        // if (num === 0)
        this.experience = experience
        this.playing = 'none'

        // else if (num === 1)
        // if (this.isCard)
        //     this.experience = new CardExperience2()
        // else
        //     this.experience = new Experience()



        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        if (this.debug)
            this.debugModelFolder = this.debug.addFolder('Model')

        this.importedLoaded = false

        // this.resource = { re: null }


        this.experience.on('ready', () => {
            console.log(this.experience.files)

            // this.experience.LoadModel.modelActive = true
            if (this.experience.type === 'triple') {
                if (this.experience.modelType === 'gltf') {
                    this.resources.setModel(this.experience.files)
                    console.log(this.experience.materialsFiles)
                    getMaterials(this.experience.materialsFiles, this.experience)

                    //   console.log(modelFiles[data.id + 'anim'])

                }
                else if (this.experience.modelType === 'img')
                    this.resources.setImgModel(this.experience.files)
                else if (this.experience.modelType === 'vid')
                    this.resources.setVidModel(this.experience.files)


                this.importedLoaded = true
            }

            if (!this.importedLoaded) {
                // // this.experience.
                // // compression(this.experience)
                // //     console.log(this.experience.modelType)
                if (this.experience.modelType === 'gltf')
                    this.resources.addGLTF(this.experience.files)
                else if (this.experience.modelType === 'img') {
                    console.log('IMG')
                    this.resources.addImg(this.experience.files)
                }
                else if (this.experience.modelType === 'vid')
                    this.resources.addVid(this.experience.files)
                else if (this.experience.modelType === 'obj')
                    this.resources.addOBJ(this.experience.files)
                else if (this.experience.modelType === 'fbx')
                    this.resources.addFBX(this.experience.files)

                this.importedLoaded = true
                //     this.experience.onSelect = true
            }
        })

        // this.experience.on('materialsReady', () => {
        //     if (this.experience.type === 'triple') {
        //         console.log('materialsReady')
        //     }
        // })

        this.resources.on('importedReady', () => {

            // this.scene.children.forEach(child => {
            //     if (child.type === 'Group')
            //         child.children.forEach(childd => {
            //             childd.visible = false
            //         })
            // })



            console.log('import ready', this.experience.modelType)
            console.log(this.experience.modeltype)
            if (this.experience.modelType === 'obj'
                || this.experience.modelType === 'fbx'
                || this.experience.modelType === ''
            ) {
                this.model = this.resources.items['file']
                setModel(this)

            }
            else if (this.experience.modelType === 'gltf') {

                // if (this.experience.files && this.experience.type !== 'triple')
                //     this.model = this.resources.items['file']
                // else
                this.model = this.resources.items['file'].scene
                console.log(this.resources.items['file'], this.resources.items['file'].scene, this.model, this.experience.type === 'triple')
                // this.scene.add(this.model)
                setModel(this)


                setAnimation(this.experience, this.experience.animationsFiles)


            }
            else if (this.experience.modelType === 'img') {
                console.log('tjen')
                this.setImgPresentation(this.resources.items['file'])
            }
            else if (this.experience.modelType === 'vid') {
                this.setVidPresentation(this.resources.items['file'])
            }
        })

        // this.resources.on('ready', () => {
        //     // console.log(this.experience.source)
        //     if (this.experience.display)
        //         this.resource = { re: this.resources.items[this.experience.source[0].name] }
        //     else
        //         this.resource = { re: this.resources.items[this.experience.source[0].name] }
        //     // this.resource = { re:  }
        //     // if (this.experience.userSource)
        //     setModel(this)
        //     // console.log(this.resources)
        // })
    }

    setImgPresentation(img) {
        console.log(img)
        img.encoding = THREE.sRGBEncoding

        const material = new THREE.MeshPhongMaterial({ map: img })
        // console.log(material)
        if (this.isCard)
            material.onBeforeCompile = (shader) => { shaderMaterial(shader) }

        let geometry
        if (this.experience.resources.ratio < 1)
            geometry = new THREE.BoxBufferGeometry(this.experience.resources.ratio, 1)
        else
            geometry = new THREE.BoxBufferGeometry(1, 1 / this.experience.resources.ratio)
        this.model = new THREE.Mesh(geometry, material)

        if (this.isCard)
            this.model.position.set(0, 0.075, -0.5)
        else
            this.model.position.set(0, 0, 0)

        this.experience.removeLoadingBox()
        this.scene.add(this.model)

        if (this.isCard)
            this.time.trigger('tick')
        // const group = new THREE.Group()
        // group.add(mesh)
        // group.add(mesh)
        // this.scene.add(mesh)
        // this.model = group
        // setModel(this)
    }

    setVidPresentation(imgtexture) {


        // console.log('VIDEOOOO')
        // const material = new THREE.MeshPhongMaterial({ map: texture })
        // material.onBeforeCompile = (shader) => { shaderMaterial(shader) }


        if (!this.isCard) {
            const texture = new THREE.VideoTexture(this.experience.resources.video)
            texture.encoding = THREE.sRGBEncoding
            this.videoMaterial = new THREE.MeshStandardMaterial({ map: texture })
            this.videoMaterial.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader
                    .replace(
                        `#include <fog_vertex>`,
                        `#include <fog_vertex>
                        gl_Position = vec4(position, 1.0);`)
            }
            this.videoGeometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)

        }
        else {
            imgtexture.encoding = THREE.sRGBEncoding
            this.videoMaterial = new THREE.MeshStandardMaterial({ map: imgtexture })
            this.videoGeometry = new THREE.PlaneBufferGeometry(1, 0.9)
        }
        this.model = new THREE.Mesh(this.videoGeometry, this.videoMaterial)
        this.model.position.set(0, 0.05, 0.5)
        // console.log(this.model)

        this.experience.removeLoadingBox()
        this.scene.add(this.model)
        if (this.isCard)
            this.time.trigger('tick')
    }

    setSettings = () => {
        const set = this.experience.settings
        // console.log(this.experience.settings)
        // this.model.scale.multiplyScalar(set.scale)
        this.model.position.x = set.modelPositionX
        this.model.position.y = set.modelPositionY
        this.model.position.z = set.modelPositionZ
        this.model.rotation.x = set.rotation
    }


    update() {
        // if (this.experience.animationsNames) {

        //     if (this.animation)
        //         this.experience.animationsNames.forEach((name) => {
        //             name.update()
        //         })

        // }
        if (this.experience.animation) {
            if (this.playing !== 'none') {
                if (this.playing !== this.experience.animation.current._clip.name) {
                    this.experience.animation.play(this.playing)
                    console.log(this.playing)
                }
            }
            // else {
            //     if (this.animation.current)
            //         this.animation.current.stop()
            // }
        }

        // if (this.resources.sceneGroup.animations)
        //     this.resources.sceneGroup.animations.forEach((animation) => {
        //         animation.update()
        //     }

        if (this.experience.animation)
            if (this.experience.animation.actions)
                this.experience.animation.mixer.update(this.time.delta * 0.001)
    }
}