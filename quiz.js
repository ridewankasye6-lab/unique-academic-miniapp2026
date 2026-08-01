// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get question list
const questions = quizData[subject][chapter];

// Start from first question
let currentQuestion = 0;

// Load first question
loadQuestion();
function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("question").textContent =
        q.question;

}
