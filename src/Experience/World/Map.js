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

        // Setup
        this.resource = this.ressources.items.mapModel

        this.goBack()
        this.overlayLoading()
        this.setModel()
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
                window.location.href = 'index.html'
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
            this.audio.volume = 0.05

            gsap.delayedCall(2.5, () => {
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
        this.bakedTexture = this.ressources.items.mapTexture
        if(this.bakedTexture)
        {
            this.bakedTexture.colorSpace = THREE.SRGBColorSpace
            this.bakedTexture.flipY = false

            // Materials
            this.bakedMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture })
            this.glowMaterial = new THREE.MeshBasicMaterial({ map: this.bakedTexture, color: new THREE.Color('#ffffff') })
            this.crystalLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.villageLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.templeLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
            this.waterLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })
            this.riverLightMaterial = new THREE.MeshBasicMaterial({ color: 0x009FFFFF })

            // Interactive objects
            this.interactiveObjects = []

            // Animated objects (Island)
            this.crystalsIsland = []
            this.pillarsIsland = []
            this.rocksIsland = []

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

                    // Animated objects
                    child.baseY = child.position.y

                    if(child.name.startsWith('crystalShard') || child.name === 'crystalCenter') {
                        this.crystalsIsland.push(child)
                    } else if(child.name === 'pillar1' || child.name === 'pillar3' || child.name === 'pillar6' || child.name === 'pillar8' || child.name === 'pillar10') {
                        this.pillarsIsland.push(child)
                    } else if(child.name.startsWith('rockIsland')) {
                        this.rocksIsland.push(child)
                    }

                    // Interactive objects
                    if(child.name.startsWith('stage') || child.name.startsWith('slab') || child.name.startsWith('logCenter') || child.name.startsWith('woodBoxCenter') || child.name.startsWith('potCenter') || child.name === 'doorWood' || child.name.startsWith('ladder') || child.name.startsWith('wall') || child.name.startsWith('rockTemple') || child.name.startsWith('torch') || child.name.startsWith('templeSlab') || child.name === 'door' || child.name === 'island' || child.name.startsWith('pillar') || child.name.startsWith('rockIsland') || child.name === 'stele' || child.name.startsWith('crystalShard') || child.name === 'crystalCenter' || child.name.startsWith('altar')) {
                        child.material = this.glowMaterial
                        this.interactiveObjects.push(child)
                    }
                }
            })
        }

        this.model.rotation.y = Math.PI
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

    update()
    {
        if(this.model)
        {
            const elapsedTime = this.experience.time.elapsed * 0.001

            // Anim model
            this.model.position.y = Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2

            // Anim crystals
            for(let i = 0; i < this.crystalsIsland.length; i++)
            {
                const crystal = this.crystalsIsland[i]
                crystal.position.y = crystal.baseY + Math.sin(elapsedTime + i) * 0.2
                crystal.rotation.y = elapsedTime * 0.8 + i
            }

            // Anim pillars
            for(let i = 0; i < this.pillarsIsland.length; i++)
            {
                const pillar = this.pillarsIsland[i]
                pillar.position.y = pillar.baseY + Math.sin(elapsedTime * 0.8 + i * 0.5) * 0.5
            }

            // Anim rocks
            for(let i = 0; i < this.rocksIsland.length; i++)
            {
                const rock = this.rocksIsland[i]
                rock.position.y = rock.baseY + Math.sin(elapsedTime * 1.5 + i * 0.7) * 0.5
            }

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

                // Go to 3D Scene page when click on interactive object
                if(this.experience.objClicked)
                {
                    this.intersects.forEach(intersect => {
                        if (intersect.object.name.startsWith('stage')) {
                            window.location.href = 'village.html'
                        } else if(intersect.object.name.startsWith('rockTemple')) {
                            window.location.href = 'temple.html'
                        } else if(intersect.object.name === 'island') {
                            window.location.href = 'island.html'
                        }
                    })

                    this.experience.objClicked = false
                }
            }
        }
    }
}
