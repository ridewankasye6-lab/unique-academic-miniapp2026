/* =========================================
   UNIQUE ACADEMIC
   REGISTRATION SYSTEM

   STEP 1 + STEP 2 + STEP 3
========================================= */


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
   STEP 1 → STEP 2
========================================= */

document
    .getElementById("personalContinueBtn")
    .addEventListener("click", function () {


        const fullName =
            document.getElementById("fullName")
                .value.trim();

        const phone =
            document.getElementById("phone")
                .value.trim();

        const email =
            document.getElementById("email")
                .value.trim();

        const university =
            document.getElementById("university")
                .value;

        const department =
            document.getElementById("department")
                .value.trim();


        if (fullName === "") {

            alert("Please enter your full name.");

            return;
        }


        if (phone === "") {

            alert("Please enter your phone number.");

            return;
        }


        if (email === "") {

            alert("Please enter your email address.");

            return;
        }


        if (university === "") {

            alert("Please select your university.");

            return;
        }


        if (department === "") {

            alert("Please enter your department.");

            return;
        }


        personalStep.style.display = "none";

        securityStep.style.display = "block";

        paymentStep.style.display = "none";


        stepIndicator1.classList.remove("active");

        stepIndicator1.classList.add("completed");

        stepIndicator2.classList.add("active");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });



/* =========================================
   STEP 2 → STEP 1
========================================= */

document
    .getElementById("backToPersonalBtn")
    .addEventListener("click", function () {


        securityStep.style.display = "none";

        personalStep.style.display = "block";


        stepIndicator2.classList.remove("active");

        stepIndicator1.classList.remove("completed");

        stepIndicator1.classList.add("active");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });



/* =========================================
   PASSWORD STRENGTH
========================================= */

const passwordInput =
    document.getElementById("password");

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");


const lengthRequirement =
    document.getElementById("lengthRequirement");

const numberRequirement =
    document.getElementById("numberRequirement");

const uppercaseRequirement =
    document.getElementById("uppercaseRequirement");


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


        if (hasLength) {

            lengthRequirement.textContent =
                "✓ At least 8 characters";

            lengthRequirement.classList.add("valid");

        } else {

            lengthRequirement.textContent =
                "○ At least 8 characters";

            lengthRequirement.classList.remove("valid");

        }


        if (hasNumber) {

            numberRequirement.textContent =
                "✓ At least one number";

            numberRequirement.classList.add("valid");

        } else {

            numberRequirement.textContent =
                "○ At least one number";

            numberRequirement.classList.remove("valid");

        }


        if (hasUppercase) {

            uppercaseRequirement.textContent =
                "✓ At least one uppercase letter";

            uppercaseRequirement.classList.add("valid");

        } else {

            uppercaseRequirement.textContent =
                "○ At least one uppercase letter";

            uppercaseRequirement.classList.remove("valid");

        }


        let strength = 0;


        if (hasLength)
            strength++;


        if (hasNumber)
            strength++;


        if (hasUppercase)
            strength++;


        if (password.length === 0) {

            strengthBar.style.width = "0%";

            strengthText.textContent =
                "Enter a password";

            strengthText.className = "";

        }

        else if (strength === 1) {

            strengthBar.style.width = "33%";

            strengthText.textContent =
                "Weak password";

            strengthText.className =
                "weak";

        }

        else if (strength === 2) {

            strengthBar.style.width = "66%";

            strengthText.textContent =
                "Medium password";

            strengthText.className =
                "medium";

        }

        else {

            strengthBar.style.width = "100%";

            strengthText.textContent =
                "Strong password";

            strengthText.className =
                "strong";

        }

    }
);



/* =========================================
   STEP 2 → STEP 3
========================================= */

document
    .getElementById("securityContinueBtn")
    .addEventListener("click", function () {


        const password =
            passwordInput.value;

        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        if (password === "") {

            alert(
                "Please create a password."
            );

            return;
        }


        if (password.length < 8) {

            alert(
                "Your password must contain at least 8 characters."
            );

            return;
        }


        if (!/[0-9]/.test(password)) {

            alert(
                "Your password must contain at least one number."
            );

            return;
        }


        if (!/[A-Z]/.test(password)) {

            alert(
                "Your password must contain at least one uppercase letter."
            );

            return;
        }


        if (confirmPassword === "") {

            alert(
                "Please confirm your password."
            );

            return;
        }


        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        securityStep.style.display = "none";

        paymentStep.style.display = "block";


        stepIndicator2.classList.remove("active");

        stepIndicator2.classList.add("completed");

        stepIndicator3.classList.add("active");


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });



/* =========================================
   PAYMENT METHOD
========================================= */

let selectedPaymentMethod = "";

const paymentDetails =
    document.getElementById("paymentDetails");

const selectedPaymentName =
    document.getElementById("selectedPaymentName");

const selectedPaymentIcon =
    document.getElementById("selectedPaymentIcon");

const accountNumber =
    document.getElementById("accountNumber");


/* CBE */

document
    .getElementById("cbeMethod")
    .addEventListener("click", function () {


        selectedPaymentMethod = "CBE";


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

    });



/* TELEBIRR */

document
    .getElementById("telebirrMethod")
    .addEventListener("click", function () {


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

    });



/* =========================================
   COPY PAYMENT NUMBER
========================================= */

document
    .getElementById("copyPaymentNumber")
    .addEventListener("click", async function () {


        const number =
            accountNumber.textContent;


        if (
            number === "—" ||
            number === ""
        ) {

            return;
        }


        try {

            await navigator.clipboard.writeText(number);

            this.textContent =
                "✓ Copied";

            setTimeout(() => {

                this.textContent =
                    "📋 Copy";

            }, 1500);

        }

        catch (error) {

            alert(
                "Please copy the payment number manually: " +
                number
            );

        }

    });



/* =========================================
   PAYMENT SCREENSHOT
========================================= */

document
    .getElementById("paymentScreenshot")
    .addEventListener("change", function () {


        const fileName =
            document.getElementById("fileName");


        if (this.files.length > 0) {

            fileName.textContent =
                "📎 " + this.files[0].name;

        } else {

            fileName.textContent = "";

        }

    });

/* =========================================
   STEP 3 → STEP 4 VERIFICATION
========================================= */

document
    .getElementById("submitPaymentBtn")
    .addEventListener("click", function () {

        const paymentReference =
            document
                .getElementById("paymentReference")
                .value.trim();

        const screenshot =
            document
                .getElementById("paymentScreenshot")
                .files;


        /* CHECK PAYMENT METHOD */

        if (selectedPaymentMethod === "") {

            alert(
                "Please select your payment method."
            );

            return;
        }


        /* CHECK REFERENCE */

        if (paymentReference === "") {

            alert(
                "Please enter your payment reference or transaction number."
            );

            return;
        }


        /* CHECK SCREENSHOT */

        if (screenshot.length === 0) {

            alert(
                "Please upload your payment screenshot."
            );

            return;
        }


        /* HIDE PAYMENT */

        paymentStep.style.display = "none";


        /* SHOW VERIFICATION */

        verificationStep.style.display = "block";


        /* UPDATE STEP INDICATORS */

        stepIndicator3.classList.remove("active");

        stepIndicator3.classList.add("completed");

        stepIndicator4.classList.add("active");


        /* SCROLL TO TOP */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });
