import * as THREE from 'three'
import Experience from "../Experience.js"

export default class Temple
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        // Raycasting
        this.raycasting = new THREE.Raycaster()

        // Setup
        this.resource = this.ressources.items.templeModel

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)

        // Baked texture
        this.bakedTexture = this.ressources.items.templeTexture
        if (this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.pathLightsMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.entranceLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if (child.name === 'pathLightA' || child.name === 'pathLightB' || child.name === 'pathLightC' ||
                        child.name === 'pathLightD' || child.name === 'pathLightE' || child.name === 'pathLightF') {
                        child.material = this.pathLightsMaterial
                    } else if (child.name === 'entranceLight') {
                        child.material = this.entranceLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                }
            })

            // Interactive objects
            this.interactiveObjects = []
            this.model.traverse((child) =>
            {
                if (['torch1', 'torch2', 'torch3', 'torch4', 'torch5', 'torch6', 'door'].includes(child.name)) {
                    this.interactiveObjects.push(child)
                }
            })
        }
    }

    update()
    {
        if(this.model)
        {
            // Temple Animation
            this.model.position.y = -1 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

            // Raycasting
            if (this.interactiveObjects && this.interactiveObjects.length > 0)
            {
                this.raycasting.setFromCamera(this.experience.mouse, this.experience.camera.instance)

                this.intersects = this.raycasting.intersectObjects(this.interactiveObjects)

                // Reset scales
                for (const object of this.interactiveObjects)
                {
                    object.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
                }

                // Scale up hovered object
                if (this.intersects.length > 0)
                {
                    this.intersects[0].object.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1)
                }
            }
        }
    }
}