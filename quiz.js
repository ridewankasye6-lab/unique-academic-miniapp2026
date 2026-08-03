const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");


const questions = quizData[subject]?.[chapter] || [];


let currentQuestion = 0;
let score = 0;



const questionBox = document.getElementById("question");
const optionsBox = document.getElementById("options");

const englishBox = document.getElementById("englishExplanation");
const amharicBox = document.getElementById("amharicExplanation");

const nextBtn = document.getElementById("nextBtn");

const subjectName = document.getElementById("subjectName");
const chapterTitle = document.getElementById("chapterTitle");




// Show subject information

if(subjectName){

    subjectName.textContent = subject || "";

}


if(chapterTitle){

    chapterTitle.textContent = "Chapter " + chapter;

}





// Check questions

if(questions.length === 0){


    questionBox.textContent = 
    "No questions added yet.";


    optionsBox.innerHTML = "";


    nextBtn.style.display = "none";


}

else{


    showQuestion();


}







function showQuestion(){


    let q = questions[currentQuestion];


    questionBox.textContent = q.question;


    optionsBox.innerHTML = "";


    englishBox.textContent = "";

    amharicBox.textContent = "";




    q.options.forEach((option,index)=>{


        let button = document.createElement("button");


        button.textContent = option;


        button.className = "optionBtn";


        button.onclick = function(){

            checkAnswer(index);

        };



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




    englishBox.innerHTML = q.englishExplanation || "";

    amharicBox.innerHTML = q.amharicExplanation || "";




    if(selected === q.answer){

        score++;

    }




}








nextBtn.onclick = function(){



    currentQuestion++;



    if(currentQuestion < questions.length){



        showQuestion();



    }

    else{


        questionBox.textContent = "🎉 Quiz Completed";


        optionsBox.innerHTML = 
        "Your Score: " + score + "/" + questions.length;



        englishBox.innerHTML = "";

        amharicBox.innerHTML = "";


        nextBtn.style.display = "none";


    }



};







// Back button

const backBtn = document.getElementById("backBtn");


if(backBtn){


    backBtn.onclick = function(){


        window.history.back();


    };


}







