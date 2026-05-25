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

        // Setup
        this.resource = this.ressources.items.villageModel

        this.overlayLoading()
        this.setModel()
        this.goBack()
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
            this.windowLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF })
            this.potLightMaterial = new THREE.MeshBasicMaterial({ color: 0x00C8FFFF, side: THREE.DoubleSide })

            this.model.traverse((child) =>
            {
                if(child instanceof THREE.Mesh)
                {
                    // Light materials
                    if (child.name === 'doorLight' || child.name === 'doorLightUp' || child.name === 'window1' || child.name === 'window2' || child.name === 'window3' || child.name === 'window4' || child.name === 'window5' || child.name === 'window6' || child.name === 'windwo7' || child.name === 'window8' || child.name === 'window9' || child.name === 'windwo10' || child.name === 'window11' || child.name === 'window12' || child.name === 'windowTop') {
                        child.material = this.windowLightMaterial
                    } else if (child.name === 'potLight1' || child.name === 'potLight2' || child.name === 'potLight3') {
                        child.material = this.potLightMaterial
                    } else {
                        // Baked texture material
                        child.material = this.bakedMaterial
                    }
                }
            })
        }
    }

    update()
    {
        if(this.model)
        {
            this.model.position.y = -2 + Math.sin(this.experience.time.elapsed * 0.001 * 1.2) * 0.2
        }
    }
}