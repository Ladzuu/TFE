import * as THREE from 'three'
import Experience from "../Experience.js"
import gsap from 'gsap'

export default class Village
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.raycasting = new THREE.Raycaster()

        // Setup
        this.resource = this.ressources.items.villageModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)

        // Baked Texture
        this.bakedTexture = this.ressources.items.villageTexture
        if(this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.windowLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF })
            this.potLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if (child.name === 'doorLight' || child.name === 'doorLightUp' || child.name === 'window1' || child.name === 'window2' || child.name === 'window3' || child.name === 'window4' || child.name === 'window5' || child.name === 'window6' || child.name === 'windwo7' || child.name === 'window8' || child.name === 'window9' || child.name === 'windwo10' || child.name === 'window11' || child.name === 'window12' || child.name === 'windowTop') {
                        child.material = this.windowLightMaterial
                    } else if (child.name === 'potLight1' || child.name === 'potLight2' || child.name === 'potLight3') {
                        child.material = this.potLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                }
            })
        }

    }

    update()
    {
        if(this.model)
        {
            this.model.position.y = -2 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2
        }
    }
}