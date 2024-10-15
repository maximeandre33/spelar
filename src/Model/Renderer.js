import * as THREE from 'three'

export default class Renderer {
    constructor(experience) {
        this.experience = experience
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.resources = this.experience.resources
        this.environment = this.experience.environment

        this.isVid = this.experience.modelType === 'vid'

        this.setViews()

        this.debugFolder = this.debug.addFolder('Renderer').close()
        this.leftFolder = this.debugFolder.addFolder('Left').close()
        this.rightFolder = this.debugFolder.addFolder('Right').close()
        this.topFolder = this.debugFolder.addFolder('Top').close()

        this.setInstance()

        if (this.experience.display)
            this.scene.background = new THREE.Color(0, 0, 0)

        document.body.appendChild(this.instance.domElement)
    }
    setViews() {
        this.views = {
            right: {
                left: window.innerWidth > 600 ? 0.6 : 0.5,
                bottom: 0.5,
                width: window.innerWidth > 600 ? 0.4 : 0.5,
                height: this.isVid ? 0 : 0.5,
                background: new THREE.Color(0.5, 0.5, 0.7),
                up: [1, 0, 0],
            },
            left: {
                left: 0,
                bottom: 0.5,
                width: window.innerWidth > 600 ? 0.4 : 0.5,
                height: this.isVid ? 0 : 0.5,
                background: new THREE.Color(0.7, 0.5, 0.5),
                up: [1, 0, 0],
            },
            top: {
                left: this.isVid ? 0 : window.innerWidth > 600 ? 0.25 : 0,
                bottom: 0,
                width: this.isVid ? 1 : window.innerWidth > 600 ? 0.5 : 1,
                height: this.isVid ? 1 : 0.5,
                background: new THREE.Color(0.5, 0.7, 0.7),
                up: [0, 1, 0],
            }
        }
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.ReinhardToneMapping
        this.instance.toneMappingExposure = 3
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        // this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

        this.instance.domElement.style.position = 'fixed'
        this.instance.domElement.style.top = '0'
        this.instance.domElement.style.background = 'black'

        const container = document.getElementById('container')
        container.appendChild(this.instance.domElement)

        this.debugFolder.add(this.instance, 'toneMapping', {
            No: THREE.NoToneMapping,
            Linear: THREE.LinearToneMapping,
            Reinhard: THREE.ReinhardToneMapping,
            Cineon: THREE.CineonToneMapping,
            ACESFilmic: THREE.ACESFilmicToneMapping
        })
            .onFinishChange(() => {
                this.instance.toneMapping = Number(this.instance.toneMapping)
                // updateAllMaterials()
            })
        this.debugFolder.add(this.instance, 'toneMappingExposure').min(0).max(10).step(0.001)

        for (const [key] of Object.entries(this.views)) {
            const folder = key === 'right' ? this.rightFolder : key === 'left' ? this.leftFolder : this.topFolder
            folder
                .add(this.views[key], 'left')
                .min(0).max(1).step(0.0001)
            folder
                .add(this.views[key], 'width')
                .min(0).max(1).step(0.0001)
            folder
                .add(this.views[key], 'height')
                .min(0).max(1).step(0.0001)
            folder
                .add(this.views[key], 'bottom')
                .min(0).max(1).step(0.001)
        }

        this.bg = { Background: false }
        this.experience.guiPannel.debug.add(this.bg, 'Background')
            .onChange(() => {
                if (this.bg.Background)
                    this.scene.background = new THREE.Color(0, 0, 0)
                else
                    this.scene.background = this.scene.environment
            })

    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        // this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
    }

    update() {

        let left
        let bottom
        let width
        let height


        left = Math.floor(this.sizes.width * this.views.right.left)
        bottom = Math.floor(this.sizes.height * this.views.right.bottom)
        width = Math.floor(this.sizes.width * this.views.right.width)
        height = Math.floor(this.sizes.height * this.views.right.height)

        this.instance.setViewport(left, bottom, width, height)
        this.instance.setScissor(left, bottom, width, height)
        this.instance.setScissorTest(true)
        this.instance.setClearColor(this.views.right.background)

        this.camera.right.aspect = width / height
        this.camera.right.updateProjectionMatrix()

        this.instance.render(this.scene, this.camera.right)


        left = Math.floor(this.sizes.width * this.views.left.left)
        bottom = Math.floor(this.sizes.height * this.views.left.bottom)
        width = Math.floor(this.sizes.width * this.views.left.width)
        height = Math.floor(this.sizes.height * this.views.left.height)

        this.instance.setViewport(left, bottom, width, height)
        this.instance.setScissor(left, bottom, width, height)
        this.instance.setScissorTest(true)
        this.instance.setClearColor(this.views.left.background)

        this.camera.left.aspect = width / height
        this.camera.left.updateProjectionMatrix()

        this.instance.render(this.scene, this.camera.left)



        left = Math.floor(this.sizes.width * this.views.top.left)
        bottom = Math.floor(this.sizes.height * this.views.top.bottom)
        width = Math.floor(this.sizes.width * this.views.top.width)
        height = Math.floor(this.sizes.height * this.views.top.height)

        this.instance.setViewport(left, bottom, width, height)
        this.instance.setScissor(left, bottom, width, height)
        this.instance.setScissorTest(true)
        this.instance.setClearColor(this.views.top.background)

        this.camera.top.aspect = width / height
        this.camera.top.updateProjectionMatrix()

        this.instance.render(this.scene, this.camera.top)
    }
}