/*
=========================================================
 UNIQUE ACADEMIC
 STUDENT ACCESS GUARD + CONTENT PROTECTION
 + TRIAL CONTENT ACCESS SYSTEM
=========================================================

 ADMIN:
    Full access
    No content restrictions

 APPROVED STUDENTS:
    Authentication + registration approval required

 ANTHROPOLOGY TRIAL:
    Chapter 1 Notes      -> UNLOCKED
    Chapter 1 Quiz       -> UNLOCKED
    Full Notes           -> UNLOCKED

    Chapters 2-5 Notes   -> LOCKED
    Chapters 2-5 Quizzes -> LOCKED
    Video                -> LOCKED

 IMPORTANT:
 Browser-level protection is deterrence only.
 Firebase Security Rules remain the real security layer.
=========================================================
*/


/* =====================================================
   FIREBASE
===================================================== */

import {
    db,
    auth
} from "./firebase-config.js";


import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


/* =====================================================
   ADMIN EMAIL
===================================================== */

const ADMIN_EMAIL =
    "ridewankasye6@gmail.com";


/* =====================================================
   TRIAL SETTINGS
===================================================== */

const TRIAL_SUBJECT =
    "anthropology";


const TRIAL_CHAPTER =
    1;


/*
 * Content types which are unlocked
 * during the Anthropology trial.
 */

const UNLOCKED_TRIAL_CONTENT = {

    chapter1Notes: true,

    chapter1Quiz: true,

    fullNotes: true

};


/* =====================================================
   PAGE INFORMATION
===================================================== */

const currentPage =
    window.location.pathname.toLowerCase();


const currentUrl =
    window.location.href.toLowerCase();


const isQuizPage =
    currentPage.includes("quiz.html");


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
        =================================================
        NOT LOGGED IN
        =================================================
        */

        if (!user) {

            showLocked(
                "🔒",
                "Login Required",
                "Login or register to access this course.",
                "🔐 Student Login",
                "student-login.html",
                "📝 Register",
                "registration.html"
            );

            return;
        }


        /*
        =================================================
        ADMIN
        =================================================

        ADMIN HAS FULL ACCESS.
        =================================================
        */

        if (
            user.email &&
            user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        ) {

            document.body.classList.add(
                "admin-access"
            );


            grantAccess(
                "👨‍💼 Admin Access",
                true
            );


            return;
        }


        /*
        =================================================
        STUDENT REGISTRATION CHECK
        =================================================
        */

        try {

            const registrationQuery =
                query(
                    collection(
                        db,
                        "registrations"
                    ),
                    where(
                        "userId",
                        "==",
                        user.uid
                    )
                );


            const snapshot =
                await getDocs(
                    registrationQuery
                );


            /*
            =============================================
            NO REGISTRATION
            =============================================
            */

            if (snapshot.empty) {

                showLocked(
                    "📝",
                    "Registration Required",
                    "Complete your registration and payment to access this course.",
                    "📝 Register Now",
                    "registration.html",
                    "🏠 Home",
                    "index.html"
                );

                return;
            }


            /*
            =============================================
            CHECK REGISTRATION STATUS
            =============================================
            */

            let approved = false;

            let pending = false;

            let rejected = false;


            snapshot.forEach(
                (registrationDoc) => {

                    const data =
                        registrationDoc.data();


                    if (
                        data.status ===
                        "approved"
                    ) {

                        approved = true;

                    }


                    if (
                        data.status ===
                        "pending"
                    ) {

                        pending = true;

                    }


                    if (
                        data.status ===
                        "rejected"
                    ) {

                        rejected = true;

                    }

                }
            );


            /*
            =============================================
            APPROVED STUDENT
            =============================================
            */

            if (approved) {

                document.body.classList.add(
                    "student-access"
                );


                /*
                 * First grant the existing
                 * student protection.
                 */

                grantAccess(
                    "✅ Payment Approved",
                    false
                );


                /*
                 * Then apply the trial system.
                 */

                applyTrialAccess();


                return;
            }


            /*
            =============================================
            PENDING
            =============================================
            */

            if (pending) {

                showLocked(
                    "⏳",
                    "Verification Pending",
                    "Your payment is waiting for administrator approval.",
                    "🏠 Back Home",
                    "index.html"
                );

                return;
            }


            /*
            =============================================
            REJECTED
            =============================================
            */

            if (rejected) {

                showLocked(
                    "❌",
                    "Registration Not Approved",
                    "Your registration has not been approved for course access.",
                    "📝 Register Again",
                    "registration.html",
                    "🏠 Home",
                    "index.html"
                );

                return;
            }


            /*
            =============================================
            UNKNOWN STATUS
            =============================================
            */

            showLocked(
                "🔒",
                "Access Locked",
                "Your account is not currently approved for course access.",
                "🏠 Back Home",
                "index.html"
            );

        }

        catch (error) {

            console.error(
                "Access Guard Error:",
                error
            );


            showLocked(
                "⚠️",
                "Unable to Verify Access",
                "We could not verify your registration right now. Please try again.",
                "🏠 Back Home",
                "index.html"
            );

        }

    }
);


