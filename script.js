
let name = "Bashar";

console.log("Hello " + name);

let age = 22;

console.log("My age is " + age);

function sayHello() {
    document.getElementById("message").innerText =
        "Welcome to my portfolio, Bashar!";
}

let developer = "Bashar";
let country = "Palestine";
let profession = "Software Engineer";

console.log("My name is " + developer);
console.log("I live in " + country);
console.log("My profession is " + profession);

function greetUser(name) {
    console.log("Welcome " + name);
}

greetUser("Bashar");
greetUser("Ahmed");
greetUser("Mohammed");

function welcomeMessage() {
    document.getElementById("welcome").innerText =
        "Welcome to Bashar Fayad's Portfolio!";
}

function greetVisitor() {

    let name = document.getElementById("visitorName").value;

    if (name === "") {
        document.getElementById("visitorMessage").innerText =
            "Please enter your name!";
    } else {
        document.getElementById("visitorMessage").innerText =
            "Welcome " + name + "! Thanks for visiting.";
    }

}
// My Technical Skills

let mySkills = [
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
    "GitHub",
    "Problem Solving"
];

let skillsContainer = document.getElementById("skillsList");

for (let i = 0; i < mySkills.length; i++) {
    let skillItem = document.createElement("li");
    skillItem.innerText = mySkills[i];
    skillsContainer.appendChild(skillItem);
}