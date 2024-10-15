
import * as THREE from 'three'
import Name from './World/Name'
import shaderMaterial from './CardShader'
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import pako from 'pako'

export default function setAnimation(experience, animations) {
    const exp = experience
    // const model = exp.model
    const model = experience.resources.items['file']
    console.log(experience)


    // if (animations) {

    //     const decompressed = pako.inflate(animations)
    //     console.log(animations, decompressed)

    //     const test = decompressed.buffer

    //     const blob = new Blob([test], { type: 'application/octet-stream' })
    //     const url = URL.createObjectURL(blob)

    //     const gltfLoader = new GLTFLoader()
    //     gltfLoader.load(url, (gltf) => {
    //         model.animations = gltf.scene.userData.animations
    //     })

    // }
    console.log(exp.isCard)
    if (model.animations.length > 0) {
        exp.animation = {}
        const timeouts = []

        if (exp.isCard) {
            const waitForCard = () => {
                if (exp.world.card) {

                    timeouts.forEach(timeout => {
                        console.log('timeout')
                        clearTimeout(timeout)
                    })

                    const logo = exp.world.card.model.children.find(child => child.name === 'LOGO')
                    logo.material.visible = false

                    const originalButton = exp.world.card.model.children.find(child => child.name === 'Button')
                    originalButton.material.visible = true
                    const originalButtonLED = exp.world.card.model.children.find(child => child.name === 'AnimationLED')
                    originalButtonLED.material.visible = true

                    exp.groups = model.animations.map((animation, index) => {
                        const group = new THREE.Group()
                        const animName = new Name(exp, false, animation.name, 0.35 - index * 0.22)
                        exp.animationsNames.push(animName)
                        group.add(animName.cube)

                        if (index === 0) {
                            originalButton.position.y = 0.35
                            originalButtonLED.position.y = 0.35

                            group.add(originalButton)
                            group.add(originalButtonLED)

                            originalButton.userData = { name: animation.name }
                            exp.buttonArray.push({ object: originalButton, name: animation.name })
                        } else {
                            const button = originalButton.clone()
                            const buttonLED = originalButtonLED.clone()

                            buttonLED.material = new THREE.MeshBasicMaterial({ color: 0x000000 })
                            buttonLED.material.onBeforeCompile = (shader) => { shaderMaterial(shader) }


                            button.position.y = 0.35 - index * 0.22
                            buttonLED.position.y = 0.35 - index * 0.22

                            group.add(button)
                            group.add(buttonLED)

                            button.userData.name = animation.name
                            exp.buttonArray.push({ object: button, name: animation.name })
                        }
                        if (index > 5) {
                            animName.cube.visible = false
                        }
                        exp.scene.add(group)
                        return group
                    })
                }
                else {
                    console.log('retry')
                    timeouts.push(setTimeout(waitForCard, 200))
                }
            }
            waitForCard()
        }


        // console.log(exp.animationsNames)

        // Mixer
        exp.animation.mixer = new THREE.AnimationMixer(model.scene)

        // if (exp.debugFolder)
        //     exp.debugFolder.destroy()

        // if (exp.debug) {

        // Actions
        exp.animation.actions = {}
        // exp.debugFolder = exp.debug.addFolder('Animations')

        // if (!exp.display) {

        model.animations.forEach((animation) => {
            // const debugObject = {
            //     play: () => {
            //         exp.animation.play(animation.name)
            //         // if (exp.guiPannel.debugObject.SendToHologram)
            //         //     exp.guiPannel.animation(animation.name)
            //     }
            // }
            exp.animation.actions[animation.name] = exp.animation.mixer.clipAction(animation)
            // exp.debugFolder.add(debugObject, `play`).name(animation.name)
        })
        // }

        exp.animation.actions.current = exp.animation.actions[Object.keys(exp.animation.actions)[0]]
        exp.animation.current = exp.animation.actions.current

        // exp.guiPannel.getAnimation()
        // }

        // Play the action
        exp.animation.play = (name) => {
            if (exp.animation.actions[name]) {
                const newAction = exp.animation.actions[name]

                const oldAction = exp.animation.current
                console.log("PLAYYYYY", newAction)

                newAction.reset()
                newAction.play()
                newAction.crossFadeFrom(oldAction, 1)

                exp.animation.current = newAction
            }
        }
    }
}