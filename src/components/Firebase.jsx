import { initializeApp } from "firebase/app"
import {
    getAuth,
    signInAnonymously,
} from "firebase/auth"
import { useEffect } from 'react'

const Firebase = () => {


    useEffect(() => {
        // Initialize Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyAZMILiIxET9X6cC3_zcBf-dyhEs0FH25g",
            authDomain: "hologramme-160ba.firebaseapp.com",
            databaseURL: "https://hologramme-160ba-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "hologramme-160ba",
            storageBucket: "hologramme-160ba.appspot.com",
            messagingSenderId: "100002171069",
            appId: "1:100002171069:web:9308fa56c1e0d0d2cb8fd4"
        }
        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)


        signInAnonymously(auth, app)
            .catch((e) => console.error('Anonymous sign in failed: ', e))
            .then(() => {
                console.log('Anonymous sign in succeeded')
                // const userId = auth.currentUser.uid;
                // writeUserData()
                // getModelsNum()

                // if (!newCard) {
                // }
            })
    }, [])


    return null
}

export default Firebase
