import React, { useCallback } from 'react'
import download from './assets/download.jpg'
import { useDropzone } from 'react-dropzone'


const DragAndDrop = ({ card, setFiles }) => {

    const onDrop = useCallback(acceptedFiles => {

        console.log(acceptedFiles)
        acceptedFiles.forEach((file) => {

            if (file.type === 'image/jpeg' || file.type === 'image/png') {
                card.modelType = 'img'
                console.log('IMG')
            }
            else if (file.type === 'video/mp4') {
                card.modelType = 'vid'
                console.log('VIDEO')
            }
            if (file.type === '') {
                if (file.path.endsWith('glb')) {
                    card.modelType = 'gltf'
                    console.log('GLTF')
                }
                else if (file.path.endsWith('fbx')) {
                    card.modelType = 'fbx'
                    console.log('FBX')
                }
                else if (file.path.endsWith('obj')) {
                    card.modelType = 'obj'
                    console.log('OBJ')
                }
            }

            const reader = new FileReader()
            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                setFiles([reader.result])
                console.log(reader)
            }
            reader.readAsArrayBuffer(file)

            // }

        })
    }, [setFiles, card])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'obj/gltf': ['.glb', '.gltf'],
            'obj/wavefront': ['.obj'],
            'obj/fbx': ['.fbx'],
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'video/mp4': ['.mp4', '.mov', '.mwv', '.avi'],
        }
    })

    return (
        <div {...getRootProps()} >
            <input {...getInputProps()} />
            {
                <div id="dl">
                    <p className='drop'>
                        Importer
                        <img src={download} alt="download" style={{ position: 'relative', width: '50px', height: '50px' }} />
                    </p>
                </div>
            }
        </div >
    )
}

export default DragAndDrop