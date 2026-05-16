import './style.scss'
import EventEmitter from './Experience/Utils/EventEmitter.js'
import Ressources from './Experience/Utils/Resources.js'
import Sizes from './Experience/Utils/Sizes.js'
import Time from './Experience/Utils/Time.js'
import Environment from './Experience/World/Environment.js'
import Island from './Experience/World/Island.js'
import Map from './Experience/World/Map.js'
import Temple from './Experience/World/Temple.js'
import Village from './Experience/World/Village.js'
import World from './Experience/World/World.js'
import Camera from './Experience/Camera.js'
import Experience from './Experience/Experience.js'
import Renderer from './Experience/Renderer.js'
import sources from './Experience/sources.js'

const canvas = document.querySelector('canvas')
const experience = new Experience(canvas)