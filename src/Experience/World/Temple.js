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

        this.raycasting = new THREE.Raycaster()

        this.templeMessageItem = document.querySelector('.templeText')

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
                    } else if (child.name === 'entranceLight' ) {
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
                if (["torch1", "torch2", "torch3", "torch4", "torch5", "torch6", "door"].includes(child.name)) {
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
                        if (object.name === "door")
                        {
                            this.templeMessageItem.textContent = "Quelle intense lumière... Impossible de voir au travers.\nQui sait ce qu'il y a derrière cette porte ?"
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch1") {
                            this.templeMessageItem.textContent = "Cette stèle a l'air plus vieille que les autres.\nLa lumière semble s'affaiblir. Étrange..."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch2") {
                            this.templeMessageItem.textContent = "Les flammes n'arrêtent pas de bouger.\nOn jurerait que quelque chose veut en sortir."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch3") {
                            this.templeMessageItem.textContent = "C'est la plus lumineuse des six torches.\nLa stèle n'est pas du tout abimée. Elle a l'air récente."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch4") {
                            this.templeMessageItem.textContent = "La lumière est faible. La flamme est calme.\nElle accompagne le silence."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch5") {
                            this.templeMessageItem.textContent = "On raconte que ces stèles renferment les âmes\ndes anciens gardiens de ce temple. Elles le protègent."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
                                        opacity: 0,
                                        y: 30,
                                        duration: 1,
                                        ease: "power4.in",
                                        delay: 6
                                    })
                                }
                            })
                        } else if (object.name === "torch6") {
                            this.templeMessageItem.textContent = "Il n'y a rien ici. Rien d'autre que de simples stèles.\nDe faibles lumières. Un lieu isolé du désert."
                            gsap.killTweensOf(this.templeMessageItem)
                            gsap.set(this.templeMessageItem, {
                                opacity: 0,
                                y: 30
                            })
                            gsap.to(this.templeMessageItem, {
                                opacity: 1,
                                y: 0,
                                duration: 1,
                                ease: "power4.out",
                                onComplete: () => {
                                    gsap.to(this.templeMessageItem, {
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