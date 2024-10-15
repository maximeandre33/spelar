import { useCallback, useEffect, useState, useMemo } from 'react'
import Experience from '../Model/Experience'
import { getApps } from "firebase/app"

import { useNavigate } from 'react-router-dom'
import { Button } from '@material-ui/core'
import {
    getDatabase,
    ref as ref_database,
    set,
    onValue
} from 'firebase/database'



const Model = ({ Model, Id, Card, cards, modelFiles, setSettings, Materials }) => {
    let model = Model
    let materials = Materials

    const idModel = Id
    const card = Card
    console.log(model)

    const editExperience = useMemo(() => model ? new Experience(card.modelType) : null, [model, card])

    const [displayModeData, setDisplayModeData] = useState()
    const [exp, setExp] = useState()
    const [onlyOnce, setOnlyOnce] = useState(true)


    // const style = document.getElementById('container').style
    // style.flexDirection = 'row'
    // style.padding = '0'
    // if (window.location.pathname === '/display') {
    //     style.overflow = 'hidden'
    // }

    const getAuth = useCallback((timeouts) => {
        const db = getApps().length !== 0
        if (db) {
            const db = getDatabase()
            const starCountRef = ref_database(db, `/display`)
            onValue(starCountRef, (snapshot) => {
                const data = snapshot.val()
                console.log('display = ', data)
                setDisplayModeData(data)
            })
        }
        else {
            console.log('db not loaded')
            timeouts.push(setTimeout(() => getAuth(), 200))
        }
        return timeouts
    }, [])


    useEffect(() => {
        const timeouts = []
        console.log('useEffect')
        if (model) {
            editExperience.id = idModel
            editExperience.files = model
            // model = null
            editExperience.materialsFiles = materials
            // materials = null
            editExperience.trigger('ready')
            editExperience.trigger('materialsReady')
            editExperience.settings = card.settings

            // card.onSelect = false
        }
        else {
            // window.scroll(0, 0)
            timeouts.splice(0, timeouts.length, ...getAuth(timeouts))
        }
        return timeouts.forEach((timeout) => {
            console.log('clear timeout')
            clearTimeout(timeout)
        }
        )
    }, [getAuth, card, model, editExperience, idModel, materials])

    useEffect(() => {
        if (displayModeData && onlyOnce) {
            console.log('onlyOnce')
            setOnlyOnce(false)
            const experience = new Experience(displayModeData.modelType)
            setExp({ experience: experience })
        }
    }, [displayModeData, onlyOnce])

    const watchDisplaySettings = useCallback(() => {

        const experience = exp.experience

        // if (experience && modelFiles) {
        const data = displayModeData
        console.log(data)
        experience.modelType = data.modelType
        experience.renderer.isVid = data.modelType === 'vid'
        experience.renderer.setViews()


        if (cards && cards[0].id)
            experience.settings = cards.find(card => card.id === data.id).settings

        if (experience.loadModel) {
            console.log(experience.id, data.id)


            if (experience.id !== data.id && experience.id) {
                experience.scene.children = []
                // experience.scene.traverse((child) => {
                //     // Test if it's a mesh
                //     if (child instanceof THREE.Mesh) {
                //         console.log('oh')

                //         child.geometry.dispose()

                //         // Loop through the material properties
                //         for (const key in child.material) {
                //             const value = child.material[key]

                //             // Test if there is a dispose function
                //             if (value && typeof value.dispose === 'function') {
                //                 value.dispose()
                //             }
                //         }
                //     }
                // })
                console.log(experience)
                // experience.resources.modelActive = false
                // experience.loadModel.model.visible = false
                experience.modelType = data.modelType
                experience.files = null
                experience.materialsFiles = null
                experience.animationsFiles = null

                // experience.resources.setModel(modelFiles[displayModeData.id])


                // if (data.animations !== 'none') {
                // const refAnimations = ref_storage(storage, `users/${id}/animations`)
                // const animations = await getBytes(refAnimations)
                // setModelFiles(oldFiles => ({ ...oldFiles, [id + 'anim']: animations }))

                // }

            }
            experience.id = data.id

            experience.loadModel.playing = data.animation
            console.log(data.animation)
        }
        // if (data.animation !== 'none')
        //     experience.animation.play(data.animation)

        if (!experience.files) {

            console.log(modelFiles)
            console.log('succed watch display settings', data)
            experience.files = modelFiles[data.id]
            experience.materialsFiles = modelFiles[data.id + 'mat']
            if (modelFiles[data.id + 'settings']) {
                experience.settings = modelFiles[data.id + 'settings'].settings
                console.log(modelFiles[data.id + 'settings'])
            }


            experience.trigger('ready')
            experience.trigger('materialsReady')


            console.log('test')
            // card.resources.setModel(modelFiles[data.id])
            // card.loaded = true
            // getMaterials(compressedMaterials, card, data.id, setModelFiles)

        }
        // }
        // else {
        //     console.log('retry')
        //     setTimeout(() => watchDisplaySettings(), 200)
        // }
    }, [modelFiles, cards, exp, displayModeData])

    useEffect(() => {
        console.log(exp)
        if (exp) {
            console.log('watchDisplaySettings')
            watchDisplaySettings()
        }
    }, [watchDisplaySettings, exp])

    const handleBack = () => {

        if (card) {
            // card.onSelect = true
            editExperience.destroy()
        }
        else
            exp.experience.destroy()
        navigate(`/${idModel}`, { replace: true })
    }

    // DATABASE    
    const handleSave = () => {
        setSettings(editExperience.settings)
        const db = getDatabase()
        set(ref_database(db, `/users/${idModel}/settings/`), {
            settings: editExperience.settings
        })
    }

    const navigate = useNavigate()

    return (
        <>
            <Button variant='contained' style={{ position: 'fixed', zIndex: '100', left: '0', bottom: '0', margin: '10px' }} onClick={handleBack}  >Retour</Button>
            {window.location.pathname !== '/display' &&
                <Button variant='contained' style={{ position: 'absolute', zIndex: '100', left: '0', bottom: '40px', margin: '10px' }} onClick={handleSave}  >Enregistrer</Button>
            }
        </>
    )
}

export default Model