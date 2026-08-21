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
// LOAD QUESTIONS
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

    questionNumber.textContent =
        `Questions ${startIndex + 1}-${endIndex} / ${questions.length}`;


    // ---------------------------------------------
    // NAVIGATION
    // ---------------------------------------------

    updateNavigation();


    // ---------------------------------------------
    // SCROLL TO TOP
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
    // QUESTION CARD
    // ---------------------------------------------

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


    // ---------------------------------------------
    // EXPLANATION
    // ---------------------------------------------

    const explanationBox =
        document.createElement("section");

    explanationBox.className =
        "explanationCard";

    explanationBox.style.display =
        "none";


    // ---------------------------------------------
    // ENGLISH EXPLANATION
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
    // AMHARIC EXPLANATION
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
    // ADD EXPLANATIONS
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
    // CREATE OPTIONS
    // ---------------------------------------------

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
    // ADD EVERYTHING
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
        q.answer;


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
    // SHOW ENGLISH EXPLANATION
    // ---------------------------------------------

    englishExplanation.textContent =
        getEnglishExplanation(q);


    // ---------------------------------------------
    // SHOW AMHARIC EXPLANATION
    // ---------------------------------------------

    amharicExplanation.textContent =
        getAmharicExplanation(q);


    // ---------------------------------------------
    // SHOW EXPLANATION
    // ---------------------------------------------

    explanationBox.style.display =
        "block";

}


// =====================================================
// UPDATE NAVIGATION
// =====================================================

function updateNavigation() {

    // ---------------------------------------------
    // PREVIOUS BUTTON
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
    // NEXT BUTTON
    // ---------------------------------------------

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
