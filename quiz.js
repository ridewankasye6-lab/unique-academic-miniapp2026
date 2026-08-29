// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// SELECTED ANSWER ONLY
// ✓ CORRECT / ❌ WRONG
// MOTIVATIONAL FEEDBACK
// ENGLISH + AMHARIC EXPLANATION
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
    // null = unanswered
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

        "🌱 Keep learning! Every mistake makes you stronger! 💪",

        "🔍 Don't give up! Review it and keep trying! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Keep your chin up! You are getting closer! 🧗‍♂️",

        "📖 Review the explanation and learn from it! ✍️",

        "💡 Every attempt strengthens your understanding! 🧠",

        "🤝 Not this time, but keep learning! 🎯",

        "🧐 Take another look and keep improving! 🔍"

    ];


    // =================================================
    // ADD FEEDBACK + ICON CSS
    // =================================================

    function addQuizStyles() {

        if (
            document.getElementById(
                "uniqueAcademicQuizExtraStyles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "uniqueAcademicQuizExtraStyles";


        style.textContent = `

            /* =========================================
               ANSWER RESULT ICON
            ========================================= */

            .unique-answer-result-icon {

                width: 42px;

                height: 42px;

                min-width: 42px;

                border-radius: 50%;

                display: inline-flex;

                align-items: center;

                justify-content: center;

                margin-left: 12px;

                font-size: 25px;

                font-weight: 900;

                line-height: 1;

                flex-shrink: 0;

                box-sizing: border-box;

            }


            /* =========================================
               CORRECT ICON
            ========================================= */

            .unique-answer-result-icon.correct-icon {

                background:
                    #2fb86d;

                color:
                    #ffffff;

                box-shadow:
                    0 5px 14px
                    rgba(
                        47,
                        184,
                        109,
                        0.25
                    );

            }


            /* =========================================
               WRONG ICON
            ========================================= */

            .unique-answer-result-icon.wrong-icon {

                background:
                    #e34b50;

                color:
                    #ffffff;

                box-shadow:
                    0 5px 14px
                    rgba(
                        227,
                        75,
                        80,
                        0.22
                    );

            }


            /* =========================================
               ANSWER BUTTON LAYOUT
            ========================================= */

            .optionBtn {

                position:
                    relative;

                display:
                    flex;

                align-items:
                    center;

                justify-content:
                    space-between;

                gap:
                    12px;

            }


            /* =========================================
               FEEDBACK BOX
            ========================================= */

            .unique-answer-feedback {

                width:
                    100%;

                box-sizing:
                    border-box;

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
                        translateY(12px)
                        scale(0.92);

                }

                55% {

                    opacity:
                        1;

                    transform:
                        translateY(-3px)
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

                .unique-answer-feedback {

                    font-size:
                        15px;

                    padding:
                        13px 14px;

                    border-radius:
                        14px;

                }


                .unique-answer-result-icon {

                    width:
                        38px;

                    height:
                        38px;

                    min-width:
                        38px;

                    font-size:
                        22px;

                    margin-left:
                        8px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    addQuizStyles();


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
    // CREATE MOTIVATIONAL FEEDBACK
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


        feedback.classList.add(
            isCorrect
                ? "correct-feedback"
                : "incorrect-feedback"
        );


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


        const answeredQuestions =
            userAnswers.filter(
                answer =>
                    answer !== null
            ).length;


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

            if (
                quizData[subject]
            ) {

                return quizData[subject];

            }


            if (
                quizData[exactKey]
            ) {

                return quizData[exactKey];

            }


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


        // ---------------------------------------------
        // Exact chapter
        // ---------------------------------------------

        if (
            subjectData[chapter]
        ) {

            return Array.isArray(
                subjectData[chapter]
            )
                ? subjectData[chapter]
                : [];

        }


        // ---------------------------------------------
        // Numeric chapter
        // ---------------------------------------------

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
    // NO QUESTIONS
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
    // GET OPTIONS
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
    // ADD RESULT ICON
    //
    // ONLY THE SELECTED ANSWER GETS AN ICON
    // =================================================

    function addResultIcon(
        button,
        isCorrect
    ) {

        // ---------------------------------------------
        // Remove any old icon first
        // ---------------------------------------------

        const oldIcon =
            button.querySelector(
                ".unique-answer-result-icon"
            );


        if (
            oldIcon
        ) {

            oldIcon.remove();

        }


        // ---------------------------------------------
        // Create icon
        // ---------------------------------------------

        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "unique-answer-result-icon";


        if (
            isCorrect
        ) {

            icon.classList.add(
                "correct-icon"
            );


            icon.textContent =
                "✓";

        }

        else {

            icon.classList.add(
                "wrong-icon"
            );


            icon.textContent =
                "❌";

        }


        button.appendChild(
            icon
        );

    }


    // =================================================
    // APPLY ANSWER RESULT
    //
    // IMPORTANT:
    // Only selected answer changes.
    // Other answers stay normal.
    // =================================================

    function applyAnswerResult(
        q,
        selectedIndex,
        buttons
    ) {

        const correctAnswer =
            getCorrectAnswer(
                q
            );


        const isCorrect =
            selectedIndex ===
            correctAnswer;


        buttons.forEach(
            (
                button,
                optionIndex
            ) => {

                // -------------------------------------
                // Always disabled after answering
                // -------------------------------------

                button.disabled =
                    true;


                // -------------------------------------
                // Remove old state/classes/icons
                // -------------------------------------

                button.classList.remove(
                    "correct"
                );


                button.classList.remove(
                    "wrong"
                );


                const oldIcon =
                    button.querySelector(
                        ".unique-answer-result-icon"
                    );


                if (
                    oldIcon
                ) {

                    oldIcon.remove();

                }


                // -------------------------------------
                // ONLY SELECTED ANSWER GETS RESULT
                // -------------------------------------

                if (
                    optionIndex ===
                    selectedIndex
                ) {

                    if (
                        isCorrect
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }

                    else {

                        button.classList.add(
                            "wrong"
                        );

                    }


                    addResultIcon(
                        button,
                        isCorrect
                    );

                }

            }
        );


        return isCorrect;

    }


    // =================================================
    // LOAD PAGE
    // =================================================

    function loadPage() {

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
        // OPTIONS CONTAINER
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
        // ENGLISH EXPLANATION
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
        // AMHARIC EXPLANATION
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
        // RESTORE PREVIOUS ANSWER
        // =============================================

        const previousAnswer =
            userAnswers[index];


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


                // -------------------------------------
                // Remove old icons/states
                // -------------------------------------

                button.classList.remove(
                    "correct"
                );


                button.classList.remove(
                    "wrong"
                );


                // -------------------------------------
                // Put option text
                // -------------------------------------

                const optionText =
                    document.createElement(
                        "span"
                    );


                optionText.className =
                    "optionText";


                optionText.textContent =
                    option;


                button.appendChild(
                    optionText
                );


                // -------------------------------------
                // RESTORE ANSWER
                // -------------------------------------

                if (
                    previousAnswer !== null &&
                    typeof previousAnswer !==
                    "undefined"
                ) {

                    button.disabled =
                        true;


                    if (
                        optionIndex ===
                        previousAnswer
                    ) {

                        const correctAnswer =
                            getCorrectAnswer(
                                q
                            );


                        const isCorrect =
                            previousAnswer ===
                            correctAnswer;


                        if (
                            isCorrect
                        ) {

                            button.classList.add(
                                "correct"
                            );

                        }

                        else {

                            button.classList.add(
                                "wrong"
                            );

                        }


                        // -----------------------------
                        // Restore ONLY selected icon
                        // -----------------------------

                        addResultIcon(
                            button,
                            isCorrect
                        );

                    }

                }


                // =====================================
                // OPTION CLICK
                // =====================================

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            quizFinished
                        ) {

                            return;

                        }


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
        // RESTORE EXPLANATION + FEEDBACK
        // =============================================

        if (
            previousAnswer !== null &&
            typeof previousAnswer !==
            "undefined"
        ) {

            const correctAnswer =
                getCorrectAnswer(
                    q
                );


            const isCorrect =
                previousAnswer ===
                correctAnswer;


            // -----------------------------------------
            // Restore explanation
            // -----------------------------------------

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


            // -----------------------------------------
            // Restore motivational feedback
            // -----------------------------------------

            const feedback =
                createAnswerFeedback(

                    isCorrect,

                    getRandomMessage(
                        isCorrect
                            ? correctMessages
                            : incorrectMessages
                    )

                );


            questionCard.appendChild(
                document.createElement(
                    "div"
                )
            );


            questionCard.appendChild(
                feedback
            );

        }


        // =============================================
        // ADD EVERYTHING TO CARD
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


        // ---------------------------------------------
        // For answered questions, feedback must be
        // between options and explanation.
        // ---------------------------------------------

        if (
            previousAnswer !== null &&
            typeof previousAnswer !==
            "undefined"
        ) {

            const feedback =
                questionCard.querySelector(
                    ".unique-answer-feedback"
                );


            if (
                feedback
            ) {

                questionCard.insertBefore(
                    feedback,
                    explanationBox
                );

            }

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

        // =============================================
        // SAFETY
        // =============================================

        if (
            userAnswers[questionIndex] !==
            null
        ) {

            return;

        }


        // =============================================
        // SAVE SELECTED ANSWER
        // =============================================

        userAnswers[questionIndex] =
            selectedIndex;


        // =============================================
        // GET CORRECT ANSWER
        // =============================================

        const correctAnswer =
            getCorrectAnswer(
                q
            );


        // =============================================
        // DETERMINE RESULT
        // =============================================

        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =============================================
        // UPDATE SCORE
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
        // SHOW RESULT
        //
        // ONLY SELECTED OPTION
        // =============================================

        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        applyAnswerResult(
            q,
            selectedIndex,
            buttons
        );


        // =============================================
        // SAVE PROGRESS
        // =============================================

        saveChapterProgress();


        // =============================================
        // MOTIVATIONAL MESSAGE
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


        // =============================================
        // REMOVE OLD FEEDBACK IF ANY
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
        // SHOW FEEDBACK
        // =============================================

        questionCard.insertBefore(
            feedbackBox,
            explanationBox
        );


        // =============================================
        // SHOW ENGLISH EXPLANATION
        // =============================================

        englishExplanation.textContent =
            getEnglishExplanation(
                q
            );


        // =============================================
        // SHOW AMHARIC EXPLANATION
        // =============================================

        amharicExplanation.textContent =
            getAmharicExplanation(
                q
            );


        // =============================================
        // SHOW EXPLANATION CARD
        // =============================================

        explanationBox.style.display =
            "block";


        // =============================================
        // SCROLL TO FEEDBACK
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

                <span>
                    Finish Quiz
                </span>

                <span class="navArrow">
                    ✓
                </span>

            `;

        }

        else {

            nextBtn.innerHTML = `

                <span>
                    Next
                </span>

                <span class="navArrow">
                    →
                </span>

            `;

        }


        // ---------------------------------------------
        // MAKE SURE NEXT IS ENABLED
        // ---------------------------------------------

        nextBtn.disabled =
            false;

    }


    // =================================================
    // NEXT BUTTON
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


            // -----------------------------------------
            // GO TO NEXT PAGE
            // -----------------------------------------

            if (
                currentPage <
                totalPages - 1
            ) {

                currentPage++;

                loadPage();

                return;

            }


            // -----------------------------------------
            // LAST PAGE → FINISH
            // -----------------------------------------

            finishQuiz();

        }
    );


    // =================================================
    // PREVIOUS BUTTON
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

        if (
            quizFinished
        ) {

            return;

        }


        quizFinished =
            true;


        // ---------------------------------------------
        // REMOVE QUESTIONS
        // ---------------------------------------------

        questionsPage.innerHTML =
            "";


        // ---------------------------------------------
        // HIDE NAVIGATION
        // ---------------------------------------------

        previousQuestionBtn.style.display =
            "none";


        nextBtn.style.display =
            "none";


        // ---------------------------------------------
        // SHOW COMPLETION
        // ---------------------------------------------

        completionMessage.hidden =
            false;


        // ---------------------------------------------
        // CALCULATE PERCENTAGE
        // ---------------------------------------------

        const percentage =
            questions.length > 0
                ? Math.round(
                    (
                        score /
                        questions.length
                    ) * 100
                )
                : 0;


        // ---------------------------------------------
        // SAVE FINAL PROGRESS
        // ---------------------------------------------

        saveChapterProgress();


        // ---------------------------------------------
        // SCORE DISPLAY
        // ---------------------------------------------

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


            completionMessage.insertBefore(
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


        // ---------------------------------------------
        // REVIEW BUTTON
        // ---------------------------------------------

        reviewQuizBtn.style.display =
            "inline-flex";


        reviewQuizBtn.disabled =
            false;


        // ---------------------------------------------
        // SCROLL TO RESULT
        // ---------------------------------------------

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

            // -----------------------------------------
            // RESET SAVED PROGRESS
            // -----------------------------------------

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


            // -----------------------------------------
            // RESET PAGE
            // -----------------------------------------

            currentPage =
                0;


            // -----------------------------------------
            // RESET SCORE
            // -----------------------------------------

            score =
                0;


            // -----------------------------------------
            // RESET WRONG ANSWERS
            // -----------------------------------------

            wrongAnswers =
                0;


            // -----------------------------------------
            // RESET ANSWERS
            // -----------------------------------------

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // -----------------------------------------
            // SAVE RESET STATE
            // -----------------------------------------

            saveChapterProgress();


            // -----------------------------------------
            // MARK QUIZ ACTIVE
            // -----------------------------------------

            quizFinished =
                false;


            // -----------------------------------------
            // HIDE COMPLETION
            // -----------------------------------------

            completionMessage.hidden =
                true;


            // -----------------------------------------
            // SHOW NAVIGATION
            // -----------------------------------------

            previousQuestionBtn.style.display =
                "inline-flex";


            nextBtn.style.display =
                "inline-flex";


            // -----------------------------------------
            // ENABLE NEXT
            // -----------------------------------------

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                false;


            // -----------------------------------------
            // RESTORE NEXT BUTTON
            // -----------------------------------------

            nextBtn.innerHTML = `

                <span>
                    Next
                </span>

                <span class="navArrow">
                    →
                </span>

            `;


            // -----------------------------------------
            // LOAD QUESTION 1–5
            // -----------------------------------------

            loadPage();


            // -----------------------------------------
            // SCROLL TOP
            // -----------------------------------------

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
    // BACK BUTTON
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
    // HOME BUTTON
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
