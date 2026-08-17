/* =========================================
   UNIQUE ACADEMIC
   REAL REGISTRATION SYSTEM
   Firebase Authentication
   Cloud Firestore
   Firebase Storage

   STEP 1 → STEP 2 → STEP 3 → STEP 4
========================================= */


import {
    db,
    auth,
    storage
} from "./firebase-config.js";


import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";



/* =========================================
   STEP ELEMENTS
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



/* =========================================
   FORM ELEMENTS
========================================= */

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

const paymentReferenceInput =
    document.getElementById("paymentReference");

const paymentScreenshotInput =
    document.getElementById("paymentScreenshot");



/* =========================================
   HELPER
   SCROLL TO TOP
========================================= */

function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =========================================
   HELPER
   SHOW ONLY ONE STEP
========================================= */

function showStep(step) {

    if (personalStep) {
        personalStep.style.display = "none";
    }

    if (securityStep) {
        securityStep.style.display = "none";
    }

    if (paymentStep) {
        paymentStep.style.display = "none";
    }

    if (verificationStep) {
        verificationStep.style.display = "none";
    }


    if (step) {
        step.style.display = "block";
    }


    scrollToTop();

}



/* =========================================
   STEP INDICATOR
========================================= */

function setActiveStep(stepNumber) {

    const indicators = [
        stepIndicator1,
        stepIndicator2,
        stepIndicator3,
        stepIndicator4
    ];


    indicators.forEach(
        function (indicator, index) {

            if (!indicator) {
                return;
            }


            indicator.classList.remove(
                "active"
            );

            indicator.classList.remove(
                "completed"
            );


            if (index + 1 < stepNumber) {

                indicator.classList.add(
                    "completed"
                );

            }


            if (index + 1 === stepNumber) {

                indicator.classList.add(
                    "active"
                );

            }

        }
    );

}



/* =========================================
   STEP 1 → STEP 2
========================================= */

const personalContinueBtn =
    document.getElementById(
        "personalContinueBtn"
    );


if (personalContinueBtn) {

    personalContinueBtn.addEventListener(
        "click",
        function () {

            const fullName =
                fullNameInput
                    ? fullNameInput.value.trim()
                    : "";

            const phone =
                phoneInput
                    ? phoneInput.value.trim()
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";

            const university =
                universityInput
                    ? universityInput.value
                    : "";

            const department =
                departmentInput
                    ? departmentInput.value.trim()
                    : "";


            /* FULL NAME */

            if (fullName === "") {

                alert(
                    "Please enter your full name."
                );

                return;
            }


            /* PHONE */

            if (phone === "") {

                alert(
                    "Please enter your phone number."
                );

                return;
            }


            /* EMAIL */

            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            /* EMAIL FORMAT */

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                alert(
                    "Please enter a valid email address."
                );

                return;
            }


            /* UNIVERSITY */

            if (university === "") {

                alert(
                    "Please select your university."
                );

                return;
            }


            /* DEPARTMENT */

            if (department === "") {

                alert(
                    "Please enter your department."
                );

                return;
            }


            showStep(securityStep);

            setActiveStep(2);

        }
    );

}



/* =========================================
   STEP 2 → STEP 1
========================================= */

const backToPersonalBtn =
    document.getElementById(
        "backToPersonalBtn"
    );


if (backToPersonalBtn) {

    backToPersonalBtn.addEventListener(
        "click",
        function () {

            showStep(personalStep);

            setActiveStep(1);

        }
    );

}



/* =========================================
   PASSWORD STRENGTH
========================================= */

const strengthBar =
    document.getElementById(
        "strengthBar"
    );

const strengthText =
    document.getElementById(
        "strengthText"
    );

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