/* =====================================================
   GRANT ACCESS
===================================================== */

function grantAccess(
    statusText,
    isAdmin = false
) {

    /*
    =============================================
    ADMIN
    =============================================
    */

    if (isAdmin) {

        document.body.classList.add(
            "admin-access"
        );

    }

    else {

        document.body.classList.add(
            "student-access"
        );

    }


    /*
    =============================================
    APPLY STUDENT PROTECTION
    =============================================
    */

    if (!isAdmin) {

        enableStudentProtection();

    }


    /*
    =============================================
    START APPLICATION
    =============================================
    */

    document.dispatchEvent(
        new CustomEvent(
            "uniqueAcademicAccessGranted",
            {
                detail: {

                    status:
                        statusText,

                    admin:
                        isAdmin

                }

            }
        )
    );

}


/* =====================================================
   TRIAL ACCESS SYSTEM
===================================================== */

function applyTrialAccess() {

    /*
     * Only Anthropology gets the trial rules
     * from this section.
     */

    if (
        !isAnthropologyPage()
    ) {

        return;

    }


    /*
     * Add a class so CSS can identify
     * the trial state.
     */

    document.body.classList.add(
        "anthropology-trial"
    );


    /*
     * Process existing links.
     */

    processTrialLinks();


    /*
     * Process links/buttons that may be
     * created dynamically later.
     */

    const trialObserver =
        new MutationObserver(
            function () {

                processTrialLinks();

            }
        );


    trialObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    /*
     * Add professional trial banner.
     */

    addTrialBanner();

}


/* =====================================================
   CHECK ANTHROPOLOGY PAGE
===================================================== */

function isAnthropologyPage() {

    const page =
        currentPage +
        " " +
        currentUrl;


    return (
        page.includes("anthropology") ||
        page.includes("anthro")
    );

}


/* =====================================================
   PROCESS TRIAL LINKS
===================================================== */

function processTrialLinks() {

    const elements =
        document.querySelectorAll(
            "a, button"
        );


    elements.forEach(
        (element) => {

            /*
            * Don't process the same element repeatedly.
            */

            if (
                element.dataset.trialChecked ===
                "true"
            ) {

                return;

            }


            /*
            * Ignore navigation elements
            * which are unrelated to course content.
            */

            const info =
                getElementAccessInfo(
                    element
                );


            if (!info.isCourseContent) {

                return;

            }


            element.dataset.trialChecked =
                "true";


            /*
            =========================================
            UNLOCKED
            =========================================
            */

            if (
                info.unlocked
            ) {

                element.classList.add(
                    "trial-unlocked"
                );

                return;

            }


            /*
            =========================================
            LOCKED
            =========================================
            */

            lockTrialElement(
                element,
                info
            );

        }
    );

}


/* =====================================================
   DETERMINE ELEMENT ACCESS
===================================================== */

