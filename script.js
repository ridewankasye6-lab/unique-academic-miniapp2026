// ==========================================
// UNIQUE ACADEMIC - MAIN JAVASCRIPT
// ==========================================


// ==========================================
// SEARCH SUBJECTS
// ==========================================

function searchSubjects() {

    const searchInput = document.getElementById("search");

    if (!searchInput) {
        return;
    }

    const input =
        searchInput.value.toLowerCase();

    const cards =
        document.getElementsByClassName("card");

    for (let i = 0; i < cards.length; i++) {

        const text =
            cards[i].innerText.toLowerCase();

        if (text.includes(input)) {

            cards[i].style.display = "";

        } else {

            cards[i].style.display = "none";

        }

    }

}


// ==========================================
// DARK MODE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const modeBtn =
            document.getElementById("modeBtn");


        // Restore saved mode
        const savedMode =
            localStorage.getItem("theme");


        if (savedMode === "dark") {

            document.body.classList.add("dark");

            if (modeBtn) {
                modeBtn.innerHTML =
                    "☀️ Light Mode";
            }

        } else {

            document.body.classList.remove("dark");

            if (modeBtn) {
                modeBtn.innerHTML =
                    "🌙 Dark Mode";
            }

        }


        // Change mode
        if (modeBtn) {

            modeBtn.onclick = function () {

                document.body.classList.toggle("dark");


                if (
                    document.body.classList.contains("dark")
                ) {

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                    modeBtn.innerHTML =
                        "☀️ Light Mode";

                } else {

                    localStorage.setItem(
                        "theme",
                        "light"
                    );

                    modeBtn.innerHTML =
                        "🌙 Dark Mode";

                }

            };

        }

    }
);


// ==========================================
// BOOKMARKS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const bookmarks =
            document.querySelectorAll(
                ".bookmarkBtn"
            );


        bookmarks.forEach(
            (button, index) => {

                const saved =
                    localStorage.getItem(
                        "bookmark" + index
                    );


                // Restore bookmark
                if (saved === "saved") {

                    button.innerHTML =
                        "⭐ Saved";

                    button.style.background =
                        "green";

                }


                // Bookmark button
                button.onclick = function () {

                    if (
                        button.innerHTML.includes(
                            "Bookmark"
                        )
                    ) {

                        button.innerHTML =
                            "⭐ Saved";

                        button.style.background =
                            "green";

                        localStorage.setItem(
                            "bookmark" + index,
                            "saved"
                        );

                    } else {

                        button.innerHTML =
                            "⭐ Bookmark";

                        button.style.background =
                            "#ffc107";

                        localStorage.removeItem(
                            "bookmark" + index
                        );

                    }

                };

            }
        );

    }
);


// ==========================================
// HOME PAGE PROGRESS BARS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const progressBars =
            document.querySelectorAll(
                ".progressBar"
            );

        const progressTexts =
            document.querySelectorAll(
                ".progressText"
            );


        progressBars.forEach(
            (bar, index) => {

                const saved =
                    localStorage.getItem(
                        "progress" + index
                    );


                // Restore saved progress
                if (saved !== null) {

                    bar.value = saved;


                    if (progressTexts[index]) {

                        progressTexts[index].innerHTML =
                            saved + "%";

                    }

                }


                // Manual progress still works
                bar.oninput = function () {

                    const value =
                        bar.value;

                    if (progressTexts[index]) {

                        progressTexts[index].innerHTML =
                            value + "%";

                    }

                    localStorage.setItem(
                        "progress" + index,
                        value
                    );

                };

            }
        );

    }
);


// ==========================================
// AUTOMATIC CHAPTER READING PROGRESS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const chapter =
            document.querySelector(".chapter");


        // Only run on chapter pages
        if (!chapter) {
            return;
        }


        // Get current page filename
        const page =
            window.location.pathname
                .split("/")
                .pop();


        // Create unique progress key
        const progressKey =
            "readingProgress_" + page;


        // Restore previous progress
        const saved =
            localStorage.getItem(
                progressKey
            );


        if (saved !== null) {

            updateReadingProgress(
                Number(saved)
            );

        }


        // Track scrolling
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


                if (totalScrollable > 0) {

                    progress =
                        Math.round(
                            (scrollTop /
                                totalScrollable) *
                            100
                        );

                }


                // Never go above 100
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


        // ======================================
        // UPDATE READING PROGRESS
        // ======================================

        function updateReadingProgress(
            progress
        ) {

            // Find progress elements on page
            const progressElements =
                document.querySelectorAll(
                    ".readingProgress, .progressText"
                );


            progressElements.forEach(
                element => {

                    element.textContent =
                        progress + "%";

                }
            );


            // Update progress bars if present
            const bars =
                document.querySelectorAll(
                    ".progressBar"
                );


            bars.forEach(
                bar => {

                    bar.value =
                        progress;

                }
            );

        }

    }
);


