
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const modal = document.getElementById('skill-modal');
const canvas = document.getElementById('skill-canvas');
const closeButton = document.getElementById('close-skill-modal');

const title = document.getElementById('skill-title');
const description = document.getElementById('skill-description');
const category = document.getElementById('skill-category');

let renderer = null;
let scene = null;
let camera = null;
let model = null;
let animationId = null;
let pointerX = 0;


const translations = {
    blender: {
        en: {
            title: 'Blender',
            category: '3D DESIGN',
            description: '3D modeling, sculpting, rendering and creative visual design. Used to create professional 3D objects, environments and animations.'
        },
        ar: {
            title: 'بلندر',
            category: 'التصميم ثلاثي الأبعاد',
            description: 'النمذجة والنحت والإخراج ثلاثي الأبعاد والتصميم البصري الإبداعي، لإنشاء المجسمات والبيئات والرسوم المتحركة.'
        }
    },
    javascript: {
        en: {
            title: 'JavaScript',
            category: 'WEB DEVELOPMENT',
            description: 'Building interactive websites, dynamic user interfaces and modern web applications using JavaScript.'
        },
        ar: {
            title: 'جافاسكريبت',
            category: 'تطوير الويب',
            description: 'إنشاء المواقع التفاعلية وواجهات المستخدم الديناميكية وتطبيقات الويب الحديثة باستخدام JavaScript.'
        }
    },
    java: {
        en: {
            title: 'Java',
            category: 'SOFTWARE DEVELOPMENT',
            description: 'Object-oriented programming, application development and building reliable software systems using Java.'
        },
        ar: {
            title: 'جافا',
            category: 'تطوير البرمجيات',
            description: 'البرمجة كائنية التوجه وتطوير التطبيقات وبناء أنظمة برمجية موثوقة باستخدام Java.'
        }
    },
    cpp: {
        en: {
            title: 'C++',
            category: 'PROGRAMMING',
            description: 'High-performance programming, object-oriented development and efficient software solutions using C++.'
        },
        ar: {
            title: 'سي بلس بلس',
            category: 'البرمجة',
            description: 'البرمجة عالية الأداء وتطوير البرمجيات بكفاءة باستخدام C++.'
        }
    },
    'html-css': {
        en: {
            title: 'HTML & CSS',
            category: 'FRONTEND DEVELOPMENT',
            description: 'Creating structured, responsive and visually appealing web pages using HTML and CSS.'
        },
        ar: {
            title: 'HTML و CSS',
            category: 'تطوير واجهات المواقع',
            description: 'إنشاء صفحات ويب منظمة ومتجاوبة وجذابة باستخدام HTML وCSS.'
        }
    },
    sql: {
        en: {
            title: 'SQL',
            category: 'DATABASE MANAGEMENT',
            description: 'Managing relational databases, writing queries and organizing structured data using SQL.'
        },
        ar: {
            title: 'SQL',
            category: 'إدارة قواعد البيانات',
            description: 'إدارة قواعد البيانات العلائقية وكتابة الاستعلامات وتنظيم البيانات باستخدام SQL.'
        }
    }
};


function getLanguage() {
    return document.documentElement.lang === 'ar' ||
        document.body.dir === 'rtl' ||
        localStorage.getItem('portfolio-language') === 'ar'
        ? 'ar'
        : 'en';
}

function addMaterialMesh(geometry, material, position, parent) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    parent.add(mesh);
    return mesh;
}

