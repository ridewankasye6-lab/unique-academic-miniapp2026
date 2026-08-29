// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// =====================================================
// FEATURES
// -----------------------------------------------------
// • 5 QUESTIONS PER PAGE
// • RETRY WRONG ANSWERS
// • ONLY CURRENT WRONG ANSWER = RED + ❌
// • PREVIOUS WRONG ANSWER IS AUTOMATICALLY CLEARED
// • CORRECT ANSWER = GREEN + ✅
// • MOTIVATIONAL FEEDBACK
// • ENGLISH + AMHARIC EXPLANATIONS
// • NEXT / PREVIOUS NAVIGATION
// • PROGRESS SAVING
// • REVIEW / RESTART QUIZ
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
    // null  = not correctly answered
    // number = correctly selected answer index
    //
    // IMPORTANT:
    // Wrong answers are NOT permanently stored here.
    // This allows the student to keep trying.
    // =================================================

    let userAnswers = [];


    // =================================================
    // TEMPORARY WRONG ANSWER
    //
    // Stores the currently selected wrong option
    // for each question.
    //
    // This is only visual feedback.
    // It is cleared when another option is selected.
    // =================================================

    let temporaryWrongAnswers = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ATTEMPTS
    //
    // Counts wrong attempts, not permanently wrong
    // questions.
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

        "🔍 This response is not right. Please try another answer! 🔄",

        "🧩 Mistakes are part of learning! Keep trying! 🌟",

        "🎈 Keep your chin up! Every mistake is a step toward mastery! 🧗‍♂️",

        "📖 This answer is incorrect. Take another look! ✍️",

        "💡 Each attempt strengthens your understanding! 🧠",

        "🤝 Not the right answer. Keep trying! 🎯",

        "🧐 You are close! Take another look! 🔍"

    ];


    // =================================================
    // ADD QUIZ FEEDBACK STYLES
    // =================================================

    function addFeedbackStyles() {

        if (
            document.getElementById(
                "uniqueAcademicQuizAnswerStyles"
            )
        ) {

            return;

        }


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "uniqueAcademicQuizAnswerStyles";


        style.textContent = `

            /* =========================================
               OPTION BUTTON
            ========================================= */

            .optionBtn {

                position: relative;

                display: flex;

                align-items: center;

                justify-content: space-between;

                gap: 15px;

            }


            /* =========================================
               ANSWER TEXT
            ========================================= */

            .optionText {

                flex: 1;

                text-align: left;

            }


            /* =========================================
               ANSWER ICON
            ========================================= */

            .answerIcon {

                width: 42px;

                min-width: 42px;

                height: 42px;

                border-radius: 50%;

                display: inline-flex;

                align-items: center;

                justify-content: center;

                font-size: 25px;

                font-weight: 900;

                line-height: 1;

                color: #ffffff;

                box-shadow:
                    0 5px 15px
                    rgba(
                        0,
                        0,
                        0,
                        0.15
                    );

                animation:
                    uniqueAnswerIconPop
                    0.35s
                    ease-out;

            }


            /* =========================================
               WRONG ICON
            ========================================= */

            .answerIcon.wrongIcon {

                background:
                    #e74c3c;

            }


            /* =========================================
               CORRECT ICON
            ========================================= */

            .answerIcon.correctIcon {

                background:
                    #2fb86a;

            }


            /* =========================================
               WRONG ANSWER
            ========================================= */

            .optionBtn.wrong {

                background:
                    #fff1f1 !important;

                border-color:
                    #e05252 !important;

                color:
                    #ad4141 !important;

                box-shadow:
                    0 5px 18px
                    rgba(
                        224,
                        82,
                        82,
                        0.12
                    );

            }


            /* =========================================
               CORRECT ANSWER
            ========================================= */

            .optionBtn.correct {

                background:
                    #eefaf2 !important;

                border-color:
                    #3ab56c !important;

                color:
                    #2c8650 !important;

                box-shadow:
                    0 6px 20px
                    rgba(
                        58,
                        181,
                        108,
                        0.18
                    );

            }


            /* =========================================
               FEEDBACK BOX
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

                animation:
                    uniqueFeedbackPop
                    0.45s
                    ease-out;

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
                    #2b8750;

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
                        0.10
                    );

            }


            /* =========================================
               WRONG FEEDBACK
            ========================================= */

            .unique-answer-feedback.incorrect-feedback {

                background:
                    linear-gradient(
                        135deg,
                        #fff4f4,
                        #fffafa
                    );

                color:
                    #d04444;

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
                        0.08
                    );

            }


            /* =========================================
               ICON ANIMATION
            ========================================= */

            @keyframes uniqueAnswerIconPop {

                0% {

                    opacity:
                        0;

                    transform:
                        scale(0.55);

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
               FEEDBACK ANIMATION
            ========================================= */

            @keyframes uniqueFeedbackPop {

                0% {

                    opacity:
                        0;

                    transform:
                        translateY(10px)
                        scale(0.96);

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

                .answerIcon {

                    width:
                        38px;

                    min-width:
                        38px;

                    height:
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


    addFeedbackStyles();


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
    // CREATE ANSWER ICON
    // =================================================

    function createAnswerIcon(
        type
    ) {

        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "answerIcon";


        if (
            type === "correct"
        ) {

            icon.classList.add(
                "correctIcon"
            );


            icon.textContent =
                "✓";

        }

        else {

            icon.classList.add(
                "wrongIcon"
            );


            icon.textContent =
                "✕";

        }


        return icon;

    }


    // =================================================
    // CREATE FEEDBACK
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
    // DISPLAY SUBJECT / CHAPTER
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


        return (
            `uniqueAcademicQuizProgress_` +
            `${normalizedSubject}_` +
            `${normalizedChapter}`
        );

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


        // =============================================
        // EXACT CHAPTER
        // =============================================

        if (
            subjectData[chapter]
        ) {

            return Array.isArray(
                subjectData[chapter]
            )
                ? subjectData[chapter]
                : [];

        }


        // =============================================
        // NUMERIC CHAPTER
        // =============================================

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
    // INITIALIZE ANSWER ARRAYS
    // =================================================

    userAnswers =
        new Array(
            questions.length
        ).fill(
            null
        );


    temporaryWrongAnswers =
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
    // AMHARIC EXPLANATION
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
        // FEEDBACK HOLDER
        // =============================================

        let feedbackBox =
            null;


        // =============================================
        // EXPLANATION
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


                // =========================================
                // OPTION TEXT
                // =========================================

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


                // =========================================
                // RESTORE CORRECT ANSWER
                // =========================================

                if (
                    userAnswers[index] !==
                    null
                ) {

                    const correctAnswer =
                        getCorrectAnswer(
                            q
                        );


                    if (
                        optionIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );


                        button.appendChild(
                            createAnswerIcon(
                                "correct"
                            )
                        );


                        button.disabled =
                            true;

                    }

                    else {

                        button.disabled =
                            true;

                    }


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
                // RESTORE CURRENT WRONG ANSWER
                // =========================================

                else if (
                    temporaryWrongAnswers[index] ===
                    optionIndex
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    button.appendChild(
                        createAnswerIcon(
                            "wrong"
                        )
                    );

                }


                // =========================================
                // CLICK ANSWER
                // =========================================

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            quizFinished
                        ) {

                            return;

                        }


                        // ---------------------------------
                        // Already correctly answered
                        // ---------------------------------

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
        // ADD CARD CONTENT
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
    // CLEAR ALL WRONG VISUALS
    //
    // This is the IMPORTANT part.
    //
    // Whenever the student selects another answer,
    // the previous red answer and ❌ disappear.
    // =================================================

    function clearWrongVisuals(
        options
    ) {

        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        buttons.forEach(
            button => {

                button.classList.remove(
                    "wrong"
                );


                const wrongIcon =
                    button.querySelector(
                        ".wrongIcon"
                    );


                if (
                    wrongIcon
                ) {

                    wrongIcon.remove();

                }

            }
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


        const correctAnswer =
            getCorrectAnswer(
                q
            );


        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =================================================
        // VERY IMPORTANT:
        //
        // Remove the previous wrong answer FIRST.
        //
        // This prevents:
        //
        // A ❌
        // B ❌
        //
        // Instead we get:
        //
        // B ❌
        //
        // only.
        // =================================================

        clearWrongVisuals(
            options
        );


        // =================================================
        // CORRECT ANSWER
        // =================================================

        if (
            isCorrect
        ) {

            // ---------------------------------------------
            // Save correct answer
            // ---------------------------------------------

            userAnswers[questionIndex] =
                selectedIndex;


            temporaryWrongAnswers[
                questionIndex
            ] = null;


            // ---------------------------------------------
            // Increase score ONLY ONCE
            // ---------------------------------------------

            score++;


            // ---------------------------------------------
            // Remove any previous feedback
            // ---------------------------------------------

            const oldFeedback =
                questionCard.querySelector(
                    ".unique-answer-feedback"
                );


            if (
                oldFeedback
            ) {

                oldFeedback.remove();

            }


            // ---------------------------------------------
            // Mark ONLY correct answer
            // ---------------------------------------------

            buttons.forEach(
                (
                    button,
                    buttonIndex
                ) => {

                    button.disabled =
                        true;


                    if (
                        buttonIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );


                        // Remove old icon first

                        const oldIcon =
                            button.querySelector(
                                ".answerIcon"
                            );


                        if (
                            oldIcon
                        ) {

                            oldIcon.remove();

                        }


                        button.appendChild(
                            createAnswerIcon(
                                "correct"
                            )
                        );

                    }

                }
            );


            // ---------------------------------------------
            // Correct motivational message
            // ---------------------------------------------

            feedbackBox =
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


            // ---------------------------------------------
            // Show explanations
            // ---------------------------------------------

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


            // ---------------------------------------------
            // SAVE PROGRESS
            // ---------------------------------------------

            saveChapterProgress();


            // ---------------------------------------------
            // Scroll feedback into view
            // ---------------------------------------------

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


            return;

        }


        // =================================================
        // WRONG ANSWER
        // =================================================

        wrongAnswers++;


        // ---------------------------------------------
        // Store ONLY temporary wrong answer
        // ---------------------------------------------

        temporaryWrongAnswers[
            questionIndex
        ] = selectedIndex;


        // ---------------------------------------------
        // Mark ONLY selected option wrong
        // ---------------------------------------------

        buttons.forEach(
            (
                button,
                buttonIndex
            ) => {

                // Make sure no answer is locked

                button.disabled =
                    false;


                // Remove old styles/icons

                button.classList.remove(
                    "wrong",
                    "correct"
                );


                const oldIcon =
                    button.querySelector(
                        ".answerIcon"
                    );


                if (
                    oldIcon
                ) {

                    oldIcon.remove();

                }


                // -----------------------------------------
                // ONLY CURRENT SELECTED ANSWER
                // -----------------------------------------

                if (
                    buttonIndex ===
                    selectedIndex
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    button.appendChild(
                        createAnswerIcon(
                            "wrong"
                        )
                    );

                }

            }
        );


        // ---------------------------------------------
        // Remove old feedback
        // ---------------------------------------------

        const oldFeedback =
            questionCard.querySelector(
                ".unique-answer-feedback"
            );


        if (
            oldFeedback
        ) {

            oldFeedback.remove();

        }


        // ---------------------------------------------
        // Create new wrong feedback
        // ---------------------------------------------

        feedbackBox =
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


        // ---------------------------------------------
        // Keep explanation available
        // ---------------------------------------------

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


        // ---------------------------------------------
        // SAVE WRONG ATTEMPT
        // ---------------------------------------------

        saveChapterProgress();


        // ---------------------------------------------
        // Scroll feedback
        // ---------------------------------------------

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


        // =============================================
        // MAKE SURE NEXT IS ENABLED
        // =============================================

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


            // =========================================
            // MOVE TO NEXT PAGE
            // =========================================

            if (
                currentPage <
                totalPages - 1
            ) {

                currentPage++;

                loadPage();

                return;

            }


            // =========================================
            // LAST PAGE
            // =========================================

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


        // =============================================
        // CHECK IF ALL QUESTIONS ARE CORRECTLY ANSWERED
        // =============================================

        const unansweredQuestions =
            userAnswers.filter(
                answer =>
                    answer === null
            ).length;


        if (
            unansweredQuestions > 0
        ) {

            alert(
                `Please answer all questions correctly before finishing the quiz.\n\nRemaining questions: ${unansweredQuestions}`
            );


            return;

        }


        // =============================================
        // FINISH
        // =============================================

        quizFinished =
            true;


        // =============================================
        // CLEAR QUESTIONS
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
        // CALCULATE SCORE
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
            // RESET STORAGE
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
            // RESET WRONG ATTEMPTS
            // =========================================

            wrongAnswers =
                0;


            // =========================================
            // RESET CORRECT ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // RESET TEMPORARY WRONG ANSWERS
            // =========================================

            temporaryWrongAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // RESET QUIZ STATE
            // =========================================

            quizFinished =
                false;


            // =========================================
            // SAVE RESET PROGRESS
            // =========================================

            saveChapterProgress();


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
            // RESET NAVIGATION
            // =========================================

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                false;


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
