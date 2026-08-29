// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + RETRYABLE ANSWER FEEDBACK
// + WRONG ANSWER CAN BE CHANGED
// + CORRECT ANSWER LOCKS QUESTION
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
    // userAnswers:
    // Stores the student's CURRENT selection.
    //
    // null = nothing selected
    //
    // IMPORTANT:
    // A wrong answer is NOT final.
    // The student can choose another option.
    // =================================================

    let userAnswers = [];


    // =================================================
    // SOLVED STATE
    //
    // true = student has finally selected
    //        the correct answer.
    //
    // false = question is still retryable.
    // =================================================

    let solvedAnswers = [];


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

        "🌱 Keep trying! You can find the correct answer! 💪",

        "🔍 Not this one. Try another choice! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Don't give up! Try another answer! 🧗‍♂️",

        "📖 Review the question carefully and try again! ✍️",

        "💡 Every attempt strengthens your understanding! 🧠",

        "🤝 Not the right answer yet. Keep trying! 🎯",

        "🧐 Take another look and choose again! 🔍"

    ];


    // =================================================
    // ADD ANSWER FEEDBACK CSS
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


            .unique-feedback-text {

                display: block;

                width: 100%;

            }


            /* =========================================
               FEEDBACK POP
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
               WRONG ANSWER SHAKE
            ========================================= */

            .optionBtn.wrong {

                animation:
                    uniqueWrongShake
                    0.35s
                    ease;

            }


            @keyframes uniqueWrongShake {

                0%,
                100% {

                    transform:
                        translateX(0);

                }

                25% {

                    transform:
                        translateX(-5px);

                }

                50% {

                    transform:
                        translateX(5px);

                }

                75% {

                    transform:
                        translateX(-3px);

                }

            }


            /* =========================================
               CORRECT ANSWER POP
            ========================================= */

            .optionBtn.correct {

                animation:
                    uniqueCorrectPop
                    0.4s
                    ease;

            }


            @keyframes uniqueCorrectPop {

                0% {

                    transform:
                        scale(1);

                }

                50% {

                    transform:
                        scale(1.03);

                }

                100% {

                    transform:
                        scale(1);

                }

            }


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
    // GET CURRENT FEEDBACK
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


        /*
         * A question is considered answered only
         * after the student finds the correct answer.
         */

        const answeredQuestions =
            solvedAnswers.filter(
                solved =>
                    solved === true
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


    solvedAnswers =
        new Array(
            questions.length
        ).fill(
            false
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
    // REMOVE OLD FEEDBACK
    // =================================================

    function removeFeedback(
        questionCard
    ) {

        const oldFeedback =
            questionCard.querySelector(
                ".unique-answer-feedback"
            );


        if (
            oldFeedback
        ) {

            oldFeedback.remove();

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
        // EXPLANATION BOX
        // =============================================

        const explanationBox =
            document.createElement(
                "section"
            );


        explanationBox.className =
            "explanationCard";


        /*
         * Explanation is hidden until the correct
         * answer is found.
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
                // RESTORE STATE
                // =========================================

                const currentAnswer =
                    userAnswers[index];


                const isSolved =
                    solvedAnswers[index] ===
                    true;


                const correctAnswer =
                    getCorrectAnswer(
                        q
                    );


                /*
                 * If already solved:
                 *
                 * Correct answer = green.
                 *
                 * All options = disabled.
                 */

                if (
                    isSolved
                ) {

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


                /*
                 * If not solved but there is a
                 * current wrong answer, restore
                 * ONLY that current wrong answer.
                 */

                else if (
                    currentAnswer !==
                    null &&
                    currentAnswer !==
                    undefined &&
                    currentAnswer ===
                    optionIndex
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }


                // =========================================
                // OPTION CLICK
                // =========================================

                button.addEventListener(
                    "click",
                    () => {

                        /*
                         * Once solved, no more attempts.
                         */

                        if (
                            solvedAnswers[index]
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
            solvedAnswers[questionIndex]
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


        // =============================================
        // IMPORTANT:
        // REMOVE OLD WRONG ANSWER
        // =============================================

        buttons.forEach(
            button => {

                button.classList.remove(
                    "wrong"
                );

            }
        );


        // =============================================
        // SAVE CURRENT SELECTION
        // =============================================

        userAnswers[questionIndex] =
            selectedIndex;


        // =============================================
        // WRONG ANSWER
        // =============================================

        if (
            !isCorrect
        ) {

            /*
             * The question is STILL NOT solved.
             *
             * The student can immediately choose
             * another option.
             */

            solvedAnswers[questionIndex] =
                false;


            /*
             * Count wrong attempts.
             */

            wrongAnswers++;


            /*
             * Highlight ONLY the newly selected
             * wrong answer.
             */

            const selectedButton =
                buttons[selectedIndex];


            if (
                selectedButton
            ) {

                selectedButton.classList.add(
                    "wrong"
                );

            }


            /*
             * Make sure every option remains
             * clickable.
             */

            buttons.forEach(
                button => {

                    button.disabled =
                        false;

                }
            );


            /*
             * Remove any previous feedback.
             */

            removeFeedback(
                questionCard
            );


            /*
             * Create new wrong feedback.
             */

            const feedbackBox =
                createAnswerFeedback(
                    false,
                    getRandomMessage(
                        incorrectMessages
                    )
                );


            /*
             * Put feedback after options.
             */

            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );


            /*
             * KEEP EXPLANATION HIDDEN.
             *
             * This is important because the student
             * should keep trying until they find
             * the correct answer.
             */

            explanationBox.style.display =
                "none";


            englishExplanation.textContent =
                "";


            amharicExplanation.textContent =
                "";


            /*
             * Save progress.
             */

            saveChapterProgress();


            /*
             * Small feedback scroll.
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


            console.log(
                "Wrong answer. Student can try again."
            );


            return;

        }


        // =============================================
        // CORRECT ANSWER
        // =============================================

        /*
         * The student has finally found the answer.
         */

        solvedAnswers[questionIndex] =
            true;


        /*
         * Count the question as correct
         * exactly once.
         */

        score++;


        /*
         * Remove any previous wrong styling.
         */

        buttons.forEach(
            button => {

                button.classList.remove(
                    "wrong"
                );

            }
        );


        /*
         * Disable all options after the
         * correct answer.
         */

        buttons.forEach(
            button => {

                button.disabled =
                    true;

            }
        );


        /*
         * Highlight the correct answer.
         */

        const correctButton =
            buttons[correctAnswer];


        if (
            correctButton
        ) {

            correctButton.classList.add(
                "correct"
            );

        }


        /*
         * Make sure the selected correct answer
         * is also stored.
         */

        userAnswers[questionIndex] =
            selectedIndex;


        // =============================================
        // REMOVE OLD FEEDBACK
        // =============================================

        removeFeedback(
            questionCard
        );


        // =============================================
        // SHOW CORRECT FEEDBACK
        // =============================================

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
        // SAVE PROGRESS
        // =============================================

        saveChapterProgress();


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


        console.log(
            "Correct answer!"
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
         * Make sure Review button is available.
         */

        reviewQuizBtn.style.display =
            "inline-flex";


        reviewQuizBtn.disabled =
            false;


        /*
         * Scroll completion message.
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

            // =========================================
            // RESET SAVED CHAPTER PROGRESS
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
            // RESET CURRENT ANSWERS
            // =========================================

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            // =========================================
            // RESET SOLVED STATE
            // =========================================

            solvedAnswers =
                new Array(
                    questions.length
                ).fill(
                    false
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
