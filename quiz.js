// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// + MULTIPLE ATTEMPTS
// + WRONG ANSWER ❌
// + CORRECT ANSWER ✅
// + MOTIVATIONAL FEEDBACK
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
    // USER ANSWERS
    //
    // null   = not correctly answered yet
    // number = correct answer index
    // =================================================

    let userAnswers = [];


    // =================================================
    // WRONG ATTEMPTS
    //
    // IMPORTANT:
    //
    // Only the MOST RECENT wrong choice is stored.
    //
    // Example:
    //
    // Student taps A → A ❌
    // Student taps B → A becomes NORMAL, B ❌
    // Student taps C → B becomes NORMAL, C ❌
    //
    // This prevents old ❌ marks from remaining.
    // =================================================

    let wrongAttempts = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;


    // =================================================
    // WRONG ANSWERS
    //
    // Counts every wrong attempt.
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

    "🎊 Great! You did it right! ✅",

    "🎯 Brilliant! Your answer is absolutely correct! 🏆",

    "💎 Excellent thinking! You really understand this! 🌟",

    "🥇 Another victory! Keep up the amazing work! 🔥",

    "🧠 Sharp mind! You chose the right answer! 🎯",

    "👏 Fantastic choice! Your knowledge is shining! ✨",

    "🚀 Yes! You are moving closer to mastery! 💪",

    "🌟 Outstanding answer! Keep believing in yourself! 💎",

    "👏 በጣም ጥሩ! በርታ! 💪",

    "🎉 እንኳን ደስ አለህ! በትክክል ነው! ✅",

    "🔥 አሪፍ! እንደዚህ ቀጥል! 🚀"

];


