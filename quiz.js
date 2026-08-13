// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// =====================================================


// =====================================================
// READ URL PARAMETERS
// =====================================================

const params =
    new URLSearchParams(window.location.search);

const subject =
    params.get("subject");

const chapter =
    params.get("chapter");


// =====================================================
// HTML ELEMENTS
// =====================================================

const subjectName =
    document.getElementById("subjectName");

const chapterName =
    document.getElementById("chapterName");

const headerTitle =
    document.getElementById("headerTitle");

const headerChapter =
    document.getElementById("headerChapter");

const questionNumber =
    document.getElementById("questionNumber");

const question =
    document.getElementById("question");

const options =
    document.getElementById("options");

const englishExplanation =
    document.getElementById("englishExplanation");

const amharicExplanation =
    document.getElementById("amharicExplanation");

const nextBtn =
    document.getElementById("nextBtn");

const previousQuestionBtn =
    document.getElementById("previousQuestionBtn");

const backBtn =
    document.getElementById("backBtn");

const homeBtn =
    document.getElementById("homeBtn");

const progressBar =
    document.getElementById("progressBar");

const completionMessage =
    document.getElementById("completionMessage");

const explanationBox =
    document.getElementById("explanationBox");


// =====================================================
// FORMAT SUBJECT NAME
// =====================================================

