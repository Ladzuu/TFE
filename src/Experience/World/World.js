import Experience from '../Experience.js'
import Environment from './Environment.js'
import Temple from './Temple.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        // Wait for ressources
        this.ressources.on('ready', () =>
        {
            // Setup
            this.temple = new Temple()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.temple)
        {
            this.temple.update()
        }
    }
}