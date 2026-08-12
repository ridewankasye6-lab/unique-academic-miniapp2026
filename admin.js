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


const registrationList =
    document.getElementById("registrationList");

const totalCount =
    document.getElementById("totalCount");

const pendingCount =
    document.getElementById("pendingCount");

const approvedCount =
    document.getElementById("approvedCount");

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


        let total = 0;
        let pending = 0;
        let approved = 0;


        registrationList.innerHTML = "";


        snapshot.forEach((doc) => {

            const data = doc.data();

            total++;


            const status =
                data.status || "pending";


            if (status === "pending") {
                pending++;
            }


            if (status === "approved") {
                approved++;
            }


            const card =
                document.createElement("div");

            card.className =
                "student-card";


            card.innerHTML = `

                <h3>
                    👤 ${escapeHTML(
                        data.fullName || "Unknown Student"
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
                            data-id="${doc.id}">
                            ✅ Approve
                        </button>

                        <button
                            class="reject-btn"
                            data-id="${doc.id}">
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


        totalCount.textContent =
            total;

        pendingCount.textContent =
            pending;

        approvedCount.textContent =
            approved;


        addActionListeners();

    }

    catch (error) {

        console.error(error);

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

    document
        .querySelectorAll(".approve-btn")
        .forEach(button => {

            button.onclick = () => {

                approveRegistration(
                    button.dataset.id
                );

            };

        });


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
APPROVE
====================================
*/

async function approveRegistration(id) {

    const confirmed = confirm(
        "Are you sure you want to approve this registration?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const registrationRef = doc(
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

        console.error(error);

        alert(
            "❌ Failed to approve student."
        );

    }

}


/*
====================================
REJECT
====================================
*/

async function rejectRegistration(id) {

    const reason = prompt(
        "Enter the reason for rejection:"
    );

    if (!reason) {
        return;
    }

    try {

        const registrationRef = doc(
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

        console.error(error);

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

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/*
====================================
LOGOUT
====================================
*/

logoutBtn.onclick = async () => {

    await signOut(auth);

    window.location.href =
        "login.html";

};
