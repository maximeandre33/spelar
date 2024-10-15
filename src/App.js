import React, { useCallback, useState, useEffect } from 'react'
import * as THREE from 'three'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import './App.css'

import Preview from './components/Preview'
import Home from './components/Home'
import Model from './components/Model'
import getMaterials from './Model/GetMaterials'
// import setAnimation from './Model/SetAnimation'
import CardExperience from './Model/CardExperience'

import Firebase from './components/Firebase.jsx'
import {
  getDatabase,
  ref as ref_data,
  onValue
} from "firebase/database"
import {
  getStorage,
  ref as ref_storage,
  // getBlob,
  getMetadata,
  getBytes
} from "firebase/storage"



function App() {
  const [selectedCard, setSelectedCard] = useState({})
  const [modelFiles, setModelFiles] = useState({})
  const [newModel, setNewModel] = useState(false)
  const [settings, setSettings] = useState({})


  async function getModel(id, card, setModelFiles, modelData) {
    const storage = getStorage()
    console.log(modelData[id])

    const refModel = ref_storage(storage, `users/${id}/model`)
    const model = await getBytes(refModel)
    setModelFiles(oldFiles => ({ ...oldFiles, [id]: model }))
    card.loaded = true


    if (modelData[id].card.model.modelType === 'gltf') {
      card.resources.setModel(model)

      // if (modelData[id].card.model.animations) {
      //   const refAnimations = ref_storage(storage, `users/${id}/animations`)
      //   const animations = await getBytes(refAnimations)
      console.log(modelData[id])
      if (modelData[id].settings) {
        setModelFiles(oldFiles => ({ ...oldFiles, [id + 'settings']: modelData[id].settings }))
        //   setAnimation(card, animations)
      }
      if (modelData[id].card.model.textures) {
        const refMaterials = ref_storage(storage, `users/${id}/textures/0`)
        const compressedMaterials = await getBytes(refMaterials)
        setModelFiles(oldFiles => ({ ...oldFiles, [id + 'mat']: compressedMaterials }))
        getMaterials(compressedMaterials, card)
      }
    }
    else if (modelData[id].card.model.modelType === 'img') {
      card.resources.setImgModel(model)
    }
    else if (modelData[id].card.model.modelType === 'vid') {
      card.resources.setVidModel(model)
    }
  }

  const getCardInfo = useCallback((id, card) => {
    if (window.location.pathname !== '/edit' && window.location.pathname !== '/display') {
      const db = getDatabase()
      onValue(ref_data(db, `users/${id}/`),
        (snapshot) => {
          console.log(snapshot.val())
          card.modelType = snapshot.val().card.model.modelType
          card.cardName = snapshot.val().card.description.name
          card.cardDescription = snapshot.val().card.description.description
          if (snapshot.val().settings) {
            // card.settings = snapshot.val().settings.settings
            const settings = snapshot.val().settings.settings
            card.settings = { ...settings, modelPositionZ: settings.modelPositionZ - 0.2 }
          }
        }
        , {
          onlyOnce: true
        })
    }
  }, [])

  const getModelsOneByOne = useCallback((cards, sizesArray, len, timeouts, modelData) => {
    let oldCard
    if (sizesArray.length === len) {
      sizesArray.forEach((element, i) => {
        const retryFun = () => {
          if (i === 0) {
            console.log('get model and info ', element.id)
            const card = cards[element.index]
            oldCard = card
            getModel(element.id, card, setModelFiles, modelData)
            return
          }
          else if (i === sizesArray.length - 1 && oldCard.loaded) {
            console.log('get model and info ', element.id)
            const card = cards[element.index]
            oldCard = card
            getModel(element.id, card, setModelFiles, modelData)
            return timeouts.forEach((timeout) => {
              console.log('clear timeout')
              clearTimeout(timeout)
            })
          }
          else if (oldCard.loaded) {
            console.log('get model and info ', element.id)
            const card = cards[element.index]
            oldCard = card
            getModel(element.id, card, setModelFiles, modelData)
            return
          }
          else {
            console.log('retry')
            timeouts.push(setTimeout(() => { retryFun() }, 500))
          }
        }
        retryFun()
      })
    }
    else {
      console.log('retry')
      timeouts.push(setTimeout(() => { getModelsOneByOne(cards, sizesArray, len, timeouts, modelData) }, 500))
    }
  }, [])

  const getModelsFromFirebase = useCallback((auth, cards, timeouts, modelData) => {
    if (auth && cards) {
      if (cards.length) {
        const sizesArray = []

        auth.forEach((id, index) => {
          cards[index].id = id
          const storage = ref_storage(getStorage(), `users/${id}/model`)
          getMetadata(storage).then((metaData) => {
            sizesArray.push({ id: id, size: metaData.size, index: index })
            sizesArray.sort((a, b) => { return a.size - b.size })
          })
          getCardInfo(id, cards[index])
        })

        getModelsOneByOne(cards, sizesArray, auth.length, timeouts, modelData)

      }
      else {
        console.log('retry')
        timeouts.push(setTimeout(() => { getModelsFromFirebase() }, 500))
      }
    }

  }, [getCardInfo, getModelsOneByOne])

  const handleCardSelection = (auth, cards, card, index) => {
    if (!card.onSelect) {
      cards.forEach(card => {
        if (card.onSelect) {
          // document.body.style.paddingLeft = '0'
          card.canvas.className = 'unselected'
          card.onSelect = false
          card.world.raycaster.synchroniserLED.material.color = new THREE.Color(0x000000)
          card.sizes.cardReset()
          card.camera.instance.position.set(0, -0.25, 3)
          card.camera.removeControls()
        }
      })

      // if (window.innerWidth < 750) {
      // document.body.style.height = '100%'

      // card.canvas.scrollIntoView({
      //   behavior: 'smooth',
      //   // block: 'center',
      //   inline: 'center'
      // })
      // }

      card.onSelect = true
      card.sizes.cardResize()
      card.camera.instance.position.z = 3.5
      card.camera.setControls()
      card.canvas.className = 'selected'

      window.requestAnimationFrame(() => {
        card.time.tick()
      })

      setSelectedCard({
        selected: auth[index],
        auth: auth,
        cards: cards
      })
    }
  }

  const app = useCallback((auth, cards, timeouts, modelData) => {
    getModelsFromFirebase(auth, cards, timeouts, modelData)

    if (cards)
      cards.forEach((card, index) => card.canvas.addEventListener('click', () => handleCardSelection(auth, cards, card, index)))

    return () => {
      cards.forEach((card, index) => {
        card.canvas.removeEventListener('click', () => handleCardSelection(auth, cards, card, index))
        card.destroy()
      }
      )
    }
  }, [getModelsFromFirebase])

  const getData = useCallback((timeouts) => {
    const db = getDatabase()
    onValue(ref_data(db, `users/`),
      (snapshot) => {
        const modelData = snapshot.val()
        const data = {
          auth: Object.keys(snapshot.val()),
          cards: Object.keys(snapshot.val()).map(() => { return new CardExperience() })
        }
        setSelectedCard({
          selected: null,
          auth: data.auth,
          cards: data.cards
        })
        app(data.auth, data.cards, timeouts, modelData)
      }
      , {
        onlyOnce: true
      })

  }, [app, setSelectedCard])

  const firstRender = useCallback((timeouts) => {
    const getAuth = () => {
      const db = getDatabase()._instanceStarted
      ref_data(getDatabase(), `/`)
      if (db)
        getData(timeouts)
      else {
        console.log('db not loaded')
        timeouts.push(setTimeout(() => getAuth(), 500))
      }
    }
    getAuth()
  }, [getData])


  useEffect(() => {
    const timeouts = []

    if (window.location.pathname !== '/import') {
      firstRender(timeouts)
    }
  }, [firstRender])

  return (
    <div className="App" id='App'>
      <Firebase />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home selectedCard={selectedCard} setSelectedCard={setSelectedCard} />} />
          <Route path='*' exact='true' element={<Navigate to='/' />} />
          <Route path="/import" element={<Preview setNewModel={setNewModel} />} />
          <Route path="/display" element={<Model modelFiles={modelFiles} cards={selectedCard.cards} />} />
          {newModel &&
            <>
              <Route path={`/${newModel.id}/edit`} element={<Model Card={newModel.card} Model={newModel.model} Id={newModel.id} />} />
              <Route path={`/${newModel.id}`} element={<Preview card={newModel.card} modelId={newModel.id} isNew={true} />} />
            </>
          }
          {selectedCard.auth && selectedCard.auth.map((id, index) => {
            return (
              <React.Fragment key={index}>
                <Route path={`/${id}`}
                  element={<Preview settings={settings} card={selectedCard.cards[index]} modelId={id} />} />
                <Route path={`/${id}/edit`} element={<Model setSettings={setSettings} Card={selectedCard.cards[index]} Materials={modelFiles[id + 'mat']} Model={modelFiles[id]} Id={id} />} />
              </React.Fragment>
            )
          })
          }
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App