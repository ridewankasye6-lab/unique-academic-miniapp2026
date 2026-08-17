/* =========================================
   UNIQUE ACADEMIC
   REAL REGISTRATION SYSTEM
   Firebase + Cloud Firestore

   STEP 1 → STEP 2 → STEP 3 → STEP 4
========================================= */

import {
    db,
    auth
} from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


"use strict";


/* =========================================
   ELEMENTS
========================================= */

const personalStep =
    document.getElementById("personalStep");

const securityStep =
    document.getElementById("securityStep");

const paymentStep =
    document.getElementById("paymentStep");

const verificationStep =
    document.getElementById("verificationStep");


const stepIndicator1 =
    document.getElementById("stepIndicator1");

const stepIndicator2 =
    document.getElementById("stepIndicator2");

const stepIndicator3 =
    document.getElementById("stepIndicator3");

const stepIndicator4 =
    document.getElementById("stepIndicator4");


const fullNameInput =
    document.getElementById("fullName");

const phoneInput =
    document.getElementById("phone");

const emailInput =
    document.getElementById("email");

const universityInput =
    document.getElementById("university");

const departmentInput =
    document.getElementById("department");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");


/* =========================================
   SCROLL TOP
========================================= */

function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   SHOW STEP
========================================= */

function showStep(step) {

    personalStep.style.display = "none";
    securityStep.style.display = "none";
    paymentStep.style.display = "none";
    verificationStep.style.display = "none";

    step.style.display = "block";

    scrollToTop();

}


/* =========================================
   STEP 1 → STEP 2
========================================= */

