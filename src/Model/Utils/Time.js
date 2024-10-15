import EventEmitter from './EventEmitter.js'

export default class Time extends EventEmitter {
    constructor(experience) {
        super()

        this.experience = experience

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        if (this.experience.type === 'triple')
            window.requestAnimationFrame(() => {
                this.tick()
            })
    }

    tick() {
        // console.log('tick')
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        if (this.experience.onSelect) {
            window.requestAnimationFrame(() => {
                this.tick()
            })
        }
    }
}