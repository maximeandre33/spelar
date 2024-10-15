import * as dat from 'lil-gui'
import EventEmitter from './Utils/EventEmitter.js'
import Stats from 'stats.js'

// import {
//     getDatabase,
//     ref,
//     set,
//     onValue
// } from "firebase/database"

export default class Debug extends EventEmitter {
    constructor(experience) {

        super()

        this.source = null
        this.experience = experience

        this.debug = new dat.GUI().close()
        this.sizes = this.experience.sizes

        // this.fold = this.debug.addFolder('Navigation').close()
        // this.importFolder = this.fold.addFolder('Options').close()

        // this.debugObject = { Import: false, SendToHologram: false }
        // this.importFolder.add(this.debugObject, 'Import').onChange(() => {
        //     if (this.debugObject.Import) {
        //         document.getElementById('dl').style.visibility = 'visible'
        //     }
        //     else {
        //         document.getElementById('dl').style.visibility = 'hidden'
        //     }
        // })

        // this.importFolder.add(this.debugObject, 'SendToHologram')
        // this.debug.add(this.debugObject, `SendToHologram`).name('Synch display')
        // .onChange(() => {
        //     console.log(this.experience.source[0].name)
        //     this.writeUserData(this.experience.source[0].name)
        // })



        this.stats = new Stats()
        this.stats.domElement.style.position = "static"
        this.stats.domElement.style.right = "0px"

        this.statsfolder = this.debug.addFolder('Stats').close()

        this.statsfolder.domElement.appendChild(this.stats.domElement)



        // this.hideImport()


        // const model = [
        //     'fox',
        //     'meka3d',
        //     'metakonz',
        //     'metaadventures',
        //     'metalegends',
        //     'uaf',
        //     'flayed',
        //     'botsskull',
        //     'Leo_Caillard_Caesar',
        //     'Leo_Caillard_Caesar_Statue',
        //     'Leo_Caillard_Proserpine',
        //     'logo',
        //     'Urban_token',
        //     'flayed_gold',
        //     'meta_adventure_new',
        //     'dragon',
        //     'wolf',
        //     'spider',
        //     'deer',
        //     'mannequin'
        // ]

        // model.forEach(id => {
        //     this.getElement(id)
        // })
    }

    // update() {
    // if (this.experience.display && this.experience.firebaseLoader) {
    // this.waitFirebase()
    //     this.trigger('ready')
    // }
    // if (this.debugObject.SendToHologram) {
    //     this.readUserData()
    //     // console.log(this.experience.source[0].name)
    //     const data = {
    //         name: this.experience.source[0].name,
    //         type: this.experience.source[0].type,
    //         path: this.experience.source[0].path
    //     }
    //     this.writeUserData(data)
    // }
    // }

    // rotate() {
    //     const db = getDatabase()
    //     set(ref(db, 'users/rotate'), {
    //         rotate: this.experience.Rotate,
    //         rotation: this.experience.loadModel.model.rotation.y
    //     })
    // }

    // getRotate() {
    //     const db = getDatabase()
    //     onValue(ref(db, 'users/rotate'), (snapshot) => {
    //         const data = snapshot.val()
    //         // console.log('rotate = ', data)
    //         this.experience.Rotate = data.rotate
    //         if (this.experience.loadModel.model)
    //             this.experience.loadModel.model.rotation.y = data.rotation
    //     })
    // }


    // animation(name) {
    //     const db = getDatabase()
    //     set(ref(db, 'users/animation'), {
    //         name: name,
    //     })
    // }

    // getAnimation() {
    //     const db = getDatabase()
    //     const starCountRef = ref(db, 'users/animation')
    //     onValue(starCountRef, (snapshot) => {
    //         const data = snapshot.val()
    //         // console.log('animation = ', data)
    //         this.experience.test = data
    //         return data
    //     })
    // }

    // writeUserData(data) {
    //     const db = getDatabase();
    //     set(ref(db, 'users/test'), {
    //         // id: userId,
    //         name: data.name,
    //         type: data.type,
    //         path: data.path
    //     })
    // }

    // readUserData() {
    //     const db = getDatabase();
    //     const starCountRef = ref(db, 'users/test')
    //     onValue(starCountRef, (snapshot) => {
    //         const data = snapshot.val()
    //         this.source = [data]
    //         // console.log(this.source)
    //     })

    // }

    // getSource() {
    //     const db = getDatabase();
    //     const starCountRef = ref(db, 'users/test')
    //     onValue(starCountRef, (snapshot) => {
    //         const data = snapshot.val()
    //         this.source = [data]
    //         this.experience.source = [data]
    //         // console.log(this.experience.source)
    //         return this.source
    //     })
    // }

    // waitFirebase() {
    //     setTimeout(() => { this.experience.source = this.getSource() }, 1000)
    // }

    // hideImport() {
    //     if (document.getElementById('dl')) {
    //         document.getElementById('dl').style.visibility = 'hidden'
    //     }
    //     else {
    //         setTimeout(() => { this.hideImport() }, 15);
    //     }
    // }

    // getElement(id) {
    //     if (document.getElementById(id) && this.importFolder) {
    //         const node = document.getElementById(id)
    //         this.importFolder.domElement.appendChild(node)
    //     } else {
    //         setTimeout(() => { this.getElement(id) }, 15);
    //     }
    // }
}
