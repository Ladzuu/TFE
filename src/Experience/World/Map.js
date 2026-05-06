import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'

export default class Map
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.resource = this.ressources.items.mapModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)
    }

    update()
    {

    }
}
