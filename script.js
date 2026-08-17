// =====================================================
// UNIQUE ACADEMIC — MAIN JAVASCRIPT
// =====================================================


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    // =================================================
    // ELEMENTS
    // =================================================

    const searchInput =
        document.getElementById("search");

    const modeBtn =
        document.getElementById("modeBtn");

    const menuBtn =
        document.getElementById("menuBtn");

    const headerMenuBtn =
        document.getElementById("headerMenuBtn");

    const sideMenu =
        document.getElementById("sideMenu");

    const menuOverlay =
        document.getElementById("menuOverlay");

    const refreshBtn =
        document.getElementById("refreshBtn");

    const shareAppBtn =
        document.getElementById("shareAppBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    // =================================================
    // THEME
    // =================================================

    function getSettings() {

        try {

            const saved =
                localStorage.getItem(
                    "uniqueAcademicSettings"
                );

            return saved
                ? JSON.parse(saved)
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

        localStorage.setItem(
            "uniqueAcademicSettings",
            JSON.stringify(settings)
        );

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

            modeBtn.innerHTML =
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


    // Apply saved theme immediately
    applyTheme();


    if (modeBtn) {

        modeBtn.addEventListener(
            "click",
            toggleTheme
        );

    }


    // =================================================
    // SIDE MENU
    // =================================================

    function openMenu() {

        if (!sideMenu || !menuOverlay) {
            return;
        }

        sideMenu.classList.add("active");

        menuOverlay.classList.add("active");

        sideMenu.setAttribute(
            "aria-hidden",
            "false"
        );

        if (menuBtn) {

            menuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }

        if (headerMenuBtn) {

            headerMenuBtn.setAttribute(
                "aria-expanded",
                "true"
            );

        }

        document.body.classList.add(
            "menu-open"
        );

    }


    function closeMenu() {

        if (!sideMenu || !menuOverlay) {
            return;
        }

        sideMenu.classList.remove("active");

        menuOverlay.classList.remove("active");

        sideMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        if (menuBtn) {

            menuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        if (headerMenuBtn) {

            headerMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        document.body.classList.remove(
            "menu-open"
        );

    }


    if (menuBtn) {

        menuBtn.addEventListener(
            "click",
            function () {

                if (
                    sideMenu &&
                    sideMenu.classList.contains("active")
                ) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );

    }


    if (headerMenuBtn) {

        headerMenuBtn.addEventListener(
            "click",
            function () {

                if (
                    sideMenu &&
                    sideMenu.classList.contains("active")
                ) {

                    closeMenu();

                } else {

                    openMenu();

                }

            }
        );

    }


    if (menuOverlay) {

        menuOverlay.addEventListener(
            "click",
            closeMenu
        );

    }


    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    // Close menu when normal link is clicked

    document
        .querySelectorAll(".sideMenu a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    // =================================================
    // REFRESH
    // =================================================

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            function () {

                closeMenu();

                window.location.reload();

            }
        );

    }


    // =================================================
    // SHARE APP
    // =================================================

    if (shareAppBtn) {

        shareAppBtn.addEventListener(
            "click",
            async function () {

                const shareData = {

                    title:
                        "Unique Academic",

                    text:
                        "Learn smarter with Unique Academic 🎓",

                    url:
                        window.location.href

                };


                try {

                    if (
                        navigator.share
                    ) {

                        await navigator.share(
                            shareData
                        );

                    } else if (
                        navigator.clipboard
                    ) {

                        await navigator
                            .clipboard
                            .writeText(
                                window.location.href
                            );

                        alert(
                            "Unique Academic link copied!"
                        );

                    } else {

                        alert(
                            "Sharing is not supported on this device."
                        );

                    }

                } catch (error) {

                    console.log(
                        "Share cancelled."
                    );

                }

            }
        );

    }


    // =================================================
    // LOGOUT
    // =================================================

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to logout?"
                    );

                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    "uniqueAcademicUser"
                );

                localStorage.removeItem(
                    "studentLoggedIn"
                );

                sessionStorage.clear();

                closeMenu();

                window.location.href =
                    "student-login.html";

            }
        );

    }


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

                const text =
                    card.innerText
                        .toLowerCase();


                if (
                    text.includes(query)
                ) {

                    card.style.display =
                        "";

                } else {

                    card.style.display =
                        "none";

                }

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
    // BOOKMARKS
    // =================================================

    const bookmarkButtons =
        document.querySelectorAll(
            ".bookmarkBtn"
        );


    bookmarkButtons.forEach(
        function (button) {

            const card =
                button.closest(
                    ".subjectCard"
                );


            if (!card) {
                return;
            }


            const titleElement =
                card.querySelector("h3");


            const openLink =
                card.querySelector(
                    'a.button[href]'
                );


            if (!titleElement || !openLink) {
                return;
            }


            const title =
                titleElement.innerText
                    .trim();


            const link =
                openLink.getAttribute(
                    "href"
                );


            /*
             * Create a stable bookmark ID
             * from the subject title.
             */

            const bookmarkId =
                "bookmark_" +
                title
                    .toLowerCase()
                    .replace(
                        /[^a-z0-9]+/g,
                        "_"
                    )
                    .replace(
                        /^_+|_+$/g,
                        ""
                    );


            // Restore bookmark

            const saved =
                localStorage.getItem(
                    bookmarkId
                );


            if (saved) {

                button.innerHTML =
                    "⭐ Saved";

                button.classList.add(
                    "bookmarked"
                );

            }


            // Click bookmark

            button.addEventListener(
                "click",
                function () {

                    const existing =
                        localStorage.getItem(
                            bookmarkId
                        );


                    if (existing) {

                        localStorage.removeItem(
                            bookmarkId
                        );

                        button.innerHTML =
                            "⭐ Bookmark";

                        button.classList.remove(
                            "bookmarked"
                        );

                    } else {

                        const bookmarkData = {

                            title: title,

                            link: link

                        };


                        localStorage.setItem(
                            bookmarkId,
                            JSON.stringify(
                                bookmarkData
                            )
                        );


                        button.innerHTML =
                            "⭐ Saved";

                        button.classList.add(
                            "bookmarked"
                        );

                    }

                }
            );

        }
    );


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


                    const title =
                        card.querySelector("h3");


                    if (title) {

                        localStorage.setItem(
                            "lastSubject",
                            title.innerText.trim()
                        );

                    }


                    localStorage.setItem(
                        "lastLink",
                        button.href
                    );

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


    const lastSubject =
        localStorage.getItem(
            "lastSubject"
        );

    const lastLink =
        localStorage.getItem(
            "lastLink"
        );


    if (
        lastSubject &&
        lastLink &&
        continueText &&
        continueBtn
    ) {

        continueText.innerHTML =
            "Last opened: " +
            lastSubject;

        continueBtn.href =
            lastLink;

        continueBtn.innerHTML =
            "Continue Reading";

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
                localStorage.getItem(
                    key
                );


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
