"use strict"

import gsap from 'gsap'
import * as THREE from 'three'
import './style.scss'

// ------- NAVIGATION -------
const menu = document.querySelector(".nav__mb")
const menuButton = document.querySelector(".menu__btn")

if(menuButton && menu)
{
    menuButton.addEventListener("click", function () 
    {
        const menuLinks = document.querySelectorAll(".nav__list .nav__list--link")

        menuButton.classList.toggle("open")

        if (menu.classList.contains("open")) 
        {
            gsap.to(menuLinks, {
                opacity: 0,
                duration: 0.1,
                stagger: { each: 0.1, from: "end" },
                onComplete: function () {
                    gsap.to(menu, {
                        y: "-100%",
                        duration: 0.1,
                        ease: "power3.out",
                    });
                    menu.classList.remove("open")
                },
            })
        } else {
            gsap.fromTo(
                menu,
                { y: "-100%" },
                {
                    y: "0%",
                    duration: 0.5,
                    ease: "power4.out",
                    onComplete: function () {
                        gsap.to(
                            menuLinks,
                            {
                                opacity: 1,
                                duration: 0.2,
                                stagger: 0.2,
                                ease: "power2.out",
                            }
                        )
                    }
                }
            )
            menu.classList.add("open")

            menuLinks.forEach(link => {
                link.addEventListener("click", () => {
                    gsap.to(menuLinks, {
                        opacity: 0,
                        duration: 0.1,
                        stagger: { each: 0.1, from: "end" },
                        onComplete: function () {
                            gsap.to(menu, {
                                y: "-100%",
                                duration: 0.1,
                                ease: "power3.out",
                            });
                            menu.classList.remove("open")
                            menuButton.classList.remove("open")
                        }
                    })
                })
            })
        }
    })
}

// ------- PYRAMID HOME -------
const canvas = document.querySelector('.section__hero--canvas')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
camera.position.z = 4

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(200, 200)

const geometry = new THREE.ConeGeometry(1, 1.6, 4)
const material = new THREE.MeshBasicMaterial({ color: 0x1e1e1e, wireframe: true })
const pyramid = new THREE.Mesh(geometry, material)
scene.add(pyramid)

pyramid.rotation.x = 0.15

function animate() {
    requestAnimationFrame(animate)
    pyramid.rotation.y += 0.02
    renderer.render(scene, camera)
}
animate()