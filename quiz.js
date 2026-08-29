// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + RETRY WRONG ANSWERS
// + ONLY CURRENT WRONG ANSWER SHOWS ❌
// + CORRECT ANSWER SHOWS ✅
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
    // null = question not correctly answered
    // number = correct answer selected
    //
    // IMPORTANT:
    // Wrong answers are NOT permanently stored here.
    // =================================================

    let userAnswers = [];


    // =================================================
    // CURRENT WRONG OPTION
    //
    // This stores only the latest wrong option.
    //
    // Example:
    //
    // Tap A wrong  -> A ❌
    // Tap B wrong  -> A resets, B ❌
    // Tap C wrong  -> B resets, C ❌
    // =================================================

    let currentWrongAnswers = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ATTEMPTS
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

        "🌱 Keep trying! You can get it! 💪",

        "🔍 Not quite! Try another answer! 🔄",

        "🧩 Mistakes are part of learning! Keep going! 🌟",

        "🎈 Don't give up! Try again! 🧗‍♂️",

        "📖 Review it carefully and try another choice! ✍️",

        "💡 Keep thinking! You are learning! 🧠",

        "🤝 Not this one! Try another answer! 🎯",

        "🧐 Take another look and keep learning! 🔍"

    ];


    // =================================================
    // ADD FEEDBACK CSS
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
               MOTIVATIONAL ANSWER FEEDBACK
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
                    ease
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
               FEEDBACK ANIMATION
            ========================================= */

            @keyframes uniqueFeedbackPop {

                0% {

                    opacity: 0;

                    transform:
                        translateY(10px)
                        scale(0.95);

                }

                60% {

                    opacity: 1;

                    transform:
                        translateY(-2px)
                        scale(1.01);

                }

                100% {

                    opacity: 1;

                    transform:
                        translateY(0)
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


    currentWrongAnswers =
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
        // RESTORE CORRECT ANSWER
        // =============================================

        const alreadyCorrect =
            userAnswers[index] !==
            null;


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
                // QUESTION ALREADY CORRECT
                // =========================================

                if (
                    alreadyCorrect
                ) {

                    button.disabled =
                        true;


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
                // RESTORE ONLY LATEST WRONG ANSWER
                // =========================================

                else if (
                    currentWrongAnswers[index] ===
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
        // ADD MAIN ELEMENTS
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


        // =============================================
        // EXISTING FEEDBACK
        // =============================================

        /*
         * If the question is already correctly
         * answered, show correct feedback.
         *
         * Wrong feedback is intentionally not
         * permanently stored.
         */

        if (
            alreadyCorrect
        ) {

            const feedbackBox =
                createAnswerFeedback(
                    true,
                    getRandomMessage(
                        correctMessages
                    )
                );


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


        const isCorrect =
            selectedIndex ===
            correctAnswer;


        // =============================================
        // IMPORTANT FIX
        //
        // REMOVE OLD WRONG STATE FIRST
        //
        // This makes:
        //
        // A ❌
        //
        // then B is tapped:
        //
        // A normal
        // B ❌
        //
        // then C:
        //
        // A normal
        // B normal
        // C ❌
        // =============================================

        buttons.forEach(
            button => {

                button.classList.remove(
                    "wrong"
                );

                button.classList.remove(
                    "correct"
                );

                /*
                 * Make sure every option becomes
                 * clickable again after a wrong
                 * attempt.
                 */

                button.disabled =
                    false;

            }
        );


        // =============================================
        // REMOVE OLD MOTIVATIONAL MESSAGE
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
        // WRONG ANSWER
        // =============================================

        if (
            !isCorrect
        ) {

            /*
             * Count this as a wrong attempt.
             */

            wrongAnswers++;


            /*
             * IMPORTANT:
             *
             * Do NOT put the wrong answer
             * into userAnswers.
             *
             * The student must be allowed
             * to try another answer.
             */

            userAnswers[questionIndex] =
                null;


            /*
             * Remember ONLY the latest wrong
             * option.
             */

            currentWrongAnswers[questionIndex] =
                selectedIndex;


            /*
             * Show ❌ / red ONLY on the
             * currently selected wrong option.
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
             * Create ONE wrong feedback.
             */

            const feedbackBox =
                createAnswerFeedback(
                    false,
                    getRandomMessage(
                        incorrectMessages
                    )
                );


            /*
             * Put it after the options.
             */

            questionCard.insertBefore(
                feedbackBox,
                explanationBox
            );


            /*
             * Keep explanation available,
             * but do not permanently lock it.
             */

            englishExplanation.textContent =
                getEnglishExplanation(
                    q
                );


            amharicExplanation.textContent =
                getAmharicExplanation(
                    q
                );


            /*
             * You can keep the explanation
             * visible after a wrong attempt.
             */

            explanationBox.style.display =
                "block";


            /*
             * Save progress.
             *
             * The question is NOT counted
             * as answered because it is still
             * being attempted.
             */

            saveChapterProgress();


            /*
             * Scroll to the feedback.
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


            return;

        }


        // =============================================
        // CORRECT ANSWER
        // =============================================

        /*
         * Now the question is officially
         * answered.
         */

        userAnswers[questionIndex] =
            selectedIndex;


        /*
         * Clear any previous wrong option.
         */

        currentWrongAnswers[questionIndex] =
            null;


        /*
         * Increase score ONLY ONCE.
         */

        score++;


        // =============================================
        // SHOW ANSWERS
        // =============================================

        buttons.forEach(
            (
                button,
                index
            ) => {

                button.disabled =
                    true;


                /*
                 * Remove all previous states.
                 */

                button.classList.remove(
                    "wrong"
                );

                button.classList.remove(
                    "correct"
                );


                /*
                 * ONLY correct answer gets
                 * green + check.
                 */

                if (
                    index ===
                    correctAnswer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );


        // =============================================
        // CREATE CORRECT FEEDBACK
        // =============================================

        const correctFeedback =
            createAnswerFeedback(
                true,
                getRandomMessage(
                    correctMessages
                )
            );


        /*
         * Add the correct feedback.
         */

        questionCard.insertBefore(
            correctFeedback,
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
        // SCROLL TO FEEDBACK
        // =============================================

        setTimeout(
            () => {

                try {

                    correctFeedback.scrollIntoView({

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


        questionsPage.innerHTML =
            "";


        previousQuestionBtn.style.display =
            "none";


        nextBtn.style.display =
            "none";


        completionMessage.hidden =
            false;


        const percentage =
            questions.length > 0
                ? Math.round(
                    (
                        score /
                        questions.length
                    ) * 100
                )
                : 0;


        saveChapterProgress();


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


        reviewQuizBtn.style.display =
            "inline-flex";


        reviewQuizBtn.disabled =
            false;


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
            // RESET CURRENT WRONG OPTIONS
            // =========================================

            currentWrongAnswers =
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
            // LOAD QUESTIONS
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
