// =====================================================
// UNIQUE ACADEMIC QUIZ ENGINE
// 5 QUESTIONS PER PAGE
// =====================================================


// =====================================================
// WAIT UNTIL PAGE IS READY
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
    // Stores the selected answer for each question.
    // This allows answers to remain selected when
    // moving between pages.
    // =================================================

    let userAnswers = [];


    // =================================================
    // SCORE
    // =================================================

    let score = 0;
let wrongAnswers = 0;
        // =================================================
    // SAVE CHAPTER PROGRESS
    // =================================================

    function getProgressStorageKey() {

        const normalizedSubject =
            normalizeSubjectKey(subject);

        const normalizedChapter =
            String(chapter || "")
                .trim();

        return `uniqueAcademicQuizProgress_${normalizedSubject}_${normalizedChapter}`;

    }
    
function saveChapterProgress() {

    const percentage =
        questions.length > 0
            ? Math.round(
                (
                    score /
                    questions.length
                ) * 100
            )
            : 0;


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
            questions.length,

        percentage:
            percentage,

        completed:
            userAnswers.every(
                answer =>
                    answer !== null
            ),

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

    }

    catch (error) {

        console.error(
            "Unable to save quiz progress:",
            error
        );

    }

}

    


    // =================================================
    // QUIZ FINISHED
    // =================================================

    let quizFinished = false;


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
    // FIND SUBJECT DATA
    // =================================================

    function findSubjectData() {

        /*
         * First try the exact URL subject.
         */

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
         * Your existing quiz data uses:
         *
         * answer: 0
         * answer: 1
         * answer: 2
         * etc.
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
         * Never load another page after the quiz
         * has been completed.
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
                 * when moving between pages.
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


                    if (
                        optionIndex ===
                        correctAnswer
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }


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
                            amharicExplanation
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
        amharicExplanation
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


        const buttons =
            options.querySelectorAll(
                ".optionBtn"
            );


        const correctAnswer =
            getCorrectAnswer(
                q
            );


        /*
         * Count the answer once.
         */

        if (
    selectedIndex ===
    correctAnswer
) {

    score++;

}

else {

    wrongAnswers++;

}
        
        // Save updated chapter progress
        saveChapterProgress();

        buttons.forEach(
            (
                button,
                index
            ) => {

                button.disabled =
                    true;


                /*
                 * Always show correct answer.
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


        /*
         * Show explanations.
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
         * Create professional score display.
         *
         * Example:
         *
         * 45 / 60
         *
         * 75%
         */

        const percentage =
            questions.length > 0
                ? Math.round(
                    (
                        score /
                        questions.length
                    ) *
                    100
                )
                : 0;

        // Save final chapter progress
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
         * Scroll completion message
         * into view.
         */

        completionMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
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
            "Percentage:",
            percentage + "%"
        );

    }


    // =================================================
    // REVIEW QUIZ
    // =================================================
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

    reviewQuizBtn.addEventListener(
        "click",
        () => {

            /*
             * Reset page.
             */

            currentPage =
                0;


            /*
             * Reset score.
             */

            score =
                0;


            /*
             * Reset all answers.
             */

            userAnswers =
                new Array(
                    questions.length
                ).fill(
                    null
                );


            /*
             * Mark quiz as active again.
             */

            quizFinished =
                false;


            /*
             * Hide completion message.
             */

            completionMessage.hidden =
                true;


            /*
             * Show navigation again.
             */

            previousQuestionBtn.style.display =
                "inline-flex";


            nextBtn.style.display =
                "inline-flex";


            /*
             * Enable buttons.
             */

            previousQuestionBtn.disabled =
                true;


            nextBtn.disabled =
                false;


            /*
             * Restore Next button.
             */

            nextBtn.innerHTML = `
                <span>Next</span>
                <span class="navArrow">→</span>
            `;


            /*
             * Load Question 1–5.
             */

            loadPage();


            /*
             * Scroll to top.
             */

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            console.log(
                "Quiz review started from Question 1."
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
