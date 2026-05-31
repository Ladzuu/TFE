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

        this.villageMessageItem = document.querySelector('.sceneText')

        // Setup
        this.resource = this.ressources.items.villageModel

        this.overlayLoading()
        this.setModel()
        this.goBack()
        this.glowAnim()
        this.musicBackground()
    }

    // Go back to previous page
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

    // Set background music
    musicBackground()
    {
        this.audio = document.querySelector('.musicPage')
        this.musicBtn = document.querySelector('.musicBtn')

        if(this.audio && this.musicBtn)
        {
            this.audio.volume = 0.1

            gsap.delayedCall(2, () => {
                this.audio.play()
                .then(() => {
                    this.musicBtn.classList.add('isPlaying')
                })
            })

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

    // Creating loading overlay
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

    // Setup 3D Scene -> Model + Interactions
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
            this.glowMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, color: new THREE.Color('#ffffff') })
            this.windowLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF })
            this.potLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if (child.name === 'doorLight' || child.name === 'doorLightUp' || child.name.startsWith('window') || child.name === 'windwo7' || child.name === 'windwo10') {
                        child.material = this.windowLightMaterial
                    } else if (child.name === 'potLight1' || child.name === 'potLight2' || child.name === 'potLight3') {
                        child.material = this.potLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }

                    // Interactive objects
                    this.interactiveObjects = []
                    this.model.traverse((child) =>
                    {
                        if (["pot1", "pot2", "pot3", "pot6", "pot7", "pot8", "pot9", "pot10", "doorWood", "woodBox1", "woodBox2"].includes(child.name)) {
                            child.material = this.glowMaterial
                            this.interactiveObjects.push(child)
                        }
                    })
                }
            })
        }

        this.model.rotation.y = 270 * (Math.PI / 180)
    }

    // Glow effect on interactive objects
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

    // Text appear when object clicked
    textAppear(text)
    {
        this.villageMessageItem.textContent = text
        gsap.killTweensOf(this.villageMessageItem)
        
        gsap.set(this.villageMessageItem, { opacity: 0, y: 30 })
        
        gsap.to(this.villageMessageItem, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            onComplete: () => {
                gsap.to(this.villageMessageItem, {
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
            // Anim village
            this.model.position.y = -1 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

            // Raycasting
            if (this.interactiveObjects && this.interactiveObjects.length > 0)
            {
                this.raycasting.setFromCamera(this.experience.mouse, this.experience.camera.instance)
                this.intersects = this.raycasting.intersectObjects(this.interactiveObjects)

                // Cursor pointer on interactive object
                if(this.intersects.length > 0)
                {
                    document.body.style.cursor = 'pointer'
                } else {
                    document.body.style.cursor = 'default'
                }

                // Object Hovered
                const hoveredObject = this.intersects.length > 0 ? this.intersects[0].object : null

                for (const object of this.interactiveObjects)
                {
                    const isHovered = object === hoveredObject
                    
                    gsap.to(object.scale, {
                        x: isHovered ? 1.15 : 1,
                        y: isHovered ? 1.15 : 1,
                        z: isHovered ? 1.15 : 1,
                        duration: 0.3
                    })
                }

                // Message on click
                if (this.experience.objClicked)
                {
                    if (hoveredObject)
                    {
                        switch (hoveredObject.name)
                        {
                            case "pot1":
                                this.textAppear("Ce sont de simples pots.\nSûrement destinés au rangement ?")
                                break
                            case "pot2":
                                this.textAppear("La personne qui habite ici doit être assez\noccupée. Elle ferait bien de ranger.")
                                break
                            case "pot3":
                                this.textAppear("Ce pot est plein d'objets en tous genres.\nAucun n'a de valeur...")
                                break
                            case "pot6":
                                this.textAppear("Il y a de la lumière à l'intérieur.\nPourtant il n'y a personne ici...")
                                break
                            case "pot7":
                                this.textAppear("Il y a un deuxième étage.\nUne autre personne ? Cette maison serait...")
                                break
                            case "pot8":
                                this.textAppear("Ces trois pots... Ils ont quelque chose\nde différents des autres.")
                                break
                            case "pot9":
                                this.textAppear("Cette lumière bleue intense...\nCela me rappelle quelque chose.")
                                break
                            case "pot10":
                                this.textAppear("Anoth et Kahaz en parlaient...\nCes cristaux viendraient de la catastrophe.")
                                break
                            case "doorWood":
                                this.textAppear("Une maison au milieu du désert...\nÀ qui peut elle bien appartenir ?")
                                break
                            case "woodBox1":
                                this.textAppear("Cette caisse est enfoncée dans le sol.\nCe lieu a bel et bien l'air abandonné.")
                                break
                            case "woodBox2":
                                this.textAppear("C'est peut être le dernier village aussi calme.\nTous les autres sont détruits.")
                                break
                        }
                    }

                    this.experience.objClicked = false
                }
            }
        }
    }
}