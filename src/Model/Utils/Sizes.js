import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
    constructor() {
        super()

        // this.innerWidth = document.body.clientWidth
        // this.innerHeight = document.body.clientWidth
        this.innerWidth = window.innerWidth
        this.innerHeight = window.innerHeight

        console.log(this.innerWidth, this.innerHeight)

        this.resize()
        // Resize event
        window.addEventListener('resize', () => {
            this.resize()
            this.trigger('resize')
        })
    }
    resize() {

        if (window.location.pathname === '/display' || window.location.pathname.endsWith('/edit')) {
            this.width = this.innerWidth
            this.height = this.innerHeight
        }
        // else if (window.location.pathname === '/') {
        //     this.width = window.innerHeight / 1.5
        //     this.height = window.innerHeight * 1
        // }
        else {
            this.width = this.innerHeight / 3
            this.height = this.innerHeight / 2
        }
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    }
    cardReset() {
        this.width = this.innerHeight / 3
        this.height = this.innerHeight / 2
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.trigger('resize')
    }
    cardResize() {
        this.width = this.innerHeight / 2
        this.height = this.innerHeight * 0.8
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)
        this.trigger('resize')
    }
}