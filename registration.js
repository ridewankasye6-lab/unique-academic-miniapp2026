/* =========================================
   UNIQUE ACADEMIC
   REGISTRATION — STEP 1
========================================= */

const continueBtn = document.getElementById("continueBtn");

continueBtn.addEventListener("click", function () {

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const university = document.getElementById("university").value;
    const department = document.getElementById("department").value.trim();


    /* Check required information */

    if (!fullName) {
        alert("Please enter your full name.");
        return;
    }

    if (!phone) {
        alert("Please enter your phone number.");
        return;
    }

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    if (!university) {
        alert("Please select your university.");
        return;
    }

    if (!department) {
        alert("Please enter your department.");
        return;
    }


    /* Temporary success message */

    alert(
        "Personal information completed successfully! " +
        "The next step will be Account Security."
    );

});
