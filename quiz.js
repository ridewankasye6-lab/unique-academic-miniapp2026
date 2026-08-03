// Read URL
const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

// Get question list
const questions = quizData[subject]?.[chapter] || [];
if (questions.length === 0) {

    document.getElementById("question").textContent =
    "No questions have been added for this chapter yet.";

    document.getElementById("options").innerHTML = "";

    document.querySelector(".answer-box").style.display = "none";

    document.getElementById("nextBtn").style.display = "none";

    throw new Error("No questions found.");

}
// Start from first question
let currentQuestion = 0;

// Load first question
loadQuestion();

function loadQuestion(){

    const q = questions[currentQuestion];

    document.getElementById("question").textContent =
        q.question;

    const optionsDiv =
        document.getElementById("options");

    optionsDiv.innerHTML = "";

    // Hide explanation
    document.querySelector(".answer-box").style.display = "none";

    // Hide Next button
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
        q.englishExplanation;

    document.getElementById("amharicExplanation").textContent =
        q.amharicExplanation;

    // Show explanation
    document.querySelector(".answer-box").style.display = "block";

    // Show Next button
    document.getElementById("nextBtn").style.display = "inline-block";

}

document.getElementById("nextBtn").onclick = function(){

    currentQuestion++;

    if(currentQuestion < questions.length){
// Subject Name
document.getElementById("subjectName").textContent =
subject.replace("-", " ").replace(/\b\w/g,
c => c.toUpperCase());

// Chapter Title
document.getElementById("chapterTitle").textContent =
"Chapter " + chapter + " Quiz";
 document.getElementById("chapterSubtitle").textContent =
"Unique Academic Learning Quiz";
        loadQuestion();

    }else{

        alert("🎉 You have completed this chapter quiz!");

    }

};

document.getElementById("backBtn").onclick = function(){

    window.location.href = subject + ".html";

};
