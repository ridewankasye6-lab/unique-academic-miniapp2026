// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + MOTIVATIONAL ANSWER FEEDBACK
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


    const completionMessage =
        document.getElementById(
            "completionMessage"
        );


    const reviewQuizBtn =
        document.getElementById(
            "reviewQuizBtn"
        );


    const questionsPage =
        document.getElementById(
            "questionsPage"
        );


    // =================================================
    // CHECK REQUIRED HTML
    // =================================================

    if (
        !subjectName ||
        !chapterName ||
        !headerTitle ||
        !headerChapter ||
        !nextBtn ||
        !previousQuestionBtn ||
        !backBtn ||
        !homeBtn ||
        !completionMessage ||
        !reviewQuizBtn ||
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
    // ANSWER STATE
    //
    // null  = not answered
    // number = selected option index
    // =================================================

    let userAnswers = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ANSWERS
    // =================================================

    let wrongAnswers = 0;


    // =================================================
    // QUIZ FINISHED
    // =================================================

    let quizFinished = false;


    // =================================================
    // MOTIVATIONAL MESSAGES
    // =================================================

    const correctMessages = [

        "🎉 Amazing work! You are setting the bar 🔝",

        "🚀 You are unstoppable! Great job! 👏",

        "🌟 You are doing great! Well done! ✨",

        "🏆 Excellent job! You got it right! 👍",

        "🙌 Well done! That’s the correct answer! 🎯",

        "🔥 Great going, you answered correctly! 💯",

        "⚡ Awesome work! You nailed it! 🔨",

        "⭐ You are becoming Unique! 💎",

        "🌈 You are doing fantastic! 💪",

        "🎊 Great! You did it right! ✅"

    ];


    const incorrectMessages = [

        "🌱 You are on the right path! Just a little more effort! 💪",

        "🔍 This response is not right. Please review and try again! 🔄",

        "🧩 Mistakes are part of learning! Keep at it and you will succeed! 🌟",

        "🎈 Keep your chin up! Every mistake is a step toward mastery! 🧗‍♂️",

        "📖 While this answer is incorrect, review your notes! ✍️",

        "💡 Each attempt strengthens your understanding! 🧠",

        "🤝 Not the right answer, keep learning and trying! 🎯",

        "🧐 You are close! Take another look and keep learning! 🔍"

    ];


    // =================================================
    // ADD FEEDBACK ANIMATION CSS
    //
    // Added safely through JavaScript so you do not
    // have to replace your existing quiz.css.
    // =================================================

    function addFeedbackStyles() {

        if (
            document.getElementById(
                "uniqueAcademicFeedbackStyles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "uniqueAcademicFeedbackStyles";


        style.textContent = `

            /* =========================================
               ANSWER FEEDBACK
            ========================================= */

            .unique-answer-feedback {

                width: 100%;

                box-sizing: border-box;

                margin: 18px 0 16px;

                padding: 15px 18px;

                border-radius: 16px;

                font-size: 17px;

                font-weight: 700;

                line-height: 1.5;

                display: flex;

                align-items: center;

                justify-content: center;

                text-align: center;

                transform-origin: center;

                animation:
                    uniqueFeedbackPop
                    0.55s
                    cubic-bezier(
                        0.175,
                        0.885,
                        0.32,
                        1.275
                    )
                    both;

            }


            /* =========================================
               CORRECT FEEDBACK
            ========================================= */

            .unique-answer-feedback.correct-feedback {

                background:
                    linear-gradient(
                        135deg,
                        #edf9ef,
                        #f7fff8
                    );

                color:
                    #258a45;

                border:
                    1px solid
                    rgba(
                        40,
                        180,
                        80,
                        0.25
                    );

                box-shadow:
                    0 6px 18px
                    rgba(
                        40,
                        180,
                        80,
                        0.12
                    );

            }


            /* =========================================
               INCORRECT FEEDBACK
            ========================================= */

            .unique-answer-feedback.incorrect-feedback {

                background:
                    linear-gradient(
                        135deg,
                        #fff4f4,
                        #fffafa
                    );

                color:
                    #d93c3c;

                border:
                    1px solid
                    rgba(
                        220,
                        60,
                        60,
                        0.22
                    );

                box-shadow:
                    0 6px 18px
                    rgba(
                        220,
                        60,
                        60,
                        0.10
                    );

            }


            /* =========================================
               FEEDBACK ICON / TEXT
            ========================================= */

            .unique-feedback-text {

                display: block;

                width: 100%;

            }


            /* =========================================
               MAIN POP ANIMATION
            ========================================= */

            @keyframes uniqueFeedbackPop {

                0% {

                    opacity: 0;

                    transform:
                        translateY(12px)
                        scale(0.92);

                }

                55% {

                    opacity: 1;

                    transform:
                        translateY(-3px)
                        scale(1.02);

                }

                100% {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            /* =========================================
               SMALL MOBILE DEVICES
            ========================================= */

            @media (max-width: 480px) {

                .unique-answer-feedback {

                    font-size: 15px;

                    padding:
                        13px
                        14px;

                    border-radius:
                        14px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    addFeedbackStyles();


    // =================================================
    // GET RANDOM MESSAGE
    // =================================================

    function getRandomMessage(
        messages
    ) {

        if (
            !Array.isArray(messages) ||
            messages.length === 0
        ) {

            return "";

        }


        const randomIndex =
            Math.floor(
                Math.random() *
                messages.length
            );


        return messages[randomIndex];

    }


    // =================================================
    // CREATE ANSWER FEEDBACK
    // =================================================

    function createAnswerFeedback(
        isCorrect,
        message
    ) {

        const feedback =
            document.createElement(
                "div"
            );


        feedback.className =
            "unique-answer-feedback";


        if (
            isCorrect
        ) {

            feedback.classList.add(
                "correct-feedback"
            );

        }

        else {

            feedback.classList.add(
                "incorrect-feedback"
            );

        }


        const feedbackText =
            document.createElement(
                "span"
            );


        feedbackText.className =
            "unique-feedback-text";


        feedbackText.textContent =
            message;


        feedback.appendChild(
            feedbackText
        );


        return feedback;

    }


    // =================================================
    // GET STORED FEEDBACK MESSAGE
    // =================================================

    function getFeedbackMessage(
        questionIndex
    ) {

        const answer =
            userAnswers[questionIndex];


        if (
            answer === null ||
            typeof answer === "undefined"
        ) {

            return null;

        }


        const q =
            questions[questionIndex];


        const correctAnswer =
            getCorrectAnswer(
                q
            );


        const isCorrect =
            answer ===
            correctAnswer;


        /*
         * We do not save the exact random message
         * inside userAnswers.
         *
         * A fresh motivational message is therefore
         * selected when an answered question is shown
         * again.
         */

        return {

            correct:
                isCorrect,

            message:
                getRandomMessage(
                    isCorrect
                        ? correctMessages
                        : incorrectMessages
                )

        };

    }


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
    // GET PROGRESS STORAGE KEY
    // =================================================

    function getProgressStorageKey() {

        const normalizedSubject =
            normalizeSubjectKey(
                subject
            );


        const normalizedChapter =
            String(
                chapter || ""
            ).trim();


        return `uniqueAcademicQuizProgress_${normalizedSubject}_${normalizedChapter}`;

    }


    // =================================================
    // SAVE CHAPTER PROGRESS
    // =================================================

    function saveChapterProgress() {

        const totalQuestions =
            questions.length;


        const answeredQuestions =
            userAnswers.filter(
                answer =>
                    answer !== null
            ).length;


        /*
         * Progress percentage is based on:
         *
         * CORRECT ANSWERS / TOTAL QUESTIONS
         *
         * Example:
         *
         * 1 correct out of 50 = 2%
         * 7 correct out of 10 = 70%
         */

        const percentage =
            totalQuestions > 0
                ? Math.round(
                    (
                        score /
                        totalQuestions
                    ) * 100
                )
                : 0;


        const completed =
            totalQuestions > 0 &&
            answeredQuestions ===
            totalQuestions;


        const progressData = {

            subject:
                subject,

            chapter:
                chapter,

            correct:
                score,

            wrong:
                wrongAnswers,

            total:
                totalQuestions,

            answered:
                answeredQuestions,

            percentage:
                percentage,

            completed:
                completed,

            updatedAt:
                Date.now()

        };


        try {

            localStorage.setItem(

                getProgressStorageKey(),

                JSON.stringify(
                    progressData
                )

            );


            /*
             * Tell chapter-page progress
             * system that progress changed.
             */

            window.dispatchEvent(
                new CustomEvent(
                    "uniqueAcademicQuizProgressUpdated",
                    {
                        detail:
                            progressData
                    }
                )
            );

        }

        catch (error) {

            console.error(
                "Unable to save quiz progress:",
                error
            );

        }

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
            typeof quizData !==
            "undefined" &&
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
            typeof quizData ===
            "undefined"
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


        previousQuestionBtn.style.display =
            "none";


        nextBtn.style.display =
            "none";


        completionMessage.hidden =
            true;


        return;

    }


    // =================================================
    // PREPARE ANSWER ARRAY
    // =================================================

    userAnswers =
        new Array(
            questions.length
        ).fill(
            null
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
    // GET QUESTION OPTIONS
    // =================================================

    function getQuestionOptions(
        q
    ) {

        if (
            q &&
            Array.isArray(
                q.options
            )
        ) {

            return q.options;

        }


        if (
            q &&
            Array.isArray(
                q.choices
            )
        ) {

            return q.choices;

        }


        return [];

    }


    // =================================================
    // GET CORRECT ANSWER
    // =================================================

    function getCorrectAnswer(
        q
    ) {

        /*
         * Existing quiz data uses:
         *
         * answer: 0
         * answer: 1
         * answer: 2
         * answer: 3
         */

        const answer =
            Number.parseInt(
                q &&
                q.answer,
                10
            );


        if (
            Number.isInteger(
                answer
            )
        ) {

            return answer;

        }


        return -1;

    }


    // =================================================
    // LOAD PAGE
    // =================================================

    function loadPage() {

        /*
         * Never load another page after
         * the quiz has been completed.
         */

        if (
            quizFinished
        ) {

            return;

        }


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


        updateNavigation();


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
            getQuestionOptions(
                q
            );


        // =============================================
        // MOTIVATIONAL FEEDBACK
        // =============================================

        let feedbackBox =
            null;


        /*
         * If this question was already answered,
         * recreate its motivational message.
         */

        const storedFeedback =
            getFeedbackMessage(
                index
            );


        if (
            storedFeedback
        ) {

            feedbackBox =
                createAnswerFeedback(
                    storedFeedback.correct,
                    storedFeedback.message
                );

        }


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


                /*
                 * Restore previously selected answer
                 * while moving between pages.
                 */

                if (
                    userAnswers[index] !==
                    null
                ) {

                    button.disabled =
                        true;


                    const correctAnswer =
                        getCorrectAnswer(
                            q
                        );


                    /*
                     * Show correct answer.
                     */

                    if (
                        optionIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }


                    /*
                     * Show selected wrong answer.
                     */

                    if (
                        optionIndex ===
                        userAnswers[index] &&
                        optionIndex !==
                        correctAnswer
                    ) {

                        button.classList.add(
                            "wrong"
                        );

                    }


                    /*
                     * Show explanation.
                     */

                    explanationBox.style.display =
                        "block";


                    englishExplanation.textContent =
                        getEnglishExplanation(
                            q
                        );


                    amharicExplanation.textContent =
                        getAmharicExplanation(
                            q
                        );

                }


                // =========================================
                // OPTION CLICK
                // =========================================

                button.addEventListener(
                    "click",
                    () => {

                        /*
                         * Prevent answering the same
                         * question more than once.
                         */

                        if (
                            userAnswers[index] !==
                            null
                        ) {

                            return;

                        }


                        checkAnswer(
                            q,
                            optionIndex,
                            index,
                            options,
                            explanationBox,
                            englishExplanation,
                            amharicExplanation,
                            questionCard
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


        /*
         * Feedback goes directly after the options
         * and before the explanation.
         */

        if (
            feedbackBox
        ) {

            questionCard.appendChild(
                feedbackBox
            );

        }


        questionCard.appendChild(
            explanationBox
        );


        questionsPage.appendChild(
            questionCard
        );

    }


    // =================================================
    // CHECK ANSWER
    // =================================================

    function checkAnswer(
        q,
        selectedIndex,
        questionIndex,
        options,
        explanationBox,
        englishExplanation,
        amharicExplanation,
        questionCard
    ) {

        /*
         * Safety check.
         */

        if (
            userAnswers[questionIndex] !==
            null
        ) {

            return;

        }


        /*
         * Save selected answer.
         */

        userAnswers[questionIndex] =
            selectedIndex;


        const correctAnswer =
            getCorrectAnswer(
                q
            );


        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        // =============================================
        // DETERMINE RESULT
        // =============================================

        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =============================================
        // COUNT ANSWER
        // =============================================

        if (
            isCorrect
        ) {

            score++;

        }

        else {

            wrongAnswers++;

        }


        // =============================================
        // SAVE PROGRESS IMMEDIATELY
        // =============================================

        saveChapterProgress();


        // =============================================
        // SHOW ANSWER COLORS
        // =============================================

        buttons.forEach(
            (
                button,
                index
            ) => {

                button.disabled =
                    true;


                /*
                 * Always show the correct answer.
                 */

                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                /*
                 * Show selected wrong answer.
                 */

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
        // CREATE MOTIVATIONAL MESSAGE
        // =============================================

        const feedbackMessage =
            getRandomMessage(
                isCorrect
                    ? correctMessages
                    : incorrectMessages
            );


        const feedbackBox =
            createAnswerFeedback(
                isCorrect,
                feedbackMessage
            );


        /*
         * Put motivational feedback between
         * options and explanation.
         */

        const existingFeedback =
            questionCard.querySelector(
                ".unique-answer-feedback"
            );


        if (
            existingFeedback
        ) {

            existingFeedback.remove();

        }


        questionCard.insertBefore(
            feedbackBox,
            explanationBox
        );


        // =============================================
        // SHOW EXPLANATIONS
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
        // SMALL ANIMATION SCROLL
        // =============================================

        setTimeout(
            () => {

                try {

                    feedbackBox.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "nearest"

                    });

                }

                catch (error) {

                    console.warn(
                        "Feedback scroll unavailable:",
                        error
                    );

                }

            },
            120
        );

    }


    // =================================================
    // UPDATE NAVIGATION
    // =================================================

    function updateNavigation() {

        /*
         * Previous button.
         */

        previousQuestionBtn.disabled =
            currentPage === 0;


        /*
         * Total pages.
         */

        const totalPages =
            Math.ceil(
                questions.length /
                QUESTIONS_PER_PAGE
            );


        /*
         * Last page.
         */

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
    // FINISH QUIZ
    // =================================================

    function finishQuiz() {

        /*
         * Prevent double finishing.
         */

        if (
            quizFinished
        ) {

            return;

        }


        quizFinished =
            true;


        /*
         * Hide questions.
         */

        questionsPage.innerHTML =
            "";


        /*
         * Hide navigation.
         */

        previousQuestionBtn.style.display =
            "none";


        nextBtn.style.display =
            "none";


        /*
         * Show completion.
         */

        completionMessage.hidden =
            false;


        /*
         * Calculate percentage.
         */

        const percentage =
            questions.length > 0
                ? Math.round(
                    (
                        score /
                        questions.length
                    ) * 100
                )
                : 0;


        /*
         * Save final progress.
         */

        saveChapterProgress();


        /*
         * Check if score display already exists.
         */

        let scoreDisplay =
            completionMessage.querySelector(
                ".quizScoreDisplay"
            );


        if (
            !scoreDisplay
        ) {

            scoreDisplay =
                document.createElement(
                    "div"
                );


            scoreDisplay.className =
                "quizScoreDisplay";


            completionMessage
                .insertBefore(
                    scoreDisplay,
                    reviewQuizBtn
                );

        }


        scoreDisplay.innerHTML = `
            <div class="quizScoreNumber">
                ${score} / ${questions.length}
            </div>

            <div class="quizScorePercentage">
                ${percentage}% Score
            </div>
        `;


        /*
         * Make sure Review/Restart button
         * is available.
         */

        reviewQuizBtn.style.display =
            "inline-flex";


        reviewQuizBtn.disabled =
            false;


        /*
         * Scroll completion message
         * into view.
         */

        completionMessage.scrollIntoView({

            behavior:
                "smooth",

            block:
                "center"

        });


        console.log(
            "Quiz completed."
        );


        console.log(
            "Score:",
            score,
            "/",
            questions.length
        );


        console.log(
            "Wrong:",
            wrongAnswers
        );


        console.log(
            "Percentage:",
            percentage + "%"
        );

    }


    // =================================================
    // REVIEW / RESTART QUIZ
    // =================================================

    reviewQuizBtn.addEventListener(
        "click",
        () => {

            /*
             * Reset saved chapter progress.
             */

            try {

                localStorage.removeItem(
                    getProgressStorageKey()
                );

            }

            catch (error) {

                console.error(
                    "Unable to reset chapter progress:",
                    error
                );

            }


            // =========================================
            // RESET PAGE
            // =========================================

            currentPage =
                0;


            // =========================================
            // RESET SCORE
            // =========================================

            score =
                0;


            // =========================================
            // RESET WRONG ANSWERS
            // =========================================

            wrongAnswers =
                0;


            // =========================================
            // RESET ALL ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            /*
             * Save completely reset state.
             *
             * Chapter card becomes:
             *
             * 0%
             * BLUE
             * 0 correct
             * 0 wrong
             */

            saveChapterProgress();


            // =========================================
            // MARK QUIZ ACTIVE
            // =========================================

            quizFinished =
                false;


            // =========================================
            // HIDE COMPLETION MESSAGE
            // =========================================

            completionMessage.hidden =
                true;


            // =========================================
            // SHOW NAVIGATION
            // =========================================

            previousQuestionBtn.style.display =
                "inline-flex";


            nextBtn.style.display =
                "inline-flex";


            // =========================================
            // ENABLE BUTTONS
            // =========================================

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                false;


            // =========================================
            // RESTORE NEXT BUTTON
            // =========================================

            nextBtn.innerHTML = `
                <span>Next</span>
                <span class="navArrow">→</span>
            `;


            // =========================================
            // LOAD QUESTION 1–5
            // =========================================

            loadPage();


            // =========================================
            // SCROLL TO TOP
            // =========================================

            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });


            console.log(
                "Quiz restarted from Question 1."
            );

        }
    );


    // =================================================
    // BACK
    // =================================================

    backBtn.addEventListener(
        "click",
        () => {

            /*
             * Prefer browser history when
             * the student came from another page.
             */

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
    // START QUIZ
    // =================================================

    loadPage();


})();
