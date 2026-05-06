import * as THREE from 'three'
import Experience from "../Experience.js"
import gsap from 'gsap'

export default class Island
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.raycasting = new THREE.Raycaster()

        // Setup
        this.resource = this.ressources.items.godIsland

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)

        // Baked Texture
        this.bakedTexture = this.ressources.items.islandTexture
        if(this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.waterLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.crystalLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if (child.name === 'crystalEmission1' || child.name === 'crystalEmission2' || child.name === 'crystalEmission3' || child.name === 'crystalEmission4' || child.name === 'crystalEmission5' || child.name === 'crystalEmission6' || child.name === 'crystalEmission7' || child.name === 'crystalEmission8' || child.name === 'crystalEmission9' || child.name === 'crystalEmission10' || child.name === 'crystalEmission11') {
                        child.material = this.crystalLightMaterial
                    } else if (child.name === 'waterEmissive') {
                        child.material = this.waterLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                }
            })
        }

        this.model.scale.setScalar(0.8)
    }

    update()
    {
        if(this.model)
        {
            this.model.position.y = -7 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2
        }
    }
}