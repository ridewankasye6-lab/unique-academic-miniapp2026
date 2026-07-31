let urlParams = new URLSearchParams(window.location.search);

let subject = urlParams.get("subject");

let chapter = Number(urlParams.get("chapter"));

let questions = QUESTIONS[subject][chapter];

let currentQuestion = 0;

let score = 0;

document.getElementById("quizTitle").innerHTML =
subject.toUpperCase() + " - Chapter " + chapter;

function showQuestion() {

    let q = questions[currentQuestion];

    document.getElementById("progress").innerHTML =
    "Question " + (currentQuestion + 1) + " / " + questions.length;

    document.getElementById("question").innerHTML = q.question;

    document.getElementById("btn0").innerHTML = q.options[0];

    document.getElementById("btn1").innerHTML = q.options[1];

    document.getElementById("btn2").innerHTML = q.options[2];

    document.getElementById("btn3").innerHTML = q.options[3];

}

showQuestion();
