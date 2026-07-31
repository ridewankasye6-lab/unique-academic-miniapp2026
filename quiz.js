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

    document.getElementById("btn0").disabled = false;
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn2").disabled = false;
    document.getElementById("btn3").disabled = false;

    document.getElementById("btn0").style.background = "";
    document.getElementById("btn1").style.background = "";
    document.getElementById("btn2").style.background = "";
    document.getElementById("btn3").style.background = "";

    document.getElementById("nextBtn").style.display = "none";

}

function checkAnswer(index) {

    let q = questions[currentQuestion];

    document.getElementById("btn0").disabled = true;
    document.getElementById("btn1").disabled = true;
    document.getElementById("btn2").disabled = true;
    document.getElementById("btn3").disabled = true;

    if (index === q.correct) {

        score++;

        document.getElementById("btn" + index).style.background = "green";

    } else {

        document.getElementById("btn" + index).style.background = "red";

        document.getElementById("btn" + q.correct).style.background = "green";

    }

    document.getElementById("nextBtn").style.display = "block";

}

function nextQuestion() {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        showQuestion();

    } else {

        localStorage.setItem("score", score);
        localStorage.setItem("total", questions.length);
        localStorage.setItem("subject", subject);
        localStorage.setItem("chapter", chapter);

        window.location.href = "result.html";

    }

}

showQuestion();
