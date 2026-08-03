// ==========================
// UNIQUE ACADEMIC QUIZ
// Lesson 3A
// ==========================

// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get questions
const questions = quizData[subject]?.[chapter] || [];

// Current question
let currentQuestion = 0;

// HTML Elements
const subjectName = document.getElementById("subjectName");
const chapterName = document.getElementById("chapterName");
const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const options = document.getElementById("options");

// Show subject name
subjectName.textContent = subject
    ? subject.replace(/-/g, " ").toUpperCase()
    : "Unknown Subject";

// Show chapter
chapterName.textContent = "Chapter " + chapter;

// No questions
if (questions.length === 0) {

    question.textContent = "No questions found.";

} else {

    function loadQuestion() {

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    question.textContent = q.question;

    options.innerHTML = "";

    document.getElementById("englishExplanation").textContent = "";
    document.getElementById("amharicExplanation").textContent = "";

    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "optionBtn";

        button.textContent = option;

        button.onclick = function () {
            checkAnswer(index);
        };

        options.appendChild(button);

    });

}
    function checkAnswer(selectedIndex) {

    const q = questions[currentQuestion];

    const buttons = document.querySelectorAll(".optionBtn");

    buttons.forEach((button, index) => {

        button.disabled = true;

        if (index === q.answer) {

            button.style.backgroundColor = "green";
            button.style.color = "white";

        }

        if (index === selectedIndex && index !== q.answer) {

            button.style.backgroundColor = "red";
            button.style.color = "white";

        }

    });

    document.getElementById("englishExplanation").textContent =
        q.englishExplanation;

    document.getElementById("amharicExplanation").textContent =
        q.amharicExplanation;

}
