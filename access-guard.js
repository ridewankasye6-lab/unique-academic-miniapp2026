/*
=========================================================
 UNIQUE ACADEMIC
 STUDENT ACCESS GUARD + CONTENT PROTECTION
 + FREE TRIAL SYSTEM
=========================================================

 FREE TRIAL SUBJECTS:
    Anthropology
    Psychology

 FREE TRIAL ACCESS:
    Chapter 1 Notes      -> UNLOCKED
    Chapter 1 Quiz       -> UNLOCKED
    Full Notes           -> UNLOCKED

 LOCKED FOR LOGGED-OUT USERS:
    Chapters 2-5 Notes
    Chapters 2-5 Quizzes
    Videos

 LOGGED-OUT USERS:
    Anthropology trial -> ALLOWED
    Psychology trial   -> ALLOWED
    Other subjects     -> LOCKED

 REGISTERED APPROVED STUDENTS:
    ALL SUBJECTS        -> ALLOWED
    INCLUDING ALL TRIAL SUBJECT CONTENT

 ADMIN:
    Full access

 IMPORTANT:
 Browser protection is deterrence only.
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
   ADMIN
===================================================== */

const ADMIN_EMAIL =
    "ridewankasye6@gmail.com";


/* =====================================================
   FREE TRIAL SUBJECTS
===================================================== */

const TRIAL_SUBJECTS = [

    "anthropology",

    "psychology"

];


/* =====================================================
   FREE TRIAL CHAPTER
===================================================== */

const TRIAL_CHAPTER = 1;


/* =====================================================
   CURRENT PAGE
===================================================== */

const currentPage =
    window.location.pathname.toLowerCase();


const currentUrl =
    window.location.href.toLowerCase();


const currentFile =
    currentPage.split("/").pop() || "";


/* =====================================================
   PUBLIC PAGES
===================================================== */

const PUBLIC_PAGES = [

    "",

    "index.html",

    "home.html",

    "student-login.html",

    "registration.html",

    "about.html",

    "help.html"

];


/* =====================================================
   CHECK PUBLIC PAGE
===================================================== */

function isPublicPage() {

    return PUBLIC_PAGES.includes(
        currentFile
    );

}


/* =====================================================
   NORMALIZE SUBJECT
===================================================== */

function normalizeSubject(
    subject
) {

    return String(
        subject || ""
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


/* =====================================================
   GET SUBJECT FROM URL / PAGE
===================================================== */

function getCurrentSubject() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    /*
    =============================================
    ?subject=anthropology
    =============================================
    */

    const urlSubject =
        params.get(
            "subject"
        );


    if (
        urlSubject
    ) {

        return normalizeSubject(
            urlSubject
        );

    }


    /*
    =============================================
    PAGE NAME
    =============================================
    */

    const page =
        currentPage;


    if (
        page.includes("anthropology") ||
        page.includes("anthro")
    ) {

        return "anthropology";

    }


    if (
        page.includes("psychology") ||
        page.includes("psych")
    ) {

        return "psychology";

    }


    if (
        page.includes("global-trends") ||
        page.includes("global_trends")
    ) {

        return "global-trends";

    }


    if (
        page.includes("economics")
    ) {

        return "economics";

    }


    if (
        page.includes("history")
    ) {

        return "history";

    }


    if (
        page.includes("geography")
    ) {

        return "geography";

    }


    if (
        page.includes("logic")
    ) {

        return "logic";

    }


    if (
        page.includes("entrepreneurship")
    ) {

        return "entrepreneurship";

    }


    return "";

}


/* =====================================================
   IS TRIAL SUBJECT?
===================================================== */

function isTrialSubject(
    subject
) {

    return TRIAL_SUBJECTS.includes(
        normalizeSubject(
            subject
        )
    );

}


/* =====================================================
   QUIZ PAGE
===================================================== */

const isQuizPage =
    currentFile === "quiz.html" ||
    currentPage.endsWith(
        "/quiz.html"
    );


/* =====================================================
   GET CHAPTER NUMBER
===================================================== */

function getChapterNumber() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    /*
    =============================================
    ?chapter=1
    =============================================
    */

    const urlChapter =
        params.get(
            "chapter"
        );


    if (
        urlChapter !== null &&
        urlChapter !== ""
    ) {

        const number =
            Number.parseInt(
                urlChapter,
                10
            );


        if (
            Number.isInteger(number) &&
            number > 0
        ) {

            return number;

        }

    }


    /*
    =============================================
    chapter-1
    chapter_1
    chapter1
    =============================================
    */

    const match =
        currentUrl.match(
            /chapter[\s_-]*(\d+)/i
        );


    if (
        match
    ) {

        const number =
            Number.parseInt(
                match[1],
                10
            );


        if (
            Number.isInteger(number) &&
            number > 0
        ) {

            return number;

        }

    }


    return null;

}


