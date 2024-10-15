import * as THREE from 'three'
// import { WebIO } from '@gltf-transform/core'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

// import { reorder, weld, dedup, quantize, center, colorspace, metalRough, prune, dequantize, sequence, normals, textureResize } from '@gltf-transform/functions'
// import { reorder, center, prune, sequence } from '@gltf-transform/functions'
// import { MeshoptCompression, KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
// import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import pako from 'pako'
import {
    getStorage,
    ref as ref_storage,
    uploadBytesResumable,
} from "firebase/storage"


export default async function compression(files, materials, newId, setProgress) {
    // await MeshoptDecoder.ready;
    // await MeshoptEncoder.ready;

    const uint8View = new Uint8Array(files);
    // const io = new WebIO().registerExtensions(KHRONOS_EXTENSIONS)
    // const modelDocument = await io.readBinary(uint8View)

    // await modelDocument.transform(
    //     // textureResize({ size: [128, 128] }),
    //     reorder({ encoder: MeshoptEncoder, level: 'medium' }),
    //     // dequantize(),
    //     // weld(),
    //     // dedup(),
    //     center({ pivot: 'below' }),
    //     // colorspace({ inputEncoding: 'sRGB' }),
    //     // metalRough(),
    //     prune(),
    //     sequence()
    //     // normals(),
    // )

    // modelDocument.createExtension(MeshoptCompression)
    //     .setRequired(true)
    //     .setEncoderOptions({ method: MeshoptCompression.EncoderMethod.FILTER });

    // const testo = await io.writeBinary(modelDocument);

    const compressed = pako.deflate(uint8View);


    // MODEL
    const storage = getStorage()
    uploadBytesResumable(ref_storage(storage, `/users/${newId}/model`), compressed)
        .on("state_changed", (snapshot) => {
            const thisProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * (50 + 5 + (materials === {} ? 45 : 0)))
            // (animations ? (animations.length > 0 ? 0 : 5) : 5)
            setProgress(prevState => ({
                ...prevState,
                model: thisProgress,
                total: prevState.texture0 + prevState.texture1 + prevState.texture2 + prevState.model + prevState.animations
            }))
            console.log(thisProgress)
        })
    console.log('FILE SENT -> ', newId);

    const exporter = new GLTFExporter()

    // // ANIMATIONS
    // if (animations ? (animations.length > 0) : false) {
    //     const scene = new THREE.Scene()
    //     scene.animations = animations
    //     scene.userData = { animations: animations }
    //     console.log(scene)
    //     exporter.parse(scene, (gltf) => {
    //         const buffer = pako.deflate(gltf)
    //         uploadBytesResumable(ref_storage(storage, `/users/${newId}/animations`), buffer)
    //             .on("state_changed", (snapshot) => {
    //                 const thisProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 5)
    //                 setProgress(prevState => ({
    //                     ...prevState,
    //                     animations: thisProgress,
    //                     total: (prevState.texture0 + prevState.texture1 + prevState.texture2 + prevState.model + prevState.animations)
    //                 }))
    //             })
    //     }, (err) => { console.error(err) }, { binary: true })
    // }

    // MATERIALS
    if (materials !== {}) {
        const testo = []
        Object.values(materials).forEach(material => {
            testo.push(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material))
        })

        for (let i = 0; i < 3; i++) {
            exporter.parse(testo, (gltf) => {
                const buffer = pako.deflate(gltf)
                uploadBytesResumable(ref_storage(storage, `/users/${newId}/textures/${i}`), buffer)
                    .on("state_changed", (snapshot) => {

                        const thisProgress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * (5 + i * 10))
                        setProgress(prevState => ({
                            ...prevState,
                            [`texture${i}`]: thisProgress,
                            total: (prevState.texture0 + prevState.texture1 + prevState.texture2 + prevState.model + prevState.animations)
                        }))
                    })
            }, (err) => { console.error(err) },
                { binary: true, maxTextureSize: 256 * Math.pow(2, i * 2) }
            )
        }

    }

}