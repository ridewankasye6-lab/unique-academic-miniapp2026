// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
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
// NO QUESTIONS FOUND
// =====================================================

if (questions.length === 0) {

    questionsPage.innerHTML = `
        <section class="questionCard">

            <h2 class="questionText">
                No questions found for this chapter.
            </h2>

        </section>
    `;

    questionNumber.textContent =
        "Question 0 / 0";

    previousQuestionBtn.style.display =
        "none";

    nextBtn.style.display =
        "none";

    progressBar.style.width =
        "0%";

} else {

    loadPage();

}


// =====================================================
// GET ENGLISH EXPLANATION
// =====================================================

function getEnglishExplanation(q) {

    if (q.englishExplanation) {

        return q.englishExplanation;

    }


    if (
        q.explanation &&
        q.explanation.english
    ) {

        return q.explanation.english;

    }


    return "";

}


// =====================================================
// GET AMHARIC EXPLANATION
// =====================================================

function getAmharicExplanation(q) {

    if (q.amharicExplanation) {

        return q.amharicExplanation;

    }


    if (
        q.explanation &&
        q.explanation.amharic
    ) {

        return q.explanation.amharic;

    }


    return "";

}


// =====================================================
// LOAD 5 QUESTIONS
// =====================================================

function loadPage() {

    questionsPage.innerHTML = "";


    const startIndex =
        currentPage * QUESTIONS_PER_PAGE;


    const endIndex =
        Math.min(
            startIndex + QUESTIONS_PER_PAGE,
            questions.length
        );


    // ---------------------------------------------
    // Create each question
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
    // Update question counter
    // ---------------------------------------------

    questionNumber.textContent =
        `Questions ${startIndex + 1}-${endIndex} / ${questions.length}`;


    // ---------------------------------------------
    // Update navigation
    // ---------------------------------------------

    updateNavigation();


    // ---------------------------------------------
    // Update progress
    // ---------------------------------------------

    updateProgress();


    // ---------------------------------------------
    // Scroll to top
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

    // ---------------------------------------------
    // Main question card
    // ---------------------------------------------

    const questionCard =
        document.createElement("section");


    questionCard.className =
        "questionCard";


    // ---------------------------------------------
    // Question label
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
    // Question text
    // ---------------------------------------------

    const questionText =
        document.createElement("h2");


    questionText.className =
        "questionText";


    questionText.textContent =
        q.question || "";


    // ---------------------------------------------
    // Options
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
    // Explanation
    // ---------------------------------------------

    const explanationBox =
        document.createElement("section");


    explanationBox.className =
        "explanationCard";


    explanationBox.style.display =
        "none";


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


    const divider =
        document.createElement("div");


    divider.className =
        "explanationDivider";


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
    // Add everything to card
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
    // Add card to page
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
        q.answer;


    // ---------------------------------------------
    // Disable all options
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
    // Show English explanation
    // ---------------------------------------------

    englishExplanation.textContent =
        getEnglishExplanation(q);


    // ---------------------------------------------
    // Show Amharic explanation
    // ---------------------------------------------

    amharicExplanation.textContent =
        getAmharicExplanation(q);


    // ---------------------------------------------
    // Show explanation box
    // ---------------------------------------------

    explanationBox.style.display =
        "block";

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

    // ---------------------------------------------
    // Previous
    // ---------------------------------------------

    previousQuestionBtn.disabled =
        currentPage === 0;


    // ---------------------------------------------
    // Check if this is the final page
    // ---------------------------------------------

    const totalPages =
        Math.ceil(
            questions.length /
            QUESTIONS_PER_PAGE
        );


    if (
        currentPage ===
        totalPages - 1
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
// NEXT PAGE
// =====================================================

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


// =====================================================
// PREVIOUS PAGE
// =====================================================

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


// =====================================================
// FINISH QUIZ
// =====================================================

function finishQuiz() {

    questionNumber.textContent =
        `Questions ${questions.length} / ${questions.length}`;


    progressBar.style.width =
        "100%";


    questionsPage.innerHTML = "";


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
