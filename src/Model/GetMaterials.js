import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import pako from 'pako'
import * as THREE from 'three'


export default function getMaterials(compressedMaterials, experience) {

    const decompressed = pako.inflate(compressedMaterials)
    console.log(compressedMaterials, decompressed)
    // const temp = Buffer.from(decompressed).toString();
    // const test = decompressed.buffer()
    // const test = new Uint8Array(decompressed)
    const test = decompressed.buffer

    const blob = new Blob([test], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(url, (gltf) => {

        console.log('gltf = ', gltf)

        let materials = {}
        if (gltf.scene) {

            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    // materials.push(child.material)
                    materials = { ...materials, [child.material.name]: child.material }
                }
            })
            experience.resources.sceneGroup.scene.traverse((child) => {
                if (child instanceof THREE.Mesh && child.material.name !== 'White') {

                    if (materials[child.material.name]) {
                        if (materials[child.material.name].map
                            || materials[child.material.name].alphaMap
                            || materials[child.material.name].aoMap
                            || materials[child.material.name].bumpMap
                            || materials[child.material.name].displacementMap
                            || materials[child.material.name].emissiveMap
                            || materials[child.material.name].envMap
                            || materials[child.material.name].lightMap
                            || materials[child.material.name].metalnessMap
                            || materials[child.material.name].normalMap
                            || materials[child.material.name].roughnessMap) {

                            child.material.map = materials[child.material.name].map
                            child.material.alphaMap = materials[child.material.name].alphaMap
                            child.material.aoMap = materials[child.material.name].aoMap
                            child.material.bumpMap = materials[child.material.name].bumpMap
                            child.material.displacementMap = materials[child.material.name].displacementMap
                            child.material.emissiveMap = materials[child.material.name].emissiveMap
                            child.material.envMap = materials[child.material.name].envMap
                            child.material.lightMap = materials[child.material.name].lightMap
                            child.material.metalnessMap = materials[child.material.name].metalnessMap
                            child.material.normalMap = materials[child.material.name].normalMap
                            child.material.roughnessMap = materials[child.material.name].roughnessMap
                        }
                    }
                    child.material.needsUpdate = true
                }
            })
            experience.time.trigger('tick')
        }
    })

}