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

// Check if there are questions
if (questions.length === 0) {

    question.textContent = "No questions found.";
    questionNumber.textContent = "Question 0 / 0";

} else {

    const q = questions[0];

    questionNumber.textContent =
        `Question 1 / ${questions.length}`;

    question.textContent = q.question;

    options.innerHTML = "";

    q.options.forEach(option => {

        const button = document.createElement("button");

        button.className = "optionBtn";

        button.textContent = option;

        options.appendChild(button);

    });

}
