import { db, auth } from "./firebase-config.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const ADMIN_EMAIL = "ridewankasye6@gmail.com";


/*
=========================================
ACCESS GUARD
=========================================
*/

onAuthStateChanged(auth, async (user) => {

    /*
    --------------------------------------
    NOT LOGGED IN
    --------------------------------------
    */

    if (!user) {

        showLocked(
            "🔒",
            "Login Required",
            "Please login or create an account to access this content.",
            "🔐 Login",
            "login.html",
            "📝 Create Account",
            "registration.html"
        );

        return;
    }


    /*
    --------------------------------------
    ADMIN
    --------------------------------------
    */

    if (
        user.email &&
        user.email.toLowerCase() ===
        ADMIN_EMAIL.toLowerCase()
    ) {

        grantAccess("👨‍💼 Admin Access");

        return;
    }


    /*
    --------------------------------------
    FIND REGISTRATION
    --------------------------------------
    */

    try {

        const registrationQuery = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid)
        );


        const snapshot = await getDocs(
            registrationQuery
        );


        /*
        ----------------------------------
        NO REGISTRATION
        ----------------------------------
        */

        if (snapshot.empty) {

            showLocked(
                "📝",
                "Registration Required",
                "Please complete your registration and payment to access this content.",
                "📝 Register Now",
                "registration.html",
                "🏠 Home",
                "index.html"
            );

            return;
        }


        /*
        ----------------------------------
        FIND APPROVED REGISTRATION
        ----------------------------------
        */

        let registration = null;

        snapshot.forEach((doc) => {

            const data = doc.data();

            if (data.status === "approved") {

                registration = data;

            }

        });


        /*
        ----------------------------------
        APPROVED
        ----------------------------------
        */

        if (registration) {

            grantAccess("✅ Payment Approved");

            return;
        }


        /*
        ----------------------------------
        CHECK PENDING
        ----------------------------------
        */

        let pendingRegistration = false;

        snapshot.forEach((doc) => {

            const data = doc.data();

            if (data.status === "pending") {

                pendingRegistration = true;

            }

        });


        if (pendingRegistration) {

            showLocked(
                "⏳",
                "Payment Verification Pending",
                "Your registration has been submitted and is waiting for administrator approval.",
                "🏠 Back Home",
                "index.html"
            );

            return;
        }


        /*
        ----------------------------------
        REJECTED / OTHER
        ----------------------------------
        */

        showLocked(
            "❌",
            "Access Not Approved",
            "Your registration has not been approved for course access.",
            "🏠 Back Home",
            "index.html",
            "📝 Register Again",
            "registration.html"
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
            "We could not verify your account right now. Please try again.",
            "🏠 Back Home",
            "index.html"
        );

    }

});


/*
=========================================
SHOW LOCKED MESSAGE
=========================================
*/

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
                max-width:500px;
                background:white;
                padding:40px 25px;
                border-radius:18px;
                text-align:center;
                box-shadow:0 8px 30px rgba(0,0,0,0.08);
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

            </div>

        </div>

    `;

}


/*
=========================================
GRANT ACCESS
=========================================
*/

function grantAccess(statusText) {

    document.body.classList.add(
        "access-granted"
    );

    document.dispatchEvent(
        new CustomEvent(
            "uniqueAcademicAccessGranted",
            {
                detail: {
                    status: statusText
                }
            }
        )
    );

}
