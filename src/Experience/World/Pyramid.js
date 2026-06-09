import * as THREE from 'three'
import Experience from "../Experience.js"
import gsap from 'gsap'

export default class Pyramid
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.ressources = this.experience.resources

        this.raycasting = new THREE.Raycaster()

        this.pyramidMessageItem = document.querySelector('.sceneText')

        // Setup
        this.resource = this.ressources.items.pyramidModel

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

            gsap.delayedCall(2, () =>
            {
                this.audio.play()
                .then(() =>
                {
                    this.musicBtn.classList.add('isPlaying')
                })
            })

            this.musicBtn.addEventListener('click', () =>
            {
                if(this.audio.paused)
                {
                    this.audio.play()
                    .then(() =>
                    {
                        this.musicBtn.classList.add('isPlaying')
                    })
                }
                else
                {
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

        // Baked texture
        this.bakedTexture = this.ressources.items.pyramidTexture
        if(this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.glowMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, color: new THREE.Color('#ffffff') })
            this.riverLightMaterial = new THREE.MeshBasicMaterial({ color: 0x20D7FFFF })
            this.crystalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if(child.name.startsWith('crystal'))
                    {
                        child.material = this.crystalLightMaterial
                    }
                    else if(child.name === 'river' )
                    {
                        child.material = this.riverLightMaterial
                    }
                    else
                    {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }

                    // Interactive objects
                    this.interactiveObjects = []
                    this.model.traverse((child) =>
                    {
                        if(["pyramidCenter", "pyramidRight", "pyramidLeft"].includes(child.name))
                        {
                            child.material = this.glowMaterial
                            this.interactiveObjects.push(child)
                        }
                    })
                }
            })
        }
    }

    // Glow effect on interactive objects
    glowAnim()
    {
        if(!this.glowMaterial) return

        gsap.fromTo(this.glowMaterial.color,
        {
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
        this.pyramidMessageItem.textContent = text
        gsap.killTweensOf(this.pyramidMessageItem)
        
        gsap.set(this.pyramidMessageItem, { opacity: 0, y: 30 })
        
        gsap.to(this.pyramidMessageItem,
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            onComplete: () =>
            {
                gsap.to(this.pyramidMessageItem,
                {
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
            // Model Animation
            this.model.position.y = -1 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

            // Raycasting
            if(this.interactiveObjects && this.interactiveObjects.length > 0)
            {
                this.raycasting.setFromCamera(this.experience.mouse, this.experience.camera.instance)
                this.intersects = this.raycasting.intersectObjects(this.interactiveObjects)

                // Cursor pointer on interactive object
                if(this.intersects.length > 0)
                {
                    document.body.style.cursor = 'pointer'
                }
                else
                {
                    document.body.style.cursor = 'default'
                }

                // Object Hovered
                const hoveredObject = this.intersects.length > 0 ? this.intersects[0].object : null

                for(const object of this.interactiveObjects)
                {
                    const isHovered = object === hoveredObject
                    
                    gsap.to(object.scale,
                    {
                        x: isHovered ? 1.1 : 1,
                        y: isHovered ? 1.1 : 1,
                        z: isHovered ? 1.1 : 1,
                        duration: 0.3
                    })
                }

                // Message on click
                if(this.experience.objClicked)
                {
                    if(hoveredObject)
                    {
                        switch (hoveredObject.name)
                        {
                            case "pyramidCenter":
                                this.textAppear("Quelle intense lumière... Impossible de voir au travers.\nQui sait ce qu'il y a derrière cette porte ?")
                                break
                            case "pyramidRight":
                                this.textAppear("Cette stèle a l'air plus vieille que les autres.\nLa lumière semble s'affaiblir. Étrange...")
                                break
                            case "pyramidLeft":
                                this.textAppear("Les flammes n'arrêtent pas de bouger.\nOn jurerait que quelque chose veut en sortir.")
                                break
                        }
                    }

                    this.experience.objClicked = false
                }
            }
        }
    }    
}