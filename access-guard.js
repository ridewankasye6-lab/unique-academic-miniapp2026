/*
=========================================================
 UNIQUE ACADEMIC
 STUDENT ACCESS GUARD + CONTENT PROTECTION
=========================================================

 ADMIN:
    Full access
    No content restrictions

 APPROVED STUDENTS:
    Course access allowed
    Copy disabled
    Text selection disabled
    Right click disabled
    Image dragging disabled
    Print disabled
    Common save/copy shortcuts disabled
    Common developer shortcuts blocked

 IMPORTANT:
 Browser-level protection is deterrence only.
 Firebase rules remain the real security layer.
=========================================================
*/


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
   PAGE INFORMATION
===================================================== */

const currentPage =
    window.location.pathname.toLowerCase();


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

        ADMIN BYPASS:
        Admin receives completely unrestricted access.
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

                /*
                 * Student gets course access.
                 *
                 * Protection is enabled here.
                 */

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
    APPLY PROTECTION ONLY TO STUDENTS
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
   STUDENT CONTENT PROTECTION
===================================================== */

function enableStudentProtection() {

    /*
    Avoid applying protection twice.
    */

    if (
        document.body.dataset.protectionEnabled ===
        "true"
    ) {

        return;

    }


    document.body.dataset.protectionEnabled =
        "true";


    /* =================================================
       DISABLE RIGHT CLICK
    ================================================= */

    document.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /* =================================================
       DISABLE TEXT SELECTION
    ================================================= */

    document.addEventListener(
        "selectstart",
        function (event) {

            /*
             * Keep input fields usable.
             */

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


    /* =================================================
       DISABLE COPY
    ================================================= */

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


    /* =================================================
       DISABLE CUT
    ================================================= */

    document.addEventListener(
        "cut",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /* =================================================
       DISABLE DRAGGING
    ================================================= */

    document.addEventListener(
        "dragstart",
        function (event) {

            event.preventDefault();

        },
        true
    );


    /* =================================================
       DISABLE IMAGE DRAGGING
    ================================================= */

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
     * Catch images added later.
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


    /* =================================================
       KEYBOARD PROTECTION
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            const key =
                event.key.toLowerCase();


            const ctrl =
                event.ctrlKey ||
                event.metaKey;


            /*
             * Allow normal typing in form fields.
             */

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
             * -----------------------------------------
             * COPY
             * Ctrl+C / Cmd+C
             * -----------------------------------------
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
             * -----------------------------------------
             * CUT
             * -----------------------------------------
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
             * -----------------------------------------
             * SAVE PAGE
             * Ctrl+S
             * -----------------------------------------
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
             * -----------------------------------------
             * PRINT
             * Ctrl+P
             * -----------------------------------------
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
             * -----------------------------------------
             * VIEW SOURCE
             * Ctrl+U
             * -----------------------------------------
             */

            if (
                ctrl &&
                key === "u"
            ) {

                event.preventDefault();

                return;

            }


            /*
             * -----------------------------------------
             * DEVTOOLS
             *
             * F12
             * Ctrl+Shift+I
             * Ctrl+Shift+J
             * Ctrl+Shift+C
             * -----------------------------------------
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
             * -----------------------------------------
             * PRINT SCREEN KEY
             *
             * Browser cannot reliably stop OS
             * screenshots, but we can respond to
             * the keyboard event when available.
             * -----------------------------------------
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


    /* =================================================
       DISABLE PRINTING
    ================================================= */

    const printStyle =
        document.createElement("style");


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


    /* =================================================
       DISABLE USER SELECTION WITH CSS
    ================================================= */

    const protectionStyle =
        document.createElement("style");


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
/* =================================================
   HIDE PROTECTED CONTENT WHEN PAGE IS NOT VISIBLE
   ================================================= */

let pageWasHidden = false;

document.addEventListener("visibilitychange", function () {

    if (document.hidden) {

        pageWasHidden = true;

        document.body.classList.add(
            "unique-academic-hidden"
        );

    } else if (pageWasHidden) {

        document.body.classList.remove(
            "unique-academic-hidden"
        );

    }

});


/* =================================================
   TEMPORARY SCREEN PROTECTION STYLE
   ================================================= */

const visibilityProtectionStyle =
    document.createElement("style");

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
            0 10px 35px rgba(0,0,0,0.35);

    }

`;

document.head.appendChild(
    visibilityProtectionStyle
);
}


/* =====================================================
   PROTECTION MESSAGE
===================================================== */

let protectionMessageTimer = null;


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
