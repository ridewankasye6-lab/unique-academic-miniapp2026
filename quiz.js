// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + RETRY WRONG ANSWERS
// + MOTIVATIONAL ANSWER FEEDBACK
// + CORRECT / WRONG ICONS
// + ENGLISH & AMHARIC EXPLANATIONS
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
    // FINAL ANSWERS
    //
    // null   = question not finally answered
    // number = correct option selected
    // =================================================

    let userAnswers = [];


    // =================================================
    // WRONG ATTEMPTS
    //
    // Every question has a Set containing the
    // option indexes that were already selected wrongly.
    //
    // Example:
    //
    // Question 1:
    // wrongAttempts[0] = Set { 0, 1 }
    //
    // Means A and B were wrong.
    // =================================================

    let wrongAttempts = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ATTEMPTS COUNT
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

        "🌱 Keep trying! You can find the correct answer! 💪",

        "🔍 Not quite! Try another choice! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Keep your chin up! Try another answer! 🧗‍♂️",

        "📖 Review the question carefully and try again! ✍️",

        "💡 Each attempt strengthens your understanding! 🧠",

        "🤝 Not the right answer yet. Keep trying! 🎯",

        "🧐 Take another look and choose again! 🔍"

    ];


    // =================================================
    // ADD SAFE QUIZ STYLES
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
               OPTION BUTTON
            ========================================= */

            .optionBtn {

                position: relative;

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 12px;

            }


            /* =========================================
               OPTION TEXT
            ========================================= */

            .optionText {

                flex: 1;

                text-align: left;

            }


            /* =========================================
               RESULT ICON
            ========================================= */

            .option-result-icon {

                flex: 0 0 auto;

                width: 42px;

                height: 42px;

                min-width: 42px;

                border-radius: 50%;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 25px;

                font-weight: 900;

                line-height: 1;

                color: #ffffff;

                box-shadow:
                    0 5px 14px
                    rgba(0, 0, 0, 0.12);

                animation:
                    uniqueOptionIconPop
                    0.35s
                    ease-out;

            }


            /* =========================================
               CORRECT ICON
            ========================================= */

            .option-result-icon.correct-icon {

                background:
                    #2fb36b;

            }


            /* =========================================
               WRONG ICON
            ========================================= */

            .option-result-icon.wrong-icon {

                background:
                    #e34d55;

            }


            /* =========================================
               CORRECT OPTION
            ========================================= */

            .optionBtn.correct {

                border-color:
                    #35b56f !important;

                background:
                    #edf9f1 !important;

                color:
                    #2d8951 !important;

            }


            /* =========================================
               WRONG OPTION
            ========================================= */

            .optionBtn.wrong {

                border-color:
                    #df5058 !important;

                background:
                    #fff1f2 !important;

                color:
                    #a83e45 !important;

            }


            /* =========================================
               WRONG DISABLED OPTION
            ========================================= */

            .optionBtn.wrong:disabled {

                opacity:
                    1;

                cursor:
                    not-allowed;

            }


            /* =========================================
               FEEDBACK
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
               OPTION ICON ANIMATION
            ========================================= */

            @keyframes uniqueOptionIconPop {

                0% {

                    opacity:
                        0;

                    transform:
                        scale(0.65);

                }

                70% {

                    opacity:
                        1;

                    transform:
                        scale(1.12);

                }

                100% {

                    opacity:
                        1;

                    transform:
                        scale(1);

                }

            }


            /* =========================================
               MOBILE
            ========================================= */

            @media (max-width: 480px) {

                .option-result-icon {

                    width:
                        38px;

                    height:
                        38px;

                    min-width:
                        38px;

                    font-size:
                        22px;

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


        if (
            subjectData[chapter]
        ) {

            return Array.isArray(
                subjectData[chapter]
            )
                ? subjectData[chapter]
                : [];

        }


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
    // PREPARE ANSWER ARRAYS
    // =================================================

    userAnswers =
        new Array(
            questions.length
        ).fill(
            null
        );


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
    // CREATE RESULT ICON
    // =================================================

    function createResultIcon(
        isCorrect
    ) {

        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "option-result-icon";


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
                "✕";

        }


        return icon;

    }


    // =================================================
    // UPDATE OPTION ICON
    // =================================================

    function setOptionIcon(
        button,
        isCorrect
    ) {

        const oldIcon =
            button.querySelector(
                ".option-result-icon"
            );


        if (
            oldIcon
        ) {

            oldIcon.remove();

        }


        button.appendChild(
            createResultIcon(
                isCorrect
            )
        );

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
            getEnglishExplanation(
                q
            );


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
            getAmharicExplanation(
                q
            );


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


                // -------------------------------------
                // OPTION TEXT
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


                // =====================================
                // RESTORE WRONG ATTEMPT
                // =====================================

                if (
                    wrongAttempts[index] &&
                    wrongAttempts[index].has(
                        optionIndex
                    )
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    button.disabled =
                        true;


                    setOptionIcon(
                        button,
                        false
                    );

                }


                // =====================================
                // RESTORE CORRECT ANSWER
                // =====================================

                if (
                    userAnswers[index] !==
                    null
                ) {

                    const correctAnswer =
                        getCorrectAnswer(
                            q
                        );


                    button.disabled =
                        true;


                    if (
                        optionIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );


                        setOptionIcon(
                            button,
                            true
                        );

                    }


                    /*
                     * Keep previously wrong choices
                     * red with X.
                     */

                    else if (
                        wrongAttempts[index] &&
                        wrongAttempts[index].has(
                            optionIndex
                        )
                    ) {

                        button.classList.add(
                            "wrong"
                        );


                        setOptionIcon(
                            button,
                            false
                        );

                    }


                    explanationBox.style.display =
                        "block";

                }


                // =====================================
                // OPTION CLICK
                // =====================================

                button.addEventListener(
                    "click",
                    () => {

                        /*
                         * If this exact option was already
                         * marked wrong, do nothing.
                         */

                        if (
                            wrongAttempts[index] &&
                            wrongAttempts[index].has(
                                optionIndex
                            )
                        ) {

                            return;

                        }


                        /*
                         * If question has already been
                         * correctly answered, do nothing.
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


        questionCard.appendChild(
            explanationBox
        );


        questionsPage.appendChild(
            questionCard
        );


        // =============================================
        // RESTORE FEEDBACK
        // =============================================

        if (
            userAnswers[index] !==
            null
        ) {

            const feedbackBox =
                createAnswerFeedback(

                    true,

                    getRandomMessage(
                        correctMessages
                    )

                );


            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );

        }

        else if (
            wrongAttempts[index] &&
            wrongAttempts[index].size > 0
        ) {

            const feedbackBox =
                createAnswerFeedback(

                    false,

                    getRandomMessage(
                        incorrectMessages
                    )

                );


            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );

        }

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
        // SAFETY CHECK
        // =============================================

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
        // WRONG ANSWER
        // =============================================

        if (
            selectedIndex !==
            correctAnswer
        ) {

            /*
             * Create Set if necessary.
             */

            if (
                !wrongAttempts[questionIndex]
            ) {

                wrongAttempts[questionIndex] =
                    new Set();

            }


            /*
             * Do not count the exact same wrong
             * option more than once.
             */

            if (
                !wrongAttempts[
                    questionIndex
                ].has(
                    selectedIndex
                )
            ) {

                wrongAttempts[
                    questionIndex
                ].add(
                    selectedIndex
                );


                wrongAnswers++;

            }


            /*
             * Find selected button.
             */

            const selectedButton =
                buttons[
                    selectedIndex
                ];


            if (
                selectedButton
            ) {

                /*
                 * Mark ONLY this option wrong.
                 */

                selectedButton.classList.add(
                    "wrong"
                );


                /*
                 * Add ❌ icon.
                 */

                setOptionIcon(
                    selectedButton,
                    false
                );


                /*
                 * Disable ONLY the wrong option.
                 *
                 * Other choices remain clickable.
                 */

                selectedButton.disabled =
                    true;

            }


            // =========================================
            // MOTIVATIONAL FEEDBACK
            // =========================================

            const feedbackMessage =
                getRandomMessage(
                    incorrectMessages
                );


            const feedbackBox =
                createAnswerFeedback(

                    false,

                    feedbackMessage

                );


            const oldFeedback =
                questionCard.querySelector(
                    ".unique-answer-feedback"
                );


            if (
                oldFeedback
            ) {

                oldFeedback.remove();

            }


            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );


            /*
             * IMPORTANT:
             *
             * Do NOT reveal the correct answer.
             *
             * Do NOT disable the other options.
             *
             * Do NOT finish the question.
             */

            saveChapterProgress();


            /*
             * Show explanation after the attempt.
             */

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


            /*
             * Small scroll.
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
                120
            );


            return;

        }


        // =============================================
        // CORRECT ANSWER
        // =============================================

        userAnswers[questionIndex] =
            selectedIndex;


        score++;


        // =============================================
        // SAVE PROGRESS
        // =============================================

        saveChapterProgress();


        // =============================================
        // MARK OPTIONS
        // =============================================

        buttons.forEach(
            (
                button,
                index
            ) => {

                /*
                 * Disable everything after the
                 * correct answer is found.
                 */

                button.disabled =
                    true;


                /*
                 * Correct option.
                 */

                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );


                    setOptionIcon(
                        button,
                        true
                    );

                }


                /*
                 * Previously selected wrong options
                 * remain red with X.
                 */

                else if (
                    wrongAttempts[questionIndex] &&
                    wrongAttempts[
                        questionIndex
                    ].has(
                        index
                    )
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    setOptionIcon(
                        button,
                        false
                    );

                }

            }
        );


        // =============================================
        // CORRECT MOTIVATIONAL MESSAGE
        // =============================================

        const feedbackMessage =
            getRandomMessage(
                correctMessages
            );


        const feedbackBox =
            createAnswerFeedback(

                true,

                feedbackMessage

            );


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

        // =============================================
        // PREVIOUS
        // =============================================

        previousQuestionBtn.disabled =
            currentPage === 0;


        // =============================================
        // TOTAL PAGES
        // =============================================

        const totalPages =
            Math.ceil(
                questions.length /
                QUESTIONS_PER_PAGE
            );


        // =============================================
        // LAST PAGE
        // =============================================

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


        /*
         * Safety:
         *
         * The student should have answered every
         * question correctly before Finish Quiz.
         *
         * If some questions are still unanswered,
         * allow them to continue instead of ending.
         */

        const unanswered =
            userAnswers.filter(
                answer =>
                    answer === null
            ).length;


        if (
            unanswered > 0
        ) {

            alert(
                "Please answer all questions before finishing the quiz."
            );


            return;

        }


        quizFinished =
            true;


        // =============================================
        // HIDE QUESTIONS
        // =============================================

        questionsPage.innerHTML =
            "";


        // =============================================
        // HIDE NAVIGATION
        // =============================================

        previousQuestionBtn.style.display =
            "none";


        nextBtn.style.display =
            "none";


        // =============================================
        // SHOW COMPLETION
        // =============================================

        completionMessage.hidden =
            false;


        // =============================================
        // CALCULATE PERCENTAGE
        // =============================================

        const percentage =
            questions.length > 0
                ? Math.round(
                    (
                        score /
                        questions.length
                    ) * 100
                )
                : 0;


        // =============================================
        // SAVE FINAL PROGRESS
        // =============================================

        saveChapterProgress();


        // =============================================
        // SCORE DISPLAY
        // =============================================

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


        // =============================================
        // REVIEW / RESTART
        // =============================================

        reviewQuizBtn.style.display =
            "inline-flex";


        reviewQuizBtn.disabled =
            false;


        // =============================================
        // SCROLL
        // =============================================

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

            // =========================================
            // RESET LOCAL STORAGE
            // =========================================

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
            // RESET FINAL ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // RESET WRONG ATTEMPTS
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
            // SAVE RESET STATE
            // =========================================

            saveChapterProgress();


            // =========================================
            // QUIZ ACTIVE
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
            // ENABLE NAVIGATION
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
