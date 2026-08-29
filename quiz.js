// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + RETRY UNTIL CORRECT
// + X FOR WRONG ANSWERS
// + ✓ FOR CORRECT ANSWERS
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
    // null  = question not completed
    // number = correct answer index
    //
    // IMPORTANT:
    // A WRONG answer is NOT stored here.
    // This allows the student to keep trying.
    // =================================================

    let userAnswers = [];


    // =================================================
    // WRONG ATTEMPTS
    //
    // Each question has a Set containing the
    // option indexes that the student answered wrongly.
    // =================================================

    let wrongAttempts = [];


    // =================================================
    // LAST ANSWER FEEDBACK
    //
    // Used to remember the latest feedback when
    // moving between quiz pages.
    // =================================================

    let lastAttemptCorrect = [];

    let feedbackMessages = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ANSWERS / ATTEMPTS
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

        "🌱 Keep trying! You are learning step by step! 💪",

        "❌ Not quite! Try another answer! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Don't give up! Try again and find the correct answer! 🧗‍♂️",

        "📖 Review the choices carefully and try again! ✍️",

        "💡 Every attempt strengthens your understanding! 🧠",

        "🤝 Not the right answer yet. Keep trying! 🎯",

        "🧐 Take another look and choose again! 🔍"

    ];


    // =================================================
    // ADD FEEDBACK + ANSWER ICON CSS
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
               ANSWER BUTTON BASE
            ========================================= */

            .optionBtn {

                position: relative;

            }


            /* =========================================
               WRONG ANSWER
            ========================================= */

            .optionBtn.wrong {

                position: relative;

                background:
                    #fff1f1 !important;

                color:
                    #b83a3a !important;

                border-color:
                    #e34b4b !important;

                box-shadow:
                    0 4px 12px
                    rgba(
                        220,
                        60,
                        60,
                        0.12
                    ) !important;

            }


            /* =========================================
               WRONG X ICON
            ========================================= */

            .optionBtn.wrong::after {

                content:
                    "✕";

                position: absolute;

                right: 18px;

                top: 50%;

                transform:
                    translateY(-50%);

                width: 30px;

                height: 30px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 50%;

                background:
                    #e34b4b;

                color:
                    white;

                font-size: 18px;

                font-weight: 900;

                line-height: 1;

                box-shadow:
                    0 3px 8px
                    rgba(
                        220,
                        60,
                        60,
                        0.25
                    );

            }


            /* =========================================
               CORRECT ANSWER
            ========================================= */

            .optionBtn.correct {

                position: relative;

                background:
                    #eaf9ef !important;

                color:
                    #218a47 !important;

                border-color:
                    #2eb463 !important;

                box-shadow:
                    0 5px 15px
                    rgba(
                        40,
                        180,
                        80,
                        0.15
                    ) !important;

            }


            /* =========================================
               CORRECT CHECK ICON
            ========================================= */

            .optionBtn.correct::after {

                content:
                    "✓";

                position: absolute;

                right: 18px;

                top: 50%;

                transform:
                    translateY(-50%);

                width: 30px;

                height: 30px;

                display: flex;

                align-items: center;

                justify-content: center;

                border-radius: 50%;

                background:
                    #2eb463;

                color:
                    white;

                font-size: 18px;

                font-weight: 900;

                line-height: 1;

                box-shadow:
                    0 3px 8px
                    rgba(
                        40,
                        180,
                        80,
                        0.25
                    );

            }


            /* =========================================
               WRONG ANSWER FEEDBACK
            ========================================= */

            .unique-answer-feedback {

                width: 100%;

                box-sizing: border-box;

                margin:
                    18px 0 16px;

                padding:
                    15px 18px;

                border-radius:
                    16px;

                font-size:
                    17px;

                font-weight:
                    700;

                line-height:
                    1.5;

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    center;

                text-align:
                    center;

                transform-origin:
                    center;

                animation:
                    uniqueFeedbackPop
                    0.45s
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
               FEEDBACK TEXT
            ========================================= */

            .unique-feedback-text {

                display:
                    block;

                width:
                    100%;

            }


            /* =========================================
               FEEDBACK ANIMATION
            ========================================= */

            @keyframes uniqueFeedbackPop {

                0% {

                    opacity:
                        0;

                    transform:
                        translateY(10px)
                        scale(0.94);

                }

                55% {

                    opacity:
                        1;

                    transform:
                        translateY(-2px)
                        scale(1.02);

                }

                100% {

                    opacity:
                        1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            /* =========================================
               MOBILE
            ========================================= */

            @media (max-width: 480px) {

                .optionBtn.wrong::after,
                .optionBtn.correct::after {

                    right:
                        12px;

                    width:
                        27px;

                    height:
                        27px;

                    font-size:
                        16px;

                }


                .unique-answer-feedback {

                    font-size:
                        15px;

                    padding:
                        13px 14px;

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


        /*
         * A question is counted as answered only
         * when the student has reached the correct answer.
         */

        const answeredQuestions =
            userAnswers.filter(
                answer =>
                    answer !== null
            ).length;


        /*
         * Progress percentage is based on
         * CORRECT ANSWERS / TOTAL QUESTIONS.
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
    // PREPARE ANSWER STATE
    // =================================================

    userAnswers =
        new Array(
            questions.length
        ).fill(
            null
        );


    // =================================================
    // PREPARE WRONG ATTEMPTS
    // =================================================

    wrongAttempts =
        Array.from(
            {
                length:
                    questions.length
            },
            () =>
                new Set()
        );


    // =================================================
    // PREPARE FEEDBACK STATE
    // =================================================

    lastAttemptCorrect =
        new Array(
            questions.length
        ).fill(
            null
        );


    feedbackMessages =
        new Array(
            questions.length
        ).fill(
            ""
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
    // GET SAVED FEEDBACK
    // =================================================

    function getStoredFeedback(
        questionIndex
    ) {

        if (
            lastAttemptCorrect[
                questionIndex
            ] === null
        ) {

            return null;

        }


        return {

            correct:
                lastAttemptCorrect[
                    questionIndex
                ],

            message:
                feedbackMessages[
                    questionIndex
                ] || ""

        };

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

            top:
                0,

            behavior:
                "smooth"

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
        // FEEDBACK
        // =============================================

        let feedbackBox =
            null;


        const storedFeedback =
            getStoredFeedback(
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


        /*
         * IMPORTANT:
         *
         * Explanation is hidden until the student
         * gets the correct answer.
         */

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


                // =========================================
                // RESTORE WRONG ATTEMPTS
                // =========================================

                if (
                    wrongAttempts[index] &&
                    wrongAttempts[index].has(
                        optionIndex
                    )
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }


                // =========================================
                // RESTORE CORRECT ANSWER
                // =========================================

                const correctAnswer =
                    getCorrectAnswer(
                        q
                    );


                if (
                    userAnswers[index] !==
                    null
                ) {

                    /*
                     * Question has already been solved.
                     */

                    button.disabled =
                        true;


                    if (
                        optionIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }

                }


                // =========================================
                // CORRECT QUESTION
                // =========================================

                if (
                    userAnswers[index] !==
                    null
                ) {

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
                         * If the question has already
                         * been solved, do nothing.
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
         * Feedback goes directly after options.
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
         * Safety check:
         *
         * If the question is already correct,
         * do not allow another attempt.
         */

        if (
            userAnswers[questionIndex] !==
            null
        ) {

            return;

        }


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
        // WRONG ANSWER
        // =============================================

        if (
            !isCorrect
        ) {

            /*
             * Make sure wrongAttempts Set exists.
             */

            if (
                !wrongAttempts[
                    questionIndex
                ]
            ) {

                wrongAttempts[
                    questionIndex
                ] =
                    new Set();

            }


            /*
             * Remember this wrong option.
             */

            wrongAttempts[
                questionIndex
            ].add(
                selectedIndex
            );


            /*
             * Count this as a wrong attempt.
             */

            wrongAnswers++;


            /*
             * Store latest feedback.
             */

            lastAttemptCorrect[
                questionIndex
            ] =
                false;


            feedbackMessages[
                questionIndex
            ] =
                getRandomMessage(
                    incorrectMessages
                );


            /*
             * Mark ONLY the selected wrong
             * option as wrong.
             */

            buttons.forEach(
                (
                    button,
                    index
                ) => {

                    if (
                        index ===
                        selectedIndex
                    ) {

                        button.classList.add(
                            "wrong"
                        );

                    }

                }
            );


            /*
             * IMPORTANT:
             *
             * Do NOT disable the other options.
             *
             * The student must be able to try again.
             */

            buttons.forEach(
                (
                    button,
                    index
                ) => {

                    if (
                        !wrongAttempts[
                            questionIndex
                        ].has(
                            index
                        )
                    ) {

                        button.disabled =
                            false;

                    }

                    else {

                        button.disabled =
                            true;

                    }

                }
            );


            /*
             * Replace old feedback.
             */

            const oldFeedback =
                questionCard.querySelector(
                    ".unique-answer-feedback"
                );


            if (
                oldFeedback
            ) {

                oldFeedback.remove();

            }


            const feedbackBox =
                createAnswerFeedback(
                    false,
                    feedbackMessages[
                        questionIndex
                    ]
                );


            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );


            /*
             * Keep explanation hidden while
             * the student is still trying.
             */

            explanationBox.style.display =
                "none";


            /*
             * Save progress.
             */

            saveChapterProgress();


            /*
             * Small scroll to feedback.
             */

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
                100
            );


            /*
             * STOP HERE.
             *
             * This is the most important part.
             *
             * The wrong answer does NOT complete
             * the question.
             */

            return;

        }


        // =============================================
        // CORRECT ANSWER
        // =============================================

        /*
         * Save the correct answer ONLY now.
         */

        userAnswers[
            questionIndex
        ] =
            correctAnswer;


        /*
         * Increase score ONLY once.
         */

        score++;


        /*
         * Store correct feedback.
         */

        lastAttemptCorrect[
            questionIndex
        ] =
            true;


        feedbackMessages[
            questionIndex
        ] =
            getRandomMessage(
                correctMessages
            );


        // =============================================
        // SHOW CORRECT / WRONG STATES
        // =============================================

        buttons.forEach(
            (
                button,
                index
            ) => {

                /*
                 * Disable all options because
                 * the question is now completed.
                 */

                button.disabled =
                    true;


                /*
                 * Correct answer gets green
                 * check icon.
                 */

                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.remove(
                        "wrong"
                    );


                    button.classList.add(
                        "correct"
                    );

                }


                /*
                 * Previously selected wrong
                 * answers remain red/X.
                 */

                else if (
                    wrongAttempts[
                        questionIndex
                    ] &&
                    wrongAttempts[
                        questionIndex
                    ].has(
                        index
                    )
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        // =============================================
        // REMOVE OLD FEEDBACK
        // =============================================

        const oldFeedback =
            questionCard.querySelector(
                ".unique-answer-feedback"
            );


        if (
            oldFeedback
        ) {

            oldFeedback.remove();

        }


        // =============================================
        // CREATE CORRECT FEEDBACK
        // =============================================

        const feedbackBox =
            createAnswerFeedback(
                true,
                feedbackMessages[
                    questionIndex
                ]
            );


        questionCard.insertBefore(
            feedbackBox,
            explanationBox
        );


        // =============================================
        // SHOW EXPLANATION
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
        // SAVE PROGRESS
        // =============================================

        saveChapterProgress();


        // =============================================
        // SCROLL TO CORRECT FEEDBACK
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


        console.log(
            "Question answered correctly:",
            questionIndex + 1
        );


        console.log(
            "Score:",
            score,
            "/",
            questions.length
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

                /*
                 * Do not allow finishing if some
                 * questions on the final page have
                 * not yet been answered correctly.
                 */

                const unanswered =
                    userAnswers.filter(
                        answer =>
                            answer === null
                    ).length;


                if (
                    unanswered > 0
                ) {

                    /*
                     * Show a small message instead of
                     * finishing with unanswered questions.
                     */

                    const oldNotice =
                        document.querySelector(
                            ".unique-unanswered-notice"
                        );


                    if (
                        oldNotice
                    ) {

                        oldNotice.remove();

                    }


                    const notice =
                        document.createElement(
                            "div"
                        );


                    notice.className =
                        "unique-unanswered-notice";


                    notice.textContent =
                        `⚠️ Please answer all questions correctly before finishing. ${unanswered} question${unanswered === 1 ? "" : "s"} remaining.`;


                    notice.style.cssText = `

                        width: 100%;

                        box-sizing: border-box;

                        margin: 15px 0;

                        padding: 14px 16px;

                        border-radius: 14px;

                        background: #fff4e5;

                        color: #a85b00;

                        border: 1px solid rgba(168,91,0,0.2);

                        font-weight: 700;

                        text-align: center;

                        line-height: 1.5;

                    `;


                    questionsPage.prepend(
                        notice
                    );


                    setTimeout(
                        () => {

                            if (
                                notice &&
                                notice.parentNode
                            ) {

                                notice.remove();

                            }

                        },
                        3500
                    );


                    return;

                }


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


        /*
         * Safety:
         * Do not finish until every question
         * has been answered correctly.
         */

        const unanswered =
            userAnswers.filter(
                answer =>
                    answer === null
            ).length;


        if (
            unanswered > 0
        ) {

            console.warn(
                "Quiz cannot finish yet.",
                unanswered,
                "questions remain."
            );


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
         * Make sure Review button
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
            "Wrong attempts:",
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
            // RESET WRONG ATTEMPTS
            // =========================================

            wrongAnswers =
                0;


            // =========================================
            // RESET ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // RESET WRONG OPTION STORAGE
            // =========================================

            wrongAttempts =
                Array.from(
                    {
                        length:
                            questions.length
                    },
                    () =>
                        new Set()
                );


            // =========================================
            // RESET FEEDBACK
            // =========================================

            lastAttemptCorrect =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            feedbackMessages =
                new Array(
                    questions.length
                ).fill(
                    ""
                );


            /*
             * Save completely reset state.
             */

            saveChapterProgress();


            // =========================================
            // MARK QUIZ ACTIVE
            // =========================================

            quizFinished =
                false;


            // =========================================
            // HIDE COMPLETION
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
            // LOAD QUESTIONS 1–5
            // =========================================

            loadPage();


            // =========================================
            // SCROLL TOP
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
