// =====================================================
// UNIQUE ACADEMIC
// QUIZ PROGRESS COLOR SYSTEM
//
// BLUE   = Not answered yet
// GREEN  = More correct than wrong
// RED    = More wrong than correct
// YELLOW = Correct and wrong are equal
// =====================================================

(function () {

    "use strict";


    // =================================================
    // NORMALIZE SUBJECT
    // =================================================

    function normalizeSubject(value) {

        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/_/g, "-")
            .replace(/\s+/g, "-");

    }


    // =================================================
    // UPDATE ONE QUIZ CARD
    // =================================================

    function updateProgressUI(element, data) {

        if (!element) {
            return;
        }


        // -------------------------------------------------
        // Remove all previous progress colors
        // -------------------------------------------------

        element.classList.remove(
            "progress-good",
            "progress-bad",
            "progress-equal",
            "progress-empty"
        );


        // -------------------------------------------------
        // Safety check
        // -------------------------------------------------

        if (
            !data ||
            typeof data.correct !== "number" ||
            typeof data.wrong !== "number" ||
            typeof data.total !== "number" ||
            data.total <= 0
        ) {

            element.textContent = "0%";

            element.classList.add(
                "progress-empty"
            );

            return;

        }


        const correct =
            Math.max(
                0,
                data.correct
            );


        const wrong =
            Math.max(
                0,
                data.wrong
            );


        const total =
            Math.max(
                0,
                data.total
            );


        // -------------------------------------------------
        // Calculate percentage
        //
        // Percentage is ALWAYS based on correct answers.
        // -------------------------------------------------

        const percentage =
            Math.round(
                (correct / total) * 100
            );


        // -------------------------------------------------
        // Show percentage
        // -------------------------------------------------

        element.textContent =
            `${percentage}%`;


        // -------------------------------------------------
        // BLUE
        //
        // Nothing answered yet.
        // -------------------------------------------------

        if (
            correct === 0 &&
            wrong === 0
        ) {

            element.classList.add(
                "progress-empty"
            );

            return;

        }


        // -------------------------------------------------
        // GREEN
        //
        // Correct answers are more than wrong answers.
        // -------------------------------------------------

        if (
            correct > wrong
        ) {

            element.classList.add(
                "progress-good"
            );

            return;

        }


        // -------------------------------------------------
        // RED
        //
        // Wrong answers are more than correct answers.
        // -------------------------------------------------

        if (
            wrong > correct
        ) {

            element.classList.add(
                "progress-bad"
            );

            return;

        }


        // -------------------------------------------------
        // YELLOW
        //
        // Correct and wrong are equal.
        // -------------------------------------------------

        if (
            correct === wrong
        ) {

            element.classList.add(
                "progress-equal"
            );

        }

    }


    // =================================================
    // UPDATE ALL QUIZ CARDS
    // =================================================

    function updateAllQuizProgress() {

        const quizCards =
            document.querySelectorAll(
                ".quiz-card"
            );


        if (
            !quizCards.length
        ) {

            return;

        }


        quizCards.forEach(
            card => {

                const quizLink =
                    card.querySelector(
                        ".quiz-arrow"
                    );


                const progressElement =
                    card.querySelector(
                        ".quiz-progress"
                    );


                if (
                    !quizLink ||
                    !progressElement
                ) {

                    return;

                }


                // -----------------------------------------
                // Read quiz URL
                // -----------------------------------------

                let url;

                try {

                    url =
                        new URL(
                            quizLink.href,
                            window.location.href
                        );

                }

                catch (error) {

                    return;

                }


                const subject =
                    normalizeSubject(
                        url.searchParams.get(
                            "subject"
                        )
                    );


                const chapter =
                    String(
                        url.searchParams.get(
                            "chapter"
                        ) || ""
                    ).trim();


                if (
                    !subject ||
                    !chapter
                ) {

                    return;

                }


                // -----------------------------------------
                // SAME KEY USED BY quiz.js
                // -----------------------------------------

                const storageKey =
                    `uniqueAcademicQuizProgress_${subject}_${chapter}`;


                let savedProgress =
                    null;


                try {

                    const saved =
                        localStorage.getItem(
                            storageKey
                        );


                    if (
                        saved
                    ) {

                        savedProgress =
                            JSON.parse(
                                saved
                            );

                    }

                }

                catch (error) {

                    console.error(
                        "Unable to read quiz progress:",
                        error
                    );

                }


                // -----------------------------------------
                // Update card
                // -----------------------------------------

                updateProgressUI(
                    progressElement,
                    savedProgress
                );

            }
        );

    }


    // =================================================
    // RUN AFTER PAGE LOAD
    // =================================================

    function start() {

        updateAllQuizProgress();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start
        );

    }

    else {

        start();

    }


    // =================================================
    // UPDATE WHEN PAGE BECOMES VISIBLE AGAIN
    //
    // Useful when returning from quiz.html.
    // =================================================

    window.addEventListener(
        "pageshow",
        updateAllQuizProgress
    );


    // =================================================
    // UPDATE WHEN STORAGE CHANGES
    // =================================================

    window.addEventListener(
        "storage",
        updateAllQuizProgress
    );


    // =================================================
    // OPTIONAL PUBLIC FUNCTION
    // =================================================

    window.updateQuizProgress =
        updateAllQuizProgress;


})();
