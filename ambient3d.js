
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.getElementById('ambient-canvas');

if (canvas) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Floating particles
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const speeds = [];

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 12;

        speeds.push(0.002 + Math.random() * 0.008);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0x8b65ff,
        size: 0.035,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Large floating neon rings
    const rings = [];

    const colors = [0x8b65ff, 0x00d9ff, 0x6845ff];

    for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(
                2 + i * 0.45,
                0.008,
                8,
                100
            ),
            new THREE.MeshBasicMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 0.18
            })
        );

        ring.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            -3 - Math.random() * 4
        );

        ring.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        scene.add(ring);
        rings.push(ring);
    }

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('pointermove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    });

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    });

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        particles.rotation.y = time * 0.012 + mouseX * 0.08;
        particles.rotation.x = Math.sin(time * 0.15) * 0.04 + mouseY * 0.05;

        rings.forEach((ring, i) => {
            ring.rotation.z += 0.0008 + i * 0.0002;
            ring.position.y += Math.sin(time + i) * 0.0008;
        });

        renderer.render(scene, camera);
    }

    animate();
}
