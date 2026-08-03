// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = Number(params.get("chapter"));

// Show Subject & Chapter
document.getElementById("subjectName").textContent =
subject.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

document.getElementById("chapterTitle").textContent =
"Chapter " + chapter + " Quiz";

const subtitle = document.getElementById("chapterSubtitle");
if (subtitle) {
    subtitle.textContent = "Unique Academic Learning Quiz";
}

// Get Questions
const questions = quizData[subject]?.[chapter] || [];

if (questions.length === 0) {

    document.getElementById("question").textContent =
    "No questions have been added for this chapter yet.";

    document.getElementById("options").innerHTML = "";

    document.querySelector(".answer-box").style.display = "none";

    document.getElementById("nextBtn").style.display = "none";

    throw new Error("No questions found.");
}

let currentQuestion = 0;

loadQuestion();

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("question").textContent =
    q.question;

    const optionsDiv =
    document.getElementById("options");

    optionsDiv.innerHTML = "";

    document.querySelector(".answer-box").style.display = "none";

    document.getElementById("englishExplanation").textContent = "";

    document.getElementById("amharicExplanation").textContent = "";

    document.getElementById("nextBtn").style.display = "none";

    q.options.forEach((option,index)=>{

        const button = document.createElement("button");

        button.className = "option-btn";

        button.textContent = "○ " + option;

        button.onclick = ()=>checkAnswer(index);

        optionsDiv.appendChild(button);

    });

}

function checkAnswer(selectedIndex){

    const q = questions[currentQuestion];

    const buttons =
    document.querySelectorAll(".option-btn");

    buttons.forEach((button,index)=>{

        button.disabled = true;

        if(index === q.answer){

            button.classList.add("correct");

        }

        if(index === selectedIndex &&
           index !== q.answer){

            button.classList.add("wrong");

        }

    });

    document.getElementById("englishExplanation").textContent =
    q.englishExplanation || "";

    document.getElementById("amharicExplanation").textContent =
    q.amharicExplanation || "";

    document.querySelector(".answer-box").style.display = "block";

    document.getElementById("nextBtn").style.display = "inline-block";

}

document.getElementById("nextBtn").onclick = function(){

    currentQuestion++;

    if(currentQuestion < questions.length){

        loadQuestion();

    }else{

        alert("🎉 You have completed this chapter quiz!");

    }

};

document.getElementById("backBtn").onclick = function(){

    window.location.href = subject + ".html";

};
