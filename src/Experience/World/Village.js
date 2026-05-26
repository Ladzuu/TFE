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
            // Temple Animation
            this.model.position.y = -1 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

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
                        x: isHovered ? 1.15 : 1,
                        y: isHovered ? 1.15 : 1,
                        z: isHovered ? 1.15 : 1,
                        duration: 0.3
                    })
                }

                if (this.experience.objClicked)
                {
                    if (hoveredObject)
                    {
                        switch (hoveredObject.name)
                        {
                            case "pot1":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot2":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot3":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot6":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot7":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot8":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot9":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "pot10":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "doorWood":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "woodBox1":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                            case "woodBox2":
                                this.textAppear("Cette pierre... Quelle énergie démentielle !\nSerait-elle la cause de cette explosion ?")
                                break
                        }
                    }

                    this.experience.objClicked = false
                }
            }
        }
    }
}