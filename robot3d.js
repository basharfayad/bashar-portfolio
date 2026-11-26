
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.getElementById('robot-canvas');

if (canvas) {
    const container = canvas.parentElement;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 0.2, 7);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Materials
    const metal = new THREE.MeshStandardMaterial({
        color: 0x7770ff,
        metalness: 0.85,
        roughness: 0.25
    });

    const darkMetal = new THREE.MeshStandardMaterial({
        color: 0x17182e,
        metalness: 0.8,
        roughness: 0.3
    });

    const whiteMetal = new THREE.MeshStandardMaterial({
        color: 0xc8d3ff,
        metalness: 0.65,
        roughness: 0.25
    });

    const neon = new THREE.MeshStandardMaterial({
        color: 0x00eaff,
        emissive: 0x00bfff,
        emissiveIntensity: 2
    });

    // Robot group
    const robot = new THREE.Group();
    scene.add(robot);

    // Helper function
    function addBox(parent, size, position, material, radius = 0) {
        const geometry = new THREE.BoxGeometry(...size);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.castShadow = true;
        parent.add(mesh);
        return mesh;
    }

    function addSphere(parent, radius, position, material) {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            material
        );
        mesh.position.set(...position);
        parent.add(mesh);
        return mesh;
    }

    // Body
    const body = new THREE.Group();
    robot.add(body);

    addBox(body, [1.35, 1.55, 0.8], [0, -0.45, 0], metal);

    // Chest panel
    addBox(body, [0.85, 0.65, 0.12], [0, -0.35, 0.46], darkMetal);

    // Chest lights
    [-0.25, 0, 0.25].forEach(x => {
        addSphere(body, 0.055, [x, -0.35, 0.54], neon);
    });

    // Neck
    addBox(body, [0.35, 0.3, 0.35], [0, 0.48, 0], darkMetal);

    // Head
    const head = new THREE.Group();
    head.position.set(0, 1.05, 0);
    robot.add(head);

    addBox(head, [1.35, 1.05, 1], [0, 0, 0], whiteMetal);

    // Face screen
    addBox(head, [1.05, 0.58, 0.09], [0, -0.05, 0.53], darkMetal);

    // Eyes
    addSphere(head, 0.12, [-0.28, -0.05, 0.62], neon);
    addSphere(head, 0.12, [0.28, -0.05, 0.62], neon);

    // Antenna
    addBox(head, [0.08, 0.35, 0.08], [0, 0.65, 0], metal);
    addSphere(head, 0.11, [0, 0.85, 0], neon);

    // Arms
    const arms = [];

    [-1, 1].forEach(side => {
        const arm = new THREE.Group();
        arm.position.set(side * 0.85, 0.15, 0);
        robot.add(arm);

        addSphere(arm, 0.22, [0, 0, 0], darkMetal);
        addBox(arm, [0.35, 0.85, 0.35], [0, -0.48, 0], metal);
        addSphere(arm, 0.19, [0, -0.95, 0], whiteMetal);
        addBox(arm, [0.35, 0.28, 0.35], [0, -1.18, 0], darkMetal);

        arms.push({ arm, side });
    });

    // Legs
    [-0.38, 0.38].forEach(x => {
        addBox(robot, [0.38, 0.85, 0.42], [x, -1.65, 0], darkMetal);
        addBox(robot, [0.55, 0.3, 0.7], [x, -2.2, 0.08], whiteMetal);
    });

    // Floating platform
    const platform = new THREE.Mesh(
        new THREE.TorusGeometry(1.35, 0.035, 16, 100),
        neon
    );
    platform.rotation.x = Math.PI / 2;
    platform.position.y = -2.38;
    robot.add(platform);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    const mainLight = new THREE.PointLight(0x8b65ff, 45);
    mainLight.position.set(3, 4, 5);
    scene.add(mainLight);

    const blueLight = new THREE.PointLight(0x00d9ff, 30);
    blueLight.position.set(-4, 1, 3);
    scene.add(blueLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Position robot
    robot.position.y = -0.05;
    robot.scale.setScalar(0.9);

    // Mouse interaction
    let targetX = 0;
    let targetY = 0;

    canvas.addEventListener('pointermove', event => {
        const rect = canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        targetY = (x - 0.5) * 1.1;
        targetX = (y - 0.5) * 0.45;
    });

    canvas.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
    });

    // Resize
    const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

// =====================================
// CINEMATIC 3D PARTICLES
// =====================================

const particleCount = 1200;
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 10;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0x8b65ff,
    size: 0.025,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particles = new THREE.Points(
    particleGeometry,
    particleMaterial
);

scene.add(particles);


// =====================================
// NEON ENERGY RINGS
// =====================================

