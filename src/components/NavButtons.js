import { useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { motion } from "framer-motion"
import { Button } from '@material-ui/core'

import {
    getStorage,
    ref as ref_storage,
    deleteObject
} from "firebase/storage"
import {
    getDatabase,
    ref as ref_database,
    remove
} from 'firebase/database'



const NavButtons = ({ card, exp, cardId, setNewModel, isNew, progress }) => {


    // const [disabledEditButton, setDisabledEditButton] = useState(false)

    console.log(progress.total)

    // useEffect(() => {
    //     if (exp.cardName === oldCard.name && exp.cardDescription === oldCard.description) {
    //         setDisabledSubmit(true)

    //         setDisabledEditButton(false)
    //     }
    //     else if (progress.total === 100)
    //         setDisabledSubmit(false)
    //     else if (progress.total > 0)
    //         setDisabledSubmit(true)
    //     else {
    //         setDisabledSubmit(false)

    //         setDisabledEditButton(true)
    //     }
    // }, [ exp, oldCard, progress, setDisabledSubmit])

    const removeFromStorage = useCallback((id) => {
        console.log(id)
        const storage = getStorage()
        const storageRefs = []
        storageRefs.push(ref_storage(storage, `/users/${id}/model`))
        storageRefs.push(ref_storage(storage, `/users/${id}/textures/0`))
        storageRefs.push(ref_storage(storage, `/users/${id}/textures/1`))
        storageRefs.push(ref_storage(storage, `/users/${id}/textures/2`))

        storageRefs.forEach((ref, i) => {
            deleteObject(ref)
                .catch((error) => {
                    console.log(error)
                })
                .then(() => {
                    if (i === storageRefs.length - 1)
                        window.location.href = '/'
                })

        })
        const db = getDatabase()
        remove(ref_database(db, `/users/${id}`))
    }, [])

    // NAVIGATION
    const navigate = useNavigate()

    const handleClickEdit = useCallback(() => {
        // if (card)
        //     card.canvas.className = 'hidden-card'
        // else {
        if (!card) {
            console.log(exp, cardId, exp.files)
            exp.canvas.className = 'hidden-card'
            setNewModel({
                card: exp,
                id: cardId,
                model: exp.files,
            })
        }
        navigate(`/${cardId}/edit`, { replace: true })
    }, [navigate, cardId, card, exp, setNewModel])

    const handleClickBack = useCallback(() => {
        // window.scroll(0, 0)
        // if (card) {
        //     card.onSelect = true
        //     // document.getElementById('container').appendChild(card.canvas)
        // }
        if (window.location.pathname === '/import' || isNew)
            window.location.href = '/'
        else
            navigate('/', { replace: false })
        if (!card)
            exp.destroy()
    }, [navigate, exp, card, isNew])


    return (
        <motion.div
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 10 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            style={{ marginTop: '10px', left: '-50%', margin: '10px' }}>

            <Button type='button' disabled={false} variant="contained" color="primary" onClick={handleClickEdit} >
                Modifier
            </Button>

            {cardId !== '' &&
                (<Button type='button' variant="contained" color="primary" style={{ backgroundColor: 'red' }} onClick={() => removeFromStorage(cardId)} >
                    Supprimer
                </Button>)
            }

            <Button type='button' variant="contained" color="primary" onClick={handleClickBack} >
                Retour
            </Button>

        </motion.div >
    )
}

export default NavButtons