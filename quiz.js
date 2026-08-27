// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// PROFESSIONAL SCORE + PROGRESS SYSTEM
// 5 QUESTIONS PER PAGE
// =====================================================


// =====================================================
// WAIT UNTIL PAGE IS READY
// =====================================================

(function () {

    "use strict";


    // =================================================
    // READ URL PARAMETERS
    // =================================================

    const params =
        new URLSearchParams(
            window.location.search
        );


    const subject =
        (
            params.get("subject") ||
            ""
        ).trim();


    const chapter =
        (
            params.get("chapter") ||
            ""
        ).trim();


    console.log(
        "Quiz subject:",
        subject
    );


    console.log(
        "Quiz chapter:",
        chapter
    );


    // =================================================
    // HTML ELEMENTS
    // =================================================

    const subjectName =
        document.getElementById(
            "subjectName"
        );


    const chapterName =
        document.getElementById(
            "chapterName"
        );


    const headerTitle =
        document.getElementById(
            "headerTitle"
        );


    const headerChapter =
        document.getElementById(
            "headerChapter"
        );


    const questionNumber =
        document.getElementById(
            "questionNumber"
        );


    const nextBtn =
        document.getElementById(
            "nextBtn"
        );


    const previousQuestionBtn =
        document.getElementById(
            "previousQuestionBtn"
        );


    const backBtn =
        document.getElementById(
            "backBtn"
        );


    const homeBtn =
        document.getElementById(
            "homeBtn"
        );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    const completionMessage =
        document.getElementById(
            "completionMessage"
        );


    const questionsPage =
        document.getElementById(
            "questionsPage"
        );


    // =================================================
    // CHECK HTML
    // =================================================

    if (
        !subjectName ||
        !chapterName ||
        !headerTitle ||
        !headerChapter ||
        !questionNumber ||
        !nextBtn ||
        !previousQuestionBtn ||
        !backBtn ||
        !homeBtn ||
        !progressBar ||
        !completionMessage ||
        !questionsPage
    ) {

        console.error(
            "Quiz HTML elements are missing."
        );

        return;

    }


    // =================================================
    // QUESTIONS PER PAGE
    // =================================================

    const QUESTIONS_PER_PAGE = 5;


    // =================================================
    // CURRENT PAGE
    // =================================================

    let currentPage = 0;


    // =================================================
    // SCORE / ANSWER TRACKING
    // =================================================

    /*
     * Stores the selected answer for every question.
     *
     * Example:
     *
     * answers[0] = 2
     * answers[1] = 0
     * answers[2] = 1
     *
     * This prevents a student from receiving
     * multiple points for answering the same
     * question again.
     */

    const userAnswers = [];


    /*
     * Stores whether each question was answered
     * correctly.
     */

    const questionResults = [];


    let correctAnswers = 0;


    let answeredQuestions = 0;


    let quizFinished = false;


    // =================================================
    // FORMAT SUBJECT NAME
    // =================================================

    function formatSubjectName(
        value
    ) {

        if (
            !value
        ) {

            return "Unknown Subject";

        }


        return value
            .replace(
                /[-_]+/g,
                " "
            )
            .replace(
                /\b\w/g,
                letter =>
                    letter.toUpperCase()
            );

    }


    // =================================================
    // FORMAT CHAPTER
    // =================================================

    function formatChapter(
        value
    ) {

        if (
            !value
        ) {

            return "Unknown Chapter";

        }


        return `Chapter ${value}`;

    }


    // =================================================
    // DISPLAY SUBJECT + CHAPTER
    // =================================================

    const formattedSubject =
        formatSubjectName(
            subject
        );


    const formattedChapter =
        formatChapter(
            chapter
        );


    subjectName.textContent =
        formattedSubject;


    chapterName.textContent =
        formattedChapter;


    headerTitle.textContent =
        formattedSubject;


    headerChapter.textContent =
        `${formattedChapter} • Quiz`;


    // =================================================
    // NORMALIZE SUBJECT KEY
    // =================================================

    function normalizeSubjectKey(
        value
    ) {

        return String(
            value || ""
        )
            .toLowerCase()
            .trim()
            .replace(
                /_/g,
                "-"
            )
            .replace(
                /\s+/g,
                "-"
            );

    }


    // =================================================
    // FIND SUBJECT DATA
    // =================================================

    function findSubjectData() {

        const exactKey =
            normalizeSubjectKey(
                subject
            );


        if (
            typeof quizData !== "undefined" &&
            quizData
        ) {

            /*
             * Exact key.
             */

            if (
                quizData[subject]
            ) {

                return quizData[subject];

            }


            /*
             * Normalized key.
             */

            if (
                quizData[exactKey]
            ) {

                return quizData[exactKey];

            }


            /*
             * Search all keys safely.
             */

            const keys =
                Object.keys(
                    quizData
                );


            for (
                const key of keys
            ) {

                if (
                    normalizeSubjectKey(
                        key
                    ) === exactKey
                ) {

                    return quizData[key];

                }

            }

        }


        return null;

    }


    // =================================================
    // FIND QUESTIONS
    // =================================================

    function findQuestions() {

        if (
            typeof quizData === "undefined"
        ) {

            console.error(
                "quizData is not defined."
            );

            return [];

        }


        if (
            !quizData
        ) {

            console.error(
                "quizData is empty."
            );

            return [];

        }


        const subjectData =
            findSubjectData();


        if (
            !subjectData
        ) {

            console.error(
                "Subject not found in quizData:",
                subject
            );


            console.log(
                "Available subjects:",
                Object.keys(
                    quizData
                )
            );


            return [];

        }


        /*
         * Try exact chapter key.
         */

        if (
            subjectData[chapter]
        ) {

            return Array.isArray(
                subjectData[chapter]
            )
                ? subjectData[chapter]
                : [];

        }


        /*
         * Try numeric chapter.
         */

        const numericChapter =
            Number.parseInt(
                chapter,
                10
            );


        if (
            Number.isInteger(
                numericChapter
            ) &&
            subjectData[numericChapter]
        ) {

            return Array.isArray(
                subjectData[numericChapter]
            )
                ? subjectData[numericChapter]
                : [];

        }


        console.error(
            "Chapter not found:",
            chapter
        );


        console.log(
            "Available chapters:",
            Object.keys(
                subjectData
            )
        );


        return [];

    }


    // =================================================
    // LOAD QUESTIONS
    // =================================================

    const questions =
        findQuestions();


    console.log(
        "Questions found:",
        questions.length
    );


    // =================================================
    // NO QUESTIONS FOUND
    // =================================================

    if (
        questions.length === 0
    ) {

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


        return;

    }


    // =================================================
    // PROFESSIONAL SCORE CARD
    // =================================================

    /*
     * We create the score card using JavaScript.
     *
     * Therefore you do NOT need to change quiz.html.
     */

    const scoreCard =
        document.createElement(
            "section"
        );


    scoreCard.className =
        "quizScoreCard";


    scoreCard.setAttribute(
        "aria-label",
        "Quiz score"
    );


    scoreCard.innerHTML = `

        <div class="scoreHeader">

            <div class="scoreTitle">

                <span class="scoreIcon">
                    🎯
                </span>

                <span>
                    Your Score
                </span>

            </div>

            <strong
                id="liveScore"
                class="liveScore"
            >
                0 / ${questions.length}
            </strong>

        </div>


        <div class="scoreDetails">

            <div class="scoreDetail">

                <span>
                    Answered
                </span>

                <strong id="answeredCount">
                    0 / ${questions.length}
                </strong>

            </div>


            <div class="scoreDetail">

                <span>
                    Correct
                </span>

                <strong id="correctCount">
                    0
                </strong>

            </div>


            <div class="scoreDetail">

                <span>
                    Accuracy
                </span>

                <strong id="accuracyPercent">
                    0%
                </strong>

            </div>

        </div>


        <div class="scoreProgressTrack">

            <div
                id="scoreProgressBar"
                class="scoreProgressBar"
            ></div>

        </div>

    `;


    /*
     * Put score card directly after the existing
     * progress card.
     */

    const progressCard =
        document.querySelector(
            ".progressCard"
        );


    if (
        progressCard &&
        progressCard.parentNode
    ) {

        progressCard.parentNode.insertBefore(
            scoreCard,
            progressCard.nextSibling
        );

    }


    // =================================================
    // SCORE ELEMENTS
    // =================================================

    const liveScore =
        document.getElementById(
            "liveScore"
        );


    const answeredCount =
        document.getElementById(
            "answeredCount"
        );


    const correctCount =
        document.getElementById(
            "correctCount"
        );


    const accuracyPercent =
        document.getElementById(
            "accuracyPercent"
        );


    const scoreProgressBar =
        document.getElementById(
            "scoreProgressBar"
        );


    // =================================================
    // ADD PROFESSIONAL SCORE STYLES
    // =================================================

    /*
     * Styles are added here so you do NOT have to
     * modify quiz.css.
     */

    const scoreStyle =
        document.createElement(
            "style"
        );


    scoreStyle.textContent = `

        .quizScoreCard {

            margin: 14px 0;

            padding: 18px;

            border-radius: 18px;

            background: var(
                --card-bg,
                #ffffff
            );

            border: 1px solid var(
                --border-color,
                #e5e7eb
            );

            box-shadow:
                0 6px 20px
                rgba(0, 0, 0, 0.06);

        }


        .scoreHeader {

            display: flex;

            align-items: center;

            justify-content: space-between;

            gap: 12px;

            margin-bottom: 16px;

        }


        .scoreTitle {

            display: flex;

            align-items: center;

            gap: 8px;

            font-weight: 800;

            font-size: 16px;

        }


        .scoreIcon {

            font-size: 21px;

        }


        .liveScore {

            font-size: 18px;

            font-weight: 900;

        }


        .scoreDetails {

            display: grid;

            grid-template-columns:
                repeat(3, 1fr);

            gap: 10px;

            margin-bottom: 15px;

        }


        .scoreDetail {

            text-align: center;

            padding: 10px 6px;

            border-radius: 12px;

            background:
                rgba(142, 68, 173, 0.07);

        }


        .scoreDetail span {

            display: block;

            font-size: 11px;

            opacity: 0.72;

            margin-bottom: 4px;

        }


        .scoreDetail strong {

            display: block;

            font-size: 15px;

            font-weight: 800;

        }


        .scoreProgressTrack {

            width: 100%;

            height: 8px;

            overflow: hidden;

            border-radius: 999px;

            background:
                rgba(128, 128, 128, 0.18);

        }


        .scoreProgressBar {

            width: 0%;

            height: 100%;

            border-radius: 999px;

            background:
                linear-gradient(
                    90deg,
                    #8e44ad,
                    #6c5ce7
                );

            transition:
                width 0.35s ease;

        }


        @media (max-width: 600px) {

            .quizScoreCard {

                padding: 15px;

                border-radius: 15px;

            }


            .scoreHeader {

                margin-bottom: 13px;

            }


            .liveScore {

                font-size: 16px;

            }


            .scoreDetails {

                gap: 7px;

            }


            .scoreDetail {

                padding: 9px 4px;

            }


            .scoreDetail span {

                font-size: 10px;

            }


            .scoreDetail strong {

                font-size: 14px;

            }

        }


        body.dark-mode .quizScoreCard {

            background:
                #1f1f2b;

            border-color:
                rgba(255,255,255,0.10);

            box-shadow:
                0 6px 20px
                rgba(0, 0, 0, 0.25);

        }


        body.dark-mode .scoreDetail {

            background:
                rgba(255,255,255,0.06);

        }

    `;


    document.head.appendChild(
        scoreStyle
    );


    // =================================================
    // GET ENGLISH EXPLANATION
    // =================================================

    function getEnglishExplanation(
        q
    ) {

        if (
            q &&
            q.englishExplanation
        ) {

            return q.englishExplanation;

        }


        if (
            q &&
            q.explanation &&
            q.explanation.english
        ) {

            return q.explanation.english;

        }


        return "";

    }


    // =================================================
    // GET AMHARIC EXPLANATION
    // =================================================

    function getAmharicExplanation(
        q
    ) {

        if (
            q &&
            q.amharicExplanation
        ) {

            return q.amharicExplanation;

        }


        if (
            q &&
            q.explanation &&
            q.explanation.amharic
        ) {

            return q.explanation.amharic;

        }


        return "";

    }


    // =================================================
    // UPDATE SCORE DISPLAY
    // =================================================

    function updateScoreDisplay() {

        const totalQuestions =
            questions.length;


        const percentage =
            totalQuestions > 0
                ? (
                    correctAnswers /
                    totalQuestions
                ) *
                100
                : 0;


        const roundedPercentage =
            Math.round(
                percentage
            );


        if (liveScore) {

            liveScore.textContent =
                `${correctAnswers} / ${totalQuestions}`;

        }


        if (answeredCount) {

            answeredCount.textContent =
                `${answeredQuestions} / ${totalQuestions}`;

        }


        if (correctCount) {

            correctCount.textContent =
                String(
                    correctAnswers
                );

        }


        if (accuracyPercent) {

            /*
             * Accuracy is based on questions
             * actually answered.
             *
             * Example:
             *
             * 4 correct out of 5 answered
             * = 80%
             */

            const accuracy =
                answeredQuestions > 0
                    ? (
                        correctAnswers /
                        answeredQuestions
                    ) *
                    100
                    : 0;


            accuracyPercent.textContent =
                `${Math.round(accuracy)}%`;

        }


        if (scoreProgressBar) {

            /*
             * Overall quiz score progress.
             */

            scoreProgressBar.style.width =
                `${Math.min(
                    roundedPercentage,
                    100
                )}%`;

        }

    }


    // =================================================
    // LOAD PAGE
    // =================================================

    function loadPage() {

        questionsPage.innerHTML =
            "";


        const startIndex =
            currentPage *
            QUESTIONS_PER_PAGE;


        const endIndex =
            Math.min(
                startIndex +
                QUESTIONS_PER_PAGE,
                questions.length
            );


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


        questionNumber.textContent =
            `Questions ${startIndex + 1}-${endIndex} / ${questions.length}`;


        updateNavigation();


        updateProgress();


        updateScoreDisplay();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =================================================
    // CREATE QUESTION CARD
    // =================================================

    function createQuestionCard(
        q,
        index
    ) {

        const questionCard =
            document.createElement(
                "section"
            );


        questionCard.className =
            "questionCard";


        // =============================================
        // QUESTION LABEL
        // =============================================

        const questionLabel =
            document.createElement(
                "div"
            );


        questionLabel.className =
            "questionLabel";


        const questionBadge =
            document.createElement(
                "span"
            );


        questionBadge.className =
            "questionBadge";


        questionBadge.textContent =
            `QUESTION ${index + 1}`;


        questionLabel.appendChild(
            questionBadge
        );


        // =============================================
        // QUESTION TEXT
        // =============================================

        const questionText =
            document.createElement(
                "h2"
            );


        questionText.className =
            "questionText";


        questionText.textContent =
            q &&
            q.question
                ? q.question
                : "";


        // =============================================
        // OPTIONS
        // =============================================

        const options =
            document.createElement(
                "div"
            );


        options.className =
            "options";


        const questionOptions =
            q &&
            Array.isArray(q.options)
                ? q.options
                : (
                    q &&
                    Array.isArray(q.choices)
                        ? q.choices
                        : []
                );


        // =============================================
        // EXPLANATION BOX
        // =============================================

        const explanationBox =
            document.createElement(
                "section"
            );


        explanationBox.className =
            "explanationCard";


        explanationBox.style.display =
            "none";


        // =============================================
        // ENGLISH
        // =============================================

        const englishSection =
            document.createElement(
                "div"
            );


        englishSection.className =
            "explanationSection";


        const englishTitle =
            document.createElement(
                "h3"
            );


        englishTitle.textContent =
            "📖 English Explanation";


        const englishExplanation =
            document.createElement(
                "p"
            );


        englishExplanation.textContent =
            "";


        englishSection.appendChild(
            englishTitle
        );


        englishSection.appendChild(
            englishExplanation
        );


        // =============================================
        // DIVIDER
        // =============================================

        const divider =
            document.createElement(
                "div"
            );


        divider.className =
            "explanationDivider";


        // =============================================
        // AMHARIC
        // =============================================

        const amharicSection =
            document.createElement(
                "div"
            );


        amharicSection.className =
            "explanationSection";


        const amharicTitle =
            document.createElement(
                "h3"
            );


        amharicTitle.textContent =
            "🇪🇹 የአማርኛ ማብራሪያ";


        const amharicExplanation =
            document.createElement(
                "p"
            );


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


        // =============================================
        // CREATE OPTIONS
        // =============================================

        questionOptions.forEach(
            (
                option,
                optionIndex
            ) => {

                const button =
                    document.createElement(
                        "button"
                    );


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
                            index,
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


        // =============================================
        // ADD TO CARD
        // =============================================

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


        questionsPage.appendChild(
            questionCard
        );


        // =============================================
        // RESTORE PREVIOUS ANSWER
        // =============================================

        if (
            userAnswers[index] !==
            undefined
        ) {

            showSavedAnswer(
                q,
                index,
                options,
                explanationBox,
                englishExplanation,
                amharicExplanation
            );

        }

    }


    // =================================================
    // CHECK ANSWER
    // =================================================

    function checkAnswer(
        q,
        questionIndex,
        selectedIndex,
        options,
        explanationBox,
        englishExplanation,
        amharicExplanation
    ) {

        /*
         * Do not allow an answer to be changed
         * after it has already been submitted.
         */

        if (
            userAnswers[questionIndex] !==
            undefined
        ) {

            return;

        }


        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        const correctAnswer =
            Number.parseInt(
                q.answer,
                10
            );


        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =============================================
        // SAVE ANSWER
        // =============================================

        userAnswers[questionIndex] =
            selectedIndex;


        questionResults[questionIndex] =
            isCorrect;


        answeredQuestions++;


        if (
            isCorrect
        ) {

            correctAnswers++;

        }


        // =============================================
        // STYLE OPTIONS
        // =============================================

        buttons.forEach(
            (
                button,
                index
            ) => {

                button.disabled =
                    true;


                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                if (
                    index ===
                    selectedIndex &&
                    index !==
                    correctAnswer
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        // =============================================
        // EXPLANATIONS
        // =============================================

        englishExplanation.textContent =
            getEnglishExplanation(
                q
            );


        amharicExplanation.textContent =
            getAmharicExplanation(
                q
            );


        explanationBox.style.display =
            "block";


        // =============================================
        // UPDATE SCORE
        // =============================================

        updateScoreDisplay();


        console.log(
            `Question ${questionIndex + 1}:`,
            isCorrect
                ? "Correct"
                : "Wrong"
        );


        console.log(
            "Current score:",
            `${correctAnswers}/${questions.length}`
        );

    }


    // =================================================
    // RESTORE SAVED ANSWER
    // =================================================

    function showSavedAnswer(
        q,
        questionIndex,
        options,
        explanationBox,
        englishExplanation,
        amharicExplanation
    ) {

        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        const selectedIndex =
            userAnswers[
                questionIndex
            ];


        const correctAnswer =
            Number.parseInt(
                q.answer,
                10
            );


        buttons.forEach(
            (
                button,
                index
            ) => {

                button.disabled =
                    true;


                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                if (
                    index ===
                    selectedIndex &&
                    index !==
                    correctAnswer
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        englishExplanation.textContent =
            getEnglishExplanation(
                q
            );


        amharicExplanation.textContent =
            getAmharicExplanation(
                q
            );


        explanationBox.style.display =
            "block";

    }


    // =================================================
    // UPDATE PROGRESS
    // =================================================

    function updateProgress() {

        if (
            questions.length === 0
        ) {

            progressBar.style.width =
                "0%";

            return;

        }


        const endIndex =
            Math.min(
                (
                    currentPage + 1
                ) *
                QUESTIONS_PER_PAGE,
                questions.length
            );


        const progress =
            (
                endIndex /
                questions.length
            ) *
            100;


        progressBar.style.width =
            `${progress}%`;

    }


    // =================================================
    // UPDATE NAVIGATION
    // =================================================

    function updateNavigation() {

        previousQuestionBtn.disabled =
            currentPage === 0;


        const totalPages =
            Math.ceil(
                questions.length /
                QUESTIONS_PER_PAGE
            );


        if (
            currentPage ===
            totalPages - 1
        ) {

            nextBtn.innerHTML = `
                <span>Finish Quiz</span>
                <span class="navArrow">✓</span>
            `;

        }

        else {

            nextBtn.innerHTML = `
                <span>Next</span>
                <span class="navArrow">→</span>
            `;

        }

    }


    // =================================================
    // NEXT
    // =================================================

    nextBtn.addEventListener(
        "click",
        () => {

            if (
                quizFinished
            ) {

                return;

            }


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

            else {

                finishQuiz();

            }

        }
    );


    // =================================================
    // PREVIOUS
    // =================================================

    previousQuestionBtn.addEventListener(
        "click",
        () => {

            if (
                quizFinished
            ) {

                return;

            }


            if (
                currentPage > 0
            ) {

                currentPage--;

                loadPage();

            }

        }
    );


    // =================================================
    // GET RESULT MESSAGE
    // =================================================

    function getResultMessage(
        percentage
    ) {

        if (
            percentage >= 90
        ) {

            return {
                title:
                    "Excellent Work!",
                message:
                    "Outstanding performance! You have demonstrated a very strong understanding of this chapter.",
                icon:
                    "🏆"
            };

        }


        if (
            percentage >= 80
        ) {

            return {
                title:
                    "Very Good!",
                message:
                    "Great performance! You have a strong understanding of the material.",
                icon:
                    "🌟"
            };

        }


        if (
            percentage >= 70
        ) {

            return {
                title:
                    "Good Job!",
                message:
                    "Good performance! Review the questions you missed and keep practicing.",
                icon:
                    "👍"
            };

        }


        if (
            percentage >= 60
        ) {

            return {
                title:
                    "Keep Practicing!",
                message:
                    "You are making progress. Review this chapter and try the quiz again.",
                icon:
                    "📚"
            };

        }


        return {
            title:
                "Review & Try Again",
            message:
                "Take some time to review the chapter carefully, then try the quiz again.",
            icon:
                "🔄"
        };

    }


    // =================================================
    // FINISH QUIZ
    // =================================================

    function finishQuiz() {

        if (
            quizFinished
        ) {

            return;

        }


        quizFinished =
            true;


        const totalQuestions =
            questions.length;


        const percentage =
            totalQuestions > 0
                ? (
                    correctAnswers /
                    totalQuestions
                ) *
                100
                : 0;


        const roundedPercentage =
            Math.round(
                percentage
            );


        const result =
            getResultMessage(
                roundedPercentage
            );


        // =============================================
        // FINAL QUESTION STATUS
        // =============================================

        questionNumber.textContent =
            `Questions ${totalQuestions} / ${totalQuestions}`;


        progressBar.style.width =
            "100%";


        // =============================================
        // REMOVE QUESTION CARDS
        // =============================================

        questionsPage.innerHTML =
            "";


        // =============================================
        // HIDE NAVIGATION
        // =============================================

        previousQuestionBtn.style.display =
            "none";


        nextBtn.disabled =
            true;


        nextBtn.innerHTML = `
            <span>Completed</span>
            <span class="navArrow">✓</span>
        `;


        // =============================================
        // UPDATE FINAL SCORE
        // =============================================

        updateScoreDisplay();


        // =============================================
        // CREATE PROFESSIONAL RESULT
        // =============================================

        completionMessage.innerHTML = `

            <div class="completionIcon">
                ${result.icon}
            </div>


            <h2>
                ${result.title}
            </h2>


            <div
                style="
                    margin:18px auto;
                    padding:18px;
                    max-width:320px;
                    border-radius:18px;
                    background:rgba(142,68,173,0.08);
                "
            >

                <div
                    style="
                        font-size:13px;
                        opacity:0.72;
                        margin-bottom:5px;
                    "
                >
                    YOUR FINAL SCORE
                </div>


                <div
                    style="
                        font-size:38px;
                        font-weight:900;
                    "
                >
                    ${correctAnswers} / ${totalQuestions}
                </div>


                <div
                    style="
                        font-size:22px;
                        font-weight:800;
                        margin-top:5px;
                    "
                >
                    ${roundedPercentage}%
                </div>

            </div>


            <p>
                ${result.message}
            </p>


            <p
                style="
                    margin-top:12px;
                    font-size:14px;
                    opacity:0.75;
                "
            >
                You answered
                <strong>
                    ${answeredQuestions}
                </strong>
                of
                <strong>
                    ${totalQuestions}
                </strong>
                questions.
            </p>

        `;


        completionMessage.hidden =
            false;


        // =============================================
        // SCROLL TO RESULT
        // =============================================

        completionMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        console.log(
            "================================="
        );


        console.log(
            "QUIZ COMPLETED"
        );


        console.log(
            "Score:",
            `${correctAnswers}/${totalQuestions}`
        );


        console.log(
            "Percentage:",
            `${roundedPercentage}%`
        );


        console.log(
            "================================="
        );

    }


    // =================================================
    // BACK
    // =================================================

    backBtn.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            }

            else if (
                subject
            ) {

                window.location.href =
                    `chapter.html?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapter)}`;

            }

            else {

                window.location.href =
                    "index.html";

            }

        }
    );


    // =================================================
    // HOME
    // =================================================

    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );


    // =================================================
    // INITIAL SCORE
    // =================================================

    updateScoreDisplay();


    // =================================================
    // START QUIZ
    // =================================================

    loadPage();


})();
