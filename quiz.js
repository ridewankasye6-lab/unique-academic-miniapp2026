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

    loadQuestion();

}

// Load question
function loadQuestion() {

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    question.textContent = q.question;

    options.innerHTML = "";

    q.options.forEach((option) => {

        const button = document.createElement("button");

        button.className = "optionBtn";

        button.textContent = option;

        options.appendChild(button);

    });

}
alert(subject);
alert(chapter);