/* =====================================================
   GET CONTENT TYPE
===================================================== */

function getContentType() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const type =
        (
            params.get("type") ||
            ""
        )
        .toLowerCase()
        .trim();


    const url =
        currentUrl;


    const page =
        currentPage;


    /*
    =============================================
    QUIZ
    =============================================
    */

    if (
        isQuizPage ||
        type === "quiz"
    ) {

        return "quiz";

    }


    /*
    =============================================
    FULL NOTES
    =============================================
    */

    if (
        type === "full-notes" ||
        url.includes("full-notes") ||
        url.includes("full_notes") ||
        url.includes("fullnotes")
    ) {

        return "full-notes";

    }


    /*
    =============================================
    VIDEO
    =============================================
    */

    if (
        type === "video" ||
        url.includes("video")
    ) {

        return "video";

    }


    /*
    =============================================
    NOTES
    =============================================
    */

    if (
        type === "notes" ||
        url.includes("notes") ||
        page.includes("chapter")
    ) {

        return "notes";

    }


    /*
    =============================================
    SUBJECT LANDING PAGE
    =============================================
    */

    return "subject";

}


/* =====================================================
   TRIAL ACCESS CHECK
===================================================== */

function canUseTrialAccess() {

    const subject =
        getCurrentSubject();


    /*
    =============================================
    NOT A TRIAL SUBJECT
    =============================================
    */

    if (
        !isTrialSubject(
            subject
        )
    ) {

        return false;

    }


    const contentType =
        getContentType();


    const chapter =
        getChapterNumber();


    /*
    =============================================
    SUBJECT LANDING PAGE
    =============================================
    */

    if (
        contentType === "subject"
    ) {

        return true;

    }


    /*
    =============================================
    FULL NOTES
    =============================================
    */

    if (
        contentType === "full-notes"
    ) {

        return true;

    }


    /*
    =============================================
    CHAPTER 1
    =============================================
    */

    if (
        chapter === TRIAL_CHAPTER
    ) {

        /*
        Chapter 1 Notes
        */

        if (
            contentType === "notes"
        ) {

            return true;

        }


        /*
        Chapter 1 Quiz
        */

        if (
            contentType === "quiz"
        ) {

            return true;

        }

    }


    /*
    =============================================
    EVERYTHING ELSE IS LOCKED
    =============================================
    */

    return false;

}


/* =====================================================
   CHECK ADMIN
===================================================== */

function isAdminUser(
    user
) {

    if (
        !user ||
        !user.email
    ) {

        return false;

    }


    return (
        user.email
            .trim()
            .toLowerCase() ===
        ADMIN_EMAIL
            .trim()
            .toLowerCase()
    );

}


/* =====================================================
   GET REGISTRATION ACCESS
===================================================== */

