/* =========================================
   UNIQUE ACADEMIC
   REAL REGISTRATION SYSTEM
   Firebase + Cloud Firestore + Storage

   STEP 1 → STEP 2 → STEP 3 → STEP 4

   SCREENSHOT:
   - Validates JPG / PNG / WEBP
   - Compresses large screenshots
   - Uploads compressed image to Firebase Storage
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


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


/* =========================================
   FIREBASE STORAGE
========================================= */

const storage = getStorage();


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
            document
                .getElementById("fullName")
                .value
                .trim();


        const phone =
            document
                .getElementById("phone")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const university =
            document
                .getElementById("university")
                .value;


        const department =
            document
                .getElementById("department")
                .value
                .trim();


        if (fullName === "") {

            alert(
                "Please enter your full name."
            );

            return;
        }


        if (phone === "") {

            alert(
                "Please enter your phone number."
            );

            return;
        }


        if (email === "") {

            alert(
                "Please enter your email address."
            );

            return;
        }


        if (university === "") {

            alert(
                "Please select your university."
            );

            return;
        }


        if (department === "") {

            alert(
                "Please enter your department."
            );

            return;
        }


        personalStep.style.display =
            "none";


        securityStep.style.display =
            "block";


        paymentStep.style.display =
            "none";


        stepIndicator1.classList.remove(
            "active"
        );


        stepIndicator1.classList.add(
            "completed"
        );


        stepIndicator2.classList.add(
            "active"
        );


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

        securityStep.style.display =
            "none";


        personalStep.style.display =
            "block";


        stepIndicator2.classList.remove(
            "active"
        );


        stepIndicator1.classList.remove(
            "completed"
        );


        stepIndicator1.classList.add(
            "active"
        );


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

            strengthBar.style.width =
                "0%";


            strengthText.textContent =
                "Enter a password";


            strengthText.className =
                "";

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
   CREATE REAL FIREBASE USER
========================================= */

document
    .getElementById("securityContinueBtn")
    .addEventListener(
        "click",
        async function () {

            const password =
                passwordInput.value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


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


            try {

                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            }

            catch (error) {

                console.error(error);


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

                else {

                    alert(
                        "Account creation failed. Please try again."
                    );

                }

                return;
            }


            securityStep.style.display =
                "none";


            paymentStep.style.display =
                "block";


            stepIndicator2.classList.remove(
                "active"
            );


            stepIndicator2.classList.add(
                "completed"
            );


            stepIndicator3.classList.add(
                "active"
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


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

        }
    );


/* =========================================
   SCREENSHOT ELEMENTS
========================================= */

const paymentScreenshot =
    document.getElementById(
        "paymentScreenshot"
    );


const fileName =
    document.getElementById(
        "fileName"
    );


/* =========================================
   SCREENSHOT VALIDATION
========================================= */

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


const maxSize =
    5 * 1024 * 1024;


paymentScreenshot.addEventListener(
    "change",
    function () {

        if (
            !this.files ||
            this.files.length === 0
        ) {

            fileName.textContent =
                "";

            return;
        }


        const file =
            this.files[0];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Please upload a JPG, PNG or WEBP image."
            );


            this.value =
                "";


            fileName.textContent =
                "";


            return;
        }


        if (
            file.size > maxSize
        ) {

            alert(
                "The screenshot must be smaller than 5 MB."
            );


            this.value =
                "";


            fileName.textContent =
                "";


            return;
        }


        const sizeMB =
            (
                file.size /
                (1024 * 1024)
            ).toFixed(2);


        fileName.textContent =
            "📎 " +
            file.name +
            " (" +
            sizeMB +
            " MB)";

    }
);


/* =========================================
   COMPRESS SCREENSHOT
========================================= */

async function compressScreenshot(
    file
) {

    /*
     * PNG / WEBP / JPEG files from phones
     * can be very large.
     *
     * We resize them to a maximum of
     * 1600px and convert them to JPEG.
     */

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const image =
                        new Image();


                    image.onload =
                        function () {

                            const MAX_WIDTH =
                                1600;


                            const MAX_HEIGHT =
                                1600;


                            let width =
                                image.width;


                            let height =
                                image.height;


                            /*
                             * RESIZE
                             */

                            if (
                                width >
                                MAX_WIDTH ||
                                height >
                                MAX_HEIGHT
                            ) {

                                const widthRatio =
                                    MAX_WIDTH /
                                    width;


                                const heightRatio =
                                    MAX_HEIGHT /
                                    height;


                                const ratio =
                                    Math.min(
                                        widthRatio,
                                        heightRatio
                                    );


                                width =
                                    Math.round(
                                        width *
                                        ratio
                                    );


                                height =
                                    Math.round(
                                        height *
                                        ratio
                                    );

                            }


                            /*
                             * CANVAS
                             */

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                width;


                            canvas.height =
                                height;


                            const context =
                                canvas.getContext(
                                    "2d"
                                );


                            context.drawImage(
                                image,
                                0,
                                0,
                                width,
                                height
                            );


                            /*
                             * CONVERT TO JPEG
                             *
                             * 80% quality gives a
                             * good balance between
                             * readability and speed.
                             */

                            canvas.toBlob(
                                function (blob) {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Could not compress screenshot."
                                            )
                                        );

                                        return;
                                    }


                                    const compressedFile =
                                        new File(
                                            [
                                                blob
                                            ],
                                            "payment-screenshot.jpg",
                                            {
                                                type:
                                                    "image/jpeg"
                                            }
                                        );


                                    resolve(
                                        compressedFile
                                    );

                                },
                                "image/jpeg",
                                0.80
                            );

                        };


                    image.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Could not read screenshot."
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "Could not read screenshot file."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


