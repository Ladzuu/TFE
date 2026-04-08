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

        this.setInstance()
        // this.setOrbitControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(
            35, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100
        )
        this.instance.position.set(20, 12, 15)
        this.instance.lookAt(0, 0, 0)
        this.scene.add(this.instance)

        this.camPositions = [
            { 
                position: new THREE.Vector3(20, 12, 15), lookAt: new THREE.Vector3(0, 0, 0) 
            },
            { 
                position: new THREE.Vector3(10, 5, -16), lookAt: new THREE.Vector3(0, 0, 0) 
            },
            { 
                position: new THREE.Vector3(14, 4, 0), lookAt: new THREE.Vector3(0, 0, 0) 
            }
        ]

        this.currentCamPosition = 0
        this.camAnimation = false
    }

    previousCamera()
    {
        if (this.camAnimation) return
        
        this.camAnimation = true
        this.previousPosition = (this.currentCamPosition - 1 + this.camPositions.length) % this.camPositions.length
        this.animCamera(this.previousPosition)
    }

    nextCamera()
    {
        if (this.camAnimation) return
        
        this.camAnimation = true
        this.nextPosition = (this.currentCamPosition + 1) % this.camPositions.length
        this.animCamera(this.nextPosition)
    }

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

    setOrbitControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        // this.controls.update()
    }
}