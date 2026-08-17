/* =========================================
   UNIQUE ACADEMIC
   ADMIN PANEL
   Firebase + Cloud Firestore

   Registration Management
   + Payment Screenshot Viewer
========================================= */

import {
    db,
    auth
} from "./firebase-config.js";


import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


/* =========================================
   ADMIN EMAIL
========================================= */

const ADMIN_EMAIL =
    "ridewankasye6@gmail.com";


/* =========================================
   HTML ELEMENTS
========================================= */

const registrationList =
    document.getElementById(
        "registrationList"
    );


const totalCount =
    document.getElementById(
        "totalCount"
    );


const pendingCount =
    document.getElementById(
        "pendingCount"
    );


const approvedCount =
    document.getElementById(
        "approvedCount"
    );


const rejectedCount =
    document.getElementById(
        "rejectedCount"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


/* =========================================
   CHECK ADMIN
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        /*
        =====================================
        NOT LOGGED IN
        =====================================
        */

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        /*
        =====================================
        CHECK ADMIN EMAIL
        =====================================
        */

        if (
            !user.email ||
            user.email.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            alert(
                "❌ Admin access required."
            );


            window.location.href =
                "index.html";


            return;
        }


        /*
        =====================================
        ADMIN VERIFIED
        =====================================
        */

        loadRegistrations();

    }
);


/* =========================================
   LOAD REGISTRATIONS
========================================= */

async function loadRegistrations() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "registrations"
                )
            );


        /* =================================
           COUNTERS
        ================================= */

        let total = 0;

        let pending = 0;

        let approved = 0;

        let rejected = 0;


        registrationList.innerHTML =
            "";


        /* =================================
           NO REGISTRATIONS
        ================================= */

        if (snapshot.empty) {

            registrationList.innerHTML = `

                <div class="loading">

                    📭 No registrations yet.

                </div>

            `;

        }


        /* =================================
           DISPLAY REGISTRATIONS
        ================================= */

        snapshot.forEach(
            (registrationDoc) => {

                const data =
                    registrationDoc.data();


                total++;


                /*
                =================================
                STATUS
                =================================
                */

                const status =
                    data.status ||
                    "pending";


                /*
                =================================
                COUNT STATUS
                =================================
                */

                if (
                    status === "pending"
                ) {

                    pending++;

                }


                if (
                    status === "approved"
                ) {

                    approved++;

                }


                if (
                    status === "rejected"
                ) {

                    rejected++;

                }


                /* =================================
                   PAYMENT SCREENSHOT
                =================================

                   IMPORTANT:

                   registration.js saves:

                   paymentScreenshotURL

                   So admin.js must read:

                   data.paymentScreenshotURL
                ================================= */

                let screenshotHTML = `

                    <div
                        class="payment-screenshot"
                        style="
                            margin-top:15px;
                            padding:14px;
                            border-radius:10px;
                            background:#f8fafc;
                            border:1px solid #e5e7eb;
                        "
                    >

                        <strong>
                            📷 Payment Screenshot
                        </strong>

                        <div
                            style="
                                margin-top:8px;
                                color:#64748b;
                            "
                        >
                            Screenshot not uploaded.
                        </div>

                    </div>

                `;


                /*
                =================================
                SCREENSHOT EXISTS
                =================================
                */

                if (
                    data.paymentScreenshotURL
                ) {

                    const screenshotURL =
                        String(
                            data.paymentScreenshotURL
                        );


                    screenshotHTML = `

                        <div
                            class="payment-screenshot"
                            style="
                                margin-top:15px;
                                padding:14px;
                                border-radius:10px;
                                background:#f8fafc;
                                border:1px solid #e5e7eb;
                            "
                        >

                            <strong>
                                📷 Payment Screenshot
                            </strong>


                            <div
                                style="
                                    margin-top:10px;
                                "
                            >

                                <a
                                    href="${escapeHTML(
                                        screenshotURL
                                    )}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="screenshot-btn"
                                    style="
                                        display:inline-block;
                                        text-decoration:none;
                                        background:#2563eb;
                                        color:white;
                                        padding:10px 15px;
                                        border-radius:8px;
                                        font-weight:bold;
                                    "
                                >

                                    🔍 View Screenshot

                                </a>

                            </div>


                            <div
                                style="
                                    margin-top:8px;
                                    color:#64748b;
                                    font-size:13px;
                                "
                            >

                                Tap the button to view
                                the student's payment screenshot.

                            </div>

                        </div>

                    `;

                }


                /* =================================
                   STUDENT CARD
                ================================= */

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "student-card";


                card.innerHTML = `

                    <h3>

                        👤 ${escapeHTML(
                            data.fullName ||
                            "Unknown Student"
                        )}

                    </h3>


                    <div class="student-info">

                        📧 Email:

                        ${escapeHTML(
                            data.email ||
                            "—"
                        )}

                        <br>


                        📱 Phone:

                        ${escapeHTML(
                            data.phone ||
                            "—"
                        )}

                        <br>


                        🎓 University:

                        ${escapeHTML(
                            data.university ||
                            "—"
                        )}

                        <br>


                        📚 Department:

                        ${escapeHTML(
                            data.department ||
                            "—"
                        )}

                        <br>


                        💳 Payment Method:

                        <strong>

                            ${escapeHTML(
                                data.paymentMethod ||
                                "—"
                            )}

                        </strong>

                        <br>


                        💰 Amount:

                        <strong>

                            ${escapeHTML(
                                String(
                                    data.amount ||
                                    300
                                )
                            )}

                            ${escapeHTML(
                                data.currency ||
                                "ETB"
                            )}

                        </strong>

                        <br>


                        🔢 Payment Reference:

                        <strong>

                            ${escapeHTML(
                                data.paymentReference ||
                                "—"
                            )}

                        </strong>

                    </div>


                    ${screenshotHTML}


                    <br>


                    <span
                        class="status ${escapeHTML(
                            status
                        )}"
                    >

                        ${escapeHTML(
                            status.toUpperCase()
                        )}

                    </span>


                    ${
                        status === "rejected" &&
                        data.rejectionReason
                        ?

                        `

                        <div
                            style="
                                margin-top:10px;
                                padding:12px;
                                background:#fee2e2;
                                color:#991b1b;
                                border-radius:8px;
                            "
                        >

                            <strong>
                                ❌ Rejection Reason:
                            </strong>

                            <br>

                            ${escapeHTML(
                                data.rejectionReason
                            )}

                        </div>

                        `

                        :

                        ""
                    }


                    <div class="actions">

                        ${
                            status === "pending"

                            ?

                            `

                            <button
                                class="approve-btn"
                                data-id="${escapeHTML(
                                    registrationDoc.id
                                )}"
                            >

                                ✅ Approve

                            </button>


                            <button
                                class="reject-btn"
                                data-id="${escapeHTML(
                                    registrationDoc.id
                                )}"
                            >

                                ❌ Reject

                            </button>

                            `

                            :

                            ""
                        }

                    </div>

                `;


                registrationList.appendChild(
                    card
                );

            }
        );


        /* =================================
           UPDATE COUNTERS
        ================================= */

        totalCount.textContent =
            total;


        pendingCount.textContent =
            pending;


        approvedCount.textContent =
            approved;


        rejectedCount.textContent =
            rejected;


        /* =================================
           ACTION BUTTONS
        ================================= */

        addActionListeners();

    }

    catch (error) {

        console.error(
            "Load registrations error:",
            error
        );


        registrationList.innerHTML = `

            <div class="loading">

                ❌ Could not load registrations.

                <br><br>

                ${escapeHTML(
                    error.message ||
                    "Unknown error"
                )}

            </div>

        `;

    }

}


