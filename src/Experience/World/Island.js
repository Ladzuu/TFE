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

        this.overlayLoading()
        this.setModel()
        this.goBack()
        this.glowAnim()
        this.musicBackground()
    }

    goBack()
    {
        this.btnBack = document.querySelector('.btn__back')

        if(this.btnBack)
        {
            this.btnBack.addEventListener('click', () =>
            {
                window.location.href = 'map.html'
            })
        }
    }

    musicBackground()
    {
        this.audio = document.querySelector('.musicPage')
        this.musicBtn = document.querySelector('.musicBtn')

        if(this.audio && this.musicBtn)
        {
            this.audio.volume = 0.1

            this.musicBtn.addEventListener('click', () => {
                if(this.audio.paused)
                {
                    this.audio.play()
                    .then(() => {
                        this.musicBtn.classList.add('isPlaying')
                    })
                } else {
                    this.audio.pause()
                    this.musicBtn.classList.remove('isPlaying')
                }
            })
        }
    }

    overlayLoading()
    {
        this.overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.overlayMaterial = new THREE.ShaderMaterial({ 
            transparent: true,
            uniforms:
            {
                uAlpha: { value: 1 }
            },
            vertexShader: `
                void main()
                {
                    gl_Position = vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uAlpha;    
    
                void main()
                {
                    gl_FragColor = vec4(0.117, 0.117, 0.117, uAlpha);
                }
            `
        })
        this.overlay = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.scene.add(this.overlay)
    
        this.ressources.overlayMaterial = this.overlayMaterial
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
            this.glowMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, color: new THREE.Color('#ffffff') })
            this.waterLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.crystalLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF, side: THREE.DoubleSide })

            this.interactiveObjects = []
            this.crystals = []
            this.pillars = []
            this.rocks = []

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
                        child.material = this.glowMaterial
                        this.interactiveObjects.push(child)
                    }   
                }
            })
        }

        this.model.scale.setScalar(0.8)
    }

    glowAnim()
    {
        if(!this.glowMaterial) return

        gsap.fromTo(this.glowMaterial.color, {
            r: 0.8,
            g: 0.8,
            b: 0.8
        }, 
        {
            r: 2.5,
            g: 2,
            b: 1.2,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        })
    }

    textAppear(text)
    {
        this.islandMessageItem.textContent = text
        gsap.killTweensOf(this.islandMessageItem)
        
        gsap.set(this.islandMessageItem, { opacity: 0, y: 30 })
        
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

                const hoveredObject = this.intersects.length > 0 ? this.intersects[0].object : null

                for (const object of this.interactiveObjects)
                {
                    const isHovered = object === hoveredObject

                    gsap.to(object.scale, {
                        x: isHovered ? 1.2 : 1,
                        y: isHovered ? 1.2 : 1,
                        z: isHovered ? 1.2 : 1,
                        duration: 0.3
                    })
                }

                if (this.experience.objClicked)
                {
                    if(hoveredObject)
                    {
                        switch (hoveredObject.name)
                        {
                            case 'crystalCenter':
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case 'pillar1':
                                this.textAppear("Ce pilier semble être presque intact.\nC'est bien le seul restant...")
                                break
                            case 'pillar3':
                                this.textAppear("Les dieux nous avaient mis en garde.\nIl est trop tard maintenant...")
                                break
                            case 'pillar4':
                                this.textAppear("Si seulement nous avions prêté attention\nà leurs avertissements...")
                                break
                            case 'pillar6':
                                this.textAppear("Des éclats de cristaux gravitent autour de la stèle.\nLa même réaction que les piliers...")
                                break
                            case 'pillar8':
                                this.textAppear("Ce lieu servait de portail entre notre monde\net celui des dieux. Impossible de traverser désormais...")
                                break
                            case 'pillar9':
                                this.textAppear("Il y a même des piliers enfouis dans le sol.\nC'est dire la puissance de l'explosion...")
                                break
                            case 'pillar10':
                                this.textAppear("Tout n'est plus géré que par la magie.\n Plus rien n'est naturel ici...")
                                break
                            case 'rock4':
                                this.textAppear("Des rochers gravitent autour de l'île.\nC'est à la fois fascinant et terrifiant...")
                                break
                            case 'rock5':
                                this.textAppear("Cette île, détachée du sol, est jonchée de cristaux.\nElle est jonchée de cristaux.")
                                break
                        }
                    }

                    this.experience.objClicked = false
                }
            }
        }
    }
}