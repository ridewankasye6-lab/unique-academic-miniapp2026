// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// =====================================================
// 5 QUESTIONS PER PAGE
//
// ANSWER BEHAVIOR:
// • Wrong answer → selected option = RED + ❌
// • Try another option → previous RED + ❌ disappears
// • New wrong option → RED + ❌
// • Correct answer → selected option = GREEN + ✅
// • Correct question becomes locked
// • Explanation appears after correct answer
// • Wrong answers do NOT reveal the correct answer
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
    // ANSWER STATES
    // =================================================
    //
    // null
    //     = not answered correctly yet
    //
    // number
    //     = current selected wrong answer
    //
    // -1
    //     = correctly answered
    //
    // =================================================

    let userAnswers = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ANSWER ATTEMPTS
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

        "🌱 Keep trying! You are learning! 💪",

        "🔍 Not quite right. Try another answer! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Don't give up! Try again! 🧗‍♂️",

        "📖 Review the question carefully and try again! ✍️",

        "💡 Every attempt makes you stronger! 🧠",

        "🤝 Not this one. Choose another answer! 🎯",

        "🧐 Take another look and keep learning! 🔍"

    ];


    // =================================================
    // ADD QUIZ FEEDBACK STYLES
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
                        translateY(10px)
                        scale(0.94);

                }

                60% {

                    opacity: 1;

                    transform:
                        translateY(-2px)
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
               OPTION ICON
            ========================================= */

            .unique-option-icon {

                width: 38px;

                height: 38px;

                min-width: 38px;

                border-radius: 50%;

                display: inline-flex;

                align-items: center;

                justify-content: center;

                margin-left: 12px;

                font-size: 23px;

                font-weight: 900;

                line-height: 1;

                box-sizing: border-box;

                animation:
                    uniqueIconPop
                    0.3s
                    ease
                    both;

            }


            .unique-option-icon.wrong-icon {

                background:
                    #e74c3c;

                color:
                    #ffffff;

                box-shadow:
                    0 5px 12px
                    rgba(
                        231,
                        76,
                        60,
                        0.28
                    );

            }


            .unique-option-icon.correct-icon {

                background:
                    #2bb673;

                color:
                    #ffffff;

                box-shadow:
                    0 5px 12px
                    rgba(
                        43,
                        182,
                        115,
                        0.28
                    );

            }


            @keyframes uniqueIconPop {

                0% {

                    opacity: 0;

                    transform:
                        scale(0.65);

                }

                70% {

                    transform:
                        scale(1.12);

                }

                100% {

                    opacity: 1;

                    transform:
                        scale(1);

                }

            }


            /* =========================================
               WRONG OPTION
            ========================================= */

            .optionBtn.unique-current-wrong {

                color:
                    #b23b3b !important;

                border-color:
                    #dc5555 !important;

                background:
                    #fff1f1 !important;

            }


            /* =========================================
               CORRECT OPTION
            ========================================= */

            .optionBtn.unique-current-correct {

                color:
                    #258a45 !important;

                border-color:
                    #36b56b !important;

                background:
                    #edf9f1 !important;

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


                .unique-option-icon {

                    width: 34px;

                    height: 34px;

                    min-width: 34px;

                    font-size: 20px;

                    margin-left: 8px;

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


        return messages[randomIndex];

    }


    // =================================================
    // CREATE FEEDBACK BOX
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
    // SAVE CHAPTER PROGRESS
    // =================================================

    function saveChapterProgress() {

        const totalQuestions =
            questions.length;


        /*
         * A question counts as answered only
         * after the student gets it correct.
         */

        const answeredQuestions =
            userAnswers.filter(
                answer =>
                    answer === -1
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
             * Search all keys.
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
         * Exact chapter.
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
         * Numeric chapter.
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
    // INITIALIZE ANSWER STATES
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
    // REMOVE ALL OPTION FEEDBACK
    // =================================================
    //
    // IMPORTANT:
    //
    // This function removes the previous
    // RED + ❌ before another option is selected.
    //
    // =================================================

    function clearOptionFeedback(
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


                button.classList.remove(
                    "correct"
                );


                button.classList.remove(
                    "unique-current-wrong"
                );


                button.classList.remove(
                    "unique-current-correct"
                );


                /*
                 * Remove ONLY our icon.
                 */

                const icon =
                    button.querySelector(
                        ".unique-option-icon"
                    );


                if (
                    icon
                ) {

                    icon.remove();

                }

            }
        );

    }


    // =================================================
    // ADD OPTION ICON
    // =================================================

    function addOptionIcon(
        button,
        iconType
    ) {

        /*
         * Make sure there is never
         * more than one icon.
         */

        const oldIcon =
            button.querySelector(
                ".unique-option-icon"
            );


        if (
            oldIcon
        ) {

            oldIcon.remove();

        }


        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "unique-option-icon";


        if (
            iconType === "correct"
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
                "×";

        }


        button.appendChild(
            icon
        );

    }


    // =================================================
    // CREATE / UPDATE FEEDBACK
    // =================================================

    function showFeedback(
        questionCard,
        isCorrect
    ) {

        let feedbackBox =
            questionCard.querySelector(
                ".unique-answer-feedback"
            );


        /*
         * Remove previous feedback first.
         *
         * This guarantees:
         *
         * ❌ old message disappears
         * ❌ old red feedback disappears
         *
         * before the new answer feedback appears.
         */

        if (
            feedbackBox
        ) {

            feedbackBox.remove();

        }


        feedbackBox =
            createAnswerFeedback(

                isCorrect,

                getRandomMessage(
                    isCorrect
                        ? correctMessages
                        : incorrectMessages
                )

            );


        const explanationBox =
            questionCard.querySelector(
                ".explanationCard"
            );


        if (
            explanationBox
        ) {

            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );

        }

        else {

            questionCard.appendChild(
                feedbackBox
            );

        }


        return feedbackBox;

    }


    // =================================================
    // SHOW EXPLANATION
    // =================================================

    function showExplanation(
        q,
        explanationBox,
        englishExplanation,
        amharicExplanation
    ) {

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
    // HIDE EXPLANATION
    // =================================================

    function hideExplanation(
        explanationBox
    ) {

        explanationBox.style.display =
            "none";

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
        // RESTORE CURRENT ANSWER STATE
        // =============================================

        const savedState =
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


                /*
                 * Put the option text inside
                 * a separate span.
                 */

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


                // =========================================
                // RESTORE CORRECT ANSWER
                // =========================================

                if (
                    savedState === -1
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


                        button.classList.add(
                            "unique-current-correct"
                        );


                        addOptionIcon(
                            button,
                            "correct"
                        );

                    }


                    /*
                     * Correctly answered questions
                     * are locked.
                     */

                    button.disabled =
                        true;


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
                    typeof savedState ===
                    "number"
                ) {

                    /*
                     * Only the latest wrong answer
                     * is shown red.
                     */

                    if (
                        optionIndex ===
                        savedState
                    ) {

                        button.classList.add(
                            "wrong"
                        );


                        button.classList.add(
                            "unique-current-wrong"
                        );


                        addOptionIcon(
                            button,
                            "wrong"
                        );

                    }

                    /*
                     * IMPORTANT:
                     *
                     * All options remain clickable
                     * while the answer is still wrong.
                     */

                    button.disabled =
                        false;


                    hideExplanation(
                        explanationBox
                    );

                }


                // =========================================
                // OPTION CLICK
                // =========================================

                button.addEventListener(
                    "click",
                    () => {

                        /*
                         * If question is already
                         * correctly answered,
                         * do nothing.
                         */

                        if (
                            userAnswers[index] ===
                            -1
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


        /*
         * If there is an active wrong answer,
         * show the motivational feedback.
         */

        if (
            typeof savedState ===
            "number" &&
            savedState !== -1
        ) {

            showFeedback(
                questionCard,
                false
            );

        }


        /*
         * If correctly answered,
         * show correct motivational feedback.
         */

        if (
            savedState === -1
        ) {

            showFeedback(
                questionCard,
                true
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
         * If already correct,
         * don't allow another click.
         */

        if (
            userAnswers[questionIndex] ===
            -1
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
        // IMPORTANT:
        //
        // REMOVE PREVIOUS WRONG ANSWER
        // =============================================

        clearOptionFeedback(
            options
        );


        /*
         * Hide old explanation while
         * the student is still trying.
         */

        hideExplanation(
            explanationBox
        );


        // =============================================
        // CHECK RESULT
        // =============================================

        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =============================================
        // CORRECT ANSWER
        // =============================================

        if (
            isCorrect
        ) {

            /*
             * Mark question as correctly answered.
             */

            userAnswers[questionIndex] =
                -1;


            /*
             * Increase score ONLY ONCE.
             */

            score++;


            /*
             * Selected answer becomes green.
             */

            const selectedButton =
                buttons[selectedIndex];


            if (
                selectedButton
            ) {

                selectedButton.classList.add(
                    "correct"
                );


                selectedButton.classList.add(
                    "unique-current-correct"
                );


                addOptionIcon(
                    selectedButton,
                    "correct"
                );

            }


            /*
             * Disable ALL options because
             * the question is now complete.
             */

            buttons.forEach(
                button => {

                    button.disabled =
                        true;

                }
            );


            /*
             * Remove any old feedback.
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
             * Show correct feedback.
             */

            const feedbackBox =
                showFeedback(
                    questionCard,
                    true
                );


            /*
             * Show explanation.
             */

            showExplanation(

                q,

                explanationBox,

                englishExplanation,

                amharicExplanation

            );


            /*
             * Save progress.
             */

            saveChapterProgress();


            /*
             * Scroll to feedback.
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

        }


        // =============================================
        // WRONG ANSWER
        // =============================================

        else {

            /*
             * IMPORTANT:
             *
             * Save ONLY the latest wrong choice.
             *
             * This means:
             *
             * A ❌
             *
             * then B clicked:
             *
             * A normal
             * B ❌
             *
             * then C clicked:
             *
             * A normal
             * B normal
             * C ❌
             */

            userAnswers[questionIndex] =
                selectedIndex;


            /*
             * Count wrong attempts.
             */

            wrongAnswers++;


            /*
             * Make sure every option
             * is available for another try.
             */

            buttons.forEach(
                button => {

                    button.disabled =
                        false;

                }
            );


            /*
             * Selected wrong answer.
             */

            const selectedButton =
                buttons[selectedIndex];


            if (
                selectedButton
            ) {

                selectedButton.classList.add(
                    "wrong"
                );


                selectedButton.classList.add(
                    "unique-current-wrong"
                );


                /*
                 * Add ❌ only to the
                 * currently selected wrong answer.
                 */

                addOptionIcon(
                    selectedButton,
                    "wrong"
                );

            }


            /*
             * Show WRONG motivational message.
             *
             * Previous message is automatically
             * removed by showFeedback().
             */

            const feedbackBox =
                showFeedback(
                    questionCard,
                    false
                );


            /*
             * Explanation stays hidden
             * until the correct answer.
             */

            hideExplanation(
                explanationBox
            );


            /*
             * Save progress.
             */

            saveChapterProgress();


            /*
             * Scroll to feedback.
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

        }

    }


    // =================================================
    // CHECK IF CURRENT PAGE IS COMPLETED
    // =================================================

    function isCurrentPageCompleted() {

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

            /*
             * Every question on this page
             * must be correctly answered.
             */

            if (
                userAnswers[index] !==
                -1
            ) {

                return false;

            }

        }


        return true;

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


        /*
         * IMPORTANT:
         *
         * Student can move forward only
         * after all questions on the current
         * page have been answered correctly.
         */

        nextBtn.disabled =
            !isCurrentPageCompleted();

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


            /*
             * Don't allow next until
             * current page is completed.
             */

            if (
                !isCurrentPageCompleted()
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
         * all questions must be correct.
         */

        if (
            userAnswers.some(
                answer =>
                    answer !== -1
            )
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
        // PERCENTAGE
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
            // RESET ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // QUIZ ACTIVE
            // =========================================

            quizFinished =
                false;


            // =========================================
            // RESET PROGRESS
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
            // PREVIOUS DISABLED
            // =========================================

            previousQuestionBtn.disabled =
                true;


            // =========================================
            // NEXT DISABLED
            //
            // It becomes enabled after all
            // 5 questions are correct.
            // =========================================

            nextBtn.disabled =
                true;


            // =========================================
            // RESTORE NEXT TEXT
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

            /*
             * Prefer browser history.
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