function createBlenderModel() {
    const group = new THREE.Group();

    const orange = new THREE.MeshStandardMaterial({
        color: 0xff8c24,
        metalness: 0.55,
        roughness: 0.25
    });

    const blue = new THREE.MeshStandardMaterial({
        color: 0x1769aa,
        metalness: 0.5,
        roughness: 0.2
    });

    const white = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.2
    });

    // Main orange ring
    const ring = addMaterialMesh(
        new THREE.TorusGeometry(0.85, 0.22, 24, 100),
        orange,
        [0, 0, 0],
        group
    );

    // Blue center
    addMaterialMesh(
        new THREE.SphereGeometry(0.58, 48, 48),
        blue,
        [0, 0, 0.08],
        group
    );

    // White inner ring
    addMaterialMesh(
        new THREE.TorusGeometry(0.35, 0.055, 16, 64),
        white,
        [0, 0, 0.57],
        group
    );

    // Orange connecting arms
    const arm1 = addMaterialMesh(
        new THREE.CylinderGeometry(0.13, 0.19, 1.05, 24),
        orange,
        [-0.95, 0.35, 0],
        group
    );
    arm1.rotation.z = Math.PI / 2.8;

    const arm2 = addMaterialMesh(
        new THREE.CylinderGeometry(0.12, 0.18, 0.9, 24),
        orange,
        [-1.25, -0.1, 0],
        group
    );
    arm2.rotation.z = Math.PI / 2;

    group.scale.setScalar(0.85);
    return group;
}

function createScene(skill) {
    if (renderer) {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        renderer = null;
    }

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        40,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        100
    );

    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light = new THREE.PointLight(0x8b65ff, 30);
    light.position.set(3, 3, 4);
    scene.add(light);

    const blueLight = new THREE.PointLight(0x00d9ff, 20);
    blueLight.position.set(-3, -2, 3);
    scene.add(blueLight);

    if (skill === 'blender') {
    model = createBlenderModel();
} else if (skill === 'javascript') {
    model = createJavaScriptModel();
} else {
    model = createGenericSkillModel(skill);
}
    scene.add(model);

    function animate() {
        animationId = requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        model.rotation.y +=
            (pointerX * 0.7 - model.rotation.y) * 0.04;

        model.rotation.x = Math.sin(time * 0.7) * 0.08;
        model.position.y = Math.sin(time * 1.5) * 0.08;

        renderer.render(scene, camera);
    }

    animate();
}

function createJavaScriptModel() {
    const group = new THREE.Group();

    const yellow = new THREE.MeshStandardMaterial({
        color: 0xf7df1e,
        metalness: 0.35,
        roughness: 0.25
    });

    const dark = new THREE.MeshStandardMaterial({
        color: 0x17182e,
        metalness: 0.4,
        roughness: 0.3
    });

    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 1.8, 0.35),
        yellow
    );

    group.add(cube);

    // JS letters as 3D text-like bars
    const vertical = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.9, 0.08),
        dark
    );

    vertical.position.set(0.25, -0.05, 0.23);
    group.add(vertical);

    const horizontal = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.17, 0.08),
        dark
    );

    horizontal.position.set(0.48, -0.42, 0.23);
    group.add(horizontal);

    const lower = new THREE.Mesh(
        new THREE.BoxGeometry(0.17, 0.35, 0.08),
        dark
    );

    lower.position.set(0.67, -0.27, 0.23);
    group.add(lower);

    return group;
}


function createGenericSkillModel(skill) {
    const colors = {
        java: 0xf89820,
        cpp: 0x4285f4,
        'html-css': 0xe34f26,
        sql: 0x00c9db
    };

    const color = colors[skill] || 0x8b65ff;

    const group = new THREE.Group();

    const geometry = new THREE.IcosahedronGeometry(1.2, 2);
    const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.65,
        roughness: 0.25,
        emissive: color,
        emissiveIntensity: 0.18
    });

    const core = new THREE.Mesh(geometry, material);
    group.add(core);

    const ringGeometry = new THREE.TorusGeometry(1.65, 0.035, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    group.add(ring);

    return group;
}
function openSkill(skill) {
    const language = getLanguage();
    const data = translations[skill];

    if (!data) return;

    title.textContent = data[language].title;
    description.textContent = data[language].description;
    category.textContent = data[language].category;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(() => {
        createScene(skill);
    });
}

document.addEventListener('click', event => {
    const card = event.target.closest('[data-skill]');

    if (!card) return;

    openSkill(card.dataset.skill.toLowerCase());
});

function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
}

closeButton.addEventListener('click', closeModal);

modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
});

window.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeModal();
});

canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
});
window.addEventListener('open-3d-skill', (event) => {
    openSkill(event.detail.skill);
});