import {
    getDatabase,
    ref as ref_database,
    set
} from 'firebase/database'
import {
    getStorage,
    ref as ref_storage,
    uploadBytesResumable,
} from "firebase/storage"

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'
import * as THREE from 'three'
import compression from './Compression'
import pako from 'pako'



// DATABASE
const setDatabase = (id, exp, animationsBool, texturesBool) => {
    console.log('database')
    const db = getDatabase()
    set(ref_database(db, `/users/${id}/card/model`), {
        modelType: exp.modelType,
        textures: texturesBool,
        animations: animationsBool
    })
}

export default function submit(files, newId, exp, setProgress, progress, setFiles) {
    console.log(exp.modelType)
    // exp.resources.addGLTF(files)

    // const storage = getStorage()
    // uploadBytesResumable(ref_storage(storage, `/users/${newId}`), exp.loadModel.model)
    //     .on("state_changed", (snapshot) => {
    //         setProgress(Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100))
    //     })
    // console.log('FILE SENT -> ', newId);

    // setFiles(false)

    // const io = new WebIO();

    // setProgress(prevState => ({
    //     ...prevState,
    //     model: 1,
    //     total: 1
    // }))

    if (exp.modelType === 'gltf' || exp.modelType === 'obj' || exp.modelType === 'fbx') {

        const exporter = new GLTFExporter()

        const modelScene = exp.modelType === 'gltf' ? exp.resources.items['file'].scene : exp.resources.items['file']
        let materials = {}



        // modelScene.animations = exp.resources.items['file'].animations

        modelScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (child.material.map) {
                    materials = { ...materials, [child.material.name]: child.material.clone() }
                    console.log(materials)
                    // child.material = new THREE.MeshStandardMaterial()
                }
                if (child.material.map)
                    child.material.map = null
                if (child.material.alphaMap)
                    child.material.alphaMap = null
                if (child.material.aoMap)
                    child.material.aoMap = null
                if (child.material.bumpMap)
                    child.material.bumpMap = null
                if (child.material.displacementMap)
                    child.material.displacementMap = null
                if (child.material.emissiveMap)
                    child.material.emissiveMap = null
                if (child.material.envMap)
                    child.material.envMap = null
                if (child.material.lightMap)
                    child.material.lightMap = null
                if (child.material.metalnessMap)
                    child.material.metalnessMap = null
                if (child.material.normalMap)
                    child.material.normalMap = null
                if (child.material.roughnessMap)
                    child.material.roughnessMap = null
                // child.material.map = null

            }
        })

        console.log(exp.resources.items['file'].animations)


        exporter.parse(modelScene, (buffer) => {
            // const json = io.binaryToJSON(buffer);
            console.log('oh');

            console.log(modelScene)
            compression(buffer, materials, newId, setProgress, progress)

        }, (err) => { console.error(err) }, { binary: true, animations: exp.resources.items['file'].animations });


        // setDisabledSaveButton(true)
        // setDisabledEditButton(false)

        // console.log(exp.scene)



        const animationsBool = false
        // animations ? animations.length > 0 : false
        const texturesBool = materials !== {}
        setDatabase(newId, exp, animationsBool, texturesBool)
    }
    else if (exp.modelType === 'img' || exp.modelType === 'vid') {

        // const img = exp.resources.items['file']
        console.log(files)
        const uint8View = new Uint8Array(files[0])
        const compressed = pako.deflate(uint8View)
        console.log(compressed)
        // MODEL
        const storage = getStorage()
        uploadBytesResumable(ref_storage(storage, `/users/${newId}/model`), compressed)
            .on("state_changed", (snapshot) => {
                const thisProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                setProgress(prevState => ({
                    ...prevState,
                    total: thisProgress
                }))
                console.log(thisProgress)
            })
        console.log('FILE SENT -> ', newId);


        setDatabase(newId, exp, false, false)
    }



    if (files)
        setFiles(false)

}

