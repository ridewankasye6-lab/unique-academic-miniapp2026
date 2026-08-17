// =====================================================
// UNIQUE ACADEMIC — MAIN JAVASCRIPT
// Version 2.2.0
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    // =================================================
    // ELEMENTS
    // =================================================

    const searchInput =
        document.getElementById("search");

    const modeBtn =
        document.getElementById("modeBtn");


    // =================================================
    // THEME
    // =================================================

    function getSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "uniqueAcademicSettings"
                );

            if (!saved) {
                return {};
            }

            const settings =
                JSON.parse(saved);

            return (
                settings &&
                typeof settings === "object"
            )
                ? settings
                : {};

        } catch (error) {

            console.error(
                "Unable to read settings:",
                error
            );

            return {};

        }

    }


    function saveSettings(settings) {

        try {

            localStorage.setItem(
                "uniqueAcademicSettings",
                JSON.stringify(settings)
            );

        } catch (error) {

            console.error(
                "Unable to save settings:",
                error
            );

        }

    }


    function applyTheme() {

        const settings =
            getSettings();

        const darkMode =
            settings.darkMode === true;


        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );


        if (modeBtn) {

            modeBtn.textContent =
                darkMode
                    ? "☀️ Light Mode"
                    : "🌙 Dark Mode";

        }

    }


    function toggleTheme() {

        const settings =
            getSettings();


        settings.darkMode =
            settings.darkMode !== true;


        saveSettings(settings);

        applyTheme();

    }


    applyTheme();


    if (modeBtn) {

        modeBtn.addEventListener(
            "click",
            toggleTheme
        );

    }


    // =================================================
    // IMPORTANT
    // =================================================
    //
    // MENU CODE IS INTENTIONALLY NOT HERE.
    //
    // index.html already contains the complete menu
    // controller for:
    //
    // #menuBtn
    // #sideMenu
    // #menuOverlay
    // refreshBtn
    // shareAppBtn
    // logoutBtn
    //
    // Keeping a second menu controller here would
    // cause the menu button to open and close twice.
    //
    // =================================================


    // =================================================
    // SEARCH SUBJECTS
    // =================================================

    function searchSubjects() {

        if (!searchInput) {
            return;
        }


        const query =
            searchInput.value
                .trim()
                .toLowerCase();


        const subjectCards =
            document.querySelectorAll(
                ".subjectCard"
            );


        subjectCards.forEach(
            function (card) {

                const subject =
                    (
                        card.dataset.subject ||
                        card.textContent ||
                        ""
                    )
                    .toLowerCase();


                card.style.display =
                    subject.includes(query)
                        ? ""
                        : "none";

            }
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            searchSubjects
        );

    }


    // =================================================
    // BOOKMARK SYSTEM
    // =================================================
    //
    // This system uses the same storage used by the
    // current index.html bookmark system.
    //
    // =================================================

    const bookmarkButtons =
        document.querySelectorAll(
            ".bookmarkBtn"
        );


    let bookmarks = [];


    try {

        bookmarks =
            JSON.parse(
                localStorage.getItem(
                    "uniqueAcademicBookmarks"
                )
            ) || [];


        if (!Array.isArray(bookmarks)) {

            bookmarks = [];

        }

    } catch (error) {

        bookmarks = [];

    }


    function updateBookmarkButtons() {

        bookmarkButtons.forEach(
            function (button) {

                const subject =
                    button.dataset.subject;


                if (!subject) {
                    return;
                }


                const isBookmarked =
                    bookmarks.includes(
                        subject
                    );


                if (isBookmarked) {

                    button.textContent =
                        "★ Bookmarked";

                    button.classList.add(
                        "bookmarked"
                    );

                } else {

                    button.textContent =
                        "⭐ Bookmark";

                    button.classList.remove(
                        "bookmarked"
                    );

                }

            }
        );

    }


    bookmarkButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const subject =
                        button.dataset.subject;


                    if (!subject) {
                        return;
                    }


                    const index =
                        bookmarks.indexOf(
                            subject
                        );


                    if (index === -1) {

                        bookmarks.push(
                            subject
                        );

                    } else {

                        bookmarks.splice(
                            index,
                            1
                        );

                    }


                    try {

                        localStorage.setItem(
                            "uniqueAcademicBookmarks",
                            JSON.stringify(
                                bookmarks
                            )
                        );

                    } catch (error) {

                        console.error(
                            "Unable to save bookmark:",
                            error
                        );

                    }


                    updateBookmarkButtons();

                }
            );

        }
    );


    updateBookmarkButtons();


    // =================================================
    // CONTINUE LEARNING
    // =================================================

    const openButtons =
        document.querySelectorAll(
            ".subjectCard .button"
        );


    openButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const card =
                        button.closest(
                            ".subjectCard"
                        );


                    if (!card) {
                        return;
                    }


                    const subject =
                        card.dataset.subject;


                    if (!subject) {
                        return;
                    }


                    try {

                        localStorage.setItem(
                            "lastOpenedSubject",
                            subject
                        );


                        localStorage.setItem(
                            "lastOpenedSubjectUrl",
                            button.href
                        );


                        // Keep compatibility with
                        // the older storage keys.

                        localStorage.setItem(
                            "lastSubject",
                            subject
                        );


                        localStorage.setItem(
                            "lastLink",
                            button.href
                        );

                    } catch (error) {

                        console.error(
                            "Unable to save learning progress:",
                            error
                        );

                    }

                }
            );

        }
    );


    const continueText =
        document.getElementById(
            "continueText"
        );

    const continueBtn =
        document.getElementById(
            "continueBtn"
        );


    const savedSubject =
        localStorage.getItem(
            "lastOpenedSubject"
        ) ||
        localStorage.getItem(
            "lastSubject"
        );


    const savedSubjectUrl =
        localStorage.getItem(
            "lastOpenedSubjectUrl"
        ) ||
        localStorage.getItem(
            "lastLink"
        );


    if (
        savedSubject &&
        savedSubjectUrl
    ) {

        if (continueText) {

            continueText.textContent =
                "Continue studying " +
                savedSubject +
                ".";

        }


        if (continueBtn) {

            continueBtn.textContent =
                "Continue Learning";

            continueBtn.href =
                savedSubjectUrl;

        }

    }


    // =================================================
    // MANUAL PROGRESS BARS
    // =================================================

    const progressBars =
        document.querySelectorAll(
            ".progressBar"
        );


    const progressTexts =
        document.querySelectorAll(
            ".progressText"
        );


    progressBars.forEach(
        function (bar, index) {

            const key =
                "progress_" + index;


            const saved =
                localStorage.getItem(key);


            if (saved !== null) {

                bar.value =
                    saved;


                if (progressTexts[index]) {

                    progressTexts[index].textContent =
                        saved + "%";

                }

            }


            bar.addEventListener(
                "input",
                function () {

                    const value =
                        bar.value;


                    if (progressTexts[index]) {

                        progressTexts[index].textContent =
                            value + "%";

                    }


                    localStorage.setItem(
                        key,
                        value
                    );

                }
            );

        }
    );


    // =================================================
    // CHAPTER READING PROGRESS
    // =================================================

    const chapter =
        document.querySelector(
            ".chapter"
        );


    if (chapter) {

        const page =
            window.location.pathname
                .split("/")
                .pop();


        const progressKey =
            "readingProgress_" + page;


        const saved =
            localStorage.getItem(
                progressKey
            );


        function updateReadingProgress(
            progress
        ) {

            document
                .querySelectorAll(
                    ".readingProgress, .progressText"
                )
                .forEach(
                    function (element) {

                        element.textContent =
                            progress + "%";

                    }
                );


            document
                .querySelectorAll(
                    ".progressBar"
                )
                .forEach(
                    function (bar) {

                        bar.value =
                            progress;

                    }
                );

        }


        if (saved !== null) {

            updateReadingProgress(
                Number(saved)
            );

        }


        window.addEventListener(
            "scroll",
            function () {

                const scrollTop =
                    window.scrollY;


                const documentHeight =
                    document.documentElement
                        .scrollHeight;


                const windowHeight =
                    window.innerHeight;


                const totalScrollable =
                    documentHeight -
                    windowHeight;


                let progress = 0;


                if (
                    totalScrollable > 0
                ) {

                    progress =
                        Math.round(
                            (
                                scrollTop /
                                totalScrollable
                            ) * 100
                        );

                }


                progress =
                    Math.min(
                        100,
                        Math.max(
                            0,
                            progress
                        )
                    );


                localStorage.setItem(
                    progressKey,
                    progress
                );


                updateReadingProgress(
                    progress
                );

            }
        );

    }

});