async function getRegistrationAccess(
    user
) {

    const result = {

        approved: false,

        pending: false,

        rejected: false

    };


    if (
        !user ||
        !user.uid
    ) {

        return result;

    }


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


    if (
        snapshot.empty
    ) {

        return result;

    }


    snapshot.forEach(
        (registrationDoc) => {

            const data =
                registrationDoc.data() || {};


            const status =
                String(
                    data.status || ""
                )
                    .trim()
                    .toLowerCase();


            if (
                status === "approved"
            ) {

                result.approved =
                    true;

            }


            else if (
                status === "pending"
            ) {

                result.pending =
                    true;

            }


            else if (
                status === "rejected"
            ) {

                result.rejected =
                    true;

            }

        }
    );


    return result;

}


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
        =================================================
        PUBLIC PAGES
        =================================================

        These pages are never blocked.
        */

        if (
            isPublicPage()
        ) {

            return;

        }


        const subject =
            getCurrentSubject();


        const isTrial =
            isTrialSubject(
                subject
            );


        /*
        =================================================
        ADMIN
        =================================================

        ADMIN MUST BE CHECKED BEFORE TRIAL LOCKING.

        This fixes the main problem where an admin could
        incorrectly receive the trial lock page.
        =================================================
        */

        if (
            user &&
            isAdminUser(
                user
            )
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
        LOGGED-OUT TRIAL ACCESS
        =================================================

        Logged-out users may access ONLY the defined
        free trial content.
        =================================================
        */

        if (
            !user &&
            isTrial
        ) {

            if (
                canUseTrialAccess()
            ) {

                enableTrialPage();

                return;

            }


            showTrialLockedPage(
                subject
            );

            return;

        }


        /*
        =================================================
        LOGGED-OUT NORMAL SUBJECT
        =================================================
        */

        if (
            !user
        ) {

            showLocked(
                "🔒",
                "Login Required",
                "Login or register to access this course.",
                "🔐 Student Login",
                "student-login.html",
                "📝 Register",
                "registration.html",
                "🏠 Home",
                "index.html"
            );

            return;

        }


        /*
        =================================================
        REGISTERED STUDENT
        =================================================
        */

        try {

            const registration =
                await getRegistrationAccess(
                    user
                );


            /*
            =============================================
            APPROVED STUDENT
            =============================================

            APPROVED STUDENTS GET FULL ACCESS.

            This is intentionally checked BEFORE the
            trial-content lock.
            =============================================
            */

            if (
                registration.approved
            ) {

                document.body.classList.add(
                    "student-access"
                );


                grantAccess(
                    "✅ Payment Approved",
                    false
                );


                return;

            }


            /*
            =============================================
            TRIAL CONTENT FOR NON-APPROVED USERS
            =============================================

            Trial remains available even if the user has
            a pending/rejected registration.
            =============================================
            */

            if (
                isTrial &&
                canUseTrialAccess()
            ) {

                enableTrialPage();

                return;

            }


            /*
            =============================================
            NO REGISTRATION
            =============================================
            */

            if (
                !registration.approved &&
                !registration.pending &&
                !registration.rejected
            ) {

                if (
                    isTrial
                ) {

                    showTrialLockedPage(
                        subject
                    );

                    return;

                }


                showLocked(
                    "📝",
                    "Registration Required",
                    "Complete your registration and payment to access this course.",
                    "📝 Register Now",
                    "registration.html",
                    "",
                    "",
                    "🏠 Home",
                    "index.html"
                );

                return;

            }


            /*
            =============================================
            PENDING
            =============================================
            */

            if (
                registration.pending
            ) {

                if (
                    isTrial
                ) {

                    showTrialLockedPage(
                        subject
                    );

                    return;

                }


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

            if (
                registration.rejected
            ) {

                if (
                    isTrial
                ) {

                    showTrialLockedPage(
                        subject
                    );

                    return;

                }


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
            UNKNOWN
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


            /*
            =============================================
            IF VERIFICATION FAILS ON TRIAL SUBJECT
            =============================================

            The free trial itself does not depend on
            Firestore registration verification.

            Therefore Chapter 1 / Full Notes remain usable
            if the content qualifies as trial content.
            =============================================
            */

            if (
                isTrial &&
                canUseTrialAccess()
            ) {

                enableTrialPage();

                return;

            }


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
   ENABLE TRIAL PAGE
===================================================== */

function enableTrialPage() {

    if (
        !document.body
    ) {

        return;

    }


    document.body.classList.add(
        "trial-access"
    );


    document.body.classList.add(
        "student-access"
    );


    /*
    Apply existing protection.
    */

    enableStudentProtection();


    /*
    Mark page as trial.
    */

    document.body.dataset.trial =
        "true";


    /*
    Add trial banner.
    */

    addTrialBanner();


    /*
    Lock unavailable links.
    */

    applyTrialElementLocks();


    /*
    =============================================
    TRIAL ACCESS GRANTED
    =============================================

    quiz.html waits for this event before loading
    quizData.js / additionalQuizData.js / quiz.js.
    */

    document.dispatchEvent(
        new CustomEvent(
            "uniqueAcademicAccessGranted",
            {
                detail: {

                    status:
                        "🎓 Free Trial Access",

                    admin:
                        false,

                    trial:
                        true

                }
            }
        )
    );

}


/* =====================================================
   APPLY TRIAL ELEMENT LOCKS
===================================================== */

function applyTrialElementLocks() {

    if (
        !document.body
    ) {

        return;

    }


    const elements =
        document.querySelectorAll(
            "a, button"
        );


    elements.forEach(
        (element) => {

            const info =
                getElementInfo(
                    element
                );


            if (
                !info.isContent
            ) {

                return;

            }


            /*
            =========================================
            AVAILABLE
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

            lockElement(
                element,
                info
            );

        }
    );

}


/* =====================================================
   GET ELEMENT INFORMATION
===================================================== */

function getElementInfo(
    element
) {

    const href =
        (
            element.getAttribute(
                "href"
            ) ||
            ""
        ).toLowerCase();


    const text =
        (
            element.textContent ||
            ""
        ).toLowerCase();


    const classes =
        String(
            element.className ||
            ""
        ).toLowerCase();


    const combined =
        href +
        " " +
        text +
        " " +
        classes;


    /*
    =============================================
    VIDEO
    =============================================
    */

    if (
        combined.includes("video")
    ) {

        return {

            isContent: true,

            unlocked: false,

            title: "Course Video"

        };

    }


    /*
    =============================================
    FULL NOTES
    =============================================
    */

    if (
        combined.includes("full notes") ||
        combined.includes("full-notes") ||
        combined.includes("full_notes") ||
        combined.includes("fullnotes")
    ) {

        return {

            isContent: true,

            unlocked: true,

            title: "Full Notes"

        };

    }


    /*
    =============================================
    QUIZ
    =============================================
    */

    if (
        combined.includes("quiz") ||
        href.includes("quiz.html")
    ) {

        const chapter =
            extractChapter(
                combined
            );


        /*
        If this is a generic quiz link without
        a chapter number, don't automatically lock it.
        */

        if (
            chapter === null
        ) {

            return {

                isContent: false

            };

        }


        return {

            isContent: true,

            unlocked:
                chapter === TRIAL_CHAPTER,

            title:
                "Chapter " +
                chapter +
                " Quiz"

        };

    }


    /*
    =============================================
    CHAPTER
    =============================================
    */

    const chapter =
        extractChapter(
            combined
        );


    if (
        chapter !== null
    ) {

        return {

            isContent: true,

            unlocked:
                chapter === TRIAL_CHAPTER,

            title:
                "Chapter " +
                chapter +
                " Notes"

        };

    }


    return {

        isContent: false

    };

}


/* =====================================================
   EXTRACT CHAPTER
===================================================== */

function extractChapter(
    text
) {

    const value =
        String(
            text || ""
        );


    /*
    =============================================
    ?chapter=1
    =============================================
    */

    let match =
        value.match(
            /(?:[?&]|^)chapter\s*=\s*(\d+)/i
        );


    if (
        match
    ) {

        return Number.parseInt(
            match[1],
            10
        );

    }


    /*
    =============================================
    chapter-1
    chapter_1
    chapter 1
    chapter1
    =============================================
    */

    match =
        value.match(
            /chapter[\s_-]*(\d+)/i
        );


    if (
        match
    ) {

        return Number.parseInt(
            match[1],
            10
        );

    }


    return null;

}


/* =====================================================
   LOCK ELEMENT
===================================================== */

function lockElement(
    element,
    info
) {

    if (
        !element ||
        element.dataset.trialLocked ===
        "true"
    ) {

        return;

    }


    element.dataset.trialLocked =
        "true";


    const originalHref =
        element.getAttribute(
            "href"
        );


    if (
        originalHref
    ) {

        element.dataset.originalHref =
            originalHref;

    }


    element.removeAttribute(
        "href"
    );


    element.setAttribute(
        "aria-disabled",
        "true"
    );


    element.classList.add(
        "trial-locked"
    );


    /*
    =============================================
    LOCK ICON
    =============================================
    */

    if (
        !element.querySelector(
            ".trial-lock-icon"
        )
    ) {

        const icon =
            document.createElement(
                "span"
            );


        icon.className =
            "trial-lock-icon";


        icon.setAttribute(
            "aria-hidden",
            "true"
        );


        icon.textContent =
            " 🔒";


        element.appendChild(
            icon
        );

    }


    /*
    =============================================
    CLICK
    =============================================
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
   TRIAL BANNER
===================================================== */

function addTrialBanner() {

    if (
        !document.body
    ) {

        return;

    }


    if (
        document.getElementById(
            "uniqueAcademicTrialBanner"
        )
    ) {

        return;

    }


    const subject =
        getCurrentSubject();


    const subjectName =
        subject === "anthropology"
            ? "Anthropology"
            : "Psychology";


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
                    ${escapeHTML(subjectName)} Free Trial
                </strong>

                <span>
                    Chapter 1 + Chapter 1 Quiz +
                    Full Notes are available free.
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
   TRIAL LOCK MESSAGE
===================================================== */

function showTrialLockMessage(
    title
) {

    let overlay =
        document.getElementById(
            "uniqueAcademicTrialOverlay"
        );


    if (
        overlay
    ) {

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
                🎓 Your free trial includes
                Chapter 1, Chapter 1 Quiz and
                Full Notes.
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


    if (
        closeButton
    ) {

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
   TRIAL LOCKED PAGE
===================================================== */

function showTrialLockedPage(
    subject
) {

    const subjectName =
        subject === "anthropology"
            ? "Anthropology"
            : "Psychology";


    document.body.innerHTML = `

        <div class="trial-page-lock">

            <div class="trial-page-card">

                <div class="trial-page-icon">
                    🔒
                </div>

                <div class="trial-page-badge">
                    FULL COURSE CONTENT
                </div>

                <h2>
                    This ${escapeHTML(subjectName)} Content
                    is Locked
                </h2>

                <p>
                    Your free trial includes
                    Chapter 1, Chapter 1 Quiz
                    and Full Notes.
                </p>

                <a
                    href="registration.html"
                    class="trial-page-button"
                >
                    🚀 Get Full Access
                </a>

                <a
                    href="index.html"
                    class="trial-page-home"
                >
                    🏠 Back Home
                </a>

                <div class="trial-page-footer">
                    🔐 Unique Academic
                </div>

            </div>

        </div>

    `;


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
        LOCKED ELEMENT
        =============================================
        */

        .trial-locked {

            position: relative !important;

            opacity: 0.68 !important;

            cursor: pointer !important;

            filter: saturate(0.7);

            transition:
                opacity 0.2s ease,
                transform 0.2s ease;

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
        MODAL
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

            background: white;

            border-radius: 22px;

            padding: 30px 24px;

            text-align: center;

            box-shadow:
                0 25px 70px
                rgba(0,0,0,0.25);

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
        FULL LOCKED PAGE
        =============================================
        */

        .trial-page-lock {

            min-height: 100vh;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            box-sizing: border-box;

            background: #f4f7fb;

            font-family:
                Arial,
                sans-serif;

        }


        .trial-page-card {

            width: 100%;

            max-width: 460px;

            background: white;

            padding: 40px 25px;

            border-radius: 22px;

            text-align: center;

            box-shadow:
                0 10px 35px
                rgba(0,0,0,0.10);

        }


        .trial-page-icon {

            font-size: 55px;

            margin-bottom: 15px;

        }


        .trial-page-badge {

            display: inline-block;

            padding: 6px 11px;

            border-radius: 999px;

            background: #eef2ff;

            color: #4338ca;

            font-size: 10px;

            font-weight: 800;

            margin-bottom: 12px;

        }


        .trial-page-card h2 {

            margin:
                0 0 12px;

            color: #111827;

        }


        .trial-page-card p {

            color: #64748b;

            line-height: 1.6;

            margin-bottom: 25px;

        }


        .trial-page-button {

            display: inline-block;

            padding: 13px 22px;

            background: #2563eb;

            color: white;

            text-decoration: none;

            border-radius: 10px;

            font-weight: bold;

            margin: 5px;

        }


        .trial-page-home {

            display: inline-block;

            padding: 13px 22px;

            background: #e5e7eb;

            color: #111827;

            text-decoration: none;

            border-radius: 10px;

            font-weight: bold;

            margin: 5px;

        }


        .trial-page-footer {

            margin-top: 25px;

            color: #94a3b8;

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


            .trial-banner-text span {

                font-size: 11px;

            }


            .trial-banner-button {

                padding:
                    8px 10px;

                font-size: 11px;

            }

        }

    `;


    if (
        document.head
    ) {

        document.head.appendChild(
            style
        );

    }

}


/* =====================================================
   ADMIN / STUDENT ACCESS
===================================================== */

function grantAccess(
    statusText,
    isAdmin = false
) {

    if (
        !document.body
    ) {

        return;

    }


    if (
        isAdmin
    ) {

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
    ADMIN DOES NOT NEED STUDENT RESTRICTIONS
    =============================================
    */

    if (
        !isAdmin
    ) {

        enableStudentProtection();

    }


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
   STUDENT PROTECTION
===================================================== */

function enableStudentProtection() {

    if (
        !document.body
    ) {

        return;

    }


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
    RIGHT CLICK
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
    TEXT SELECTION
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
    COPY
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
    CUT
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
    DRAG
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
    IMAGES
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
    KEYBOARD
    =============================================
    */

    document.addEventListener(
        "keydown",
        function (event) {

            const key =
                String(
                    event.key || ""
                ).toLowerCase();


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
            COPY
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
            CUT
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
            SAVE
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
            PRINT
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
            VIEW SOURCE
            */

            if (
                ctrl &&
                key === "u"
            ) {

                event.preventDefault();

                return;

            }


            /*
            DEVTOOLS
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

        },
        true
    );


    /*
    =============================================
    PRINT PROTECTION
    =============================================
    */

    if (
        !document.getElementById(
            "student-print-protection"
        )
    ) {

        const printStyle =
            document.createElement(
                "style"
            );


        printStyle.id =
            "student-print-protection";


        printStyle.textContent = `

            @media print {

                body * {

                    display:
                        none !important;

                }

                body::before {

                    content:
                        "Unique Academic — Course printing is not permitted.";

                    display:
                        block !important;

                    font-size:
                        24px;

                    text-align:
                        center;

                    margin-top:
                        100px;

                }

            }

        `;


        document.head.appendChild(
            printStyle
        );

    }


    /*
    =============================================
    USER SELECTION
    =============================================
    */

    if (
        !document.getElementById(
            "student-content-protection"
        )
    ) {

        const protectionStyle =
            document.createElement(
                "style"
            );


        protectionStyle.id =
            "student-content-protection";


        protectionStyle.textContent = `

            body.student-access,
            body.trial-access {

                -webkit-user-select:
                    none !important;

                -moz-user-select:
                    none !important;

                user-select:
                    none !important;

            }


            body.student-access img,
            body.trial-access img {

                -webkit-user-drag:
                    none !important;

                user-drag:
                    none !important;

            }


            body.student-access,
            body.trial-access {

                -webkit-touch-callout:
                    none !important;

            }

        `;


        document.head.appendChild(
            protectionStyle
        );

    }


    /*
    =============================================
    VISIBILITY PROTECTION
    =============================================
    */

    if (
        !document.body.dataset.visibilityProtectionEnabled
    ) {

        document.body.dataset.visibilityProtectionEnabled =
            "true";


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


        const visibilityStyle =
            document.createElement(
                "style"
            );


        visibilityStyle.id =
            "unique-academic-visibility-protection";


        visibilityStyle.textContent = `

            body.student-access.unique-academic-hidden
            > *,
            body.trial-access.unique-academic-hidden
            > * {

                visibility:
                    hidden !important;

            }


            body.student-access.unique-academic-hidden::after,
            body.trial-access.unique-academic-hidden::after {

                content:
                    "🔒 Unique Academic — Content Protected";

                position:
                    fixed;

                top:
                    50%;

                left:
                    50%;

                transform:
                    translate(-50%, -50%);

                z-index:
                    999999;

                visibility:
                    visible !important;

                background:
                    #111827;

                color:
                    white;

                padding:
                    18px 25px;

                border-radius:
                    14px;

                font-size:
                    16px;

                font-weight:
                    bold;

                text-align:
                    center;

            }

        `;


        document.head.appendChild(
            visibilityStyle
        );

    }

}


/* =====================================================
   PROTECTION MESSAGE
===================================================== */

let protectionMessageTimer =
    null;


function showProtectionMessage(
    message
) {

    if (
        !document.body
    ) {

        return;

    }


    let box =
        document.getElementById(
            "uniqueAcademicProtectionMessage"
        );


    if (
        !box
    ) {

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

                if (
                    box
                ) {

                    box.style.display =
                        "none";

                }

            },
            2200
        );

}


/* =====================================================
   NORMAL LOCKED PAGE
===================================================== */

function showLocked(
    icon,
    title,
    message,
    button1Text,
    button1Link,
    button2Text = "",
    button2Link = "",
    button3Text = "",
    button3Link = ""
) {

    if (
        !document.body
    ) {

        return;

    }


    const safeIcon =
        escapeHTML(
            icon
        );


    const safeTitle =
        escapeHTML(
            title
        );


    const safeMessage =
        escapeHTML(
            message
        );


    const safeButton1Text =
        escapeHTML(
            button1Text
        );


    const safeButton1Link =
        escapeAttribute(
            button1Link
        );


    const safeButton2Text =
        escapeHTML(
            button2Text
        );


    const safeButton2Link =
        escapeAttribute(
            button2Link
        );


    const safeButton3Text =
        escapeHTML(
            button3Text
        );


    const safeButton3Link =
        escapeAttribute(
            button3Link
        );


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
                    ${safeIcon}
                </div>


                <h2 style="
                    margin-bottom:12px;
                    color:#111827;
                ">
                    ${safeTitle}
                </h2>


                <p style="
                    color:#64748b;
                    line-height:1.6;
                    margin-bottom:25px;
                ">
                    ${safeMessage}
                </p>


                <a
                    href="${safeButton1Link}"
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
                    ${safeButton1Text}
                </a>


                ${
                    button2Text
                    ?
                    `
                    <a
                        href="${safeButton2Link}"
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
                        ${safeButton2Text}
                    </a>
                    `
                    :
                    ""
                }


                ${
                    button3Text
                    ?
                    `
                    <a
                        href="${safeButton3Link}"
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
                        ${safeButton3Text}
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


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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
   ESCAPE ATTRIBUTE
===================================================== */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}
