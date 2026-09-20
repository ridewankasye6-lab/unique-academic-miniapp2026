import {
    db,
    auth
} from "./firebase-config.js";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp
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
           "student-login.html" ;

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
    "student-login.html";

        }

        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };
/* =====================================================
   WEEKLY EXAM MANAGER
===================================================== */

const weeklyQuestionEditor =
    document.getElementById(
        "weeklyQuestionEditor"
    );

const publishWeeklyExamBtn =
    document.getElementById(
        "publishWeeklyExamBtn"
    );

const weeklyExamStatus =
    document.getElementById(
        "weeklyExamStatus"
    );


/* =====================================================
   CREATE 20 QUESTION FIELDS
===================================================== */

function createWeeklyQuestionFields() {

    if (!weeklyQuestionEditor) {
        return;
    }


    weeklyQuestionEditor.innerHTML = "";


    for (let i = 1; i <= 20; i++) {

        const questionBox =
            document.createElement("div");


        questionBox.style.cssText = `
            border:1px solid #e5e7eb;
            border-radius:12px;
            padding:18px;
            margin-top:15px;
            background:#f8fafc;
        `;


        questionBox.innerHTML = `

            <h4
                style="
                    color:#2563eb;
                    margin-bottom:12px;
                "
            >
                Question ${i}
            </h4>


            <textarea
                class="weekly-question"
                data-question="${i}"
                placeholder="Write question ${i}..."
                rows="3"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    resize:vertical;
                    margin-bottom:10px;
                "
            ></textarea>


            <input
                class="weekly-option"
                data-question="${i}"
                data-option="0"
                type="text"
                placeholder="Option A"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    margin-bottom:8px;
                "
            >


            <input
                class="weekly-option"
                data-question="${i}"
                data-option="1"
                type="text"
                placeholder="Option B"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    margin-bottom:8px;
                "
            >


            <input
                class="weekly-option"
                data-question="${i}"
                data-option="2"
                type="text"
                placeholder="Option C"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    margin-bottom:8px;
                "
            >


            <input
                class="weekly-option"
                data-question="${i}"
                data-option="3"
                type="text"
                placeholder="Option D"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    margin-bottom:10px;
                "
            >


            <label
                style="
                    display:block;
                    margin-bottom:8px;
                    font-weight:bold;
                "
            >
                Correct Answer
            </label>


            <select
                class="weekly-answer"
                data-question="${i}"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    margin-bottom:10px;
                "
            >

                <option value="0">
                    A
                </option>

                <option value="1">
                    B
                </option>

                <option value="2">
                    C
                </option>

                <option value="3">
                    D
                </option>

            </select>


            <textarea
                class="weekly-explanation"
                data-question="${i}"
                placeholder="Write the explanation..."
                rows="2"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    resize:vertical;
                    margin-bottom:10px;
                "
            ></textarea>


            <textarea
                class="weekly-hint"
                data-question="${i}"
                placeholder="Write a hint..."
                rows="2"
                style="
                    width:100%;
                    padding:11px;
                    border:1px solid #cbd5e1;
                    border-radius:8px;
                    resize:vertical;
                "
            ></textarea>

        `;


        weeklyQuestionEditor.appendChild(
            questionBox
        );

    }

}


/* =====================================================
   CREATE QUESTION FIELDS ON PAGE LOAD
===================================================== */

createWeeklyQuestionFields();


/* =====================================================
   PUBLISH EXAM
===================================================== */

if (publishWeeklyExamBtn) {

    publishWeeklyExamBtn.addEventListener(
        "click",
        publishWeeklyExam
    );

}