function formatSubjectName(value) {

    if (!value) {
        return "Unknown Subject";
    }

    return value
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


// =====================================================
// SHOW SUBJECT + CHAPTER
// =====================================================

const formattedSubject =
    formatSubjectName(subject);

const formattedChapter =
    chapter
        ? `Chapter ${chapter}`
        : "Unknown Chapter";


subjectName.textContent =
    formattedSubject;

chapterName.textContent =
    formattedChapter;


headerTitle.textContent =
    formattedSubject;

headerChapter.textContent =
    `${formattedChapter} • Quiz`;


// =====================================================
// LOAD QUESTIONS
// =====================================================

const questions =
    typeof quizData !== "undefined"
        ? quizData?.[subject]?.[chapter] || []
        : [];


// =====================================================
// CURRENT QUESTION
// =====================================================

let currentQuestion = 0;


// =====================================================
// NO QUESTIONS FOUND
// =====================================================

if (questions.length === 0) {

    question.textContent =
        "No questions found for this chapter.";

    questionNumber.textContent =
        "Question 0 / 0";

    options.innerHTML = "";

    englishExplanation.textContent = "";

    amharicExplanation.textContent = "";

    previousQuestionBtn.style.display =
        "none";

    nextBtn.style.display =
        "none";

    explanationBox.style.display =
        "none";

    progressBar.style.width =
        "0%";

} else {

    loadQuestion();

}


// =====================================================
// LOAD QUESTION
// =====================================================

function loadQuestion() {

    const q =
        questions[currentQuestion];


    // ---------------------------------------------
    // Question number
    // ---------------------------------------------

    questionNumber.textContent =
        `Question ${currentQuestion + 1} / ${questions.length}`;


    // ---------------------------------------------
    // Question text
    // ---------------------------------------------

    question.textContent =
        q.question || "";


    // ---------------------------------------------
    // Clear old options
    // ---------------------------------------------

    options.innerHTML = "";


    // ---------------------------------------------
    // Clear explanations
    // ---------------------------------------------

    englishExplanation.textContent = "";

    amharicExplanation.textContent = "";


    // ---------------------------------------------
    // Hide explanation until answer
    // ---------------------------------------------

    explanationBox.style.display =
        "none";


    // ---------------------------------------------
    // Create options
    // ---------------------------------------------

    const questionOptions =
        q.options ||
        q.choices ||
        [];


    questionOptions.forEach(
        (option, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.className =
                "optionBtn";


            button.textContent =
                option;


            button.addEventListener(
                "click",
                () => {

                    checkAnswer(index);

                }
            );


            options.appendChild(button);

        }
    );


    // ---------------------------------------------
    // Update navigation
    // ---------------------------------------------

    updateNavigation();


    // ---------------------------------------------
    // Update progress
    // ---------------------------------------------

    updateProgress();


    // ---------------------------------------------
    // Scroll question into view
    // ---------------------------------------------

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// UPDATE PROGRESS
// =====================================================

function updateProgress() {

    if (questions.length === 0) {

        progressBar.style.width =
            "0%";

        return;

    }


    const progress =
        ((currentQuestion + 1) /
            questions.length) * 100;


    progressBar.style.width =
        `${progress}%`;

}


// =====================================================
// UPDATE NAVIGATION
// =====================================================

function updateNavigation() {

    // Previous Question
    previousQuestionBtn.disabled =
        currentQuestion === 0;


    // Next button
    if (
        currentQuestion ===
        questions.length - 1
    ) {

        nextBtn.innerHTML =
            `
            <span>Finish Quiz</span>
            <span class="navArrow">✓</span>
            `;

    } else {

        nextBtn.innerHTML =
            `
            <span>Next</span>
            <span class="navArrow">→</span>
            `;

    }

}


// =====================================================
// GET EXPLANATION
// =====================================================

function getEnglishExplanation(q) {

    // New / simple structure
    if (q.englishExplanation) {

        return q.englishExplanation;

    }


    // Explanation object structure
    if (
        q.explanation &&
        q.explanation.english
    ) {

        return q.explanation.english;

    }


    return "";

}


function getAmharicExplanation(q) {

    // New / simple structure
    if (q.amharicExplanation) {

        return q.amharicExplanation;

    }


    // Explanation object structure
    if (
        q.explanation &&
        q.explanation.amharic
    ) {

        return q.explanation.amharic;

    }


    return "";

}


// =====================================================
// CHECK ANSWER
// =====================================================

function checkAnswer(selectedIndex) {

    const q =
        questions[currentQuestion];


    const buttons =
        document.querySelectorAll(
            ".optionBtn"
        );


    const correctAnswer =
        q.answer;


    // ---------------------------------------------
    // Disable all buttons
    // ---------------------------------------------

    buttons.forEach(
        (button, index) => {

            button.disabled = true;


            // Correct answer
            if (
                index === correctAnswer
            ) {

                button.classList.add(
                    "correct"
                );

            }


            // Wrong selected answer
            if (
                index === selectedIndex &&
                index !== correctAnswer
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    // ---------------------------------------------
    // Show explanations
    // ---------------------------------------------

    englishExplanation.textContent =
        getEnglishExplanation(q);


    amharicExplanation.textContent =
        getAmharicExplanation(q);


    explanationBox.style.display =
        "block";


    // ---------------------------------------------
    // Scroll explanation into view
    // ---------------------------------------------

    setTimeout(
        () => {

            explanationBox.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        },
        150
    );

}


// =====================================================
// NEXT QUESTION
// =====================================================

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentQuestion <
            questions.length - 1
        ) {

            currentQuestion++;

            loadQuestion();

        } else {

            finishQuiz();

        }

    }
);


// =====================================================
// PREVIOUS QUESTION
// =====================================================

previousQuestionBtn.addEventListener(
    "click",
    () => {

        if (currentQuestion > 0) {

            currentQuestion--;

            loadQuestion();

        }

    }
);


// =====================================================
// FINISH QUIZ
// =====================================================

function finishQuiz() {

    questionNumber.textContent =
        `Question ${questions.length} / ${questions.length}`;


    progressBar.style.width =
        "100%";


    question.textContent =
        "🎉 Quiz Completed!";


    options.innerHTML = "";


    explanationBox.style.display =
        "none";


    previousQuestionBtn.style.display =
        "none";


    nextBtn.disabled =
        true;


    nextBtn.innerHTML =
        `
        <span>Completed</span>
        <span class="navArrow">✓</span>
        `;


    completionMessage.hidden =
        false;


    completionMessage.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


// =====================================================
// TOP BACK BUTTON
// =====================================================

backBtn.addEventListener(
    "click",
    () => {

        /*
         * This is now a REAL page back button.
         *
         * It does NOT move between questions.
         */

        if (window.history.length > 1) {

            window.history.back();

        } else {

            /*
             * Fallback if there is no
             * previous browser history.
             */

            if (subject) {

                window.location.href =
                    `chapter.html?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter || "")}`;

            } else {

                window.location.href =
                    "index.html";

            }

        }

    }
);


// =====================================================
// HOME BUTTON
// =====================================================

homeBtn.addEventListener(
    "click",
    () => {

        window.location.href =
            "index.html";

    }
);
