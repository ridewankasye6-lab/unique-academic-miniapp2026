// ===============================
// UNIQUE ACADEMIC QUIZ
// ===============================

// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// HTML Elements
const subjectName = document.getElementById("subjectName");
const chapterName = document.getElementById("chapterName");
const questionNumber = document.getElementById("questionNumber");
const question = document.getElementById("question");
const options = document.getElementById("options");
const englishExplanation = document.getElementById("englishExplanation");
const amharicExplanation = document.getElementById("amharicExplanation");
const nextBtn = document.getElementById("nextBtn");

// Show Subject & Chapter
subjectName.textContent = subject
    ? subject.replace(/-/g, " ").toUpperCase()
    : "Unknown Subject";

chapterName.textContent = chapter
    ? "Chapter " + chapter
    : "Unknown Chapter";

// Load Questions
const questions = quizData[subject]?.[chapter] || [];
console.log(questions.length);
let currentQuestion = 0;

// No Questions
if (questions.length === 0) {

    question.textContent = "No questions found.";
    questionNumber.textContent = "Question 0 / 0";
    nextBtn.style.display = "none";

} else {

    loadQuestion();

}

// ===============================
// Load Question
// ===============================
function loadQuestion() {

    const q = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;

    question.textContent = q.question;

    options.innerHTML = "";

    englishExplanation.textContent = "";
    amharicExplanation.textContent = "";

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

// ===============================
// Check Answer
// ===============================
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

    englishExplanation.textContent = q.englishExplanation;
    amharicExplanation.textContent = q.amharicExplanation;

}

// ===============================
// Next Question
// ===============================
nextBtn.onclick = function () {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        loadQuestion();

    } else {

        questionNumber.textContent = `Question ${questions.length} / ${questions.length}`;

        question.innerHTML = "🎉 Quiz Completed!";

        options.innerHTML = "";

        englishExplanation.textContent = "";
        amharicExplanation.textContent = "";

        nextBtn.disabled = true;
        nextBtn.textContent = "Finished";

    }

};
// ===============================
// Back Button
// ===============================
document.getElementById("backBtn").onclick = function () {
    history.back();
};

// ===============================
// Home Button
// ===============================
document.getElementById("homeBtn").onclick = function () {
    window.location.href = "index.html";
};