document
    .getElementById("personalContinueBtn")
    .addEventListener("click", function () {

        const fullName =
            fullNameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const email =
            emailInput.value.trim();

        const university =
            universityInput.value;

        const department =
            departmentInput.value.trim();


        if (!fullName) {

            alert(
                "Please enter your full name."
            );

            fullNameInput.focus();

            return;
        }


        if (!phone) {

            alert(
                "Please enter your phone number."
            );

            phoneInput.focus();

            return;
        }


        if (!email) {

            alert(
                "Please enter your email address."
            );

            emailInput.focus();

            return;
        }


        if (!email.includes("@")) {

            alert(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;
        }


        if (!university) {

            alert(
                "Please select your university."
            );

            universityInput.focus();

            return;
        }


        if (!department) {

            alert(
                "Please enter your department."
            );

            departmentInput.focus();

            return;
        }


        showStep(securityStep);


        stepIndicator1.classList.remove("active");

        stepIndicator1.classList.add("completed");

        stepIndicator2.classList.add("active");

    });


/* =========================================
   STEP 2 → STEP 1
========================================= */

document
    .getElementById("backToPersonalBtn")
    .addEventListener("click", function () {

        showStep(personalStep);


        stepIndicator2.classList.remove(
            "active"
        );

        stepIndicator1.classList.remove(
            "completed"
        );

        stepIndicator1.classList.add(
            "active"
        );

    });


/* =========================================
   PASSWORD STRENGTH
========================================= */

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

const lengthRequirement =
    document.getElementById(
        "lengthRequirement"
    );

const numberRequirement =
    document.getElementById(
        "numberRequirement"
    );

const uppercaseRequirement =
    document.getElementById(
        "uppercaseRequirement"
    );


passwordInput.addEventListener(
    "input",
    function () {

        const password =
            passwordInput.value;


        const hasLength =
            password.length >= 8;

        const hasNumber =
            /[0-9]/.test(password);

        const hasUppercase =
            /[A-Z]/.test(password);


        /* LENGTH */

        if (hasLength) {

            lengthRequirement.textContent =
                "✓ At least 8 characters";

            lengthRequirement.classList.add(
                "valid"
            );

        } else {

            lengthRequirement.textContent =
                "○ At least 8 characters";

            lengthRequirement.classList.remove(
                "valid"
            );

        }


        /* NUMBER */

        if (hasNumber) {

            numberRequirement.textContent =
                "✓ At least one number";

            numberRequirement.classList.add(
                "valid"
            );

        } else {

            numberRequirement.textContent =
                "○ At least one number";

            numberRequirement.classList.remove(
                "valid"
            );

        }


        /* UPPERCASE */

        if (hasUppercase) {

            uppercaseRequirement.textContent =
                "✓ At least one uppercase letter";

            uppercaseRequirement.classList.add(
                "valid"
            );

        } else {

            uppercaseRequirement.textContent =
                "○ At least one uppercase letter";

            uppercaseRequirement.classList.remove(
                "valid"
            );

        }


        let strength = 0;

        if (hasLength) strength++;

        if (hasNumber) strength++;

        if (hasUppercase) strength++;


        if (!password) {

            strengthBar.style.width =
                "0%";

            strengthText.textContent =
                "Enter a password";

            strengthText.className = "";

        }

        else if (strength === 1) {

            strengthBar.style.width =
                "33%";

            strengthText.textContent =
                "Weak password";

            strengthText.className =
                "weak";

        }

        else if (strength === 2) {

            strengthBar.style.width =
                "66%";

            strengthText.textContent =
                "Medium password";

            strengthText.className =
                "medium";

        }

        else {

            strengthBar.style.width =
                "100%";

            strengthText.textContent =
                "Strong password";

            strengthText.className =
                "strong";

        }

    }
);


/* =========================================
   STEP 2 → STEP 3
   CREATE FIREBASE ACCOUNT
========================================= */

const securityContinueBtn =
    document.getElementById(
        "securityContinueBtn"
    );


securityContinueBtn.addEventListener(
    "click",
    async function () {

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;

        const email =
            emailInput.value.trim();


        if (!password) {

            alert(
                "Please create a password."
            );

            passwordInput.focus();

            return;
        }


        if (password.length < 8) {

            alert(
                "Your password must contain at least 8 characters."
            );

            passwordInput.focus();

            return;
        }


        if (!/[0-9]/.test(password)) {

            alert(
                "Your password must contain at least one number."
            );

            passwordInput.focus();

            return;
        }


        if (!/[A-Z]/.test(password)) {

            alert(
                "Your password must contain at least one uppercase letter."
            );

            passwordInput.focus();

            return;
        }


        if (!confirmPassword) {

            alert(
                "Please confirm your password."
            );

            confirmPasswordInput.focus();

            return;
        }


        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            confirmPasswordInput.focus();

            return;
        }


        securityContinueBtn.disabled = true;

        securityContinueBtn.innerHTML =
            "Creating Account...";


        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


            showStep(paymentStep);


            stepIndicator2.classList.remove(
                "active"
            );

            stepIndicator2.classList.add(
                "completed"
            );

            stepIndicator3.classList.add(
                "active"
            );

        }

        catch (error) {

            console.error(
                "Firebase Authentication Error:",
                error
            );


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                alert(
                    "This email is already registered. Please log in instead."
                );

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                alert(
                    "Please enter a valid email address."
                );

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                alert(
                    "Firebase rejected this password. Please create a stronger password."
                );

            }

            else {

                alert(
                    "Account creation failed. Please try again."
                );

            }

        }

        finally {

            securityContinueBtn.disabled = false;

            securityContinueBtn.innerHTML =
                'Continue <span>→</span>';

        }

    }
);


/* =========================================
   PAYMENT
========================================= */

let selectedPaymentMethod = "";


const paymentDetails =
    document.getElementById(
        "paymentDetails"
    );

const selectedPaymentName =
    document.getElementById(
        "selectedPaymentName"
    );

const selectedPaymentIcon =
    document.getElementById(
        "selectedPaymentIcon"
    );

const accountNumber =
    document.getElementById(
        "accountNumber"
    );


/* =========================================
   CBE
========================================= */

document
    .getElementById("cbeMethod")
    .addEventListener(
        "click",
        function () {

            selectedPaymentMethod =
                "CBE";


            selectedPaymentName.textContent =
                "CBE / CBE Birr";

            selectedPaymentIcon.textContent =
                "🏦";

            accountNumber.textContent =
                "1000721240208";


            paymentDetails.style.display =
                "block";


            document
                .getElementById("cbeMethod")
                .classList.add("selected");


            document
                .getElementById("telebirrMethod")
                .classList.remove("selected");

        }
    );


/* =========================================
   TELEBIRR
========================================= */

document
    .getElementById("telebirrMethod")
    .addEventListener(
        "click",
        function () {

            selectedPaymentMethod =
                "Telebirr";


            selectedPaymentName.textContent =
                "Telebirr";

            selectedPaymentIcon.textContent =
                "📱";

            accountNumber.textContent =
                "0976596520";


            paymentDetails.style.display =
                "block";


            document
                .getElementById("telebirrMethod")
                .classList.add("selected");


            document
                .getElementById("cbeMethod")
                .classList.remove("selected");

        }
    );


