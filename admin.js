import { db, auth } from "./firebase-config.js";

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


const ADMIN_EMAIL = "ridewankasye6@gmail.com";


/*
====================================
HTML ELEMENTS
====================================
*/

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


/*
====================================
CHECK ADMIN
====================================
*/

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "login.html";

        return;
    }


    if (
        !user.email ||
        user.email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        alert("❌ Admin access required.");

        window.location.href = "index.html";

        return;
    }


    loadRegistrations();

});


/*
====================================
LOAD REGISTRATIONS
====================================
*/

async function loadRegistrations() {

    try {

        const snapshot =
            await getDocs(
                collection(db, "registrations")
            );


        /*
        ================================
        COUNTERS
        ================================
        */

        let total = 0;
        let pending = 0;
        let approved = 0;
        let rejected = 0;


        registrationList.innerHTML = "";


        /*
        ================================
        DISPLAY REGISTRATIONS
        ================================
        */

        snapshot.forEach((doc) => {

            const data = doc.data();

            total++;


            const status =
                data.status || "pending";


            /*
            COUNT PENDING
            */

            if (status === "pending") {

                pending++;

            }


            /*
            COUNT APPROVED
            */

            if (status === "approved") {

                approved++;

            }


            /*
            COUNT REJECTED
            */

            if (status === "rejected") {

                rejected++;

            }


            /*
            ================================
            STUDENT CARD
            ================================
            */

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
                    <br>

                    💰 Payment Reference:
                    <strong>
                        ${escapeHTML(
                            data.paymentReference || "—"
                        )}
                    </strong>

                </div>


                <span class="status ${status}">
                    ${status.toUpperCase()}
                </span>


                <div class="actions">

                    ${
                        status === "pending"
                        ?
                        `

                        <button
                            class="approve-btn"
                            data-id="${doc.id}"
                        >
                            ✅ Approve
                        </button>


                        <button
                            class="reject-btn"
                            data-id="${doc.id}"
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

        });


        /*
        ================================
        UPDATE DASHBOARD COUNTERS
        ================================
        */

        totalCount.textContent =
            total;

        pendingCount.textContent =
            pending;

        approvedCount.textContent =
            approved;

        rejectedCount.textContent =
            rejected;


        /*
        ================================
        ADD BUTTON LISTENERS
        ================================
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

            </div>

        `;

    }

}


/*
====================================
BUTTONS
====================================
*/

function addActionListeners() {


    /*
    ================================
    APPROVE BUTTONS
    ================================
    */

    document
        .querySelectorAll(".approve-btn")
        .forEach(button => {

            button.onclick = () => {

                approveRegistration(
                    button.dataset.id
                );

            };

        });


    /*
    ================================
    REJECT BUTTONS
    ================================
    */

    document
        .querySelectorAll(".reject-btn")
        .forEach(button => {

            button.onclick = () => {

                rejectRegistration(
                    button.dataset.id
                );

            };

        });

}


/*
====================================
APPROVE REGISTRATION
====================================
*/

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


/*
====================================
REJECT REGISTRATION
====================================
*/

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


/*
====================================
ESCAPE HTML
====================================
*/

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


/*
====================================
LOGOUT
====================================
*/

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
