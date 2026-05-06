import Experience from '../Experience.js'
import Environment from './Environment.js'
import Temple from './Temple.js'
import Island from './Island.js'
import Map from './Map.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.ressources.on('ready', () =>
        {
            const canvas = this.experience.canvas

            if(canvas && canvas.classList.contains('model__map'))
            {
                this.map = new Map()
            }
            else if(canvas && canvas.classList.contains('model__temple'))
            {
                this.temple = new Temple()
            }
            else if(canvas && canvas.classList.contains('model__island'))
            {
                this.island = new Island()
            }

            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.map)
        {
            this.map.update()
        }
        
        if(this.temple)
        {
            this.temple.update()
        }

        if(this.island)
        {
            this.island.update()
        }
    }
}