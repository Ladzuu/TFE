import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from "./EventEmitter"
import gsap from 'gsap'

export default class Ressources extends EventEmitter
{
    constructor(sources)
    {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.loadingContainer = document.querySelector('.loading__assets')
        this.loadingBar = document.querySelector('.loading__assets--bar')
        this.loadingText = document.querySelector('.loading__assets--text')
        this.loadingPercentage = document.querySelector('.loading__assets--percentage')
        this.arrowsContainer = document.querySelector('.templeUI__switchCam')
        this.btnBack = document.querySelector('.btn__back')

        const randomLoadingText = [
            "Traversée du désert.",
            "Priez Osiris. Il vieille sur vous...",
            "Une puissante énergie résonne dans la nuit.",
            "Seth vous observe. Méfiez vous...",
            "Gardez votre torche allumée, les ténèbres sont partout.",
        ]

        if(this.loadingText)        {
            this.loadingText.textContent = randomLoadingText[Math.floor(Math.random() * randomLoadingText.length)]
        }

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.loadingManager = new THREE.LoadingManager(
            // Loaded
            () =>
            {
                gsap.delayedCall(0.5, () =>
                {
                    if(this.overlayMaterial)
                    {
                        gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 2, value: 0, delay: 1.5 })
                    }

                    if(this.loadingContainer)
                    {
                        gsap.to(this.loadingContainer, { 
                            duration: 0.5,
                            opacity: 0,
                            delay: 1,
                            onComplete: () =>
                            {
                                this.loadingContainer.style.display = 'none'
                                if(this.arrowsContainer)
                                {
                                    this.arrowsContainer.classList.remove('hidden')
                                }

                                if(this.btnBack)                                
                                {
                                    this.btnBack.classList.remove('hidden')
                                }
                            }
                        })
                    }

                    if(this.loadingBar)
                    {
                        this.loadingBar.classList.add('ended')
                        this.loadingBar.style.transform = ``
                    }
                })
            },
            // Progress
            (itemUrl, itemsLoaded, itemsTotal) =>
            {
                this.progressRatio = itemsLoaded / itemsTotal
                
                if(this.loadingBar)                {
                    this.loadingBar.style.transform = `scaleX(${this.progressRatio})`
                }
                if(this.loadingPercentage)
                {
                    const percentage = Math.round(this.progressRatio * 100)
                    this.loadingPercentage.textContent = `${percentage} %`
                }
            }
        )
        this.loaders.gltfLoader = new GLTFLoader(this.loaders.loadingManager)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loaders.loadingManager)
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    startLoading()
    {
        if(this.arrowsContainer)
        {
            this.arrowsContainer.classList.add('hidden')
        }

        if(this.btnBack)
        {
            this.btnBack.classList.add('hidden')
        }

        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(source.path, (file) =>
                {
                    this.sourceLoaded(source, file)
                })
            } else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(source.path, (file) =>
                {
                    this.sourceLoaded(source, file)
                })
            } else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(source.path, (file) =>
                {
                    this.sourceLoaded(source, file)
                })
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file
        this.loaded++

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
        }
    }
}