if (passwordInput) {

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

            if (lengthRequirement) {

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

            }


            /* NUMBER */

            if (numberRequirement) {

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

            }


            /* UPPERCASE */

            if (uppercaseRequirement) {

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

            }


            /* STRENGTH */

            let strength = 0;


            if (hasLength) {
                strength++;
            }

            if (hasNumber) {
                strength++;
            }

            if (hasUppercase) {
                strength++;
            }


            if (password.length === 0) {

                if (strengthBar) {

                    strengthBar.style.width =
                        "0%";

                }


                if (strengthText) {

                    strengthText.textContent =
                        "Enter a password";

                    strengthText.className =
                        "";

                }

            }

            else if (strength === 1) {

                if (strengthBar) {

                    strengthBar.style.width =
                        "33%";

                }


                if (strengthText) {

                    strengthText.textContent =
                        "Weak password";

                    strengthText.className =
                        "weak";

                }

            }

            else if (strength === 2) {

                if (strengthBar) {

                    strengthBar.style.width =
                        "66%";

                }


                if (strengthText) {

                    strengthText.textContent =
                        "Medium password";

                    strengthText.className =
                        "medium";

                }

            }

            else {

                if (strengthBar) {

                    strengthBar.style.width =
                        "100%";

                }


                if (strengthText) {

                    strengthText.textContent =
                        "Strong password";

                    strengthText.className =
                        "strong";

                }

            }

        }
    );

}



/* =========================================
   STEP 2 → STEP 3
   CREATE FIREBASE ACCOUNT
========================================= */

const securityContinueBtn =
    document.getElementById(
        "securityContinueBtn"
    );


if (securityContinueBtn) {

    securityContinueBtn.addEventListener(
        "click",
        async function () {

            const password =
                passwordInput
                    ? passwordInput.value
                    : "";

            const confirmPassword =
                confirmPasswordInput
                    ? confirmPasswordInput.value
                    : "";

            const email =
                emailInput
                    ? emailInput.value.trim()
                    : "";


            /* PASSWORD EMPTY */

            if (password === "") {

                alert(
                    "Please create a password."
                );

                return;
            }


            /* LENGTH */

            if (password.length < 8) {

                alert(
                    "Your password must contain at least 8 characters."
                );

                return;
            }


            /* NUMBER */

            if (!/[0-9]/.test(password)) {

                alert(
                    "Your password must contain at least one number."
                );

                return;
            }


            /* UPPERCASE */

            if (!/[A-Z]/.test(password)) {

                alert(
                    "Your password must contain at least one uppercase letter."
                );

                return;
            }


            /* CONFIRM PASSWORD */

            if (confirmPassword === "") {

                alert(
                    "Please confirm your password."
                );

                return;
            }


            /* MATCH */

            if (password !== confirmPassword) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            /* EMAIL */

            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                return;
            }


            /* PREVENT DOUBLE CLICK */

            securityContinueBtn.disabled =
                true;

            securityContinueBtn.innerHTML =
                "Creating Account...";


            try {

                /*
                 * CREATE REAL FIREBASE ACCOUNT
                 */

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


                /*
                 * MOVE TO PAYMENT
                 */

                showStep(paymentStep);

                setActiveStep(3);

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
                        "This email is already registered. Please use another email or log in."
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

                else if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    alert(
                        "Too many attempts. Please wait a moment and try again."
                    );

                }

                else {

                    alert(
                        "Account creation failed. Please try again."
                    );

                }

            }

            finally {

                securityContinueBtn.disabled =
                    false;

                securityContinueBtn.innerHTML =
                    'Continue <span>→</span>';

            }

        }
    );

}



/* =========================================
   PAYMENT METHOD
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


const cbeMethod =
    document.getElementById(
        "cbeMethod"
    );

const telebirrMethod =
    document.getElementById(
        "telebirrMethod"
    );



/* =========================================
   CBE
========================================= */

if (cbeMethod) {

    cbeMethod.addEventListener(
        "click",
        function () {

            selectedPaymentMethod =
                "CBE";


            if (selectedPaymentName) {

                selectedPaymentName.textContent =
                    "CBE / CBE Birr";

            }


            if (selectedPaymentIcon) {

                selectedPaymentIcon.textContent =
                    "🏦";

            }


            if (accountNumber) {

                accountNumber.textContent =
                    "1000721240208";

            }


            if (paymentDetails) {

                paymentDetails.style.display =
                    "block";

            }


            cbeMethod.classList.add(
                "selected"
            );


            if (telebirrMethod) {

                telebirrMethod.classList.remove(
                    "selected"
                );

            }

        }
    );

}



