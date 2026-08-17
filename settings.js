/* =========================================
   UNIQUE ACADEMIC — SETTINGS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================
       ELEMENTS
    ===================================== */

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const notificationsToggle =
        document.getElementById("notificationsToggle");

    const showAnswerToggle =
        document.getElementById("showAnswerToggle");

    const saveProgressToggle =
        document.getElementById("saveProgressToggle");

    const textSizeSelect =
        document.getElementById("textSizeSelect");

    const languageSelect =
        document.getElementById("languageSelect");

    const backBtn =
        document.getElementById("backBtn");

    const homeBtn =
        document.getElementById("homeBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const accountBtn =
        document.getElementById("accountBtn");

    const aboutBtn =
        document.getElementById("aboutBtn");


    /* =====================================
       DEFAULT SETTINGS
    ===================================== */

    const defaultSettings = {

        darkMode: false,

        notifications: true,

        showAnswer: true,

        saveProgress: true,

        textSize: "medium",

        language: "en"

    };


    /* =====================================
       LOAD SETTINGS
    ===================================== */

    function loadSettings() {

        const saved =
            localStorage.getItem(
                "uniqueAcademicSettings"
            );

        let settings = defaultSettings;

        if (saved) {

            try {

                settings = {
                    ...defaultSettings,
                    ...JSON.parse(saved)
                };

            } catch (error) {

                console.error(
                    "Could not load settings:",
                    error
                );

                settings = defaultSettings;
            }
        }


        /* Dark Mode */

        darkModeToggle.checked =
            settings.darkMode;

        applyDarkMode(
            settings.darkMode
        );


        /* Notifications */

        notificationsToggle.checked =
            settings.notifications;


        /* Show Answer */

        showAnswerToggle.checked =
            settings.showAnswer;


        /* Save Progress */

        saveProgressToggle.checked =
            settings.saveProgress;


        /* Text Size */

        textSizeSelect.value =
            settings.textSize;

        applyTextSize(
            settings.textSize
        );


        /* Language */

        languageSelect.value =
            settings.language;
    }


    /* =====================================
       SAVE SETTINGS
    ===================================== */

    function saveSettings() {

        const settings = {

            darkMode:
                darkModeToggle.checked,

            notifications:
                notificationsToggle.checked,

            showAnswer:
                showAnswerToggle.checked,

            saveProgress:
                saveProgressToggle.checked,

            textSize:
                textSizeSelect.value,

            language:
                languageSelect.value

        };


        localStorage.setItem(

            "uniqueAcademicSettings",

            JSON.stringify(settings)

        );
    }


    /* =====================================
       DARK MODE
    ===================================== */

    function applyDarkMode(enabled) {

        document.body.classList.toggle(
            "dark-mode",
            enabled
        );
    }


    darkModeToggle.addEventListener(
        "change",
        () => {

            applyDarkMode(
                darkModeToggle.checked
            );

            saveSettings();

        }
    );


    /* =====================================
       TEXT SIZE
    ===================================== */

    function applyTextSize(size) {

        document.body.classList.remove(
            "text-small",
            "text-medium",
            "text-large"
        );

        document.body.classList.add(
            `text-${size}`
        );
    }


    textSizeSelect.addEventListener(
        "change",
        () => {

            applyTextSize(
                textSizeSelect.value
            );

            saveSettings();

        }
    );


    /* =====================================
       NOTIFICATIONS
    ===================================== */

    notificationsToggle.addEventListener(
        "change",
        () => {

            saveSettings();

            console.log(
                "Notifications:",
                notificationsToggle.checked
            );

        }
    );


    /* =====================================
       SHOW CORRECT ANSWER
    ===================================== */

    showAnswerToggle.addEventListener(
        "change",
        () => {

            saveSettings();

        }
    );


    /* =====================================
       SAVE QUIZ PROGRESS
    ===================================== */

    saveProgressToggle.addEventListener(
        "change",
        () => {

            saveSettings();

        }
    );


    /* =====================================
       LANGUAGE
    ===================================== */

    languageSelect.addEventListener(
        "change",
        () => {

            saveSettings();

            if (
                languageSelect.value === "am"
            ) {

                alert(
                    "አማርኛ ቋንቋ በቅርቡ ይጨመራል።"
                );

            } else {

                console.log(
                    "Language: English"
                );

            }

        }
    );


    /* =====================================
       BACK BUTTON
    ===================================== */

    backBtn.addEventListener(
        "click",
        () => {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "index.html";

            }

        }
    );


    /* =====================================
       HOME BUTTON
    ===================================== */

    homeBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );


    /* =====================================
       ACCOUNT BUTTON
    ===================================== */

    accountBtn.addEventListener(
        "click",
        () => {

            alert(
                "Account & Security will be available soon."
            );

        }
    );


    /* =====================================
       ABOUT BUTTON
    ===================================== */

    aboutBtn.addEventListener(
        "click",
        () => {

            alert(
                "Unique Academic\n\n" +
                "Your academic learning platform."
            );

        }
    );


    /* =====================================
       RESET SETTINGS
    ===================================== */

    resetBtn.addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Are you sure you want to reset all settings?"
                );

            if (!confirmed) {
                return;
            }


            localStorage.removeItem(
                "uniqueAcademicSettings"
            );


            loadSettings();


            alert(
                "Settings have been reset."
            );

        }
    );


    /* =====================================
       INITIALIZE
    ===================================== */

    loadSettings();

});
