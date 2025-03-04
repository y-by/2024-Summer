import * as THREE from 'three'
import "./style.css"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()


// canvas
const canvas = document.querySelector('.webgl')
// scene
const scene = new THREE.Scene()

// Create our sphere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: "#0000aa",
    roughness: 0.5
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Light
const light = new THREE.PointLight(0xffffff, 500, 100)
// const light = new THREE.DirectionalLight(0xffffff, 5, -10)
light.position.set(10, 10, 20)
light.intensity = 500.25
scene.add(light)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(5)
renderer.render(scene, camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5

// Resizes
window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
    // mesh.position.x += 0.1
    // mesh.position.z += 0.3
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

//Create a helper for the shadow camera (optional)
const helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper );

// Timeline magic
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", {opacity: 0 }, { opacity: 1 })

// Mouse animation color
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
    if(mouseDown) {
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ]
        // Let's animate
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b
        })
    }
})