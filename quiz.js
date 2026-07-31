let subject = "global-trends";
let chapter = 1;

let currentQuestion = 0;
let score = 0;

let quizData = QUESTIONS[subject][chapter];


const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const resultBox = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");


function loadQuestion(){

let q = quizData[currentQuestion];


progressText.innerHTML =
"Question " + (currentQuestion + 1) +
" / " + quizData.length;


let percent =
((currentQuestion) / quizData.length) * 100;


progressFill.style.width = percent + "%";


questionText.innerHTML = q.question;


answersBox.innerHTML="";


q.answers.forEach(function(answer,index){

let button=document.createElement("button");

button.className="answer";

button.innerHTML=answer;


button.onclick=function(){

checkAnswer(button,index);

};


answersBox.appendChild(button);

});


resultBox.style.display="none";

nextBtn.style.display="none";

}



function checkAnswer(button,selected){

let q = quizData[currentQuestion];


let buttons=document.querySelectorAll(".answer");


buttons.forEach(function(btn){

btn.disabled=true;

});


if(selected === q.correct){

button.style.background="#2ecc71";

button.style.color="white";

score++;

}else{

button.style.background="#e74c3c";

button.style.color="white";


buttons[q.correct].style.background="#2ecc71";

buttons[q.correct].style.color="white";

}


resultBox.style.display="block";


resultBox.innerHTML=

"<b>🇬🇧 Explanation:</b><br>"+
q.english+
"<br><br>"+
"<b>🇪🇹 ማብራሪያ:</b><br>"+
q.amharic;


nextBtn.style.display="block";

}



nextBtn.onclick=function(){

currentQuestion++;


if(currentQuestion < quizData.length){

loadQuestion();

}else{


localStorage.setItem("score",score);


window.location.href="result.html";


}

};



loadQuestion();
