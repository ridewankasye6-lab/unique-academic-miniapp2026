// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get question list
const questions = quizData[subject][chapter];

// Start from first question
let currentQuestion = 0;

// Load first question
function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("question").textContent =
        q.question;

    const optionsDiv =
        document.getElementById("options");

    optionsDiv.innerHTML = "";

    q.options.forEach((option,index)=>{

        const button =
            document.createElement("button");

        button.className = "option-btn";

        button.textContent = "○ " + option;

        button.onclick = ()=>checkAnswer(index);

        optionsDiv.appendChild(button);

    });

}
