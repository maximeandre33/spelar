import * as THREE from 'three'
// import Experience from '../CardExperience'

export default class Name {
    constructor(experience, fontSize, animationName, pos) {

        this.experience = experience
        this.fontSize = fontSize
        this.animationName = animationName
        this.pos = pos

        this.scene = this.experience.scene
        this.sizes = this.experience.sizes
        this.camera = this.experience.camera.instance

        this.setInstance()
    }

    setInstance() {

        this.canvas = document.createElement("canvas")

        if (this.animationName) {
            this.geometry = new THREE.PlaneGeometry(7, 1.2)
            this.canvas.height = 128 * 1.2
            this.canvas.width = 128 * 7
        }
        else if (this.fontSize) {
            this.geometry = new THREE.PlaneGeometry(10, 2)
            this.canvas.height = 128 * 2
            this.canvas.width = 128 * 10
        } else {
            this.geometry = new THREE.PlaneGeometry(10, 2.75)
            this.canvas.height = 128 * 2.75
            this.canvas.width = 128 * 10
        }

        this.ctx = this.canvas.getContext("2d")


        this.texture = new THREE.CanvasTexture(this.canvas)
        this.material = new THREE.MeshBasicMaterial({ map: this.texture })

        this.text = this.animationName && ''

        const rect = new Path2D();
        rect.arc(100, 75, 50, 0, 2 * Math.PI)

        this.ctx.beginPath();
        this.ctx.arc(100, 75, 50, 0, 2 * Math.PI)
        this.ctx.stroke();

        // this.experience.canvas.addEventListener('mousemove', function (event) {
        //     // Check whether point is inside circle
        //     console.log(event.offsetX, event.offsetY)
        //     if (this.ctx.isPointInPath(event.offsetX, event.offsetY)) {
        //         console.log(event.offsetX, event.offsetY)

        //     }
        // })

        this.cube = new THREE.Mesh(this.geometry, this.material)
        this.cube.scale.set(0.1, 0.1, 0.1)



        if (this.animationName) {

            this.ctx.fillStyle = "black"
            this.ctx.beginPath();
            this.ctx.arc(100, 75, 50, 0, 2 * Math.PI)
            this.ctx.stroke();
            this.ctx.fillRect(0, 0, 128 * 10, 128 * 2)
            this.ctx.fillStyle = "white"
            this.ctx.font = "75px sans-serif"

            this.cube.position.set(0.05, this.pos, 0.5)
            this.cube.rotation.y = Math.PI

            this.ctx.fillText(this.animationName, 50, 100)
            this.texture.needsUpdate = true

        }
        else {
            if (this.fontSize)
                this.cube.position.set(0, -0.55, 0.52)
            else
                this.cube.position.set(0, -0.8, 0.52)
        }


        this.scene.add(this.cube);
    }


    wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
        let words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineArray = [];

        for (var n = 0; n < words.length; n++) {
            testLine += `${words[n]} `;
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lineArray.push([line, x, y]);
                line = `${words[n]} `;
                testLine = `${words[n]} `;
                y += lineHeight;
            }
            else {
                line += `${words[n]} `;
            }
            if (n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }
        return lineArray;
    }

    update() {
        // if (!this.animationName) {

        this.ctx.fillStyle = "black"
        this.ctx.beginPath();
        this.ctx.arc(100, 75, 50, 0, 2 * Math.PI)
        this.ctx.stroke();

        if (this.fontSize) {
            this.ctx.fillRect(0, 0, 128 * 10, 128 * 2)
            this.ctx.fillStyle = "white"
            this.ctx.font = "125px sans-serif"
        }
        else {
            this.ctx.fillRect(0, 0, 128 * 10, 128 * 2.75)
            this.ctx.fillStyle = "white"
            this.ctx.font = "75px sans-serif"
        }

        // this.ctx.fillText(` ${this.text}`, 50, 175)
        let wrappedText = this.wrapText(this.ctx,
            `${this.animationName ? this.animationName : this.fontSize ? this.experience.cardName : this.experience.cardDescription}`,
            50, 100, 1250, this.fontSize ? 125 : 77)
        // wrappedTe
        wrappedText.forEach((item) => {
            // item[0] is the text
            // item[1] is the x coordinate to fill the text at
            // item[2] is the y coordinate to fill the text at
            this.ctx.fillText(item[0], item[1], item[2])

            // console.log(wrappedText)
            // this.ctx.fillText(wrappedText[0][0], wrappedText[0][1], wrappedText[0][2]);
        })


        this.texture.needsUpdate = true
        // }
    }
}