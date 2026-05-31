import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import Experience from "./Experience.js"
import gsap from 'gsap'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setPageConfig()
        this.setInstance()
        this.setOrbitControls()
    }

    // Camera settings for each Page (Difference between map and other scenes)
    setPageConfig()
    {
        const canvas = this.canvas
        this.isMapPage = canvas && canvas.classList.contains('model__map')
        this.isTemplePage = canvas && canvas.classList.contains('model__temple')
        this.isIslandPage = canvas && canvas.classList.contains('model__island')
        this.isVillagePage = canvas && canvas.classList.contains('model__village')

        if(this.isMapPage)
        {
            this.cameraSettings = {
                fov: 45,
                position: new THREE.Vector3(0, 35, 40),
                lookAt: new THREE.Vector3(0, 0, 0),
                minPolarAngle: Math.PI / 2.7,
                maxPolarAngle: Math.PI / 2.7,
                minDistance: 20,
                maxDistance: 120,
                enablePan: true
            }
        } else {
            this.cameraSettings = {
                fov: 35,
                position: new THREE.Vector3(27, 20, 22),
                lookAt: new THREE.Vector3(0, 0, 0),
                minPolarAngle: Math.PI / 2.7,
                maxPolarAngle: Math.PI / 2.7,
                minDistance: 15,
                maxDistance: 80,
                enablePan: false
            }
        }
    }

    // Settings of each scenes
    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            this.cameraSettings.fov,
            this.sizes.width / this.sizes.height,
            0.1,
            300
        )
        this.instance.position.copy(this.cameraSettings.position)
        this.instance.lookAt(this.cameraSettings.lookAt)
        this.scene.add(this.instance)

        if(this.isTemplePage)
        {
            this.camPositions = [
                {
                    position: new THREE.Vector3(25, 20, 22),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                {
                    position: new THREE.Vector3(15, 10, -21),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                { 
                    position: new THREE.Vector3(19, 9, 0),
                    lookAt: new THREE.Vector3(0, 0, 0)
                }
            ]

            this.currentCamPosition = 0
            this.camAnimation = false

        } else if(this.isIslandPage)
        {
            this.camPositions = [
                {
                    position: new THREE.Vector3(27, 20, 22),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                {
                    position: new THREE.Vector3(-20, 22, 10),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                { 
                    position: new THREE.Vector3(15, -15, -25),
                    lookAt: new THREE.Vector3(0, 0, 0)
                }
            ]

            this.currentCamPosition = 0
            this.camAnimation = false
            
        } else if(this.isVillagePage)
        {
            this.camPositions = [
                {
                    position: new THREE.Vector3(27, 20, 22),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                {
                    position: new THREE.Vector3(20, 15, -26),
                    lookAt: new THREE.Vector3(0, 0, 0)
                },
                { 
                    position: new THREE.Vector3(-24, 14, -10),
                    lookAt: new THREE.Vector3(0, 0, 0)
                }
            ]

            this.currentCamPosition = 0
            this.camAnimation = false
        }
    }

    // Go to previous camera
    previousCamera()
    {
        if (this.camAnimation) {
            return
        }
        
        this.camAnimation = true
        this.previousPosition = (this.currentCamPosition - 1 + this.camPositions.length) % this.camPositions.length
        this.animCamera(this.previousPosition)
    }

    // Go to next camera
    nextCamera()
    {
        if (this.camAnimation) {
            return
        }
        
        this.camAnimation = true
        this.nextPosition = (this.currentCamPosition + 1) % this.camPositions.length
        this.animCamera(this.nextPosition)
    }

    // Anim movement of the camera
    animCamera(targetList)
    {
        this.targetPosition = this.camPositions[targetList].position
        this.targetLookAt = this.camPositions[targetList].lookAt

        gsap.to(this.instance.position, {
            x: this.targetPosition.x,
            y: this.targetPosition.y,
            z: this.targetPosition.z,
            duration: 1.25,
            ease: "power2.inOut",
            onUpdate: () => {
                this.instance.lookAt(this.targetLookAt)
            },
            onComplete: () => {
                this.currentCamPosition = targetList
                this.camAnimation = false
            }
        })
    }

    // Orbit controls settings
    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enablePan = this.cameraSettings.enablePan
        this.controls.minPolarAngle = this.cameraSettings.minPolarAngle
        this.controls.maxPolarAngle = this.cameraSettings.maxPolarAngle
        this.controls.minDistance = this.cameraSettings.minDistance
        this.controls.maxDistance = this.cameraSettings.maxDistance
    }

    // Resizing the instance
    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}