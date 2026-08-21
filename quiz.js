// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// STABLE VERSION
// 5 QUESTIONS PER PAGE
// =====================================================


// =====================================================
// READ URL PARAMETERS
// =====================================================

const params = new URLSearchParams(window.location.search);

const subject = params.get("subject");
const chapter = params.get("chapter");


// =====================================================
// HTML ELEMENTS
// =====================================================

const subjectName = document.getElementById("subjectName");
const chapterName = document.getElementById("chapterName");

const headerTitle = document.getElementById("headerTitle");
const headerChapter = document.getElementById("headerChapter");

const questionNumber = document.getElementById("questionNumber");

const nextBtn = document.getElementById("nextBtn");
const previousQuestionBtn =
    document.getElementById("previousQuestionBtn");

const backBtn = document.getElementById("backBtn");
const homeBtn = document.getElementById("homeBtn");

const progressBar = document.getElementById("progressBar");

const completionMessage =
    document.getElementById("completionMessage");

const questionsPage =
    document.getElementById("questionsPage");


// =====================================================
// QUESTIONS PER PAGE
// =====================================================

const QUESTIONS_PER_PAGE = 5;


// =====================================================
// CURRENT PAGE
// =====================================================

let currentPage = 0;


// =====================================================
// SAFETY CHECK
// =====================================================

if (!questionsPage) {
    console.error("questionsPage was not found.");
}


// =====================================================
// FORMAT SUBJECT NAME
// =====================================================