/* =========================================
   TELEBIRR
========================================= */

if (telebirrMethod) {

    telebirrMethod.addEventListener(
        "click",
        function () {

            selectedPaymentMethod =
                "Telebirr";


            if (selectedPaymentName) {

                selectedPaymentName.textContent =
                    "Telebirr";

            }


            if (selectedPaymentIcon) {

                selectedPaymentIcon.textContent =
                    "📱";

            }


            if (accountNumber) {

                accountNumber.textContent =
                    "0976596520";

            }


            if (paymentDetails) {

                paymentDetails.style.display =
                    "block";

            }


            telebirrMethod.classList.add(
                "selected"
            );


            if (cbeMethod) {

                cbeMethod.classList.remove(
                    "selected"
                );

            }

        }
    );

}



/* =========================================
   COPY PAYMENT NUMBER
========================================= */

const copyPaymentNumber =
    document.getElementById(
        "copyPaymentNumber"
    );


if (copyPaymentNumber) {

    copyPaymentNumber.addEventListener(
        "click",
        async function () {

            const number =
                accountNumber
                    ? accountNumber.textContent.trim()
                    : "";


            if (
                number === "—" ||
                number === ""
            ) {

                alert(
                    "Please select a payment method first."
                );

                return;
            }


            try {

                if (
                    navigator.clipboard &&
                    navigator.clipboard.writeText
                ) {

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

                else {

                    alert(
                        "Please copy the payment number manually: " +
                        number
                    );

                }

            }

            catch (error) {

                console.error(
                    "Copy error:",
                    error
                );


                alert(
                    "Please copy the payment number manually: " +
                    number
                );

            }

        }
    );

}



/* =========================================
   PAYMENT SCREENSHOT
========================================= */

if (paymentScreenshotInput) {

    paymentScreenshotInput.addEventListener(
        "change",
        function () {

            const fileName =
                document.getElementById(
                    "fileName"
                );


            if (
                !this.files ||
                this.files.length === 0
            ) {

                if (fileName) {

                    fileName.textContent =
                        "";

                }

                return;
            }


            const file =
                this.files[0];


            /* ALLOWED TYPES */

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


                if (fileName) {

                    fileName.textContent =
                        "";

                }

                return;
            }


            /* MAX SIZE — 5 MB */

            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                alert(
                    "The screenshot must be smaller than 5 MB."
                );


                this.value = "";


                if (fileName) {

                    fileName.textContent =
                        "";

                }

                return;
            }


            if (fileName) {

                fileName.textContent =
                    "📎 " + file.name;

            }

        }
    );

}



/* =========================================
   BACK TO SECURITY
========================================= */

const backToSecurityBtn =
    document.getElementById(
        "backToSecurityBtn"
    );


if (backToSecurityBtn) {

    backToSecurityBtn.addEventListener(
        "click",
        function () {

            showStep(securityStep);

            setActiveStep(2);

        }
    );

}



/* =========================================
   STEP 3 → STEP 4
   UPLOAD SCREENSHOT
   SAVE REGISTRATION
========================================= */

const submitPaymentBtn =
    document.getElementById(
        "submitPaymentBtn"
    );


