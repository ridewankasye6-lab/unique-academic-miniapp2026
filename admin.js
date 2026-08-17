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


const ADMIN_EMAIL =
    "ridewankasye6@gmail.com";


/* =========================================
   HTML ELEMENTS
========================================= */

const registrationList =
    document.getElementById("registrationList");

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const approvedCount =
    document.getElementById("approvedCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const logoutBtn =
    document.getElementById("logoutBtn");


/* =========================================
   CHECK ADMIN
========================================= */

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    if (
        !user.email ||
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        alert("❌ Admin access required.");

        window.location.href =
            "index.html";

        return;
    }


    loadRegistrations();

});


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


        let total = 0;
        let pending = 0;
        let approved = 0;
        let rejected = 0;


        registrationList.innerHTML = "";


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

        }


        snapshot.forEach(
            (registrationDoc) => {

                const data =
                    registrationDoc.data();


                total++;


                const status =
                    data.status || "pending";


                if (status === "pending") {
                    pending++;
                }


                if (status === "approved") {
                    approved++;
                }


                if (status === "rejected") {
                    rejected++;
                }


                /* =================================
                   SCREENSHOT
                ================================= */

                let screenshotHTML = `

                    <div class="screenshot-section">

                        <h4>
                            📷 Payment Screenshot
                        </h4>

                        <div class="no-screenshot">
                            ❌ No screenshot uploaded
                        </div>

                    </div>

                `;


                /*
                 * IMPORTANT:
                 *
                 * registration.js saves:
                 *
                 * paymentScreenshotURL
                 *
                 */

                const screenshotURL =
                    data.paymentScreenshotURL;


                if (
                    screenshotURL &&
                    typeof screenshotURL === "string" &&
                    screenshotURL.trim() !== ""
                ) {

                    screenshotHTML = `

                        <div class="screenshot-section">

                            <h4>
                                📷 Payment Screenshot
                            </h4>

                            <button
                                type="button"
                                class="view-screenshot-btn"
                                data-screenshot-url="${escapeHTML(
                                    screenshotURL
                                )}"
                            >
                                👁️ View Screenshot
                            </button>

                            <br>

                            <img
                                class="screenshot-preview"
                                src="${escapeHTML(
                                    screenshotURL
                                )}"
                                alt="Student payment screenshot"
                                loading="lazy"
                            >

                        </div>

                    `;

                }


                /* =================================
                   REJECTION REASON
                ================================= */

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


                /* =================================
                   STUDENT CARD
                ================================= */

                const card =
                    document.createElement("div");


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
                            data.email || "—"
                        )}

                        <br>


                        📱 Phone:
                        ${escapeHTML(
                            data.phone || "—"
                        )}

                        <br>


                        🎓 University:
                        ${escapeHTML(
                            data.university || "—"
                        )}

                        <br>


                        📚 Department:
                        ${escapeHTML(
                            data.department || "—"
                        )}

                    </div>


                    <div class="payment-info">

                        <div class="payment-info-title">
                            💳 Payment Information
                        </div>


                        <p>

                            Method:
                            <strong>
                                ${escapeHTML(
                                    data.paymentMethod ||
                                    "—"
                                )}
                            </strong>

                        </p>


                        <p>

                            Amount:
                            <strong>
                                ${escapeHTML(
                                    String(
                                        data.amount || 300
                                    )
                                )}
                                ${escapeHTML(
                                    data.currency ||
                                    "ETB"
                                )}
                            </strong>

                        </p>


                        <p>

                            Reference:
                            <strong>
                                ${escapeHTML(
                                    data.paymentReference ||
                                    "—"
                                )}
                            </strong>

                        </p>

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


                    ${rejectionHTML}


                    <div class="actions">

                        ${
                            status === "pending"
                            ?

                            `

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

                            `

                            :

                            ""
                        }

                    </div>

                `;


                registrationList.appendChild(card);

            }
        );


        /* =================================
           COUNTERS
        ================================= */

        totalCount.textContent =
            total;

        pendingCount.textContent =
            pending;

        approvedCount.textContent =
            approved;

        rejectedCount.textContent =
            rejected;


        addActionListeners();

        addScreenshotListeners();

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
   SCREENSHOT BUTTONS
========================================= */

function addScreenshotListeners() {

    document
        .querySelectorAll(
            ".view-screenshot-btn"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const url =
                        this.dataset.screenshotUrl;


                    if (!url) {

                        alert(
                            "❌ Screenshot URL is missing."
                        );

                        return;

                    }


                    openScreenshot(url);

                }
            );

        });


    /*
     * ALSO ALLOW CLICKING THE PREVIEW IMAGE
     */

    document
        .querySelectorAll(
            ".screenshot-preview"
        )
        .forEach(image => {

            image.addEventListener(
                "click",
                function () {

                    if (this.src) {

                        openScreenshot(
                            this.src
                        );

                    }

                }
            );

        });

}


/* =========================================
   OPEN SCREENSHOT
========================================= */

function openScreenshot(url) {

    const imageModal =
        document.getElementById(
            "imageModal"
        );

    const modalImage =
        document.getElementById(
            "modalImage"
        );


    if (!imageModal || !modalImage) {

        /*
         * FALLBACK:
         * If modal is unavailable,
         * open image directly.
         */

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

        return;

    }


    /*
     * IMPORTANT:
     * Set image first.
     */

    modalImage.onload = function () {

        imageModal.classList.add(
            "active"
        );

        imageModal.setAttribute(
            "aria-hidden",
            "false"
        );

    };


    modalImage.onerror = function () {

        imageModal.classList.remove(
            "active"
        );

        alert(
            "❌ The screenshot could not be loaded. Please check Firebase Storage rules."
        );

        modalImage.src = "";

    };


    modalImage.src = url;

}


/* =========================================
   BUTTONS
========================================= */

function addActionListeners() {

    document
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(button => {

            button.onclick = () => {

                approveRegistration(
                    button.dataset.id
                );

            };

        });


    document
        .querySelectorAll(
            ".reject-btn"
        )
        .forEach(button => {

            button.onclick = () => {

                rejectRegistration(
                    button.dataset.id
                );

            };

        });

}


/* =========================================
   APPROVE
========================================= */

async function approveRegistration(id) {

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
                status: "approved"
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
   REJECT
========================================= */

async function rejectRegistration(id) {

    const reason =
        prompt(
            "Enter the reason for rejection:"
        );


    if (!reason) {
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
                status: "rejected",
                rejectionReason: reason
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

            await signOut(auth);


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
