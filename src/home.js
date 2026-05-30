"use strict"

// ------- IMPORTS -------
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
import * as THREE from 'three'
import './style.scss'

// ------- CURSOR -------
const cursor = document.querySelector('.cursor__center')
const outline = document.querySelector('.cursor__outline')

let mouseX = 0, mouseY = 0
let outlineX = 0, outlineY = 0

document.addEventListener('mousemove', (e) =>{
    mouseX = e.clientX
    mouseY = e.clientY

    cursor.style.left = `${mouseX}px`
    cursor.style.top = `${mouseY}px`
})

function animCursor() {
    outlineX += (mouseX - outlineX) * 0.1
    outlineY += (mouseY - outlineY) * 0.1

    outline.style.left = `${outlineX}px`
    outline.style.top = `${outlineY}px`

    requestAnimationFrame(animCursor)
}

animCursor()

// ------- AUDIO -------
const audio = document.querySelector('.musicPage')
const musicBtn = document.querySelector('.musicBtn')

audio.volume = 0.1

audio.play()
.then(() => {
    musicBtn.classList.add('isPlaying')
})

musicBtn.addEventListener('click', () => {
    if(audio.paused)
    {
        audio.play()
        .then(() => {
            musicBtn.classList.add('isPlaying')
        })
    } else {
        audio.pause()
        musicBtn.classList.remove('isPlaying')
    }
})

// ------- NAVIGATION -------
const menu = document.querySelector('.nav__mb')
const menuButton = document.querySelector('.menu__btn')

if(menuButton && menu)
{
    menuButton.addEventListener('click', function () 
    {
        const menuLinks = document.querySelectorAll('.nav__list .nav__list--link')

        menuButton.classList.toggle('open')

        if (menu.classList.contains('open')) 
        {
            gsap.to(menuLinks, {
                opacity: 0,
                duration: 0.1,
                stagger: { each: 0.1, from: 'end' },
                onComplete: function () {
                    gsap.to(menu, {
                        y: '-100%',
                        duration: 0.1,
                        ease: 'power3.out',
                    });
                    menu.classList.remove('open')
                },
            })
        } else {
            gsap.fromTo(
                menu,
                { y: '-100%' },
                {
                    y: '0%',
                    duration: 0.5,
                    ease: 'power4.out',
                    onComplete: function () {
                        gsap.to(
                            menuLinks,
                            {
                                opacity: 1,
                                duration: 0.2,
                                stagger: 0.2,
                                ease: 'power2.out',
                            }
                        )
                    }
                }
            )
            menu.classList.add('open')

            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    gsap.to(menuLinks, {
                        opacity: 0,
                        duration: 0.1,
                        stagger: { each: 0.1, from: 'end' },
                        onComplete: function () {
                            gsap.to(menu, {
                                y: '-100%',
                                duration: 0.1,
                                ease: 'power3.out',
                            });
                            menu.classList.remove('open')
                            menuButton.classList.remove('open')
                        }
                    })
                })
            })
        }
    })
}

// ------- HEADER -------
window.addEventListener('DOMContentLoaded', () => 
{
    gsap.from('.section__hero--title', {
        y: -80,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out'
    })

    gsap.from('.section__hero--text', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.4
    })
})

// ------- MAIN -------
const quotes = 
[
    '«\u00A0Ils me dégoûtent… Je veux les voir morts.\u00A0»',
    '«\u00A0Ils sont si fragiles… Ce seront eux la clé\u00A0!\u00A0»',
    '«\u00A0Chaque mot a des conséquences, le silence aussi.\u00A0»',
    '«\u00A0Osiris… quel idiot tu fais. Il est trop tard\u00A0!\u00A0»',
    '«\u00A0Étrange… mais sans importance.\u00A0»',
    '«\u00A0Ces faibles humains… Ils ne méritent pas ce pouvoir.\u00A0»',
    '«\u00A0Enfin… L’Égypte est à moi. À moi\u00A0!\u00A0»',
    '«\u00A0Ils ont peur… Qu’ils restent cachés dans leur royaume\u00A0!\u00A0»',
    '«\u00A0J’offre une nouvelle destinée… Le chaos.\u00A0»'
]

const introTitle = document.querySelector('.section__intro--title')

if(introTitle)
{
    gsap.fromTo(introTitle,
        {
            y: -50,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: introTitle,
                start: 'top 80%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse'
            }
        }
    )
}

const goMap = document.querySelector('.section__goMap')

if(goMap)
{
    gsap.fromTo(goMap,
        {
            y: 50,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: goMap,
                start: 'top 80%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse'
            }
        }
    )
}

const storyContent = document.querySelectorAll('.context__content')

storyContent.forEach((blocContent, i) =>
{
    const el = blocContent.querySelector('.context__content--quote')

    if(el && quotes[i])
    {
        const hieroglyphsBase = el.textContent
        
        gsap.fromTo(blocContent,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: blocContent,
                    start: 'top 80%',
                    end: 'bottom 30%',
                    toggleActions: 'play reverse play reverse'
                }
            }
        )

        ScrollTrigger.create({
            trigger: el,
            start: 'top 40%',
            end: 'bottom 80%',
            onEnter: () => {
                gsap.timeline()
                    .to(el, {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power1.in'
                    })
                    .to(el, {
                        opacity: 1, 
                        duration: 0.5, 
                        ease: 'power1.out',
                        onStart: () => { el.textContent = quotes[i] } 
                    })
            },
            onLeaveBack: () => {
                gsap.timeline()
                    .to(el, {
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power1.in'
                    })
                    .to(el, {
                        opacity: 1, 
                        duration: 0.5, 
                        ease: 'power1.out',
                        onStart: () => { el.textContent = hieroglyphsBase } 
                    })
            },
            onLeave: () => {
                el.textContent = hieroglyphsBase
            }
        })
    }
})


// ------- DECORATION HOME -------
const canvas = document.querySelector('.section__hero--canvas')
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
camera.position.z = 7

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
renderer.setSize(300, 300)

// Crystal
const geometry = new THREE.DodecahedronGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x2D7CFC, wireframe: true })
const stoneHeader = new THREE.Mesh(geometry, material)

// Circles
const circleBig = new THREE.RingGeometry(2.4, 2.7, 32)
const circleMid = new THREE.RingGeometry(1.1, 1.4, 32)
const circleMaterial = new THREE.MeshBasicMaterial({ color: 0xff7e46, wireframe: true, side: THREE.DoubleSide })
const circleHeaderBig = new THREE.Mesh(circleBig, circleMaterial)
const circleHeaderMid = new THREE.Mesh(circleMid, circleMaterial)

scene.add(stoneHeader, circleHeaderBig, circleHeaderMid)

circleHeaderBig.rotation.x = 1.9
circleHeaderBig.position.y = -0.5
circleHeaderMid.rotation.x = 1.9
circleHeaderMid.position.y = -1

function animate() 
{
    requestAnimationFrame(animate)
    stoneHeader.rotation.x += 0.008
    stoneHeader.rotation.y += 0.008
    stoneHeader.rotation.z += 0.008
    circleHeaderBig.rotation.z += -0.008
    circleHeaderMid.rotation.z += 0.008
    renderer.render(scene, camera)
}
animate()