if (submitPaymentBtn) {

    submitPaymentBtn.addEventListener(
        "click",
        async function () {

            const button = this;


            /* =================================
               PAYMENT METHOD
            ================================= */

            if (
                selectedPaymentMethod === ""
            ) {

                alert(
                    "Please select your payment method."
                );

                return;
            }



            /* =================================
               PAYMENT REFERENCE
            ================================= */

            const paymentReference =
                paymentReferenceInput
                    ? paymentReferenceInput.value.trim()
                    : "";


            if (
                paymentReference === ""
            ) {

                alert(
                    "Please enter your payment reference or transaction number."
                );

                return;
            }



            /* =================================
               SCREENSHOT
            ================================= */

            const screenshot =
                paymentScreenshotInput &&
                paymentScreenshotInput.files
                    ? paymentScreenshotInput.files[0]
                    : null;


            if (!screenshot) {

                alert(
                    "Please upload your payment screenshot."
                );

                return;
            }



            /* =================================
               FIREBASE USER
            ================================= */

            if (!auth.currentUser) {

                alert(
                    "Your account session has expired. Please restart registration."
                );

                return;
            }



            /* =================================
               PREVENT DOUBLE SUBMISSION
            ================================= */

            button.disabled =
                true;

            button.innerHTML =
                "Submitting...";



            try {

                const user =
                    auth.currentUser;



                /* =================================
                   CREATE SAFE FILE NAME
                ================================= */

                const safeFileName =
                    screenshot.name
                        .replace(
                            /[^a-zA-Z0-9._-]/g,
                            "_"
                        );


                const timeStamp =
                    Date.now();


                const storagePath =
                    "payment-screenshots/" +
                    user.uid +
                    "/" +
                    timeStamp +
                    "_" +
                    safeFileName;



                /* =================================
                   FIREBASE STORAGE REFERENCE
                ================================= */

                const screenshotRef =
                    ref(
                        storage,
                        storagePath
                    );



                /* =================================
                   UPLOAD SCREENSHOT
                ================================= */

                button.innerHTML =
                    "Uploading Screenshot...";


                const uploadResult =
                    await uploadBytes(
                        screenshotRef,
                        screenshot,
                        {
                            contentType:
                                screenshot.type
                        }
                    );



                /* =================================
                   GET DOWNLOAD URL
                ================================= */

                const screenshotURL =
                    await getDownloadURL(
                        uploadResult.ref
                    );



                /* =================================
                   REGISTRATION DATA
                ================================= */

                const registrationData = {

                    userId:
                        user.uid,

                    fullName:
                        fullNameInput
                            ? fullNameInput.value.trim()
                            : "",

                    phone:
                        phoneInput
                            ? phoneInput.value.trim()
                            : "",

                    email:
                        emailInput
                            ? emailInput.value.trim()
                            : "",

                    university:
                        universityInput
                            ? universityInput.value
                            : "",

                    department:
                        departmentInput
                            ? departmentInput.value.trim()
                            : "",

                    paymentMethod:
                        selectedPaymentMethod,

                    paymentReference:
                        paymentReference,

                    paymentScreenshotURL:
                        screenshotURL,

                    paymentScreenshotPath:
                        storagePath,

                    amount:
                        300,

                    currency:
                        "ETB",

                    status:
                        "pending",

                    verificationStatus:
                        "pending",

                    submittedAt:
                        serverTimestamp()

                };



                /* =================================
                   SAVE TO FIRESTORE
                ================================= */

                button.innerHTML =
                    "Saving Registration...";


                const registrationRef =
                    await addDoc(
                        collection(
                            db,
                            "registrations"
                        ),
                        registrationData
                    );



                /* =================================
                   SAVE REGISTRATION ID
                ================================= */

                sessionStorage.setItem(
                    "registrationId",
                    registrationRef.id
                );


                localStorage.setItem(
                    "uniqueAcademicRegistrationStatus",
                    "pending"
                );



                /* =================================
                   SHOW VERIFICATION
                ================================= */

                showStep(
                    verificationStep
                );


                setActiveStep(4);


            }

            catch (error) {

                console.error(
                    "Registration submission error:",
                    error
                );


                let message =
                    "We could not submit your registration. Please try again.";


                if (
                    error.code ===
                    "storage/unauthorized"
                ) {

                    message =
                        "The payment screenshot could not be uploaded because Firebase Storage permissions are not configured correctly.";

                }

                else if (
                    error.code ===
                    "storage/quota-exceeded"
                ) {

                    message =
                        "Firebase Storage is currently unavailable because the storage quota has been exceeded.";

                }

                else if (
                    error.code ===
                    "permission-denied"
                ) {

                    message =
                        "Firebase denied access. Please check your Firestore and Storage security rules.";

                }


                alert(message);


                button.disabled =
                    false;

                button.innerHTML =
                    'Submit Payment <span>→</span>';

            }

        }
    );

}



/* =========================================
   INITIAL STATE
========================================= */

showStep(
    personalStep
);

setActiveStep(1);
