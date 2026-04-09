import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        if(instance)
        {
            return instance
        }

        instance = this

        // Global access
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()

        // Sizes resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })

        // Mouse events
        this.mouse = new THREE.Vector2()
        this.objClicked = false

        window.addEventListener('mousemove', (event) =>
        {
            this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1
            this.mouse.y = - (event.clientY / this.sizes.height) * 2 + 1
        })
        
        window.addEventListener('click', () =>
        {
            this.objClicked = true
        })

        // Switch camera
        this.arrowLeft = document.querySelector('.templeUI__switchCam--left')
        this.arrowRight = document.querySelector('.templeUI__switchCam--right')

        if(this.arrowLeft)
        {
            this.arrowLeft.addEventListener('click', () =>
            {
                this.camera.previousCamera()
            })
        }

        if(this.arrowRight)
        {
            this.arrowRight.addEventListener('click', () =>
            {
                this.camera.nextCamera()
            })
        }
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
    }
}