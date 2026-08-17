/* =========================================
   UNIQUE ACADEMIC
   ADMIN PANEL
   Firebase Authentication + Firestore
   Payment Screenshot Viewer
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
   CHECK REQUIRED HTML
========================================= */

if (!registrationList) {
    console.error(
        "Admin error: registrationList was not found."
    );
}


/* =========================================
   CHECK ADMIN USER
========================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        /*
         * ADMIN EMAIL CHECK
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
         * ADMIN VERIFIED
         */

        await loadRegistrations();

    }
);


/* =========================================
   LOAD REGISTRATIONS
========================================= */

async function loadRegistrations() {

    try {

        /*
         * SHOW LOADING
         */

        registrationList.innerHTML = `

            <div class="loading">

                ⏳ Loading registrations...

            </div>

        `;


        /*
         * GET FIRESTORE DATA
         */

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "registrations"
                )
            );


        /*
         * COUNTERS
         */

        let total = 0;

        let pending = 0;

        let approved = 0;

        let rejected = 0;


        /*
         * CLEAR LIST
         */

        registrationList.innerHTML = "";


        /*
         * NO REGISTRATIONS
         */

        if (snapshot.empty) {

            registrationList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-state-icon">
                        📭
                    </div>

                    <h3>
                        No registrations yet
                    </h3>

                    <p>
                        Student registrations will appear here.
                    </p>

                </div>

            `;


            updateCounters(
                0,
                0,
                0,
                0
            );

            return;
        }


        /*
         * LOOP THROUGH REGISTRATIONS
         */

        snapshot.forEach(
            (registrationDoc) => {

                const data =
                    registrationDoc.data();


                total++;


                /*
                 * STATUS
                 */

                const status =
                    data.status ||
                    "pending";


                if (
                    status === "pending"
                ) {

                    pending++;

                }

                else if (
                    status === "approved"
                ) {

                    approved++;

                }

                else if (
                    status === "rejected"
                ) {

                    rejected++;

                }


                /*
                 * SCREENSHOT
                 *
                 * IMPORTANT:
                 * registration.js saves:
                 *
                 * paymentScreenshotURL
                 *
                 */

                let screenshotHTML = `

                    <div class="screenshot-section">

                        <h4>
                            📷 Payment Screenshot
                        </h4>

                        <div class="no-screenshot">

                            No payment screenshot uploaded.

                        </div>

                    </div>

                `;


                /*
                 * SCREENSHOT EXISTS
                 */

                if (
                    data.paymentScreenshotURL
                ) {

                    const screenshotURL =
                        String(
                            data.paymentScreenshotURL
                        );


                    screenshotHTML = `

                        <div class="screenshot-section">

                            <h4>
                                📷 Payment Screenshot
                            </h4>

                            <button
                                type="button"
                                class="view-screenshot-btn"
                                onclick="openScreenshot(
                                    ${JSON.stringify(
                                        screenshotURL
                                    )}
                                )"
                            >
                                🔍 View Screenshot
                            </button>


                            <img
                                class="screenshot-preview"
                                src="${escapeHTML(
                                    screenshotURL
                                )}"
                                alt="Student payment screenshot"
                                loading="lazy"
                                onclick="openScreenshot(
                                    ${JSON.stringify(
                                        screenshotURL
                                    )}
                                )"
                            >

                        </div>

                    `;

                }


                /*
                 * REJECTION REASON
                 */

                let rejectionHTML = "";


                if (
                    status === "rejected" &&
                    data.rejectionReason
                ) {

                    rejectionHTML = `

                        <div class="rejection-box">

                            <strong>
                                Rejection Reason
                            </strong>

                            ${escapeHTML(
                                data.rejectionReason
                            )}

                        </div>

                    `;

                }


                /*
                 * ACTION BUTTONS
                 */

                let actionHTML = "";


                if (
                    status === "pending"
                ) {

                    actionHTML = `

                        <div class="actions">

                            <button
                                type="button"
                                class="approve-btn"
                                data-id="${escapeHTML(
                                    registrationDoc.id
                                )}"
                            >
                                ✅ Approve
                            </button>


                            <button
                                type="button"
                                class="reject-btn"
                                data-id="${escapeHTML(
                                    registrationDoc.id
                                )}"
                            >
                                ❌ Reject
                            </button>

                        </div>

                    `;

                }


                /*
                 * PAYMENT INFORMATION
                 */

                const paymentMethod =
                    data.paymentMethod ||
                    "—";

                const paymentReference =
                    data.paymentReference ||
                    "—";

                const amount =
                    data.amount !== undefined
                        ? data.amount
                        : 300;

                const currency =
                    data.currency ||
                    "ETB";


                /*
                 * STUDENT CARD
                 */

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

                    </div>


                    <!-- =====================
                         PAYMENT INFORMATION
                    ====================== -->

                    <div class="payment-info">

                        <div class="payment-info-title">

                            💳 Payment Information

                        </div>


                        <p>

                            Payment Method:
                            <strong>
                                ${escapeHTML(
                                    paymentMethod
                                )}
                            </strong>

                        </p>


                        <p>

                            Amount:
                            <strong>
                                ${escapeHTML(
                                    String(amount)
                                )}
                                ${escapeHTML(
                                    currency
                                )}
                            </strong>

                        </p>


                        <p>

                            Payment Reference:
                            <strong>
                                ${escapeHTML(
                                    paymentReference
                                )}
                            </strong>

                        </p>

                    </div>


                    <!-- =====================
                         SCREENSHOT
                    ====================== -->

                    ${screenshotHTML}


                    <!-- =====================
                         STATUS
                    ====================== -->

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


                    <!-- =====================
                         REJECTION REASON
                    ====================== -->

                    ${rejectionHTML}


                    <!-- =====================
                         ACTIONS
                    ====================== -->

                    ${actionHTML}

                `;


                registrationList.appendChild(
                    card
                );

            }
        );


        /*
         * UPDATE COUNTERS
         */

        updateCounters(
            total,
            pending,
            approved,
            rejected
        );


        /*
         * ADD BUTTON EVENTS
         */

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
   UPDATE COUNTERS
========================================= */

function updateCounters(
    total,
    pending,
    approved,
    rejected
) {

    if (totalCount) {

        totalCount.textContent =
            total;

    }


    if (pendingCount) {

        pendingCount.textContent =
            pending;

    }


    if (approvedCount) {

        approvedCount.textContent =
            approved;

    }


    if (rejectedCount) {

        rejectedCount.textContent =
            rejected;

    }

}


/* =========================================
   ACTION BUTTON LISTENERS
========================================= */

function addActionListeners() {


    /*
     * APPROVE BUTTONS
     */

    document
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        approveRegistration(
                            button.dataset.id
                        );

                    }
                );

            }
        );


    /*
     * REJECT BUTTONS
     */

    document
        .querySelectorAll(
            ".reject-btn"
        )
        .forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        rejectRegistration(
                            button.dataset.id
                        );

                    }
                );

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


        await loadRegistrations();

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
        reason === null ||
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


        await loadRegistrations();

    }

    catch (error) {

        console.error(
            "Reject error:",
            error
        );


        alert(
            "❌ Failed to reject student."
        );

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

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

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "❌ Logout failed. Please try again."
                );

            }

        }
    );

}