const incorrectMessages = [

    "🌱 Keep trying! You are learning! 💪",

    "🔍 Not quite! Try another answer! 🔄",

    "🧩 Mistakes are part of learning! Keep going! 🌟",

    "🎈 Don't give up! Try again! 🧗‍♂️",

    "📖 Review what you know and try another choice! ✍️",

    "💡 Every attempt makes you stronger! 🧠",

    "🤝 Keep learning and try another answer! 🎯",

    "🧐 Take another look and try again! 🔍",

    "🌱 No worries! Learn from this attempt and try again! 💪",

    "🔄 Almost there! Think carefully and choose again! 🧠",

    "💡 Great learners make mistakes! Keep going! 🌟",

    "🎯 Don't worry about the mistake! Focus and try again! 💪",

    "🔥 Stay strong! Every wrong answer teaches you something new! 🧠",

    "🧐 Think again! You still have another chance! 🔄",

    "🌈 Keep your confidence! The next attempt could be the one! 🚀",

    "💪 ምንም አይደለም! እንደገና ሞክር! 🔄",

    "🌱 ተስፋ አትቁረጥ! በርታ! 💪",

    "🧠 ደግመህ አስብና ሞክር! ትችላለህ! 🎯"

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

            .optionBtn {

    position: relative;

    display: flex;

    align-items: center;

}


            .unique-answer-icon {

                width: 38px;

                height: 38px;

                min-width: 38px;

                border-radius: 50%;

                display: inline-flex;

                align-items: center;

                justify-content: center;

                font-size: 24px;

                font-weight: 900;

                line-height: 1;

                margin-left: auto;

                flex-shrink: 0;

                animation:
                    uniqueIconPop
                    0.35s
                    ease-out
                    both;

            }


            .unique-answer-icon.wrong-icon {

                background: #e34b50;

                color: white;

                box-shadow:
                    0 5px 12px
                    rgba(
                        220,
                        60,
                        60,
                        0.22
                    );

            }


            .unique-answer-icon.correct-icon {

                background: #2fb66d;

                color: white;

                box-shadow:
                    0 5px 12px
                    rgba(
                        40,
                        180,
                        100,
                        0.22
                    );

            }


            .optionBtn.wrong {

                color: #b43e43 !important;

                border-color: #d95357 !important;

                background:
                    #fff1f2 !important;

            }


            .optionBtn.correct {

                color: #278b4d !important;

                border-color: #38ad6c !important;

                background:
                    #edf9f1 !important;

            }


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


            @keyframes uniqueIconPop {

                0% {

                    opacity: 0;

                    transform:
                        scale(0.5);

                }

                70% {

                    opacity: 1;

                    transform:
                        scale(1.15);

                }

                100% {

                    opacity: 1;

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


                .unique-answer-icon {

                    width: 36px;

                    height: 36px;

                    min-width: 36px;

                    font-size: 22px;

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
    // PREPARE WRONG ATTEMPTS
    //
    // Each question starts with NO current
    // wrong selection.
    // =================================================

    wrongAttempts =
        new Array(
            questions.length
        );


    for (
        let i = 0;
        i < questions.length;
        i++
    ) {

        wrongAttempts[i] = [];

    }


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
    // QUESTION PAGE COMPLETION CHECK
    // =================================================

    function isCurrentPageComplete() {

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

            if (
                userAnswers[index] ===
                null
            ) {

                return false;

            }

        }


        return true;

    }


    // =================================================
    // ADD ANSWER ICON
    // =================================================

    function addAnswerIcon(
        button,
        isCorrect
    ) {

        const oldIcon =
            button.querySelector(
                ".unique-answer-icon"
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
            "unique-answer-icon";


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
                "×";

        }


        button.appendChild(
            icon
        );

    }


    // =================================================
    // RESET CURRENT QUESTION FEEDBACK
    //
    // THIS IS THE IMPORTANT FIX.
    //
    // Whenever another answer is selected:
    //
    // • Remove old ❌
    // • Remove old green/red styling
    // • Remove old motivational message
    // • Make previous options normal again
    // • Allow them to be selected again
    //
    // This means ONLY the latest selected answer
    // receives feedback.
    // =================================================

    function resetQuestionFeedback(
        questionIndex,
        options,
        questionCard,
        explanationBox
    ) {

        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        buttons.forEach(
            button => {

                // Remove previous styling
                button.classList.remove(
                    "wrong"
                );


                button.classList.remove(
                    "correct"
                );


                // Remove previous ❌ / ✅
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
                 * IMPORTANT:
                 *
                 * Re-enable every option.
                 *
                 * This allows the student to
                 * change from A → B → C → D.
                 */

                button.disabled =
                    false;

            }
        );


        /*
         * Remove previous motivational
         * message.
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


        /*
         * Clear the stored current wrong
         * selection.
         */

        wrongAttempts[questionIndex] = [];


        /*
         * Explanation must remain hidden
         * until the correct answer is found.
         */

        if (
            userAnswers[questionIndex] ===
            null
        ) {

            explanationBox.style.display =
                "none";

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


                const optionText =
                    document.createElement(
                        "span"
                    );


                optionText.textContent =
                    option;


                button.appendChild(
                    optionText
                );


                // =====================================
                // RESTORE CURRENT WRONG ANSWER
                //
                // Only ONE wrong answer can be
                // restored.
                // =====================================

                if (
                    wrongAttempts[index]
                        .includes(
                            optionIndex
                        )
                ) {

                    button.classList.add(
                        "wrong"
                    );


                    button.disabled =
                        true;


                    addAnswerIcon(
                        button,
                        false
                    );

                }


                // =====================================
                // RESTORE CORRECT ANSWER
                // =====================================

                if (
                    userAnswers[index] !==
                    null &&
                    userAnswers[index] ===
                    optionIndex
                ) {

                    button.classList.add(
                        "correct"
                    );


                    button.disabled =
                        true;


                    addAnswerIcon(
                        button,
                        true
                    );

                }


                // =====================================
                // CLICK
                // =====================================

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
        // ADD CARD ELEMENTS
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
        // IF ALREADY CORRECT
        // =============================================

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
         * If already correctly answered,
         * do nothing.
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


        const selectedButton =
            buttons[selectedIndex];


        /*
         * =================================================
         * IMPORTANT FIX
         * =================================================
         *
         * Before processing the NEW choice:
         *
         * 1. Remove old ❌
         * 2. Remove old motivational message
         * 3. Return old option to normal
         * 4. Re-enable all other choices
         *
         * Therefore:
         *
         * A ❌ → choose B
         *
         * A becomes normal automatically.
         * =================================================
         */

        resetQuestionFeedback(
            questionIndex,
            options,
            questionCard,
            explanationBox
        );


        // =============================================
        // CORRECT ANSWER
        // =============================================

        if (
            selectedIndex ===
            correctAnswer
        ) {

            /*
             * Save correct answer.
             */

            userAnswers[questionIndex] =
                selectedIndex;


            /*
             * Increase score only once.
             */

            score++;


            /*
             * Mark selected answer green.
             */

            selectedButton.classList.add(
                "correct"
            );


            selectedButton.disabled =
                true;


            /*
             * Add ✅ only to the selected
             * correct answer.
             */

            addAnswerIcon(
                selectedButton,
                true
            );


            /*
             * Disable all other options
             * because this question is complete.
             */

            buttons.forEach(
                (
                    button,
                    buttonIndex
                ) => {

                    if (
                        buttonIndex !==
                        selectedIndex
                    ) {

                        button.disabled =
                            true;

                    }

                }
            );


            // =========================================
            // CLEAR WRONG ATTEMPT
            // =========================================

            wrongAttempts[questionIndex] =
                [];


            // =========================================
            // SAVE PROGRESS
            // =========================================

            saveChapterProgress();


            // =========================================
            // MOTIVATIONAL MESSAGE
            // =========================================

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


            // =========================================
            // SHOW EXPLANATION ONLY NOW
            // =========================================

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


            // =========================================
            // SCROLL TO FEEDBACK
            // =========================================

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


            /*
             * Update navigation.
             */

            updateNavigation();


            return;

        }


        // =============================================
        // WRONG ANSWER
        // =============================================

        /*
         * IMPORTANT:
         *
         * DO NOT use:
         *
         * wrongAttempts[questionIndex].push(...)
         *
         * because that would remember old wrong
         * choices and keep their ❌ marks.
         *
         * Instead, replace the previous wrong
         * choice with ONLY the current one.
         */

        wrongAttempts[questionIndex] = [
            selectedIndex
        ];


        /*
         * Count this wrong attempt.
         */

        wrongAnswers++;


        /*
         * Mark ONLY the current selected
         * answer red.
         */

        selectedButton.classList.add(
            "wrong"
        );


        selectedButton.disabled =
            true;


        /*
         * Add ❌ ONLY to the current
         * selected answer.
         */

        addAnswerIcon(
            selectedButton,
            false
        );


        /*
         * All other choices remain normal
         * and selectable.
         */


        // =========================================
        // WRONG MOTIVATIONAL MESSAGE
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


        /*
         * Make absolutely sure that there
         * is only ONE feedback box.
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


        /*
         * Explanation stays hidden until
         * the correct answer is selected.
         */

        explanationBox.style.display =
            "none";


        /*
         * Save progress.
         */

        saveChapterProgress();


        /*
         * Scroll to the current feedback.
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
         * Next button available only when
         * every question on current page
         * is correctly answered.
         */

        nextBtn.disabled =
            !isCurrentPageComplete();

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


            if (
                !isCurrentPageComplete()
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

        if (
            quizFinished
        ) {

            return;

        }


        const allQuestionsComplete =
            userAnswers.every(
                answer =>
                    answer !== null
            );


        if (
            !allQuestionsComplete
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

            /*
             * Remove saved progress.
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
            // RESET WRONG ATTEMPT ARRAYS
            // =========================================

            wrongAttempts =
                new Array(
                    questions.length
                );


            for (
                let i = 0;
                i < questions.length;
                i++
            ) {

                wrongAttempts[i] = [];

            }


            // =========================================
            // SAVE RESET STATE
            // =========================================

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
            // RESET BUTTONS
            // =========================================

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                true;


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
