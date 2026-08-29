// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
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
    // ANSWER STATE
    //
    // null  = not answered
    // number = selected option index
    // =================================================

    let userAnswers =
        [];


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
               OPTION BUTTON
            ========================================= */

            .optionBtn {

                position: relative;

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 14px;

            }


            /* =========================================
               OPTION TEXT
            ========================================= */

            .unique-option-text {

                flex: 1;

                text-align: left;

            }


            /* =========================================
               ANSWER ICON
            ========================================= */

            .unique-answer-icon {

                width: 50px;

                height: 50px;

                min-width: 50px;

                border-radius: 50%;

                display: flex;

                align-items: center;

                justify-content: center;

                font-size: 30px;

                font-weight: 900;

                line-height: 1;

                flex-shrink: 0;

            }


            /* =========================================
               CORRECT ICON
            ========================================= */

            .unique-correct-icon {

                background: #2dbb70;

                color: #ffffff;

                box-shadow:
                    0 5px 14px
                    rgba(
                        45,
                        187,
                        112,
                        0.28
                    );

            }


            /* =========================================
               WRONG ICON
            ========================================= */

            .unique-wrong-icon {

                background: #e34d55;

                color: #ffffff;

                box-shadow:
                    0 5px 14px
                    rgba(
                        227,
                        77,
                        85,
                        0.25
                    );

            }


            /* =========================================
               MOTIVATIONAL FEEDBACK
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
               FEEDBACK TEXT
            ========================================= */

            .unique-feedback-text {

                display: block;

                width: 100%;

            }


            /* =========================================
               FEEDBACK ANIMATION
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
               MOBILE
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


                .unique-answer-icon {

                    width: 46px;

                    height: 46px;

                    min-width: 46px;

                    font-size: 27px;

                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    addQuizStyles();


    // =================================================
    // RANDOM MESSAGE
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


        return messages[
            randomIndex
        ];

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


        /*
         * textContent safely keeps
         * all emojis.
         */

        feedbackText.textContent =
            message;


        feedback.appendChild(
            feedbackText
        );


        return feedback;

    }


    // =================================================
    // FORMAT SUBJECT
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
    // PROGRESS STORAGE KEY
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
                "Subject not found:",
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
    // PREPARE ANSWERS
    // =================================================

    userAnswers =
        new Array(
            questions.length
        ).fill(
            null
        );


    // =================================================
    // ENGLISH EXPLANATION
    // =================================================

    function getEnglishExplanation(
        q
    ) {

        if (
            !q
        ) {

            return "";

        }


        if (
            typeof q.englishExplanation ===
            "string"
        ) {

            return q.englishExplanation;

        }


        if (
            typeof q.explanationEnglish ===
            "string"
        ) {

            return q.explanationEnglish;

        }


        if (
            q.explanation &&
            typeof q.explanation.english ===
            "string"
        ) {

            return q.explanation.english;

        }


        if (
            q.explanation &&
            typeof q.explanation.en ===
            "string"
        ) {

            return q.explanation.en;

        }


        return "";

    }


    // =================================================
    // AMHARIC EXPLANATION
    // =================================================

    function getAmharicExplanation(
        q
    ) {

        if (
            !q
        ) {

            return "";

        }


        if (
            typeof q.amharicExplanation ===
            "string"
        ) {

            return q.amharicExplanation;

        }


        if (
            typeof q.explanationAmharic ===
            "string"
        ) {

            return q.explanationAmharic;

        }


        if (
            q.explanation &&
            typeof q.explanation.amharic ===
            "string"
        ) {

            return q.explanation.amharic;

        }


        if (
            q.explanation &&
            typeof q.explanation.am ===
            "string"
        ) {

            return q.explanation.am;

        }


        return "";

    }


    // =================================================
    // QUESTION OPTIONS
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
    // CORRECT ANSWER
    // =================================================

    function getCorrectAnswer(
        q
    ) {

        if (
            !q
        ) {

            return -1;

        }


        const answer =
            Number.parseInt(
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


        /*
         * Extra compatibility:
         * correctAnswer can also be used
         * if your question data contains it.
         */

        const correctAnswer =
            Number.parseInt(
                q.correctAnswer,
                10
            );


        if (
            Number.isInteger(
                correctAnswer
            )
        ) {

            return correctAnswer;

        }


        return -1;

    }


    // =================================================
    // SAVE PROGRESS
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
        // PREVIOUS ANSWER
        // =============================================

        const previousAnswer =
            userAnswers[index];


        if (
            previousAnswer !== null
        ) {

            const correctAnswer =
                getCorrectAnswer(
                    q
                );


            const isCorrect =
                previousAnswer ===
                correctAnswer;


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


            // =========================================
            // CREATE OPTIONS
            // =========================================

            questionOptions.forEach(
                (
                    option,
                    optionIndex
                ) => {

                    const button =
                        createOptionButton(
                            option,
                            optionIndex,
                            previousAnswer,
                            correctAnswer,
                            true
                        );


                    options.appendChild(
                        button
                    );

                }
            );


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
                feedbackBox
            );


            questionCard.appendChild(
                explanationBox
            );


            questionsPage.appendChild(
                questionCard
            );


            return;

        }


        // =============================================
        // CREATE UNANSWERED OPTIONS
        // =============================================

        questionOptions.forEach(
            (
                option,
                optionIndex
            ) => {

                const button =
                    createOptionButton(
                        option,
                        optionIndex,
                        null,
                        getCorrectAnswer(q),
                        false
                    );


                button.addEventListener(
                    "click",
                    () => {

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

    }


    // =================================================
    // CREATE OPTION BUTTON
    // =================================================

    function createOptionButton(
        option,
        optionIndex,
        selectedAnswer,
        correctAnswer,
        answered
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "optionBtn";


        // =============================================
        // OPTION TEXT
        // =============================================

        const optionText =
            document.createElement(
                "span"
            );


        optionText.className =
            "unique-option-text";


        optionText.textContent =
            option;


        button.appendChild(
            optionText
        );


        // =============================================
        // SHOW RESULT ONLY AFTER ANSWERING
        // =============================================

        if (
            answered
        ) {

            button.disabled =
                true;


            /*
             * IMPORTANT:
             *
             * Only the selected answer receives
             * the red X when it is wrong.
             *
             * The correct answer receives
             * the green check.
             *
             * Other options remain normal.
             */

            if (
                optionIndex ===
                correctAnswer
            ) {

                button.classList.add(
                    "correct"
                );


                addAnswerIcon(
                    button,
                    "✓",
                    "unique-correct-icon"
                );

            }


            if (
                optionIndex ===
                selectedAnswer &&
                optionIndex !==
                correctAnswer
            ) {

                button.classList.add(
                    "wrong"
                );


                addAnswerIcon(
                    button,
                    "×",
                    "unique-wrong-icon"
                );

            }

        }


        return button;

    }


    // =================================================
    // ADD ANSWER ICON
    // =================================================

    function addAnswerIcon(
        button,
        icon,
        iconClass
    ) {

        /*
         * Remove an existing icon first.
         * This prevents duplicate icons.
         */

        const oldIcon =
            button.querySelector(
                ".unique-answer-icon"
            );


        if (
            oldIcon
        ) {

            oldIcon.remove();

        }


        const iconElement =
            document.createElement(
                "span"
            );


        iconElement.className =
            "unique-answer-icon";


        iconElement.classList.add(
            iconClass
        );


        iconElement.textContent =
            icon;


        button.appendChild(
            iconElement
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
        // SAFETY CHECK
        // =============================================

        if (
            userAnswers[questionIndex] !==
            null
        ) {

            return;

        }


        // =============================================
        // SAVE ANSWER
        // =============================================

        userAnswers[questionIndex] =
            selectedIndex;


        const correctAnswer =
            getCorrectAnswer(
                q
            );


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
        // DISABLE ALL OPTIONS
        // =============================================

        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        buttons.forEach(
            (
                button,
                optionIndex
            ) => {

                button.disabled =
                    true;


                /*
                 * Remove any old icons.
                 */

                const oldIcon =
                    button.querySelector(
                        ".unique-answer-icon"
                    );


                if (
                    oldIcon
                ) {

                    oldIcon.remove();

                }


                /*
                 * Remove old result classes.
                 */

                button.classList.remove(
                    "correct",
                    "wrong"
                );


                // =====================================
                // CORRECT ANSWER
                // =====================================

                if (
                    optionIndex ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );


                    addAnswerIcon(
                        button,
                        "✓",
                        "unique-correct-icon"
                    );

                }


                // =====================================
                // SELECTED WRONG ANSWER
                // =====================================

                if (
                    optionIndex ===
                    selectedIndex &&
                    optionIndex !==
                    correctAnswer
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    addAnswerIcon(
                        button,
                        "×",
                        "unique-wrong-icon"
                    );

                }

            }
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


        /*
         * Remove any old feedback first.
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


        /*
         * Feedback goes AFTER options
         * and BEFORE explanation.
         */

        questionCard.insertBefore(
            feedbackBox,
            explanationBox
        );


        // =============================================
        // SHOW ENGLISH EXPLANATION
        // =============================================

        const englishText =
            getEnglishExplanation(
                q
            );


        englishExplanation.textContent =
            englishText;


        // =============================================
        // SHOW AMHARIC EXPLANATION
        // =============================================

        const amharicText =
            getAmharicExplanation(
                q
            );


        amharicExplanation.textContent =
            amharicText;


        /*
         * FORCE explanation to be visible.
         */

        explanationBox.style.display =
            "block";


        explanationBox.hidden =
            false;


        /*
         * Make sure both explanation sections
         * are visible.
         */

        englishSectionVisible(
            explanationBox,
            englishText
        );


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
            150
        );

    }


    // =================================================
    // ENSURE EXPLANATION IS VISIBLE
    // =================================================

    function englishSectionVisible(
        explanationBox,
        englishText
    ) {

        /*
         * Do not hide explanation even if one
         * language is empty.
         */

        explanationBox.style.visibility =
            "visible";


        explanationBox.style.opacity =
            "1";


        const sections =
            explanationBox.querySelectorAll(
                ".explanationSection"
            );


        sections.forEach(
            section => {

                section.style.visibility =
                    "visible";

                section.style.opacity =
                    "1";

            }
        );


        /*
         * If English explanation is missing,
         * still keep the explanation card visible.
         */

        if (
            !englishText
        ) {

            console.warn(
                "English explanation is empty for this question."
            );

        }

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


        /*
         * Make sure Next is usable.
         */

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
        // SCORE PERCENTAGE
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


        // =============================================
        // REVIEW BUTTON
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
            "Wrong:",
            wrongAnswers
        );


        console.log(
            "Percentage:",
            percentage + "%"
        );

    }


    // =================================================
    // REVIEW / RESTART
    // =================================================

    reviewQuizBtn.addEventListener(
        "click",
        () => {

            // =========================================
            // REMOVE SAVED PROGRESS
            // =========================================

            try {

                localStorage.removeItem(
                    getProgressStorageKey()
                );

            }

            catch (error) {

                console.error(
                    "Unable to reset progress:",
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
            // RESET WRONG
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
            // ENABLE BUTTONS
            // =========================================

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                false;


            // =========================================
            // RESTORE NEXT
            // =========================================

            nextBtn.innerHTML = `
                <span>Next</span>
                <span class="navArrow">→</span>
            `;


            // =========================================
            // LOAD FIRST PAGE
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
