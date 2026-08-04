// ===============================
// UNIQUE ACADEMIC QUIZ
// Step 2 - Load First Question
// ===============================

// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get HTML elements
const subjectName = document.getElementById("subjectName");
const chapterName = document.getElementById("chapterName");
const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const options = document.getElementById("options");

// Show subject
subjectName.textContent = subject
    ? subject.replace(/-/g, " ").toUpperCase()
    : "Unknown Subject";

// Show chapter
chapterName.textContent = chapter
    ? "Chapter " + chapter
    : "Unknown Chapter";

// Get questions
const questions = quizData[subject]?.[chapter] || [];
let currentQuestion = 0;

console.log(quizData);
console.log(questions);
// Check if there are questions
if (questions.length === 0) {

    question.textContent = "No questions found.";
    questionNumber.textContent = "Question 0 / 0";

} else {

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `Question 1 / ${questions.length}`;

    question.textContent = q.question;

    options.innerHTML = "";

    q.options.forEach(option => {

        const button = document.createElement("button");

        button.className = "optionBtn";

        button.textContent = option;

button.onclick = function () {
    checkAnswer(button, q, button.textContent);
};

options.appendChild(button);

    });

}

function checkAnswer(clickedButton, q, selectedOption) {

    const buttons = document.querySelectorAll(".optionBtn");

    buttons.forEach(btn => {

        btn.disabled = true;

        if (btn.textContent === q.options[q.answer]) {

            btn.style.background = "green";
            btn.style.color = "white";

        }

    });

    if (selectedOption !== q.options[q.answer]) {

        clickedButton.style.background = "red";
        clickedButton.style.color = "white";

    }

    document.getElementById("englishExplanation").textContent =
        q.englishExplanation;

    document.getElementById("amharicExplanation").textContent =
        q.amharicExplanation;
}