/* =========================================
   COPY PAYMENT NUMBER
========================================= */

document
    .getElementById("copyPaymentNumber")
    .addEventListener(
        "click",
        async function () {

            const number =
                accountNumber.textContent;


            if (
                number === "—" ||
                number === ""
            ) {

                return;

            }


            try {

                await navigator
                    .clipboard
                    .writeText(number);


                this.textContent =
                    "✓ Copied";


                setTimeout(
                    () => {

                        this.textContent =
                            "📋 Copy";

                    },
                    1500
                );

            }

            catch (error) {

                alert(
                    "Please copy the payment number manually: " +
                    number
                );

            }

        }
    );


/* =========================================
   SCREENSHOT
========================================= */

document
    .getElementById("paymentScreenshot")
    .addEventListener(
        "change",
        function () {

            const fileName =
                document.getElementById(
                    "fileName"
                );


            if (
                this.files &&
                this.files.length > 0
            ) {

                const file =
                    this.files[0];


                const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                ];


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Please upload a JPG, PNG, or WEBP image."
                    );

                    this.value = "";

                    fileName.textContent = "";

                    return;

                }


                fileName.textContent =
                    "📎 " + file.name;

            }

            else {

                fileName.textContent =
                    "";

            }

        }
    );


/* =========================================
   BACK TO SECURITY FROM PAYMENT
========================================= */

document
    .getElementById("backToSecurityBtn")
    .addEventListener(
        "click",
        function () {

            showStep(securityStep);


            stepIndicator3.classList.remove(
                "active"
            );

            stepIndicator2.classList.remove(
                "completed"
            );

            stepIndicator2.classList.add(
                "active"
            );

        }
    );


/* =========================================
   STEP 3 → STEP 4
========================================= */

const submitPaymentBtn =
    document.getElementById(
        "submitPaymentBtn"
    );


submitPaymentBtn.addEventListener(
    "click",
    async function () {

        const paymentReference =
            document
                .getElementById(
                    "paymentReference"
                )
                .value
                .trim();


        const screenshotInput =
            document.getElementById(
                "paymentScreenshot"
            );


        const screenshot =
            screenshotInput.files;


        /* PAYMENT METHOD */

        if (!selectedPaymentMethod) {

            alert(
                "Please select your payment method."
            );

            return;
        }


        /* REFERENCE */

        if (!paymentReference) {

            alert(
                "Please enter your payment reference or transaction number."
            );

            return;
        }


        /* SCREENSHOT */

        if (
            !screenshot ||
            screenshot.length === 0
        ) {

            alert(
                "Please upload your payment screenshot."
            );

            return;
        }


        /* FIREBASE USER */

        if (!auth.currentUser) {

            alert(
                "Your account session has expired. Please restart registration."
            );

            return;
        }


        /* PREVENT DOUBLE SUBMISSION */

        submitPaymentBtn.disabled = true;

        submitPaymentBtn.innerHTML =
            "Submitting...";


        const registrationData = {

            userId:
                auth.currentUser.uid,

            fullName:
                fullNameInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            email:
                emailInput.value.trim(),

            university:
                universityInput.value,

            department:
                departmentInput.value.trim(),

            paymentMethod:
                selectedPaymentMethod,

            paymentReference:
                paymentReference,

            amount:
                300,

            currency:
                "ETB",

            status:
                "pending",

            submittedAt:
                serverTimestamp()

        };


        try {

            const registrationRef =
                await addDoc(
                    collection(
                        db,
                        "registrations"
                    ),
                    registrationData
                );


            sessionStorage.setItem(
                "registrationId",
                registrationRef.id
            );


            showStep(
                verificationStep
            );


            stepIndicator3.classList.remove(
                "active"
            );

            stepIndicator3.classList.add(
                "completed"
            );

            stepIndicator4.classList.add(
                "active"
            );

        }

        catch (error) {

            console.error(
                "Firestore error:",
                error
            );


            alert(
                "We could not submit your registration. Please try again."
            );


            submitPaymentBtn.disabled =
                false;

            submitPaymentBtn.innerHTML =
                'Submit Payment <span>→</span>';

        }

    }
);