async function publishWeeklyExam() {

    if (!auth.currentUser) {

        alert(
            "❌ Admin authentication required."
        );

        return;

    }


    const subject =
        document.getElementById(
            "weeklySubject"
        ).value.trim();


    const chapter =
        document.getElementById(
            "weeklyChapter"
        ).value.trim();


    const examDate =
        document.getElementById(
            "weeklyExamDate"
        ).value;


    const startTime =
        document.getElementById(
            "weeklyStartTime"
        ).value;


    const endTime =
        document.getElementById(
            "weeklyEndTime"
        ).value;


    const duration =
        Number(
            document.getElementById(
                "weeklyDuration"
            ).value
        );


    /* =============================================
       VALIDATION
    ============================================= */

    if (!subject) {

        alert(
            "❌ Please select a subject."
        );

        return;

    }


    if (!chapter) {

        alert(
            "❌ Please enter the chapter."
        );

        return;

    }


    if (!examDate) {

        alert(
            "❌ Please select the exam date."
        );

        return;

    }


    if (!startTime || !endTime) {

        alert(
            "❌ Please enter the exam time."
        );

        return;

    }


    if (
        duration < 1 ||
        duration > 60
    ) {

        alert(
            "❌ Time limit must be between 1 and 60 minutes."
        );

        return;

    }


    if (
        startTime >= endTime
    ) {

        alert(
            "❌ End time must be after start time."
        );

        return;

    }


    /* =============================================
       COLLECT QUESTIONS
    ============================================= */

    const questionElements =
        document.querySelectorAll(
            ".weekly-question"
        );


    const optionElements =
        document.querySelectorAll(
            ".weekly-option"
        );


    const answerElements =
        document.querySelectorAll(
            ".weekly-answer"
        );


    const explanationElements =
        document.querySelectorAll(
            ".weekly-explanation"
        );


    const hintElements =
        document.querySelectorAll(
            ".weekly-hint"
        );


    const questions = [];


    for (
        let i = 0;
        i < 20;
        i++
    ) {

        const question =
            questionElements[i]
                .value
                .trim();


        const options = [];


        for (
            let j = 0;
            j < 4;
            j++
        ) {

            const option =
                optionElements[
                    (i * 4) + j
                ]
                .value
                .trim();


            options.push(
                option
            );

        }


        const answer =
            Number(
                answerElements[i].value
            );


        const explanation =
            explanationElements[i]
                .value
                .trim();


        const hint =
            hintElements[i]
                .value
                .trim();


        if (!question) {

            alert(
                `❌ Please write Question ${i + 1}.`
            );

            return;

        }


        for (
            let j = 0;
            j < 4;
            j++
        ) {

            if (!options[j]) {

                alert(
                    `❌ Please complete all options for Question ${i + 1}.`
                );

                return;

            }

        }


        questions.push({

            question,

            options,

            answer,

            explanation,

            hint

        });

    }


    /* =============================================
       CONFIRM
    ============================================= */

    const confirmed =
        confirm(
            `Publish ${subject} ${chapter} exam for ${examDate} from ${startTime} to ${endTime}?`
        );


    if (!confirmed) {
        return;
    }


    publishWeeklyExamBtn.disabled =
        true;


    publishWeeklyExamBtn.textContent =
        "⏳ Publishing...";


    weeklyExamStatus.textContent =
        "⏳ Saving Weekly Exam to Firebase...";


    try {

        /* =========================================
           FIRESTORE
        ========================================= */

        const examRef =
            await addDoc(
                collection(
                    db,
                    "weeklyExams"
                ),
                {

                    subject,

                    chapter,

                    examDate,

                    startTime,

                    endTime,

                    duration,

                    questions,

                    status: "published",

                    timezone:
                        "Africa/Addis_Ababa",

                    createdBy:
                        auth.currentUser.email,

                    createdAt:
                        serverTimestamp()

                }
            );


        console.log(
            "Weekly exam published:",
            examRef.id
        );


        weeklyExamStatus.innerHTML = `

            <div
                style="
                    padding:15px;
                    border-radius:10px;
                    background:#dcfce7;
                    color:#166534;
                "
            >

                <strong>
                    ✅ Weekly Exam Published Successfully!
                </strong>

                <br><br>

                📚 Subject:
                ${escapeHTML(subject)}

                <br>

                📖 Chapter:
                ${escapeHTML(chapter)}

                <br>

                📅 Date:
                ${escapeHTML(examDate)}

                <br>

                ⏰ Time:
                ${escapeHTML(startTime)}
                –
                ${escapeHTML(endTime)}

                <br>

                ⏱️ Individual Time:
                ${duration} minutes

                <br><br>

                🔑 Exam ID:
                ${escapeHTML(examRef.id)}

            </div>

        `;


        alert(
            "✅ Weekly Exam published successfully!"
        );


    }

    catch (error) {

        console.error(
            "Publish Weekly Exam error:",
            error
        );


        weeklyExamStatus.innerHTML = `

            <div
                style="
                    padding:15px;
                    border-radius:10px;
                    background:#fee2e2;
                    color:#991b1b;
                "
            >

                ❌ Failed to publish the Weekly Exam.

                <br><br>

                ${escapeHTML(
                    error.message ||
                    "Unknown error"
                )}

            </div>

        `;

    }

    finally {

        publishWeeklyExamBtn.disabled =
            false;


        publishWeeklyExamBtn.textContent =
            "🚀 Publish Weekly Exam";

    }

}
