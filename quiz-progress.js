// =====================================================
// UNIQUE ACADEMIC
// QUIZ PROGRESS SYSTEM
// =====================================================
// COLOR RULES:
//
// 0 answered              → WHITE
// correct > wrong        → GREEN
// wrong > correct        → RED
// correct === wrong      → YELLOW
//
// The percentage shown is:
// correct answers / total questions
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
    // UPDATE ONE PROGRESS CIRCLE
    // =================================================

    function updateProgressUI(element, data) {

        if (!element) {
            return;
        }


        // Remove old color classes first

        element.classList.remove(
            "progress-good",
            "progress-bad",
            "progress-equal",
            "progress-empty"
        );


        // ---------------------------------------------
        // SAFETY CHECK
        // ---------------------------------------------

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
                1,
                data.total
            );


        const answered =
            correct + wrong;


        // ---------------------------------------------
        // PERCENTAGE
        // ---------------------------------------------

        const percentage =
            Math.round(
                (correct / total) * 100
            );


        element.textContent =
            `${percentage}%`;


        // ---------------------------------------------
        // NOTHING ANSWERED
        // ---------------------------------------------

        if (answered === 0) {

            element.classList.add(
                "progress-empty"
            );

            return;

        }


        // ---------------------------------------------
        // MORE CORRECT → GREEN
        // ---------------------------------------------

        if (correct > wrong) {

            element.classList.add(
                "progress-good"
            );

            return;

        }


        // ---------------------------------------------
        // MORE WRONG → RED
        // ---------------------------------------------

        if (wrong > correct) {

            element.classList.add(
                "progress-bad"
            );

            return;

        }


        // ---------------------------------------------
        // EQUAL → YELLOW
        // ---------------------------------------------

        element.classList.add(
            "progress-equal"
        );

    }


    // =================================================
    // UPDATE ALL QUIZ CARDS
    // =================================================

    function updateAllQuizProgress() {

        const quizCards =
            document.querySelectorAll(
                ".quiz-card"
            );


        if (!quizCards.length) {

            return;

        }


        quizCards.forEach(
            (card) => {

                const quizLink =
                    card.querySelector(
                        ".quiz-arrow"
                    );


                const progress =
                    card.querySelector(
                        ".quiz-progress"
                    );


                if (
                    !quizLink ||
                    !progress
                ) {

                    return;

                }


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


                const storageKey =
                    `uniqueAcademicQuizProgress_${subject}_${chapter}`;


                let savedProgress =
                    null;


                try {

                    const saved =
                        localStorage.getItem(
                            storageKey
                        );


                    if (saved) {

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


                updateProgressUI(
                    progress,
                    savedProgress
                );

            }
        );

    }


    // =================================================
    // UPDATE WHEN PAGE IS READY
    // =================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            updateAllQuizProgress
        );

    }

    else {

        updateAllQuizProgress();

    }


    // =================================================
    // UPDATE WHEN STORAGE CHANGES
    // =================================================

    window.addEventListener(
        "storage",
        updateAllQuizProgress
    );


    // =================================================
    // UPDATE WHEN QUIZ SAVES PROGRESS
    // =================================================

    window.addEventListener(
        "quizProgressUpdated",
        updateAllQuizProgress
    );


    // =================================================
    // UPDATE WHEN PAGE BECOMES VISIBLE
    // =================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden
            ) {

                updateAllQuizProgress();

            }

        }
    );


})();
