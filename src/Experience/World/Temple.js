import * as THREE from 'three'
import Experience from "../Experience.js"
import gsap from 'gsap'

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
                    if (child.name === 'pathLightA' || child.name === 'pathLightB' || child.name === 'pathLightC' || child.name === 'pathLightD' || child.name === 'pathLightE' || child.name === 'pathLightF') {
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

                for (const object of this.interactiveObjects)
                {
                    const objHovered = this.intersects.length > 0 && this.intersects[0].object === object
                    
                    gsap.to(object.scale, {
                        x: objHovered ? 1.2 : 1,
                        y: objHovered ? 1.2 : 1,
                        z: objHovered ? 1.2 : 1,
                        duration: 0.3
                    })

                    if (objHovered && this.experience.objClicked)
                    {
                        console.log('Objet cliqué : ' + object.name)
                        this.experience.objClicked = false
                    }
                }
            }
        }
    }
}