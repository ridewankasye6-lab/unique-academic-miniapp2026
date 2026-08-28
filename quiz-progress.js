// =====================================================
// UNIQUE ACADEMIC
// AUTOMATIC CHAPTER QUIZ PROGRESS
// =====================================================

(function () {

    "use strict";


    // =================================================
    // FIND ALL QUIZ CARDS
    // =================================================

    const quizCards =
        document.querySelectorAll(
            ".quiz-card"
        );


    if (!quizCards.length) {

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
            );

    }


    // =================================================
    // UPDATE EACH CHAPTER
    // =================================================

    quizCards.forEach(
        (
            card
        ) => {

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


            // =============================================
            // READ QUIZ URL
            // =============================================

            const url =
                new URL(
                    quizLink.href,
                    window.location.href
                );


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


            // =============================================
            // STORAGE KEY
            // =============================================

            const storageKey =
                `uniqueAcademicQuizProgress_${subject}_${chapter}`;


            // =============================================
            // GET SAVED DATA
            // =============================================

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


            // =============================================
            // NO ANSWERS YET
            // KEEP ORIGINAL BLUE
            // =============================================

            if (
                !savedProgress ||
                typeof savedProgress.percentage !==
                "number"
            ) {

                progress.textContent =
                    "0%";

                progress.classList.remove(
                    "progress-good",
                    "progress-bad"
                );

                return;

            }


            // =============================================
            // GET PERCENTAGE
            // =============================================

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round(
                            savedProgress.percentage
                        )
                    )
                );


            // =============================================
            // DISPLAY PERCENTAGE
            // =============================================

            progress.textContent =
                `${percentage}%`;


            // =============================================
            // REMOVE OLD STATUS
            // =============================================

            progress.classList.remove(
                "progress-good",
                "progress-bad"
            );


            // =============================================
            // COLOR STATUS
            //
            // 50% or higher = GREEN
            // Below 50% = RED
            // =============================================

            if (
                percentage >= 50
            ) {

                progress.classList.add(
                    "progress-good"
                );

            }

            else {

                progress.classList.add(
                    "progress-bad"
                );

            }

        }
    );

})();
