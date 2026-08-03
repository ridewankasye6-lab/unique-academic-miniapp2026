const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");

const questions = quizData[subject]?.[chapter] || [];

let currentQuestion = 0;
let score = 0;

const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");
const explanationBox = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");


if (questions.length === 0) {

    questionBox.textContent = "No questions added yet.";
    optionsBox.innerHTML = "";

} else {

    showQuestion();

}


function showQuestion(){

    let q = questions[currentQuestion];

    questionBox.textContent = q.question;

    optionsBox.innerHTML = "";

    explanationBox.innerHTML = "";

    q.options.forEach((option,index)=>{

        let button = document.createElement("button");

        button.textContent = option;

        button.className = "optionBtn";

        button.onclick = ()=>checkAnswer(index);

        optionsBox.appendChild(button);

    });

}


function checkAnswer(selected){

    let q = questions[currentQuestion];

    let buttons = document.querySelectorAll(".optionBtn");


    buttons.forEach((btn,index)=>{

        btn.disabled = true;


        if(index === q.answer){

            btn.style.background = "green";
            btn.style.color = "white";

        }


        if(index === selected && selected !== q.answer){

            btn.style.background = "red";
            btn.style.color = "white";

        }

    });


    explanationBox.innerHTML = `

    <h3>Explanation</h3>

    <p>${q.englishExplanation}</p>

    <p>${q.amharicExplanation}</p>

    `;


    if(selected === q.answer){

        score++;

    }


}

nextBtn.onclick = ()=>{


    currentQuestion++;


    if(currentQuestion < questions.length){

        showQuestion();

    }

    else{


        questionBox.textContent =
        "🎉 Quiz Completed";


        optionsBox.innerHTML =
        "Your Score: " + score + "/" + questions.length;


        document.getElementById("englishExplanation").innerHTML = "";

        document.getElementById("amharicExplanation").innerHTML = "";


        nextBtn.style.display = "none";


    }


};

};
// Back button
// Back button
const backBtn = document.getElementById("backBtn");

if(backBtn){

    backBtn.onclick = function(){

        window.history.back();

    };

}


// Home button
const homeBtn = document.getElementById("homeBtn");

if(homeBtn){

    homeBtn.onclick = function(){

        window.location.href = "index.html";

    };

}