// ==========================================
// CONTINUE LEARNING
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const openButtons =
            document.querySelectorAll(
                ".button"
            );


        openButtons.forEach(
            button => {

                if (
                    button.innerHTML.includes(
                        "📖 Open"
                    )
                ) {

                    button.addEventListener(
                        "click",
                        function () {

                            const parent =
                                button.parentElement;


                            const title =
                                parent.querySelector(
                                    "h3"
                                );


                            if (title) {

                                localStorage.setItem(
                                    "lastSubject",
                                    title.innerText
                                );

                            }


                            localStorage.setItem(
                                "lastLink",
                                button.href
                            );

                        }
                    );

                }

            }
        );


        // Restore Continue Learning
        const lastSubject =
            localStorage.getItem(
                "lastSubject"
            );

        const lastLink =
            localStorage.getItem(
                "lastLink"
            );


        const continueText =
            document.getElementById(
                "continueText"
            );

        const continueBtn =
            document.getElementById(
                "continueBtn"
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

    }
);
/* =====================================================
   UNIQUE ACADEMIC SIDE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenuBtn = document.getElementById("closeMenuBtn");


function openSideMenu() {

    sideMenu.classList.add("open");

    menuOverlay.classList.add("open");

    document.body.style.overflow = "hidden";

}


function closeSideMenu() {

    sideMenu.classList.remove("open");

    menuOverlay.classList.remove("open");

    document.body.style.overflow = "";

}


if (menuBtn) {

    menuBtn.onclick = function () {

        openSideMenu();

    };

}


if (closeMenuBtn) {

    closeMenuBtn.onclick = function () {

        closeSideMenu();

    };

}


if (menuOverlay) {

    menuOverlay.onclick = function () {

        closeSideMenu();

    };

}


/* Close menu after clicking a menu link */

document.querySelectorAll(".menuItem").forEach(function (item) {

    item.addEventListener("click", function () {

        closeSideMenu();

    });

});


/* =====================================================
   MENU DARK MODE
===================================================== */

const menuModeBtn =
    document.getElementById("menuModeBtn");

if (menuModeBtn) {

    menuModeBtn.onclick = function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            menuModeBtn.innerHTML =
                "☀️ <span>Light Mode</span>";

        } else {

            menuModeBtn.innerHTML =
                "🌙 <span>Dark Mode</span>";

        }

    };

}
// =====================================================
// UNIQUE ACADEMIC SIDE MENU
// =====================================================

const menuBtn = document.getElementById("menuBtn");
const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");


// OPEN MENU

menuBtn.addEventListener("click", function () {

    sideMenu.classList.add("active");
    menuOverlay.classList.add("active");

});


// CLOSE MENU

menuOverlay.addEventListener("click", function () {

    sideMenu.classList.remove("active");
    menuOverlay.classList.remove("active");

});


// CLOSE WITH ESCAPE

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        sideMenu.classList.remove("active");
        menuOverlay.classList.remove("active");

    }

});


// =====================================================
// REFRESH
// =====================================================

const refreshBtn =
    document.getElementById("refreshBtn");

if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        window.location.reload();

    });

}


// =====================================================
// SHARE APP
// =====================================================

const shareAppBtn =
    document.getElementById("shareAppBtn");

if (shareAppBtn) {

    shareAppBtn.addEventListener("click", async function () {

        const shareData = {

            title: "Unique Academic",

            text:
                "Learn smarter with Unique Academic 🎓",

            url:
                window.location.origin +
                window.location.pathname

        };


        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(
                    window.location.href
                );

                alert(
                    "Unique Academic link copied!"
                );

            }

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    });

}


// =====================================================
// LOGOUT
// =====================================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        const confirmed =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmed) return;


        /*
         * Clear local student session.
         */

        localStorage.removeItem(
            "uniqueAcademicUser"
        );

        localStorage.removeItem(
            "studentLoggedIn"
        );


        sessionStorage.clear();


        /*
         * Go to student login.
         */

        window.location.href =
            "student-login.html";

    });

}
