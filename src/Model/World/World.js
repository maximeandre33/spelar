import Environment from './Environment.js'
import Raycaster from './Raycaster.js'
import Name from './Name.js'
import Card from './Card.js'

export default class World {
    constructor(experience) {
        // if (experience === 0)
        this.experience = experience
        // else if (experience === 1)
        //     this.experience = new Experience2()

        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.card = new Card(this.experience)
            this.environment = new Environment(this.experience)
            this.raycaster = new Raycaster(this.experience)
            this.name = new Name(this.experience, true)
            this.description = new Name(this.experience, false)

        })
    }
    update() {
        if (this.raycaster)
            this.raycaster.update()
        if (this.name)
            this.name.update()
        if (this.description)
            this.description.update()

    }
}