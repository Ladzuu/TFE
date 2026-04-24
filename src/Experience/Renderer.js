import * as THREE from 'three'
import Experience from "./Experience.js"
import gsap from 'gsap'

export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera

        this.templeBgColor = new THREE.Color('#1e1e1e')

        this.setInstance()
        this.templeAnimateBG()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    templeAnimateBG()
    {
        const templeVariableBgColor = new THREE.Color('#1c1e2b')

        gsap.to(this.templeBgColor, {
            r: templeVariableBgColor.r,
            g: templeVariableBgColor.g, 
            b: templeVariableBgColor.b,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            onUpdate: () => {
                this.instance.setClearColor(this.templeBgColor)
            }
        })
    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.instance.render(this.scene, this.camera.instance)
    }
}