/* =========================================
   ACTION BUTTONS
========================================= */

function addActionListeners() {


    /* =================================
       APPROVE BUTTONS
    ================================= */

    document
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(
            (button) => {

                button.onclick =
                    () => {

                        approveRegistration(
                            button.dataset.id
                        );

                    };

            }
        );


    /* =================================
       REJECT BUTTONS
    ================================= */

    document
        .querySelectorAll(
            ".reject-btn"
        )
        .forEach(
            (button) => {

                button.onclick =
                    () => {

                        rejectRegistration(
                            button.dataset.id
                        );

                    };

            }
        );

}


/* =========================================
   APPROVE REGISTRATION
========================================= */

async function approveRegistration(
    id
) {

    const confirmed =
        confirm(
            "Are you sure you want to approve this registration?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const registrationRef =
            doc(
                db,
                "registrations",
                id
            );


        await updateDoc(
            registrationRef,
            {
                status:
                    "approved"
            }
        );


        alert(
            "✅ Student approved successfully!"
        );


        loadRegistrations();

    }

    catch (error) {

        console.error(
            "Approve error:",
            error
        );


        alert(
            "❌ Failed to approve student."
        );

    }

}


/* =========================================
   REJECT REGISTRATION
========================================= */

async function rejectRegistration(
    id
) {

    const reason =
        prompt(
            "Enter the reason for rejection:"
        );


    if (
        !reason ||
        reason.trim() === ""
    ) {

        return;

    }


    try {

        const registrationRef =
            doc(
                db,
                "registrations",
                id
            );


        await updateDoc(
            registrationRef,
            {

                status:
                    "rejected",

                rejectionReason:
                    reason.trim()

            }
        );


        alert(
            "❌ Registration rejected."
        );


        loadRegistrations();

    }

    catch (error) {

        console.error(
            "Reject error:",
            error
        );


        alert(
            "❌ Failed to reject registration."
        );

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================
   LOGOUT
========================================= */

logoutBtn.onclick =
    async () => {

        try {

            await signOut(
                auth
            );


            window.location.href =
                "login.html";

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };
