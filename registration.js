/* =========================================
   UNIQUE ACADEMIC
   REGISTRATION SYSTEM
   STEP 1 + STEP 2
========================================= */


/* =========================
   ELEMENTS
========================= */

const personalStep =
    document.getElementById("personalStep");

const securityStep =
    document.getElementById("securityStep");


const personalContinueBtn =
    document.getElementById("personalContinueBtn");

const securityContinueBtn =
    document.getElementById("securityContinueBtn");

const backToPersonalBtn =
    document.getElementById("backToPersonalBtn");


const stepIndicator1 =
    document.getElementById("stepIndicator1");

const stepIndicator2 =
    document.getElementById("stepIndicator2");


/* =========================
   STEP 1 → STEP 2
========================= */

personalContinueBtn.addEventListener("click", function () {

    const fullName =
        document.getElementById("fullName").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const university =
        document.getElementById("university").value;

    const department =
        document.getElementById("department").value.trim();


    /* CHECK FULL NAME */

    if (fullName === "") {

        alert("Please enter your full name.");

        return;
    }


    /* CHECK PHONE */

    if (phone === "") {

        alert("Please enter your phone number.");

        return;
    }


    /* CHECK EMAIL */

    if (email === "") {

        alert("Please enter your email address.");

        return;
    }


    /* CHECK UNIVERSITY */

    if (university === "") {

        alert("Please select your university.");

        return;
    }


    /* CHECK DEPARTMENT */

    if (department === "") {

        alert("Please enter your department.");

        return;
    }


    /* SHOW STEP 2 */

    personalStep.style.display = "none";

    securityStep.style.display = "block";


    /* UPDATE PROGRESS */

    stepIndicator1.classList.remove("active");

    stepIndicator1.classList.add("completed");

    stepIndicator2.classList.add("active");


    /* Scroll to top */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   STEP 2 → STEP 1
========================= */

backToPersonalBtn.addEventListener("click", function () {

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


/* =========================
   PASSWORD STRENGTH
========================= */

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


passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;


    const hasLength =
        password.length >= 8;

    const hasNumber =
        /[0-9]/.test(password);

    const hasUppercase =
        /[A-Z]/.test(password);


    /* UPDATE REQUIREMENTS */

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


    /* PASSWORD STRENGTH */

    let strength = 0;

    if (hasLength) strength++;

    if (hasNumber) strength++;

    if (hasUppercase) strength++;


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

        strengthText.className = "weak";

    }

    else if (strength === 2) {

        strengthBar.style.width = "66%";

        strengthText.textContent =
            "Medium password";

        strengthText.className = "medium";

    }

    else {

        strengthBar.style.width = "100%";

        strengthText.textContent =
            "Strong password";

        strengthText.className = "strong";

    }

});


/* =========================
   STEP 2 CONTINUE
========================= */

securityContinueBtn.addEventListener("click", function () {

    const password =
        passwordInput.value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    /* CHECK PASSWORD */

    if (password === "") {

        alert("Please create a password.");

        return;
    }


    /* CHECK REQUIREMENTS */

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


    /* CHECK CONFIRM PASSWORD */

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


    /* TEMPORARY */

    alert(
        "Account security completed successfully! " +
        "Next step: Registration Payment."
    );

});
