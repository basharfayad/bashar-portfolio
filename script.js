
// Language switcher
const languageToggle = document.getElementById("languageToggle");

let currentLanguage = localStorage.getItem("portfolio-language") || "en";

function updateLanguage() {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.body.dir =
        currentLanguage === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-en][data-ar]").forEach(element => {
        element.innerHTML = element.dataset[currentLanguage];
    });

    languageToggle.textContent =
        currentLanguage === "en" ? "عربي" : "English";

    localStorage.setItem("portfolio-language", currentLanguage);
}

languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "en" ? "ar" : "en";
    updateLanguage();
});

updateLanguage();


// Mobile navigation
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuBtn.textContent =
        navLinks.classList.contains("active") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuBtn.textContent = "☰";
    });
});


// Automatic footer year
document.getElementById("year").textContent =
    new Date().getFullYear();


// Scroll reveal animation
const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .stat-card, .skill-card, " +
    ".timeline-item, .education-card, .project-card, .language-list, " +
    ".contact-section"
);

revealElements.forEach(element => {
    element.classList.add("reveal");
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

revealElements.forEach(element => observer.observe(element));

console.log("Bashar Fayad Portfolio is ready!");