const rings = [];

const ringColors = [
    0x8b65ff,
    0x00d9ff,
    0x6d4aff
];

for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
            1.85 + i * 0.22,
            0.012,
            12,
            120
        ),
        new THREE.MeshBasicMaterial({
            color: ringColors[i],
            transparent: true,
            opacity: 0.65
        })
    );

    ring.rotation.x = Math.PI / 2 + i * 0.25;
    ring.rotation.y = i * 0.45;
    ring.position.y = -0.2 + i * 0.12;

    robot.add(ring);
    rings.push(ring);
}


// =====================================
// 3D FLOATING SKILL BADGES
// =====================================

const skillBadges = [];

function createSkillBadge(label, color) {
    const badgeCanvas = document.createElement('canvas');

    badgeCanvas.width = 512;
    badgeCanvas.height = 160;

    const ctx = badgeCanvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgba(17, 19, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 144, 28);
    ctx.fill();

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 55px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, 82);

    const texture = new THREE.CanvasTexture(badgeCanvas);

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const badge = new THREE.Mesh(
        new THREE.PlaneGeometry(1.25, 0.39),
        material
    );

    return badge;
}


const skills = [
    { name: 'JAVASCRIPT', color: '#f7df1e', x: -1.85, y: 1.55 },
    { name: 'JAVA', color: '#ff8b45', x: 1.85, y: 1.55 },
    { name: 'C++', color: '#48a9ff', x: -1.9, y: 0.15 },
    { name: 'BLENDER', color: '#ff9b45', x: 1.9, y: 0.15 },
    { name: 'HTML / CSS', color: '#a78bfa', x: -1.85, y: -1.25 },
    { name: 'SQL', color: '#00eaff', x: 1.85, y: -1.25 }
];

// Create all skill badges
skills.forEach((skill, index) => {
    const badge = createSkillBadge(skill.name, skill.color);

    badge.position.set(skill.x, skill.y, 0.3);

    badge.userData.baseY = skill.y;
    badge.userData.offset = index * 0.8;

    const skillNames = {
        'JAVASCRIPT': 'javascript',
        'JAVA': 'java',
        'C++': 'cpp',
        'BLENDER': 'blender',
        'HTML / CSS': 'html-css',
        'SQL': 'sql'
    };

    badge.userData.skill = skillNames[skill.name];

    scene.add(badge);
    skillBadges.push(badge);
});

// Clickable 3D skill badges
const skillRaycaster = new THREE.Raycaster();
const skillPointer = new THREE.Vector2();

canvas.addEventListener('pointerdown', (event) => {
    const rect = canvas.getBoundingClientRect();

    skillPointer.x =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;

    skillPointer.y =
        -((event.clientY - rect.top) / rect.height) * 2 + 1;

    skillRaycaster.setFromCamera(skillPointer, camera);

    const hits = skillRaycaster.intersectObjects(skillBadges);

    if (hits.length > 0) {
        const selectedSkill = hits[0].object.userData.skill;

        window.dispatchEvent(
            new CustomEvent('open-3d-skill', {
                detail: { skill: selectedSkill }
            })
        );
    }
});

    // Animation
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Smooth mouse-following rotation
        robot.rotation.y += (targetY + Math.sin(time * 0.5) * 0.12
            - robot.rotation.y) * 0.045;

        robot.rotation.x += (targetX - robot.rotation.x) * 0.045;

        // Floating movement
        robot.position.y = -0.05 + Math.sin(time * 1.5) * 0.08;

        // Arm movement
        
arms.forEach(({ arm, side }) => {
    if (side === 1 && time < 3.5) {
        // Welcome wave
        arm.rotation.z =
            0.85 + Math.sin(time * 9) * 1.9;
    } else {
        // Normal idle movement
        arm.rotation.z =
            side * (0.40 + Math.sin(time * 1.5) * 0.08);
    }
});

        platform.rotation.z = time * 0.35;

// Cinematic particle movement
particles.rotation.y = time * 0.025;
particles.rotation.x = Math.sin(time * 0.2) * 0.08;

// Animate neon rings
rings.forEach((ring, index) => {
    ring.rotation.z = time * (0.15 + index * 0.08);
});

// Floating skill badges
skillBadges.forEach((badge, index) => {
    badge.position.y =
        badge.userData.baseY +
        Math.sin(time * 1.4 + badge.userData.offset) * 0.12;

    badge.rotation.y =
        Math.sin(time + badge.userData.offset) * 0.12;

    badge.rotation.z =
        Math.sin(time * 0.8 + index) * 0.035;
});

        renderer.render(scene, camera);
    }

    animate();
}
// GitHub upload test