function formatSubjectName(value) {

    if (!value) {
        return "Unknown Subject";
    }

    return value
        .replace(/-/g, " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
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


if (subjectName) {
    subjectName.textContent =
        formattedSubject;
}


if (chapterName) {
    chapterName.textContent =
        formattedChapter;
}


if (headerTitle) {
    headerTitle.textContent =
        formattedSubject;
}


if (headerChapter) {
    headerChapter.textContent =
        `${formattedChapter} • Quiz`;
}


// =====================================================
// LOAD QUESTIONS
// =====================================================

let questions = [];


// quizData must already be loaded by quiz.html
if (
    typeof quizData !== "undefined" &&
    subject &&
    chapter
) {

    questions =
        quizData?.[subject]?.[chapter] || [];

}


console.log(
    "Quiz loaded:",
    subject,
    chapter,
    questions.length,
    "questions"
);


// =====================================================
// NO QUESTIONS FOUND
// =====================================================

if (questions.length === 0) {

    if (questionsPage) {

        questionsPage.innerHTML = `
            <section class="questionCard">

                <h2 class="questionText">
                    No questions found for this chapter.
                </h2>

                <p>
                    Subject: ${formattedSubject}
                    <br>
                    Chapter: ${formattedChapter}
                </p>

            </section>
        `;

    }


    if (questionNumber) {
        questionNumber.textContent =
            "Question 0 / 0";
    }


    if (previousQuestionBtn) {
        previousQuestionBtn.style.display =
            "none";
    }


    if (nextBtn) {
        nextBtn.style.display =
            "none";
    }


    if (progressBar) {
        progressBar.style.width =
            "0%";
    }

} else {

    loadPage();

}


// =====================================================
// GET ENGLISH EXPLANATION
// =====================================================

function getEnglishExplanation(q) {

    if (
        q &&
        typeof q.englishExplanation === "string"
    ) {

        return q.englishExplanation;

    }


    if (
        q &&
        q.explanation &&
        typeof q.explanation.english === "string"
    ) {

        return q.explanation.english;

    }


    return "";
}


// =====================================================
// GET AMHARIC EXPLANATION
// =====================================================

function getAmharicExplanation(q) {

    if (
        q &&
        typeof q.amharicExplanation === "string"
    ) {

        return q.amharicExplanation;

    }


    if (
        q &&
        q.explanation &&
        typeof q.explanation.amharic === "string"
    ) {

        return q.explanation.amharic;

    }


    return "";
}


// =====================================================
// LOAD PAGE
// =====================================================

function loadPage() {

    if (!questionsPage) {
        return;
    }


    questionsPage.innerHTML = "";


    const startIndex =
        currentPage * QUESTIONS_PER_PAGE;


    const endIndex =
        Math.min(
            startIndex + QUESTIONS_PER_PAGE,
            questions.length
        );


    // ---------------------------------------------
    // CREATE QUESTIONS
    // ---------------------------------------------

    for (
        let index = startIndex;
        index < endIndex;
        index++
    ) {

        createQuestionCard(
            questions[index],
            index
        );

    }


    // ---------------------------------------------
    // QUESTION COUNTER
    // ---------------------------------------------

    if (questionNumber) {

        questionNumber.textContent =
            `Questions ${startIndex + 1}-${endIndex} / ${questions.length}`;

    }


    // ---------------------------------------------
    // NAVIGATION
    // ---------------------------------------------

    updateNavigation();


    // ---------------------------------------------
    // PROGRESS
    // ---------------------------------------------

    updateProgress();


    // ---------------------------------------------
    // SCROLL
    // ---------------------------------------------

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// CREATE QUESTION CARD
// =====================================================

function createQuestionCard(q, index) {

    const questionCard =
        document.createElement("section");

    questionCard.className =
        "questionCard";


    // ---------------------------------------------
    // QUESTION LABEL
    // ---------------------------------------------

    const questionLabel =
        document.createElement("div");

    questionLabel.className =
        "questionLabel";


    const questionBadge =
        document.createElement("span");

    questionBadge.className =
        "questionBadge";


    questionBadge.textContent =
        `QUESTION ${index + 1}`;


    questionLabel.appendChild(
        questionBadge
    );


    // ---------------------------------------------
    // QUESTION TEXT
    // ---------------------------------------------

    const questionText =
        document.createElement("h2");

    questionText.className =
        "questionText";


    questionText.textContent =
        q.question || "";


    // ---------------------------------------------
    // OPTIONS
    // ---------------------------------------------

    const options =
        document.createElement("div");

    options.className =
        "options";


    const questionOptions =
        q.options ||
        q.choices ||
        [];


    questionOptions.forEach(
        (option, optionIndex) => {

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

                    checkAnswer(
                        q,
                        optionIndex,
                        options,
                        explanationBox,
                        englishExplanation,
                        amharicExplanation
                    );

                }
            );


            options.appendChild(
                button
            );

        }
    );


    // ---------------------------------------------
    // EXPLANATION BOX
    // ---------------------------------------------

    const explanationBox =
        document.createElement("section");

    explanationBox.className =
        "explanationCard";


    explanationBox.style.display =
        "none";


    // ---------------------------------------------
    // ENGLISH
    // ---------------------------------------------

    const englishSection =
        document.createElement("div");

    englishSection.className =
        "explanationSection";


    const englishTitle =
        document.createElement("h3");

    englishTitle.textContent =
        "📖 English Explanation";


    const englishExplanation =
        document.createElement("p");

    englishExplanation.textContent =
        "";


    englishSection.appendChild(
        englishTitle
    );

    englishSection.appendChild(
        englishExplanation
    );


    // ---------------------------------------------
    // DIVIDER
    // ---------------------------------------------

    const divider =
        document.createElement("div");

    divider.className =
        "explanationDivider";


    // ---------------------------------------------
    // AMHARIC
    // ---------------------------------------------

    const amharicSection =
        document.createElement("div");

    amharicSection.className =
        "explanationSection";


    const amharicTitle =
        document.createElement("h3");

    amharicTitle.textContent =
        "🇪🇹 የአማርኛ ማብራሪያ";


    const amharicExplanation =
        document.createElement("p");

    amharicExplanation.textContent =
        "";


    amharicSection.appendChild(
        amharicTitle
    );

    amharicSection.appendChild(
        amharicExplanation
    );


    // ---------------------------------------------
    // ADD EXPLANATION PARTS
    // ---------------------------------------------

    explanationBox.appendChild(
        englishSection
    );

    explanationBox.appendChild(
        divider
    );

    explanationBox.appendChild(
        amharicSection
    );


    // ---------------------------------------------
    // ADD EVERYTHING TO CARD
    // ---------------------------------------------

    questionCard.appendChild(
        questionLabel
    );

    questionCard.appendChild(
        questionText
    );

    questionCard.appendChild(
        options
    );

    questionCard.appendChild(
        explanationBox
    );


    // ---------------------------------------------
    // ADD CARD TO PAGE
    // ---------------------------------------------

    questionsPage.appendChild(
        questionCard
    );

}


// =====================================================
// CHECK ANSWER
// =====================================================

function checkAnswer(
    q,
    selectedIndex,
    options,
    explanationBox,
    englishExplanation,
    amharicExplanation
) {

    const buttons =
        options.querySelectorAll(
            ".optionBtn"
        );


    const correctAnswer =
        Number(q.answer);


    // ---------------------------------------------
    // DISABLE OPTIONS
    // ---------------------------------------------

    buttons.forEach(
        (button, index) => {

            button.disabled =
                true;


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
    // EXPLANATIONS
    // ---------------------------------------------

    englishExplanation.textContent =
        getEnglishExplanation(q);


    amharicExplanation.textContent =
        getAmharicExplanation(q);


    // ---------------------------------------------
    // SHOW EXPLANATION
    // ---------------------------------------------

    explanationBox.style.display =
        "block";

}


// =====================================================
// UPDATE PROGRESS
// =====================================================

function updateProgress() {

    if (
        !progressBar ||
        questions.length === 0
    ) {
        return;
    }


    const endIndex =
        Math.min(
            (
                currentPage + 1
            ) * QUESTIONS_PER_PAGE,
            questions.length
        );


    const progress =
        (
            endIndex /
            questions.length
        ) * 100;


    progressBar.style.width =
        `${progress}%`;

}


// =====================================================
// UPDATE NAVIGATION
// =====================================================

function updateNavigation() {

    if (!nextBtn || !previousQuestionBtn) {
        return;
    }


    // ---------------------------------------------
    // PREVIOUS
    // ---------------------------------------------

    previousQuestionBtn.disabled =
        currentPage === 0;


    // ---------------------------------------------
    // TOTAL PAGES
    // ---------------------------------------------

    const totalPages =
        Math.ceil(
            questions.length /
            QUESTIONS_PER_PAGE
        );


    // ---------------------------------------------
    // LAST PAGE
    // ---------------------------------------------

    if (
        currentPage ===
        totalPages - 1
    ) {

        nextBtn.innerHTML = `
            <span>Finish Quiz</span>
            <span class="navArrow">✓</span>
        `;

    } else {

        nextBtn.innerHTML = `
            <span>Next</span>
            <span class="navArrow">→</span>
        `;

    }

}


// =====================================================
// NEXT PAGE
// =====================================================

if (nextBtn) {

    nextBtn.addEventListener(
        "click",
        () => {

            const totalPages =
                Math.ceil(
                    questions.length /
                    QUESTIONS_PER_PAGE
                );


            if (
                currentPage <
                totalPages - 1
            ) {

                currentPage++;

                loadPage();

            } else {

                finishQuiz();

            }

        }
    );

}


// =====================================================
// PREVIOUS PAGE
// =====================================================

if (previousQuestionBtn) {

    previousQuestionBtn.addEventListener(
        "click",
        () => {

            if (
                currentPage > 0
            ) {

                currentPage--;

                loadPage();

            }

        }
    );

}


// =====================================================
// FINISH QUIZ
// =====================================================

function finishQuiz() {

    if (questionNumber) {

        questionNumber.textContent =
            `Questions ${questions.length} / ${questions.length}`;

    }


    if (progressBar) {

        progressBar.style.width =
            "100%";

    }


    if (questionsPage) {

        questionsPage.innerHTML =
            "";

    }


    if (previousQuestionBtn) {

        previousQuestionBtn.style.display =
            "none";

    }


    if (nextBtn) {

        nextBtn.disabled =
            true;


        nextBtn.innerHTML = `
            <span>Completed</span>
            <span class="navArrow">✓</span>
        `;

    }


    if (completionMessage) {

        completionMessage.hidden =
            false;


        completionMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

}


// =====================================================
// TOP BACK BUTTON
// =====================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

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

}


// =====================================================
// HOME BUTTON
// =====================================================

if (homeBtn) {

    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

}