/* =========================================
   STEP 3 → STEP 4
   SAVE REGISTRATION + UPLOAD SCREENSHOT
========================================= */

document
    .getElementById("submitPaymentBtn")
    .addEventListener(
        "click",
        async function () {

            const button =
                this;


            const paymentReference =
                document
                    .getElementById(
                        "paymentReference"
                    )
                    .value
                    .trim();


            const screenshotFiles =
                document
                    .getElementById(
                        "paymentScreenshot"
                    )
                    .files;


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

            if (
                screenshotFiles.length === 0
            ) {

                alert(
                    "Please upload your payment screenshot."
                );

                return;
            }


            const originalScreenshot =
                screenshotFiles[0];


            /* =================================
               FILE TYPE
            ================================= */

            if (
                !allowedTypes.includes(
                    originalScreenshot.type
                )
            ) {

                alert(
                    "Please upload a JPG, PNG or WEBP image."
                );

                return;
            }


            /* =================================
               ORIGINAL FILE SIZE
            ================================= */

            if (
                originalScreenshot.size >
                maxSize
            ) {

                alert(
                    "The screenshot must be smaller than 5 MB."
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
                "Preparing screenshot...";


            try {

                /* =================================
                   CURRENT USER
                ================================= */

                const user =
                    auth.currentUser;


                const userId =
                    user.uid;


                /* =================================
                   COMPRESS SCREENSHOT
                ================================= */

                const screenshot =
                    await compressScreenshot(
                        originalScreenshot
                    );


                /*
                 * Safety check after compression.
                 */

                if (
                    screenshot.size >
                    maxSize
                ) {

                    alert(
                        "The screenshot is still too large after compression. Please choose a smaller screenshot."
                    );


                    button.disabled =
                        false;


                    button.innerHTML =
                        'Submit Payment <span>→</span>';


                    return;
                }


                /* =================================
                   SHOW UPLOAD SIZE
                ================================= */

                const compressedMB =
                    (
                        screenshot.size /
                        (1024 * 1024)
                    ).toFixed(2);


                button.innerHTML =
                    "Uploading screenshot...";


                /*
                 * CREATE UNIQUE STORAGE PATH
                 */

                const storagePath =
                    `payment-screenshots/${userId}/${Date.now()}.jpg`;


                const screenshotRef =
                    ref(
                        storage,
                        storagePath
                    );


                /* =================================
                   UPLOAD COMPRESSED SCREENSHOT
                ================================= */

                await uploadBytes(
                    screenshotRef,
                    screenshot,
                    {
                        contentType:
                            "image/jpeg"
                    }
                );


                /* =================================
                   GET DOWNLOAD URL
                ================================= */

                button.innerHTML =
                    "Saving registration...";


                const screenshotURL =
                    await getDownloadURL(
                        screenshotRef
                    );


                /* =================================
                   COLLECT STUDENT INFORMATION
                ================================= */

                const registrationData = {

                    userId:
                        userId,


                    fullName:
                        document
                            .getElementById(
                                "fullName"
                            )
                            .value
                            .trim(),


                    phone:
                        document
                            .getElementById(
                                "phone"
                            )
                            .value
                            .trim(),


                    email:
                        document
                            .getElementById(
                                "email"
                            )
                            .value
                            .trim(),


                    university:
                        document
                            .getElementById(
                                "university"
                            )
                            .value,


                    department:
                        document
                            .getElementById(
                                "department"
                            )
                            .value
                            .trim(),


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


                    /* =================================
                       SCREENSHOT INFORMATION
                    ================================= */

                    paymentScreenshotURL:
                        screenshotURL,


                    /*
                     * Keep screenshotURL too.
                     *
                     * This makes the data compatible
                     * with your existing admin.js.
                     */

                    screenshotURL:
                        screenshotURL,


                    paymentScreenshotPath:
                        storagePath,


                    paymentScreenshotName:
                        originalScreenshot.name,


                    paymentScreenshotType:
                        "image/jpeg",


                    paymentScreenshotSize:
                        screenshot.size,


                    originalScreenshotSize:
                        originalScreenshot.size,


                    submittedAt:
                        serverTimestamp()

                };


                /* =================================
                   SAVE TO FIRESTORE
                ================================= */

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


                /* =================================
                   HIDE PAYMENT
                ================================= */

                paymentStep.style.display =
                    "none";


                /* =================================
                   SHOW VERIFICATION
                ================================= */

                if (
                    verificationStep
                ) {

                    verificationStep.style.display =
                        "block";

                }


                /* =================================
                   UPDATE INDICATORS
                ================================= */

                stepIndicator3
                    .classList
                    .remove(
                        "active"
                    );


                stepIndicator3
                    .classList
                    .add(
                        "completed"
                    );


                stepIndicator4
                    .classList
                    .add(
                        "active"
                    );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });


            }

            catch (error) {

                console.error(
                    "Registration submission error:",
                    error
                );


                /* =================================
                   FIREBASE STORAGE ERRORS
                ================================= */

                if (
                    error.code ===
                    "storage/unauthorized"
                ) {

                    alert(
                        "Screenshot upload was denied by Firebase Storage rules. Please check your Firebase Storage rules."
                    );

                }

                else if (
                    error.code ===
                    "storage/canceled"
                ) {

                    alert(
                        "Screenshot upload was canceled. Please try again."
                    );

                }

                else if (
                    error.code ===
                    "storage/quota-exceeded"
                ) {

                    alert(
                        "Firebase Storage quota has been exceeded."
                    );

                }

                else {

                    alert(
                        "We could not submit your registration. Please try again."
                    );

                }


                button.disabled =
                    false;


                button.innerHTML =
                    'Submit Payment <span>→</span>';

            }

        }
    );
