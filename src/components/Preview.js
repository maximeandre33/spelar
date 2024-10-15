import { useEffect, useCallback, useMemo, useRef, useState } from 'react'
import CardExperience from '../Model/CardExperience'
import DragAndDrop from './DragAndDrop'
import NavButtons from './NavButtons'
import FormInput from './FormInput'
import submit from './Submit'

import {
    getDatabase,
    ref as ref_database,
    set
} from 'firebase/database'

import { useForm, FormProvider } from 'react-hook-form'
import { motion } from "framer-motion"
import { Button, Grid, Card, CardContent, ThemeProvider } from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'

const theme = createTheme({
    palette: {
        action: {
            disabled: '#303030'
        }
    }
})


const Preview = ({ card, modelId, setNewModel, isNew, settings }) => {
    const [disabledSubmit, setDisabledSubmit] = useState(false)
    const [cardId, setCardId] = useState(modelId ? modelId : '')
    const [nameFormContent, setNameFormContent] = useState('')
    const [descriptionFormContent, setDescriptionFormContent] = useState('')
    const [oldCard, setOldCard] = useState({})
    const [files, setFiles] = useState(false)
    const [progress, setProgress] = useState({ model: 0, animations: 0, texture0: 0, texture1: 0, texture2: 0, total: 0 })
    const methods = useForm()
    const form = useRef()

    // EXPERIENCE
    const exp = useMemo(() => {

        // window.scroll(0, 0)
        const bodyStyle = document.body.style
        const containerStyle = document.getElementById('container').style

        containerStyle.overflow = 'hidden'

        if (window.innerWidth < 750) {
            // bodyStyle.overflow = 'visible'
            bodyStyle.display = 'flex'
            bodyStyle.flexDirection = 'column-reverse'
            bodyStyle.overflow = 'visible'
            bodyStyle.height = '100%'

            containerStyle.height = '100%'
            containerStyle.padding = ' 0 50px 0 50px'
            containerStyle.justifyContent = 'center'
        }
        else {

            bodyStyle.display = 'flex'
            bodyStyle.flexDirection = 'row-reverse'
            bodyStyle.justifyContent = 'center'
            bodyStyle.alignItems = 'center'

        }
        if (card) {

            // // if (window.innerWidth > 750) {
            //     const appStyle = document.getElementById('App')
            //     appStyle.style.width = '35vw'
            // // }
            card.canvas.className = ''
            // const appClass = document.getElementById('App')
            // appClass.appendChild(card.canvas)

            setOldCard({
                name: card.cardName,
                description: card.cardDescription
            })

            setNameFormContent(card.cardName)
            setDescriptionFormContent(card.cardDescription)
            return card
        }
        else {
            const card = new CardExperience()
            // card.onSelect = true
            // if (card.onSelect)
            //     window.requestAnimationFrame(() => {
            //         card.time.tick()
            //     })
            card.sizes.cardResize()
            card.camera.instance.position.z = 3.5
            card.camera.setControls()

            return card
        }
    }, [card])


    // INITIALIZE
    useEffect(() => {
        console.log('Init')

        if (files) {
            exp.files = files
            exp.trigger('ready')
            console.log(files)
        }
        if (card) {
            if (settings.scale) {
                exp.settings = settings
                console.log(settings)
                exp.loadModel.setSettings()
            }
        }
        if (exp.world.name) {
            console.log('test')
            exp.cardName = nameFormContent
            exp.cardDescription = descriptionFormContent
        }
        console.log('test')

    }, [files, card, exp, nameFormContent, descriptionFormContent, settings])


    // SUBMIT
    const handleSubmit = useCallback((e) => {
        e.preventDefault()

        let newId
        if (card)
            newId = modelId
        else {
            newId = 'id' + (new Date()).getTime()
            setCardId(newId)
        }

        if (!card) {
            setDisabledSubmit(true)
            setProgress({ model: 1, animations: 0, texture0: 0, texture1: 0, texture2: 0, total: 1 })
            submit(files, newId, exp, setProgress, progress, setCardId, setFiles, nameFormContent, descriptionFormContent)
        }
        const db = getDatabase()
        set(ref_database(db, `/users/${newId}/card/description`), {
            name: nameFormContent,
            description: descriptionFormContent,
        })

    }, [files, card, modelId, exp, descriptionFormContent, nameFormContent, progress])

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', position: 'relative',
            margin: '10px', color: 'white', top: '0px', width: '80vw'
        }} id='card' >
            <ThemeProvider theme={theme}>
                <Card className='responsiveCard' >
                    {!(card || exp.files) && <CardContent style={{ height: '100px', width: '200px' }} >
                        <motion.div
                            initial={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            exit={{ opacity: 0, translateY: 6 }}
                            transition={{ duration: 0.4 }}>

                            <DragAndDrop card={exp} setFiles={setFiles} />

                        </motion.div  >
                    </CardContent>}
                    <CardContent style={{ paddingBottom: '15px' }} >

                        <FormProvider {...methods}>
                            <form ref={form} onSubmit={handleSubmit}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={6}>
                                        <motion.div
                                            initial={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            exit={{ opacity: 0, translateY: 10 }}
                                            transition={{ delay: 0.1, duration: 0.4 }}
                                            style={{ width: '100%' }}>

                                            <FormInput required value={nameFormContent}
                                                onChange={(e) => {
                                                    setNameFormContent(e.target.value)
                                                }}
                                                name="Name" label="Nom" />

                                        </motion.div >
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <motion.div
                                            initial={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            exit={{ opacity: 0, translateY: 10 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                            style={{ width: '100%' }}>

                                            <FormInput value={descriptionFormContent} onChange={e => setDescriptionFormContent(e.target.value)} name="description" label="Description" />

                                        </motion.div >
                                    </Grid>
                                    <Grid item xs={2} sm={2} style={{ display: 'flex', alignItems: 'center', }}>
                                        <motion.div
                                            initial={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            exit={{ opacity: 0, translateY: 10 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                            style={{ width: '100%', marginTop: '10px' }}>
                                            <Button type="submit" className="savebutton" disabled={disabledSubmit && progress.total !== 100} variant="contained" color="primary">
                                                {!disabledSubmit ? 'Enregistrer' : `${progress.total}%`}
                                            </Button>

                                        </motion.div >
                                    </Grid>
                                </Grid>
                            </form>
                        </FormProvider>
                    </CardContent>
                </Card >

                <NavButtons card={card} exp={exp} cardId={cardId} setNewModel={setNewModel} isNew={isNew} oldCard={oldCard} progress={progress} setDisabledSubmit={setDisabledSubmit} />
            </ThemeProvider>
        </div >
    )
}

export default Preview