function getElementAccessInfo(
    element
) {

    const href =
        (
            element.getAttribute("href") ||
            ""
        ).toLowerCase();


    const text =
        (
            element.textContent ||
            ""
        ).trim().toLowerCase();


    const combined =
        (
            href +
            " " +
            text +
            " " +
            (element.className || "")
        ).toLowerCase();


    /*
    =============================================
    VIDEO
    =============================================
    */

    if (
        combined.includes("video") ||
        combined.includes("lecture-video")
    ) {

        return {

            isCourseContent: true,

            unlocked: false,

            type: "video",

            title: "Course Video"

        };

    }


    /*
    =============================================
    FULL NOTES
    =============================================
    */

    if (
        combined.includes("full-notes") ||
        combined.includes("full notes") ||
        combined.includes("all-notes") ||
        combined.includes("all notes")
    ) {

        return {

            isCourseContent: true,

            unlocked:
                UNLOCKED_TRIAL_CONTENT.fullNotes,

            type: "full-notes",

            title: "Full Notes"

        };

    }


    /*
    =============================================
    QUIZ
    =============================================
    */

    const quizDetected =
        combined.includes("quiz") ||
        href.includes("quiz.html");


    if (quizDetected) {

        const chapter =
            getChapterNumber(
                combined
            );


        /*
         * If no chapter is visible in the
         * link, allow it to remain untouched.
         */

        if (!chapter) {

            return {

                isCourseContent: false

            };

        }


        return {

            isCourseContent: true,

            unlocked:
                chapter === TRIAL_CHAPTER,

            type: "quiz",

            chapter:
                chapter,

            title:
                "Chapter " +
                chapter +
                " Quiz"

        };

    }


    /*
    =============================================
    CHAPTER NOTES
    =============================================
    */

    const chapter =
        getChapterNumber(
            combined
        );


    if (chapter) {

        return {

            isCourseContent: true,

            unlocked:
                chapter === TRIAL_CHAPTER,

            type: "notes",

            chapter:
                chapter,

            title:
                "Chapter " +
                chapter +
                " Notes"

        };

    }


    /*
    =============================================
    NOTHING DETECTED
    =============================================
    */

    return {

        isCourseContent: false

    };

}


/* =====================================================
   GET CHAPTER NUMBER
===================================================== */

function getChapterNumber(
    text
) {

    /*
     * chapter=1
     */

    let match =
        text.match(
            /chapter\s*=\s*(\d+)/i
        );


    if (match) {

        return parseInt(
            match[1],
            10
        );

    }


    /*
     * chapter-1
     * chapter_1
     * chapter 1
     */

    match =
        text.match(
            /chapter[\s_-]*(\d+)/i
        );


    if (match) {

        return parseInt(
            match[1],
            10
        );

    }


    /*
     * "Chapter 1"
     */

    match =
        text.match(
            /chapter\s+(\d+)/i
        );


    if (match) {

        return parseInt(
            match[1],
            10
        );

    }


    return null;

}


/* =====================================================
   LOCK TRIAL ELEMENT
===================================================== */

function lockTrialElement(
    element,
    info
) {

    /*
     * Save the original href.
     */

    const originalHref =
        element.getAttribute(
            "href"
        );


    if (originalHref) {

        element.dataset.originalHref =
            originalHref;

    }


    /*
     * Prevent navigation.
     */

    element.removeAttribute(
        "href"
    );


    element.dataset.trialLocked =
        "true";


    element.classList.add(
        "trial-locked"
    );


    element.setAttribute(
        "aria-disabled",
        "true"
    );


    /*
     * Add lock indicator.
     */

    if (
        !element.querySelector(
            ".trial-lock-icon"
        )
    ) {

        const lockIcon =
            document.createElement(
                "span"
            );


        lockIcon.className =
            "trial-lock-icon";


        lockIcon.textContent =
            " 🔒";


        lockIcon.setAttribute(
            "aria-hidden",
            "true"
        );


        element.appendChild(
            lockIcon
        );

    }


    /*
     * Click handler.
     */

    element.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            showTrialLockMessage(
                info.title
            );

        },
        true
    );

}


/* =====================================================
   TRIAL LOCK MESSAGE
===================================================== */

