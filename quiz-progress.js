/*
=========================================================
 UNIQUE ACADEMIC
 QUIZ PROGRESS CIRCLE
=========================================================

 RULES:

 0 answered
     → WHITE / GRAY

 Correct > Wrong
     → GREEN

 Wrong > Correct
     → RED

 Correct === Wrong
     → YELLOW

 The ring percentage is based on:

     correct / total × 100

 The percentage number stays inside
 the circle.

=========================================================
*/

(function () {

    "use strict";


    // =================================================
    // FIND ALL QUIZ CARDS
    // =================================================

    const quizCards =
        document.querySelectorAll(
            ".quiz-card"
        );


    if (
        !quizCards.length
    ) {

        return;

    }


    // =================================================
    // NORMALIZE SUBJECT
    // =================================================

    function normalizeSubject(
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
            )
            .replace(
                /\/+/g,
                "-"
            );

    }


    // =================================================
    // GET PROGRESS STORAGE KEY
    // =================================================

    function getStorageKey(
        subject,
        chapter
    ) {

        return (
            "uniqueAcademicQuizProgress_" +
            normalizeSubject(subject) +
            "_" +
            String(chapter || "").trim()
        );

    }


    // =================================================
    // READ SAVED PROGRESS
    // =================================================

    function getSavedProgress(
        subject,
        chapter
    ) {

        const storageKey =
            getStorageKey(
                subject,
                chapter
            );


        try {

            const saved =
                localStorage.getItem(
                    storageKey
                );


            if (
                !saved
            ) {

                return null;

            }


            const data =
                JSON.parse(
                    saved
                );


            if (
                !data ||
                typeof data !== "object"
            ) {

                return null;

            }


            return data;

        }

        catch (error) {

            console.error(
                "Unable to read quiz progress:",
                error
            );


            return null;

        }

    }


    // =================================================
    // UPDATE ONE PROGRESS CIRCLE
    // =================================================

    function updateProgressCircle(
        progressElement,
        data
    ) {

        if (
            !progressElement
        ) {

            return;

        }


        // =============================================
        // REMOVE OLD STATE CLASSES
        // =============================================

        progressElement.classList.remove(
            "progress-empty",
            "progress-good",
            "progress-bad",
            "progress-equal"
        );


        // =============================================
        // NO ANSWERS YET
        // =============================================

        if (
            !data ||
            typeof data.correct !== "number" ||
            typeof data.wrong !== "number" ||
            typeof data.total !== "number" ||
            data.correct < 0 ||
            data.wrong < 0 ||
            data.total <= 0 ||
            data.correct + data.wrong === 0
        ) {

            progressElement.textContent =
                "0%";


            progressElement.style.setProperty(
                "--progress-percent",
                "0%"
            );


            progressElement.classList.add(
                "progress-empty"
            );


            return;

        }


        // =============================================
        // SAFE VALUES
        // =============================================

        const correct =
            Math.max(
                0,
                Number(data.correct)
            );


        const wrong =
            Math.max(
                0,
                Number(data.wrong)
            );


        const total =
            Math.max(
                1,
                Number(data.total)
            );


        // =============================================
        // CALCULATE PERCENTAGE
        // =============================================

        const percentage =
            Math.max(
                0,
                Math.min(
                    100,
                    Math.round(
                        (
                            correct /
                            total
                        ) * 100
                    )
                )
            );


        // =============================================
        // DISPLAY PERCENTAGE
        // =============================================

        progressElement.textContent =
            `${percentage}%`;


        // =============================================
        // SET RING LENGTH
        // =============================================

        progressElement.style.setProperty(
            "--progress-percent",
            `${percentage}%`
        );


        // =============================================
        // COLOR RULE
        // =============================================

        if (
            correct > wrong
        ) {

            // GREEN
            progressElement.classList.add(
                "progress-good"
            );

        }

        else if (
            wrong > correct
        ) {

            // RED
            progressElement.classList.add(
                "progress-bad"
            );

        }

        else {

            // YELLOW
            progressElement.classList.add(
                "progress-equal"
            );

        }

    }


    // =================================================
    // UPDATE ALL QUIZ CARDS
    // =================================================

    function updateAllQuizProgress() {

        quizCards.forEach(
            card => {

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


                // =====================================
                // READ URL
                // =====================================

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
                    url.searchParams.get(
                        "subject"
                    );


                const chapter =
                    url.searchParams.get(
                        "chapter"
                    );


                if (
                    !subject ||
                    !chapter
                ) {

                    return;

                }


                // =====================================
                // GET SAVED DATA
                // =====================================

                const savedProgress =
                    getSavedProgress(
                        subject,
                        chapter
                    );


                // =====================================
                // UPDATE CIRCLE
                // =====================================

                updateProgressCircle(
                    progress,
                    savedProgress
                );

            }
        );

    }


    // =================================================
    // INITIAL UPDATE
    // =================================================

    updateAllQuizProgress();


    // =================================================
    // LISTEN FOR LOCAL STORAGE CHANGES
    // =================================================

    window.addEventListener(
        "storage",
        () => {

            updateAllQuizProgress();

        }
    );


    // =================================================
    // LISTEN FOR QUIZ PROGRESS UPDATES
    // =================================================

    window.addEventListener(
        "uniqueAcademicQuizProgressUpdated",
        () => {

            updateAllQuizProgress();

        }
    );


    // =================================================
    // ALSO CHECK WHEN PAGE BECOMES VISIBLE
    // =================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                updateAllQuizProgress();

            }

        }
    );


    // =================================================
    // EXPOSE UPDATE FUNCTION
    // =================================================

    window.updateAllQuizProgress =
        updateAllQuizProgress;


})();
