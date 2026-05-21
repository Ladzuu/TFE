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

        this.raycasting = new THREE.Raycaster()

        this.resource = this.ressources.items.mapModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)

        // Baked Texture
        this.bakedTexture = this.ressources.items.mapTexture
        if(this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.crystalLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.villageLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.templeLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.waterLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.riverLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if(child.name.startsWith('crystalEmission') || child.name.startsWith('potLight')) {
                        child.material = this.crystalLightMaterial
                    } else if (child.name.startsWith('doorLight') || child.name.startsWith('window')) {
                        child.material = this.villageLightMaterial
                    } else if (child.name.startsWith('pathLight') || child.name === 'doorTemple') {
                        child.material = this.templeLightMaterial
                    } else if (child.name === 'waterEmissive') {
                        child.material = this.waterLightMaterial
                    } else if (child.name === 'river') {
                        child.material = this.riverLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                }
            })

            // Interactive objects
            this.interactiveObjects = []
        }

        this.model.rotation.y = Math.PI
    }

    update()
    {
        if(this.model)
        {

        }
    }
}