function showTrialLockMessage(
    title
) {

    let overlay =
        document.getElementById(
            "uniqueAcademicTrialOverlay"
        );


    if (overlay) {

        overlay.remove();

    }


    overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "uniqueAcademicTrialOverlay";


    overlay.innerHTML = `

        <div class="trial-modal">

            <div class="trial-modal-icon">
                🔒
            </div>

            <div class="trial-modal-badge">
                PREMIUM CONTENT
            </div>

            <h2>
                ${escapeHTML(title)}
                is Locked
            </h2>

            <p>
                This content is available with
                full course access.
            </p>

            <div class="trial-modal-note">
                🎓 Chapter 1 is available as your
                free trial.
            </div>

            <div class="trial-modal-actions">

                <a
                    href="registration.html"
                    class="trial-primary-button"
                >
                    🚀 Get Full Access
                </a>

                <button
                    type="button"
                    class="trial-secondary-button"
                    id="closeTrialModal"
                >
                    Maybe Later
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );


    const closeButton =
        document.getElementById(
            "closeTrialModal"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function () {

                overlay.remove();

            }
        );

    }


    overlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                overlay
            ) {

                overlay.remove();

            }

        }
    );

}


/* =====================================================
   TRIAL BANNER
===================================================== */

function addTrialBanner() {

    /*
     * Don't duplicate banner.
     */

    if (
        document.getElementById(
            "uniqueAcademicTrialBanner"
        )
    ) {

        return;

    }


    /*
     * Only add on main Anthropology pages.
     */

    if (isQuizPage) {

        return;

    }


    const banner =
        document.createElement(
            "div"
        );


    banner.id =
        "uniqueAcademicTrialBanner";


    banner.innerHTML = `

        <div class="trial-banner-content">

            <div class="trial-banner-icon">
                🎓
            </div>

            <div class="trial-banner-text">

                <strong>
                    Free Trial Access
                </strong>

                <span>
                    Chapter 1, Chapter 1 Quiz
                    and Full Notes are available.
                </span>

            </div>

            <a
                href="registration.html"
                class="trial-banner-button"
            >
                Get Full Access
            </a>

        </div>

    `;


    document.body.prepend(
        banner
    );


    addTrialStyles();

}


/* =====================================================
   TRIAL STYLES
===================================================== */

function addTrialStyles() {

    if (
        document.getElementById(
            "uniqueAcademicTrialStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "uniqueAcademicTrialStyles";


    style.textContent = `

        /*
        =============================================
        LOCKED CONTENT
        =============================================
        */

        .trial-locked {

            position: relative !important;

            opacity: 0.72 !important;

            cursor: pointer !important;

            filter: saturate(0.75);

            transition:
                transform 0.2s ease,
                opacity 0.2s ease,
                box-shadow 0.2s ease;

        }


        .trial-locked:hover {

            opacity: 1 !important;

            transform:
                translateY(-2px);

        }


        .trial-lock-icon {

            display: inline-block;

            margin-left: 5px;

            font-size: 0.9em;

        }


        /*
        =============================================
        UNLOCKED CONTENT
        =============================================
        */

        .trial-unlocked {

            position: relative;

        }


        /*
        =============================================
        TRIAL BANNER
        =============================================
        */

        #uniqueAcademicTrialBanner {

            width: 100%;

            box-sizing: border-box;

            padding: 10px 16px;

            background:
                linear-gradient(
                    135deg,
                    #2563eb,
                    #4f46e5
                );

            color: white;

            box-shadow:
                0 4px 18px
                rgba(37,99,235,0.20);

            position: relative;

            z-index: 1000;

        }


        .trial-banner-content {

            max-width: 1100px;

            margin: auto;

            display: flex;

            align-items: center;

            gap: 12px;

        }


        .trial-banner-icon {

            font-size: 25px;

            flex-shrink: 0;

        }


        .trial-banner-text {

            display: flex;

            flex-direction: column;

            gap: 2px;

            flex: 1;

        }


        .trial-banner-text strong {

            font-size: 14px;

        }


        .trial-banner-text span {

            font-size: 12px;

            opacity: 0.9;

        }


        .trial-banner-button {

            display: inline-block;

            padding: 9px 14px;

            background: white;

            color: #2563eb;

            border-radius: 9px;

            text-decoration: none;

            font-size: 12px;

            font-weight: 700;

            white-space: nowrap;

        }


        /*
        =============================================
        TRIAL MODAL
        =============================================
        */

        #uniqueAcademicTrialOverlay {

            position: fixed;

            inset: 0;

            z-index: 999998;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            box-sizing: border-box;

            background:
                rgba(15,23,42,0.68);

            backdrop-filter:
                blur(5px);

        }


        .trial-modal {

            width: 100%;

            max-width: 420px;

            box-sizing: border-box;

            background: white;

            border-radius: 22px;

            padding: 30px 24px;

            text-align: center;

            box-shadow:
                0 25px 70px
                rgba(0,0,0,0.25);

            animation:
                trialModalIn
                0.2s ease;

        }


        @keyframes trialModalIn {

            from {

                opacity: 0;

                transform:
                    translateY(12px)
                    scale(0.97);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        .trial-modal-icon {

            width: 70px;

            height: 70px;

            margin:
                0 auto 15px;

            border-radius: 50%;

            display: flex;

            align-items: center;

            justify-content: center;

            background: #eff6ff;

            font-size: 32px;

        }


        .trial-modal-badge {

            display: inline-block;

            padding: 5px 10px;

            border-radius: 999px;

            background: #eef2ff;

            color: #4338ca;

            font-size: 10px;

            font-weight: 800;

            letter-spacing: 0.6px;

            margin-bottom: 10px;

        }


        .trial-modal h2 {

            margin:
                0 0 10px;

            color: #111827;

            font-size: 22px;

        }


        .trial-modal p {

            margin:
                0 0 16px;

            color: #64748b;

            line-height: 1.6;

            font-size: 14px;

        }


        .trial-modal-note {

            padding: 12px;

            border-radius: 12px;

            background: #f8fafc;

            color: #475569;

            font-size: 12px;

            line-height: 1.5;

            margin-bottom: 20px;

        }


        .trial-modal-actions {

            display: flex;

            flex-direction: column;

            gap: 9px;

        }


        .trial-primary-button {

            display: block;

            padding: 13px;

            border-radius: 11px;

            background: #2563eb;

            color: white;

            text-decoration: none;

            font-weight: 700;

            font-size: 14px;

        }


        .trial-secondary-button {

            border: none;

            background: #f1f5f9;

            color: #475569;

            padding: 12px;

            border-radius: 11px;

            cursor: pointer;

            font-weight: 600;

            font-size: 13px;

        }


        /*
        =============================================
        MOBILE
        =============================================
        */

        @media (max-width: 600px) {

            .trial-banner-content {

                align-items: flex-start;

            }


            .trial-banner-button {

                padding:
                    8px 10px;

                font-size: 11px;

            }


            .trial-banner-text span {

                font-size: 11px;

            }


            .trial-modal {

                padding:
                    26px 20px;

            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   STUDENT CONTENT PROTECTION
===================================================== */

function enableStudentProtection() {

    /*
    =============================================
    AVOID DUPLICATE PROTECTION
    =============================================
    */

    if (
        document.body.dataset.protectionEnabled ===
        "true"
    ) {

        return;

    }


    document.body.dataset.protectionEnabled =
        "true";


    /*
    =============================================
    DISABLE RIGHT CLICK
    =============================================
    */

    document.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /*
    =============================================
    DISABLE TEXT SELECTION
    =============================================
    */

    document.addEventListener(
        "selectstart",
        function (event) {

            const target =
                event.target;


            if (
                target &&
                (
                    target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT"
                )
            ) {

                return;

            }


            event.preventDefault();

        },
        true
    );


    /*
    =============================================
    DISABLE COPY
    =============================================
    */

    document.addEventListener(
        "copy",
        function (event) {

            event.preventDefault();


            showProtectionMessage(
                "📚 Copying course content is disabled."
            );

        },
        true
    );


    /*
    =============================================
    DISABLE CUT
    =============================================
    */

    document.addEventListener(
        "cut",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /*
    =============================================
    DISABLE DRAGGING
    =============================================
    */

    document.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /*
    =============================================
    DISABLE IMAGE DRAGGING
    =============================================
    */

    document
        .querySelectorAll("img")
        .forEach(
            (image) => {

                image.setAttribute(
                    "draggable",
                    "false"
                );

            }
        );


    /*
    =============================================
    CATCH NEW IMAGES
    =============================================
    */

    const observer =
        new MutationObserver(
            function () {

                document
                    .querySelectorAll("img")
                    .forEach(
                        (image) => {

                            image.setAttribute(
                                "draggable",
                                "false"
                            );

                        }
                    );

            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    /*
    =============================================
    KEYBOARD PROTECTION
    =============================================
    */

    document.addEventListener(
        "keydown",
        function (event) {

            const key =
                event.key.toLowerCase();


            const ctrl =
                event.ctrlKey ||
                event.metaKey;


            const target =
                event.target;


            const isInput =
                target &&
                (
                    target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT"
                );


            /*
            -----------------------------------------
            COPY
            -----------------------------------------
            */

            if (
                ctrl &&
                key === "c" &&
                !isInput
            ) {

                event.preventDefault();


                showProtectionMessage(
                    "📚 Copying course content is disabled."
                );


                return;

            }


            /*
            -----------------------------------------
            CUT
            -----------------------------------------
            */

            if (
                ctrl &&
                key === "x" &&
                !isInput
            ) {

                event.preventDefault();

                return;

            }


            /*
            -----------------------------------------
            SAVE
            -----------------------------------------
            */

            if (
                ctrl &&
                key === "s"
            ) {

                event.preventDefault();


                showProtectionMessage(
                    "🔒 Saving course pages is disabled."
                );


                return;

            }


            /*
            -----------------------------------------
            PRINT
            -----------------------------------------
            */

            if (
                ctrl &&
                key === "p"
            ) {

                event.preventDefault();


                showProtectionMessage(
                    "🖨️ Printing course content is disabled."
                );


                return;

            }


            /*
            -----------------------------------------
            VIEW SOURCE
            -----------------------------------------
            */

            if (
                ctrl &&
                key === "u"
            ) {

                event.preventDefault();

                return;

            }


            /*
            -----------------------------------------
            DEVTOOLS
            -----------------------------------------
            */

            if (
                key === "f12"
            ) {

                event.preventDefault();

                return;

            }


            if (
                ctrl &&
                event.shiftKey &&
                (
                    key === "i" ||
                    key === "j" ||
                    key === "c"
                )
            ) {

                event.preventDefault();

                return;

            }


            /*
            -----------------------------------------
            PRINT SCREEN
            -----------------------------------------
            */

            if (
                key === "printscreen"
            ) {

                event.preventDefault();


                showProtectionMessage(
                    "🔒 Screenshot capture is restricted."
                );

            }

        },
        true
    );


    /*
    =============================================
    DISABLE PRINTING
    =============================================
    */

    const printStyle =
        document.createElement(
            "style"
        );


    printStyle.id =
        "student-print-protection";


    printStyle.textContent = `

        @media print {

            body * {
                display: none !important;
            }

            body::before {

                content:
                    "Unique Academic — Course printing is not permitted.";

                display: block !important;

                font-size: 24px;

                text-align: center;

                margin-top: 100px;

            }

        }

    `;


    document.head.appendChild(
        printStyle
    );


    /*
    =============================================
    DISABLE USER SELECTION
    =============================================
    */

    const protectionStyle =
        document.createElement(
            "style"
        );


    protectionStyle.id =
        "student-content-protection";


    protectionStyle.textContent = `

        body.student-access {

            -webkit-user-select: none !important;

            -moz-user-select: none !important;

            user-select: none !important;

        }


        body.student-access img {

            -webkit-user-drag: none !important;

            user-drag: none !important;

        }


        body.student-access {

            -webkit-touch-callout: none !important;

        }

    `;


    document.head.appendChild(
        protectionStyle
    );


    /*
    =============================================
    HIDE CONTENT WHEN PAGE IS NOT VISIBLE
    =============================================
    */

    let pageWasHidden =
        false;


    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                pageWasHidden =
                    true;


                document.body.classList.add(
                    "unique-academic-hidden"
                );

            }

            else if (
                pageWasHidden
            ) {

                document.body.classList.remove(
                    "unique-academic-hidden"
                );

            }

        }
    );


    /*
    =============================================
    VISIBILITY PROTECTION STYLE
    =============================================
    */

    const visibilityProtectionStyle =
        document.createElement(
            "style"
        );


    visibilityProtectionStyle.id =
        "unique-academic-visibility-protection";


    visibilityProtectionStyle.textContent = `

        body.student-access.unique-academic-hidden
        > * {

            visibility: hidden !important;

        }


        body.student-access.unique-academic-hidden::after {

            content:
                "🔒 Unique Academic — Content Protected";

            position: fixed;

            top: 50%;
            left: 50%;

            transform:
                translate(-50%, -50%);

            z-index: 999999;

            visibility: visible !important;

            background: #111827;

            color: white;

            padding: 18px 25px;

            border-radius: 14px;

            font-size: 16px;

            font-weight: bold;

            text-align: center;

            box-shadow:
                0 10px 35px
                rgba(0,0,0,0.35);

        }

    `;


    document.head.appendChild(
        visibilityProtectionStyle
    );

}


/* =====================================================
   PROTECTION MESSAGE
===================================================== */

let protectionMessageTimer =
    null;


function showProtectionMessage(
    message
) {

    let box =
        document.getElementById(
            "uniqueAcademicProtectionMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );


        box.id =
            "uniqueAcademicProtectionMessage";


        box.style.position =
            "fixed";

        box.style.left =
            "50%";

        box.style.bottom =
            "25px";

        box.style.transform =
            "translateX(-50%)";

        box.style.zIndex =
            "999999";

        box.style.background =
            "#111827";

        box.style.color =
            "white";

        box.style.padding =
            "13px 20px";

        box.style.borderRadius =
            "12px";

        box.style.fontSize =
            "14px";

        box.style.fontWeight =
            "bold";

        box.style.boxShadow =
            "0 8px 30px rgba(0,0,0,0.25)";

        box.style.maxWidth =
            "90%";

        box.style.textAlign =
            "center";


        document.body.appendChild(
            box
        );

    }


    box.textContent =
        message;


    box.style.display =
        "block";


    clearTimeout(
        protectionMessageTimer
    );


    protectionMessageTimer =
        setTimeout(
            function () {

                box.style.display =
                    "none";

            },
            2200
        );

}


/* =====================================================
   LOCKED PAGE
===================================================== */

function showLocked(
    icon,
    title,
    message,
    button1Text,
    button1Link,
    button2Text = "",
    button2Link = ""
) {

    document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            background:#f4f7fb;
            font-family:Arial,sans-serif;
        ">

            <div style="
                width:100%;
                max-width:460px;
                background:white;
                padding:40px 25px;
                border-radius:20px;
                text-align:center;
                box-shadow:0 10px 35px rgba(0,0,0,0.10);
            ">

                <div style="
                    font-size:55px;
                    margin-bottom:15px;
                ">
                    ${icon}
                </div>


                <h2 style="
                    margin-bottom:12px;
                    color:#111827;
                ">
                    ${title}
                </h2>


                <p style="
                    color:#64748b;
                    line-height:1.6;
                    margin-bottom:25px;
                ">
                    ${message}
                </p>


                <a
                    href="${button1Link}"
                    style="
                        display:inline-block;
                        padding:12px 22px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:9px;
                        font-weight:bold;
                        margin:5px;
                    "
                >
                    ${button1Text}
                </a>


                ${
                    button2Text
                    ?
                    `
                    <a
                        href="${button2Link}"
                        style="
                            display:inline-block;
                            padding:12px 22px;
                            background:#e5e7eb;
                            color:#111827;
                            text-decoration:none;
                            border-radius:9px;
                            font-weight:bold;
                            margin:5px;
                        "
                    >
                        ${button2Text}
                    </a>
                    `
                    :
                    ""
                }


                <p style="
                    margin-top:25px;
                    color:#94a3b8;
                    font-size:13px;
                ">
                    🔐 Unique Academic
                </p>

            </div>

        </div>

    `;

}
