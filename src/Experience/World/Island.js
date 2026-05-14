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

        this.islandMessageItem = document.querySelector('.sceneText')

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

            this.crystals = []
            this.pillars = []
            this.rocks = []
            this.interactiveObjects = []

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if(child.name.startsWith('crystalEmission')) {
                        child.material = this.crystalLightMaterial
                    } else if (child.name === 'waterEmissive') {
                        child.material = this.waterLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                    
                    // Animated objects
                    child.baseY = child.position.y

                    if(child.name.startsWith('crystalShard') || child.name === 'crystalCenter') {
                        this.crystals.push(child)
                    } else if(child.name === 'pillar1' || child.name === 'pillar3' || child.name === 'pillar6' || child.name === 'pillar8' || child.name === 'pillar10') {
                        this.pillars.push(child)
                    } else if(child.name.startsWith('rock')) {
                        this.rocks.push(child)
                    }

                    // Interactive objects
                    if(["pillar1", "pillar3", "pillar4", "pillar6", "pillar8", "pillar9", "pillar10", "crystalCenter", "rock4", "rock5"].includes(child.name)) {
                        this.interactiveObjects.push(child)
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
            const elapsedTime = this.experience.time.elapsed * 0.001

            // Anim island
            this.model.position.y = -6.5 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

            // Anim crystals
            for(let i = 0; i < this.crystals.length; i++)
            {
                const crystal = this.crystals[i]
                crystal.position.y = crystal.baseY + Math.sin(elapsedTime + i) * 0.2
                crystal.rotation.y = elapsedTime * 0.8 + i
            }

            // Anim pillars
            for(let i = 0; i < this.pillars.length; i++)
            {
                const pillar = this.pillars[i]
                pillar.position.y = pillar.baseY + Math.sin(elapsedTime * 0.8 + i * 0.5) * 0.5
            }

            // Anim rocks
            for(let i = 0; i < this.rocks.length; i++)
            {
                const rock = this.rocks[i]
                rock.position.y = rock.baseY + Math.sin(elapsedTime * 1.5 + i * 0.7) * 0.5
            }

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
                        if(object.name === 'crystalCenter')
                        {
                            this.islandMessageItem.textContent = "Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?"
                            gsap.killTweensOf(this.islandMessageItem)
                            gsap.set(this.islandMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.islandMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.islandMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        }

                        this.experience.objClicked = false
                    }
                }
            }
        }
    }
}