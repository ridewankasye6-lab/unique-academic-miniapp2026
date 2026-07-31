let urlParams = new URLSearchParams(window.location.search);

let subject = urlParams.get("subject");

let chapter = Number(urlParams.get("chapter"));

let questions = QUESTIONS[subject][chapter];

let currentQuestion = 0;

let score = 0;

const questionText = document.getElementById("question");
const answersBox = document.getElementById("answers");
const resultBox = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");


function loadQuestion(){

let q = quizData[currentQuestion];


questionText.innerHTML = q.question;


answersBox.innerHTML="";

resultBox.style.display="none";

nextBtn.style.display="none";


progressText.innerHTML =
"Question " + (currentQuestion + 1) +
" / " + quizData.length;


progressFill.style.width =
((currentQuestion) / quizData.length * 100) + "%";



q.answers.forEach(function(answer,index){


let button=document.createElement("button");

button.className="answer";

button.innerHTML=answer;


button.onclick=function(){

checkAnswer(button,index);

};


answersBox.appendChild(button);


});


}



function checkAnswer(button,index){


let q=quizData[currentQuestion];


let buttons=document.querySelectorAll(".answer");


buttons.forEach(function(btn){

btn.disabled=true;

});



if(index===q.correct){


button.style.background="#2ecc71";

button.style.color="white";

score++;


resultBox.innerHTML=
"✅ Correct!<br><br>"+
"🇬🇧 "+q.english+
"<br><br>"+
"🇪🇹 "+q.amharic;


}

else{


button.style.background="#e74c3c";

button.style.color="white";


buttons[q.correct].style.background="#2ecc71";

buttons[q.correct].style.color="white";


resultBox.innerHTML=
"❌ Wrong<br><br>"+
"✅ Correct Answer: "+
q.answers[q.correct]+
"<br><br>"+
"🇬🇧 "+q.english+
"<br><br>"+
"🇪🇹 "+q.amharic;


}


resultBox.style.display="block";

nextBtn.style.display="block";


}



nextBtn.onclick=function(){


currentQuestion++;


if(currentQuestion < quizData.length){

loadQuestion();

}

else{


localStorage.setItem("score",score);


window.location.href="result.html";


}


};



loadQuestion();
