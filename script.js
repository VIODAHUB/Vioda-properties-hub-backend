// ============================================================
// VIODA PROPERTY HUB - COMPLETE SCRIPT.JS
// Firebase + Property Submission + KSh 100 M-Pesa STK Push
// ============================================================


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyBgHYsPHBpSaFy057GglWzZcWUnpUpu_wM",
    authDomain: "vioda-properties-hub.firebaseapp.com",
    databaseURL: "https://vioda-properties-hub-default-rtdb.firebaseio.com",
    projectId: "vioda-properties-hub",
    storageBucket: "vioda-properties-hub.firebasestorage.app",
    messagingSenderId: "422965817049",
    appId: "1:422965817049:web:18e572a712ed247851d8c8"
};


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let adminProperties = [];


// ============================================================
// HELPER
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


// ============================================================
// TEST JAVASCRIPT
// ============================================================

function testJavaScript() {

    alert(
        "✅ JAVASCRIPT IS WORKING!\n\n" +
        "VIODA PROPERTY HUB is working correctly."
    );
}

function testAdminJavaScript() {

    alert(
        "✅ ADMIN JAVASCRIPT IS WORKING!\n\n" +
        "VIODA ADMIN DASHBOARD is working correctly."
    );
}

window.testJavaScript = testJavaScript;
window.testAdminJavaScript = testAdminJavaScript;


// ============================================================
// PUBLIC WEBSITE - VIEW PROPERTY
// ============================================================

function viewProperty(property) {

    if (!property) {

        alert(
            "Property information not found."
        );

        return;
    }

    const modal =
        getElement("propertyModal");

    if (!modal) {

        alert(
            "Property viewing window was not found."
        );

        return;
    }

    modal.style.display = "block";


    const title =
        getElement("modalTitle");

    const location =
        getElement("modalLocation");

    const price =
        getElement("modalPrice");

    const listing =
        getElement("modalListing");

    const owner =
        getElement("modalOwner");

    const phone =
        getElement("modalPhone");

    const email =
        getElement("modalEmail");

    const description =
        getElement("modalDescription");

    const features =
        getElement("modalFeatures");

    const photosContainer =
        getElement("modalPhotos");


    if (title) {

        title.innerText =
            property.apartment ||
            property.name ||
            property.propertyName ||
            "Property";
    }


    if (location) {

        location.innerText =
            "📍 Location: " +
            (property.location || "Not provided");
    }


    if (price) {

        price.innerText =
            "💰 Price: KSh " +
            (property.price || "Not provided");
    }


    if (listing) {

        listing.innerText =
            "📋 Listing: " +
            (property.listingType || "Not provided");
    }


    if (owner) {

        owner.innerText =
            "👤 Owner: " +
            (property.name || "Not provided");
    }


    if (phone) {

        phone.innerText =
            "📞 Phone: " +
            (property.phone || "Not provided");
    }


    if (email) {

        email.innerText =
            "📧 Email: " +
            (property.email || "Not provided");
    }


    if (description) {

        description.innerText =
            "📝 Description: " +
            (property.description || "Not provided");
    }


    if (features) {

        let featureText = "";

        if (Array.isArray(property.features)) {

            featureText =
                property.features.join(" • ");

        } else {

            featureText =
                property.features || "";
        }

        features.innerText =
            "⭐ Features: " +
            featureText;
    }


    if (photosContainer) {

        photosContainer.innerHTML = "";

        const photos =
            Array.isArray(property.photos)
                ? property.photos
                : [];


        if (photos.length === 0) {

            photosContainer.innerHTML =
                "<p>No photos available.</p>";

        } else {

            const gallery =
                document.createElement("div");

            gallery.className =
                "photo-gallery";


            photos.forEach(
                function(photo) {

                    const image =
                        document.createElement("img");

                    image.src =
                        photo;

                    image.alt =
                        "Property photo";

                    image.style.maxWidth =
                        "100%";

                    image.style.height =
                        "auto";

                    gallery.appendChild(
                        image
                    );
                }
            );


            photosContainer.appendChild(
                gallery
            );
        }
    }
}

window.viewProperty =
    viewProperty;


// ============================================================
// CLOSE PROPERTY MODAL
// ============================================================

function closePropertyModal() {

    const modal =
        getElement("propertyModal");

    if (modal) {

        modal.style.display =
            "none";
    }
}

window.closePropertyModal =
    closePropertyModal;


// ============================================================
// PUBLIC PROPERTY SEARCH
// ============================================================

function searchProperties() {

    const locationInput =
        getElement("locationSearch");

    const typeInput =
        getElement("typeSearch");


    const location =
        locationInput
            ? locationInput.value
                .toLowerCase()
                .trim()
            : "";


    const type =
        typeInput
            ? typeInput.value
                .toLowerCase()
                .trim()
            : "";


    const cards =
        document.querySelectorAll(
            ".property-card"
        );


    cards.forEach(
        function(card) {

            const cardLocation =
                (
                    card.dataset.location ||
                    card.getAttribute(
                        "data-location"
                    ) ||
                    ""
                ).toLowerCase();


            const cardType =
                (
                    card.dataset.type ||
                    card.getAttribute(
                        "data-type"
                    ) ||
                    ""
                ).toLowerCase();


            const locationMatch =
                location === "" ||
                cardLocation.includes(
                    location
                );


            const typeMatch =
                type === "" ||
                cardType.includes(
                    type
                );


            if (
                locationMatch &&
                typeMatch
            ) {

                card.style.display =
                    "";

            } else {

                card.style.display =
                    "none";
            }
        }
    );
}

window.searchProperties =
    searchProperties;


// ============================================================
// SHOW ALL PROPERTIES
// ============================================================

function showAllProperties() {

    const cards =
        document.querySelectorAll(
            ".property-card"
        );


    cards.forEach(
        function(card) {

            card.style.display =
                "";
        }
    );


    const location =
        getElement("locationSearch");

    const type =
        getElement("typeSearch");


    if (location) {

        location.value =
            "";
    }


    if (type) {

        type.value =
            "";
    }
}

window.showAllProperties =
    showAllProperties;


// ============================================================
// FORMAT KENYAN PHONE NUMBER
// ============================================================

function formatKenyanPhone(phone) {

    let number =
        String(phone || "")
            .replace(/\s+/g, "")
            .replace(/-/g, "")
            .replace(/^\+/, "");


    if (number.startsWith("07")) {

        number =
            "254" +
            number.substring(1);
    }


    else if (
        number.startsWith("01")
    ) {

        number =
            "254" +
            number.substring(1);
    }


    return number;
}


// ============================================================
// VALIDATE KENYAN PHONE
// ============================================================

function isValidKenyanPhone(phone) {

    return /^254[17]\d{8}$/.test(
        phone
    );
}


// ============================================================
// REQUEST KSh 100 M-PESA STK PUSH
// ============================================================

async function requestMpesaPayment(
    phone,
    propertyId
) {

    const phoneNumber =
        formatKenyanPhone(phone);


    if (
        !isValidKenyanPhone(
            phoneNumber
        )
    ) {

        throw new Error(
            "Please enter a valid Kenyan phone number, e.g. 0712345678."
        );
    }


    const response =
        await fetch(
            "/api/stkpush",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        phone:
                            phoneNumber,

                        propertyId:
                            propertyId
                    })
            }
        );


    let data = {};

    try {

        data =
            await response.json();

    } catch (error) {

        throw new Error(
            "The payment server returned an invalid response."
        );
    }


    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "M-Pesa payment request failed."
        );
    }


    return data;
}

// ============================================================
// PROPERTY SUBMISSION + KSH 100 M-PESA PAYMENT
// ============================================================

async function submitProperty(event) {

    if (event) {
        event.preventDefault();
    }

    const form = getElement("propertyForm");

    if (!form) {
        alert("Property submission form was not found.");
        return;
    }

    const submitButton =
        getElement("submitPropertyButton") ||
        form.querySelector('button[type="submit"]');

    try {

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerText = "SAVING PROPERTY...";
        }

        // ----------------------------------------------------
        // MAKE SURE VISITOR IS AUTHENTICATED
        // ----------------------------------------------------

        await ensureAnonymousLogin();

        // ----------------------------------------------------
        // GET FORM DATA
        // ----------------------------------------------------

        const name =
            getElement("fullName")?.value.trim() || "";

        const apartment =
            getElement("apartmentName")?.value.trim() || "";

        const phone =
            getElement("phoneNumber")?.value.trim() || "";

        const email =
            getElement("email")?.value.trim() || "";

        const propertyType =
            getElement("propertyType")?.value || "";

        const listingType =
            getElement("listingType")?.value || "";

        const location =
            getElement("propertyLocation")?.value.trim() || "";

        const price =
            Number(
                getElement("propertyPrice")?.value || 0
            );

        const description =
            getElement("propertyDescription")
                ?.value.trim() || "";

        // ----------------------------------------------------
        // VALIDATE
        // ----------------------------------------------------

        if (
            !name ||
            !phone ||
            !propertyType ||
            !listingType ||
            !location ||
            !price ||
            !description
        ) {

            alert(
                "Please fill in all required property details."
            );

            return;
        }

        // ----------------------------------------------------
        // FEATURES
        // ----------------------------------------------------

        const featureCheckboxes =
            document.querySelectorAll(
                'input[name="features"]:checked'
            );

        const features =
            Array.from(featureCheckboxes)
                .map(function(item) {
                    return item.value;
                });

        // ----------------------------------------------------
        // PHOTOS
        // ----------------------------------------------------

        const photoInput =
            getElement("propertyPhoto");

        const files =
            photoInput
                ? Array.from(
                    photoInput.files || []
                )
                : [];

        if (files.length > 5) {

            alert(
                "Please select a maximum of 5 photos."
            );

            return;
        }

        // ----------------------------------------------------
        // COMPRESS PHOTOS
        // ----------------------------------------------------

        if (submitButton) {
            submitButton.innerText =
                "PROCESSING PHOTOS...";
        }

        const photos = [];

        for (const file of files) {

            const photoData =
                await compressImage(file);

            photos.push(photoData);
        }

        // ----------------------------------------------------
        // CREATE PROPERTY AS PENDING PAYMENT
        // ----------------------------------------------------

        if (submitButton) {
            submitButton.innerText =
                "CREATING PAYMENT REQUEST...";
        }

        const propertyData = {

            name: name,

            apartment: apartment,

            phone: phone,

            email: email,

            propertyType: propertyType,

            listingType: listingType,

            location: location,

            price: price,

            description: description,

            features: features,

            photos: photos,

            paymentAmount: 100,

            paymentCurrency: "KES",

            paymentStatus: "PENDING",

            status: "pending_payment",

            source: "owner",

            createdAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp(),

            updatedAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp()
        };

        // ----------------------------------------------------
        // SAVE PROPERTY FIRST
        // ----------------------------------------------------

        const propertyRef =
            await db
                .collection("properties")
                .add(propertyData);

        const propertyId =
            propertyRef.id;

        console.log(
            "PROPERTY CREATED:",
            propertyId
        );

        // ----------------------------------------------------
        // SEND STK PUSH
        // ----------------------------------------------------

        if (submitButton) {
            submitButton.innerText =
                "SENDING M-PESA PROMPT...";
        }

        const paymentResponse =
            await fetch(
                "/api/stkpush",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            phone:
                                phone,

                            propertyId:
                                propertyId
                        })
                }
            );

        const paymentData =
            await paymentResponse.json();

        console.log(
            "M-PESA RESPONSE:",
            paymentData
        );

        // ----------------------------------------------------
        // CHECK STK RESPONSE
        // ----------------------------------------------------

        if (
            !paymentResponse.ok ||
            !paymentData.success
        ) {

            await propertyRef.update({

                paymentStatus:
                    "FAILED",

                status:
                    "payment_failed",

                paymentError:
                    paymentData.message ||
                    "M-Pesa request failed.",

                updatedAt:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp()
            });

            throw new Error(
                paymentData.message ||
                "M-Pesa payment request failed."
            );
        }

        // ----------------------------------------------------
        // SAVE CHECKOUT REQUEST ID
        // ----------------------------------------------------

        await propertyRef.update({

            checkoutRequestId:
                paymentData.checkoutRequestId ||
                "",

            merchantRequestId:
                paymentData.merchantRequestId ||
                "",

            paymentStatus:
                "PENDING",

            status:
                "pending_payment",

            updatedAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp()
        });

        // ----------------------------------------------------
        // SHOW PAYMENT MESSAGE
        // ----------------------------------------------------

        alert(
            "📱 M-PESA PAYMENT REQUEST SENT!\n\n" +
            "Please complete the KSh 100 payment.\n\n" +
            "Your property will only be published after payment is confirmed."
        );

        if (submitButton) {
            submitButton.innerText =
                "WAITING FOR PAYMENT...";
        }

        // ----------------------------------------------------
        // WAIT FOR FIRESTORE CALLBACK UPDATE
        // ----------------------------------------------------

        await waitForPaymentConfirmation(
            propertyRef
        );

    }

    catch(error) {

        console.error(
            "PROPERTY SUBMISSION ERROR:",
            error
        );

        alert(
            "❌ PROPERTY SUBMISSION FAILED.\n\n" +
            error.message
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerText =
                "📤 SUBMIT PROPERTY";
        }
    }
}


// ============================================================
// WAIT FOR PAYMENT CONFIRMATION
// ============================================================

function waitForPaymentConfirmation(
    propertyRef
) {

    return new Promise(
        function(resolve, reject) {

            let finished = false;

            const timeout =
                setTimeout(
                    function() {

                        if (finished) {
                            return;
                        }

                        finished = true;

                        unsubscribe();

                        reject(
                            new Error(
                                "Payment confirmation timed out. If you completed the payment, please contact VIODA PROPERTY HUB."
                            )
                        );

                    },
                    180000
                );


            const unsubscribe =
                propertyRef.onSnapshot(
                    function(snapshot) {

                        if (!snapshot.exists) {
                            return;
                        }

                        const data =
                            snapshot.data();

                        console.log(
                            "PAYMENT STATUS:",
                            data.paymentStatus
                        );


                        // ------------------------------------
                        // PAYMENT SUCCESSFUL
                        // ------------------------------------

                        if (
                            data.paymentStatus ===
                            "PAID"
                        ) {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            clearTimeout(
                                timeout
                            );

                            unsubscribe();

                            alert(
                                "✅ PAYMENT CONFIRMED!\n\n" +
                                "Your property has been published successfully on VIODA PROPERTY HUB."
                            );

                            const form =
                                getElement(
                                    "propertyForm"
                                );

                            if (form) {
                                form.reset();
                            }

                            resolve();
                        }


                        // ------------------------------------
                        // PAYMENT FAILED
                        // ------------------------------------

                        else if (
                            data.paymentStatus ===
                            "FAILED"
                        ) {

                            if (finished) {
                                return;
                            }

                            finished = true;

                            clearTimeout(
                                timeout
                            );

                            unsubscribe();

                            reject(
                                new Error(
                                    data.paymentResultDescription ||
                                    "M-Pesa payment was not completed."
                                )
                            );
                        }

                    },

                    function(error) {

                        if (finished) {
                            return;
                        }

                        finished = true;

                        clearTimeout(
                            timeout
                        );

                        unsubscribe();

                        reject(error);
                    }
                );
        }
    );
}

window.submitProperty =
    submitProperty;
// ============================================================
// COMPRESS IMAGE
// ============================================================

function compressImage(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        new Image();


                    image.onload =
                        function() {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const maxWidth =
                                900;

                            const maxHeight =
                                900;


                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width > maxWidth ||
                                height > maxHeight
                            ) {

                                const ratio =
                                    Math.min(
                                        maxWidth /
                                            width,

                                        maxHeight /
                                            height
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


                            const compressed =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.65
                                );


                            resolve(
                                compressed
                            );
                        };


                    image.onerror =
                        function() {

                            reject(
                                new Error(
                                    "Could not process image."
                                )
                            );
                        };


                    image.src =
                        event.target.result;
                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not read image."
                        )
                    );
                };


            reader.readAsDataURL(
                file
            );
        }
    );
}


// ============================================================
// ADMIN LOGIN
// ============================================================

function setupAdminLogin() {

    const loginForm =
        getElement(
            "adminLoginForm"
        );


    if (!loginForm) {

        return;
    }


    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                getElement(
                    "adminEmail"
                )
                    ?.value
                    .trim() || "";


            const password =
                getElement(
                    "adminPassword"
                )
                    ?.value || "";


            const message =
                getElement(
                    "loginMessage"
                );


            const loginButton =
                getElement(
                    "loginButton"
                );


            if (
                !email ||
                !password
            ) {

                if (message) {

                    message.innerText =
                        "Please enter your email and password.";

                    message.style.color =
                        "red";
                }

                return;
            }


            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.innerText =
                    "LOGGING IN...";
            }


            if (message) {

                message.innerText =
                    "Connecting to Firebase...";

                message.style.color =
                    "purple";
            }


            try {

                await auth
                    .signInWithEmailAndPassword(
                        email,
                        password
                    );


                if (message) {

                    message.innerText =
                        "✅ Login successful.";

                    message.style.color =
                        "green";
                }

            }


            catch(error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                let text =
                    "Login failed.";


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    text =
                        "No account exists with this email.";
                }


                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    text =
                        "Incorrect password.";
                }


                else if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    text =
                        "Incorrect email or password.";
                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    text =
                        "Please enter a valid email address.";
                }


                else if (
                    error.code ===
                    "auth/api-key-not-valid"
                ) {

                    text =
                        "Firebase API key is not valid.";
                }


                else {

                    text =
                        error.message;
                }


                if (message) {

                    message.innerText =
                        "❌ " + text;

                    message.style.color =
                        "red";
                }
            }


            finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.innerText =
                        "LOGIN";
                }
            }
        }
    );
}


// ============================================================
// ADMIN AUTH STATE
// ============================================================

function setupAdminAuthState() {

    auth.onAuthStateChanged(
        async function(user) {

            const loginContainer =
                getElement(
                    "loginContainer"
                );


            const dashboard =
                getElement(
                    "dashboard"
                );


            if (user) {

                console.log(
                    "ADMIN LOGGED IN:",
                    user.email
                );


                if (loginContainer) {

                    loginContainer.style.display =
                        "none";
                }


                if (dashboard) {

                    dashboard.style.display =
                        "block";
                }


                const emailDisplay =
                    getElement(
                        "adminEmailDisplay"
                    );


                if (emailDisplay) {

                    emailDisplay.innerText =
                        user.email;
                }


                await loadAdminProperties();

            }


            else {

                if (loginContainer) {

                    loginContainer.style.display =
                        "block";
                }


                if (dashboard) {

                    dashboard.style.display =
                        "none";
                }
            }
        }
    );
}


// ============================================================
// LOAD ADMIN PROPERTIES
// ============================================================

async function loadAdminProperties() {

    const grid =
        getElement(
            "adminPropertyGrid"
        );


    const count =
        getElement(
            "propertyCount"
        );


    if (!grid) {

        return;
    }


    if (!auth.currentUser) {

        grid.innerHTML =
            "<p style='color:red;'>Admin is not logged in.</p>";

        return;
    }


    grid.innerHTML =
        "<p>Loading properties...</p>";


    try {

        const snapshot =
            await db
                .collection(
                    "properties"
                )
                .get();


        adminProperties = [];


        snapshot.forEach(
            function(doc) {

                adminProperties.push({

                    id:
                        doc.id,

                    ...doc.data()
                });
            }
        );


        if (count) {

            count.innerText =
                adminProperties.length;
        }


        displayAdminProperties(
            adminProperties
        );

    }


    catch(error) {

        console.error(
            "LOAD ADMIN PROPERTIES ERROR:",
            error
        );


        grid.innerHTML =
            "<p style='color:red;'>" +
            "Could not load properties.<br><br>" +
            error.message +
            "</p>";
    }
}


window.loadAdminProperties =
    loadAdminProperties;


// ============================================================
// DISPLAY ADMIN PROPERTIES
// ============================================================

function displayAdminProperties(
    properties
) {

    const grid =
        getElement(
            "adminPropertyGrid"
        );


    if (!grid) {

        return;
    }


    grid.innerHTML =
        "";


    if (!properties.length) {

        grid.innerHTML =
            "<p>No properties found.</p>";

        return;
    }


    properties.forEach(
        function(property) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "property-card";


            const photos =
                Array.isArray(
                    property.photos
                )
                    ? property.photos
                    : [];


            if (
                photos.length > 0
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    photos[0];


                image.alt =
                    "Property photo";


                card.appendChild(
                    image
                );
            }


            const title =
                document.createElement(
                    "h3"
                );


            title.innerText =
                property.apartment ||
                property.name ||
                "Property";


            card.appendChild(
                title
            );


            const location =
                document.createElement(
                    "p"
                );


            location.innerText =
                "📍 " +
                (
                    property.location ||
                    "No location"
                );


            card.appendChild(
                location
            );


            const price =
                document.createElement(
                    "p"
                );


            price.innerText =
                "💰 KSh " +
                (
                    property.price ||
                    "No price"
                );


            card.appendChild(
                price
            );


            const owner =
                document.createElement(
                    "p"
                );


            owner.innerText =
                "👤 Owner: " +
                (
                    property.name ||
                    "Not provided"
                );


            card.appendChild(
                owner
            );


            const listing =
                document.createElement(
                    "p"
                );


            listing.innerText =
                "📋 " +
                (
                    property.listingType ||
                    ""
                );


            card.appendChild(
                listing
            );


            // ------------------------------------------------
            // ADMIN-ONLY PAYMENT STATUS
            // ------------------------------------------------

            const payment =
                document.createElement(
                    "p"
                );


            payment.innerText =
                "💳 Payment: " +
                (
                    property.paymentStatus ||
                    "PENDING"
                );


            payment.style.fontWeight =
                "bold";


            card.appendChild(
                payment
            );


            // ------------------------------------------------
            // BUTTONS
            // ------------------------------------------------

            const buttons =
                document.createElement(
                    "div"
                );


            buttons.className =
                "card-buttons";


            // VIEW

            const viewButton =
                document.createElement(
                    "button"
                );


            viewButton.type =
                "button";


            viewButton.innerText =
                "VIEW";


            viewButton.onclick =
                function() {

                    viewAdminProperty(
                        property
                    );
                };


            buttons.appendChild(
                viewButton
            );


            // EDIT

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.innerText =
                "EDIT";


            editButton.className =
                "edit-button";


            editButton.onclick =
                function() {

                    openEditModal(
                        property
                    );
                };


            buttons.appendChild(
                editButton
            );


            // DELETE

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.innerText =
                "DELETE";


            deleteButton.className =
                "delete-button";


            deleteButton.onclick =
                function() {

                    deleteProperty(
                        property
                    );
                };


            buttons.appendChild(
                deleteButton
            );


            card.appendChild(
                buttons
            );


            grid.appendChild(
                card
            );
        }
    );
}


// ============================================================
// ADMIN VIEW
// ============================================================

function viewAdminProperty(
    property
) {

    viewProperty(
        property
    );
}


window.viewAdminProperty =
    viewAdminProperty;


// ============================================================
// ADMIN EDIT
// ============================================================

function openEditModal(
    property
) {

    const modal =
        getElement(
            "editModal"
        );


    if (!modal) {

        alert(
            "Edit window was not found."
        );

        return;
    }


    getElement(
        "editPropertyId"
    ).value =
        property.id;


    getElement(
        "editName"
    ).value =
        property.name || "";


    getElement(
        "editApartment"
    ).value =
        property.apartment || "";


    getElement(
        "editPhone"
    ).value =
        property.phone || "";


    getElement(
        "editEmail"
    ).value =
        property.email || "";


    getElement(
        "editPropertyType"
    ).value =
        property.propertyType ||
        "residential";


    getElement(
        "editListingType"
    ).value =
        property.listingType ||
        "sale";


    getElement(
        "editLocation"
    ).value =
        property.location || "";


    getElement(
        "editPrice"
    ).value =
        property.price || "";


    getElement(
        "editDescription"
    ).value =
        property.description || "";


    const boxes =
        document.querySelectorAll(
            'input[name="editFeatures"]'
        );


    boxes.forEach(
        function(box) {

            box.checked =
                Array.isArray(
                    property.features
                ) &&
                property.features.includes(
                    box.value
                );
        }
    );


    modal.style.display =
        "block";
}


window.openEditModal =
    openEditModal;


// ============================================================
// SAVE EDITED PROPERTY
// ============================================================

function setupEditForm() {

    const form =
        getElement(
            "editPropertyForm"
        );


    if (!form) {

        return;
    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const propertyId =
                getElement(
                    "editPropertyId"
                )
                    ?.value;


            const saveButton =
                getElement(
                    "saveEditButton"
                );


            if (!propertyId) {

                alert(
                    "Property ID is missing."
                );

                return;
            }


            try {

                if (saveButton) {

                    saveButton.disabled =
                        true;

                    saveButton.innerText =
                        "SAVING...";
                }


                const features =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="editFeatures"]:checked'
                        )
                    ).map(
                        function(item) {

                            return item.value;
                        }
                    );


                await db
                    .collection(
                        "properties"
                    )
                    .doc(
                        propertyId
                    )
                    .update({

                        name:
                            getElement(
                                "editName"
                            )
                                .value
                                .trim(),

                        apartment:
                            getElement(
                                "editApartment"
                            )
                                .value
                                .trim(),

                        phone:
                            getElement(
                                "editPhone"
                            )
                                .value
                                .trim(),

                        email:
                            getElement(
                                "editEmail"
                            )
                                .value
                                .trim(),

                        propertyType:
                            getElement(
                                "editPropertyType"
                            )
                                .value,

                        listingType:
                            getElement(
                                "editListingType"
                            )
                                .value,

                        location:
                            getElement(
                                "editLocation"
                            )
                                .value
                                .trim(),

                        price:
                            Number(
                                getElement(
                                    "editPrice"
                                ).value
                            ),

                        description:
                            getElement(
                                "editDescription"
                            )
                                .value
                                .trim(),

                        features:
                            features,

                        updatedAt:
                            firebase.firestore
                                .FieldValue
                                .serverTimestamp()
                    });


                alert(
                    "✅ PROPERTY UPDATED SUCCESSFULLY!"
                );


                closeEditModal();


                await loadAdminProperties();

            }


            catch(error) {

                console.error(
                    "EDIT PROPERTY ERROR:",
                    error
                );


                alert(
                    "❌ PROPERTY COULD NOT BE UPDATED.\n\n" +
                    error.message
                );

            }


            finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.innerText =
                        "💾 SAVE CHANGES";
                }
            }
        }
    );
}


// ============================================================
// CLOSE EDIT MODAL
// ============================================================

function closeEditModal() {

    const modal =
        getElement(
            "editModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


window.closeEditModal =
    closeEditModal;


// ============================================================
// DELETE PROPERTY
// ============================================================

async function deleteProperty(
    property
) {

    const propertyName =
        property.apartment ||
        property.name ||
        "this property";


    const confirmed =
        confirm(

            "⚠️ DELETE PROPERTY?\n\n" +

            propertyName +

            "\n\n" +

            "This property will be permanently deleted."
        );


    if (!confirmed) {

        return;
    }


    try {

        await db
            .collection(
                "properties"
            )
            .doc(
                property.id
            )
            .delete();


        alert(
            "✅ PROPERTY DELETED SUCCESSFULLY!"
        );


        await loadAdminProperties();

    }


    catch(error) {

        console.error(
            "DELETE PROPERTY ERROR:",
            error
        );


        alert(
            "❌ DELETE FAILED.\n\n" +
            error.message
        );
    }
}


window.deleteProperty =
    deleteProperty;


// ============================================================
// ADMIN SEARCH
// ============================================================

function searchAdminProperties() {

    const input =
        getElement(
            "adminSearch"
        );


    if (!input) {

        return;
    }


    const search =
        input.value
            .toLowerCase()
            .trim();


    if (!search) {

        displayAdminProperties(
            adminProperties
        );

        return;
    }


    const filtered =
        adminProperties.filter(
            function(property) {

                const text =
                    (
                        property.name ||
                        ""
                    ) +

                    " " +

                    (
                        property.apartment ||
                        ""
                    ) +

                    " " +

                    (
                        property.location ||
                        ""
                    ) +

                    " " +

                    (
                        property.propertyType ||
                        ""
                    ) +

                    " " +

                    (
                        property.listingType ||
                        ""
                    );


                return text
                    .toLowerCase()
                    .includes(
                        search
                    );
            }
        );


    displayAdminProperties(
        filtered
    );
}


window.searchAdminProperties =
    searchAdminProperties;


// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout() {

    try {

        await auth.signOut();


        alert(
            "You have been logged out."
        );

    }


    catch(error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );


        alert(
            "Logout failed.\n\n" +
            error.message
        );
    }
}


window.adminLogout =
    adminLogout;


// ============================================================
// INITIALIZE PAGE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "================================================"
        );


        console.log(
            "VIODA PROPERTY HUB SCRIPT LOADED"
        );


        console.log(
            "Firebase Project:",
            firebaseConfig.projectId
        );


        console.log(
            "================================================"
        );


        // ----------------------------------------------------
        // PROPERTY FORM
        // ----------------------------------------------------

        const propertyForm =
            getElement(
                "propertyForm"
            );


        if (propertyForm) {

            propertyForm.addEventListener(
                "submit",
                submitProperty
            );
        }


        // ----------------------------------------------------
        // ADMIN LOGIN
        // ----------------------------------------------------

        setupAdminLogin();


        // ----------------------------------------------------
        // ADMIN EDIT FORM
        // ----------------------------------------------------

        setupEditForm();


        // ----------------------------------------------------
        // ADMIN AUTH
        // ----------------------------------------------------

        setupAdminAuthState();


        // ----------------------------------------------------
        // CLOSE MODALS WHEN BACKGROUND IS CLICKED
        // ----------------------------------------------------

        window.addEventListener(
            "click",
            function(event) {

                const propertyModal =
                    getElement(
                        "propertyModal"
                    );


                const editModal =
                    getElement(
                        "editModal"
                    );


                if (
                    propertyModal &&
                    event.target ===
                    propertyModal
                ) {

                    closePropertyModal();
                }


                if (
                    editModal &&
                    event.target ===
                    editModal
                ) {

                    closeEditModal();
                }
            }
        );

    }
);


// ============================================================
// FINAL MESSAGE
// ============================================================

console.log(
    "✅ VIODA script.js loaded successfully."
);// ============================================================
// VIODA PROPERTY HUB - COMPLETE SCRIPT.JS
// FIREBASE + PROPERTY SUBMISSION + ADMIN FUNCTIONS
// ============================================================


// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBgHYsPHBpSaFy057GglWZcWUnpUpu_wM",

    authDomain:
        "vioda-properties-hub.firebaseapp.com",

    databaseURL:
        "https://vioda-properties-hub-default-rtdb.firebaseio.com",

    projectId:
        "vioda-properties-hub",

    storageBucket:
        "vioda-properties-hub.firebasestorage.app",

    messagingSenderId:
        "422965817049",

    appId:
        "1:422965817049:web:18e572a712ed247851d8c8"
};


// ============================================================
// INITIALIZE FIREBASE
// ============================================================

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

const auth =
    firebase.auth();

const db =
    firebase.firestore();

const storage =
    firebase.storage();


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let adminProperties = [];


// ============================================================
// HELPER
// ============================================================

function getElement(id) {

    return document.getElementById(id);

}


// ============================================================
// TEST JAVASCRIPT
// ============================================================

function testJavaScript() {

    alert(
        "✅ JAVASCRIPT IS WORKING!\n\n" +
        "VIODA PROPERTY HUB is working correctly."
    );

}

window.testJavaScript =
    testJavaScript;


function testAdminJavaScript() {

    alert(
        "✅ ADMIN JAVASCRIPT IS WORKING!\n\n" +
        "VIODA ADMIN DASHBOARD is working correctly."
    );

}

window.testAdminJavaScript =
    testAdminJavaScript;


// ============================================================
// ANONYMOUS LOGIN
// ============================================================
// Public property owners do not need to create an account.
// Firebase anonymously authenticates them before photo upload.
// ============================================================

async function ensureAnonymousLogin() {

    // If already authenticated, use the current user.
    if (auth.currentUser) {

        return auth.currentUser;

    }

    try {

        const result =
            await auth.signInAnonymously();

        console.log(
            "Anonymous authentication successful:",
            result.user.uid
        );

        return result.user;

    }

    catch(error) {

        console.error(
            "ANONYMOUS LOGIN ERROR:",
            error
        );

        throw new Error(
            "Could not connect to Firebase authentication. " +
            error.message
        );

    }

}

window.ensureAnonymousLogin =
    ensureAnonymousLogin;


// ============================================================
// PUBLIC WEBSITE - VIEW PROPERTY
// ============================================================

function viewProperty(property) {

    if (!property) {

        alert(
            "Property information was not found."
        );

        return;
    }

    const modal =
        getElement("propertyModal");

    if (!modal) {

        alert(
            "Property viewing window was not found."
        );

        return;
    }

    modal.style.display =
        "block";


    const title =
        getElement("modalTitle");

    const location =
        getElement("modalLocation");

    const price =
        getElement("modalPrice");

    const listing =
        getElement("modalListing");

    const owner =
        getElement("modalOwner");

    const phone =
        getElement("modalPhone");

    const email =
        getElement("modalEmail");

    const description =
        getElement("modalDescription");

    const features =
        getElement("modalFeatures");

    const photosContainer =
        getElement("modalPhotos");


    if (title) {

        title.innerText =
            property.apartment ||
            property.name ||
            property.propertyName ||
            "Property";

    }


    if (location) {

        location.innerText =
            "📍 Location: " +
            (
                property.location ||
                "Not provided"
            );

    }


    if (price) {

        price.innerText =
            "💰 Price: KSh " +
            (
                property.price ||
                "Not provided"
            );

    }


    if (listing) {

        listing.innerText =
            "📋 Listing: " +
            (
                property.listingType ||
                "Not provided"
            );

    }


    if (owner) {

        owner.innerText =
            "👤 Owner: " +
            (
                property.name ||
                "Not provided"
            );

    }


    if (phone) {

        phone.innerText =
            "📞 Phone: " +
            (
                property.phone ||
                "Not provided"
            );

    }


    if (email) {

        email.innerText =
            "📧 Email: " +
            (
                property.email ||
                "Not provided"
            );

    }


    if (description) {

        description.innerText =
            "📝 Description: " +
            (
                property.description ||
                "Not provided"
            );

    }


    if (features) {

        let featureText = "";

        if (
            Array.isArray(
                property.features
            )
        ) {

            featureText =
                property.features.join(
                    " • "
                );

        }

        else {

            featureText =
                property.features ||
                "";

        }

        features.innerText =
            "⭐ Features: " +
            featureText;

    }


    if (photosContainer) {

        photosContainer.innerHTML =
            "";

        const photos =
            Array.isArray(
                property.photos
            )
            ?
            property.photos
            :
            [];


        if (photos.length === 0) {

            photosContainer.innerHTML =
                "<p>No photos available.</p>";

        }

        else {

            const gallery =
                document.createElement(
                    "div"
                );

            gallery.className =
                "photo-gallery";


            photos.forEach(
                function(photo) {

                    const image =
                        document.createElement(
                            "img"
                        );

                    image.src =
                        photo;

                    image.alt =
                        "Property photo";

                    gallery.appendChild(
                        image
                    );

                }
            );


            photosContainer.appendChild(
                gallery
            );

        }

    }

}

window.viewProperty =
    viewProperty;


// ============================================================
// CLOSE PROPERTY MODAL
// ============================================================

function closePropertyModal() {

    const modal =
        getElement("propertyModal");

    if (modal) {

        modal.style.display =
            "none";

    }

}

window.closePropertyModal =
    closePropertyModal;


// ============================================================
// PUBLIC PROPERTY SEARCH
// ============================================================

function searchProperties() {

    const locationInput =
        getElement("locationSearch");

    const typeInput =
        getElement("typeSearch");


    const location =
        locationInput
            ?
            locationInput.value
                .toLowerCase()
                .trim()
            :
            "";


    const type =
        typeInput
            ?
            typeInput.value
                .toLowerCase()
                .trim()
            :
            "";


    const cards =
        document.querySelectorAll(
            ".property-card"
        );


    cards.forEach(
        function(card) {

            const cardLocation =
                (
                    card.dataset.location ||
                    card.getAttribute(
                        "data-location"
                    ) ||
                    ""
                )
                .toLowerCase();


            const cardType =
                (
                    card.dataset.type ||
                    card.getAttribute(
                        "data-type"
                    ) ||
                    ""
                )
                .toLowerCase();


            const locationMatch =
                location === "" ||
                cardLocation.includes(
                    location
                );


            const typeMatch =
                type === "" ||
                cardType.includes(
                    type
                );


            if (
                locationMatch &&
                typeMatch
            ) {

                card.style.display =
                    "";

            }

            else {

                card.style.display =
                    "none";

            }

        }
    );

}

window.searchProperties =
    searchProperties;


// ============================================================
// SHOW ALL PROPERTIES
// ============================================================

function showAllProperties() {

    const cards =
        document.querySelectorAll(
            ".property-card"
        );


    cards.forEach(
        function(card) {

            card.style.display =
                "";

        }
    );


    const location =
        getElement("locationSearch");

    const type =
        getElement("typeSearch");


    if (location) {

        location.value =
            "";

    }


    if (type) {

        type.value =
            "";

    }

}

window.showAllProperties =
    showAllProperties;


// ============================================================
// IMAGE UPLOAD TO FIREBASE STORAGE
// ============================================================

async function uploadPropertyPhoto(
    file,
    index
) {

    if (!file) {

        throw new Error(
            "Photo file was not found."
        );

    }


    // Maximum individual file size:
    // 10 MB before compression.
    if (
        file.size >
        10 * 1024 * 1024
    ) {

        throw new Error(
            file.name +
            " is larger than 10 MB."
        );

    }


    const user =
        await ensureAnonymousLogin();


    if (!user) {

        throw new Error(
            "Firebase authentication failed."
        );

    }


    // Compress the image first.
    const blob =
        await compressImageToBlob(
            file
        );


    const timestamp =
        Date.now();


    const safeName =
        file.name
            .replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


    const filePath =
        "propertyPhotos/" +
        timestamp +
        "_" +
        index +
        "_" +
        safeName;


    console.log(
        "Uploading photo:",
        filePath
    );


    const storageRef =
        storage.ref(
            filePath
        );


    const uploadTask =
        await storageRef.put(
            blob,
            {
                contentType:
                    "image/jpeg"
            }
        );


    console.log(
        "Photo uploaded successfully:",
        filePath
    );


    const downloadURL =
        await uploadTask.ref.getDownloadURL();


    return downloadURL;

}


// ============================================================
// COMPRESS IMAGE TO BLOB
// ============================================================

function compressImageToBlob(file) {

    return new Promise(
        function(resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        new Image();


                    image.onload =
                        function() {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const maxWidth =
                                1200;

                            const maxHeight =
                                1200;


                            let width =
                                image.width;

                            let height =
                                image.height;


                            if (
                                width >
                                    maxWidth ||
                                height >
                                    maxHeight
                            ) {

                                const ratio =
                                    Math.min(
                                        maxWidth /
                                            width,
                                        maxHeight /
                                            height
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


                            canvas.toBlob(
                                function(blob) {

                                    if (!blob) {

                                        reject(
                                            new Error(
                                                "Image compression failed."
                                            )
                                        );

                                        return;

                                    }


                                    resolve(
                                        blob
                                    );

                                },
                                "image/jpeg",
                                0.75
                            );

                        };


                    image.onerror =
                        function() {

                            reject(
                                new Error(
                                    "Could not process image."
                                )
                            );

                        };


                    image.src =
                        event.target.result;

                };


            reader.onerror =
                function() {

                    reject(
                        new Error(
                            "Could not read image."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// PROPERTY SUBMISSION
// ============================================================

async function submitProperty(event) {

    if (event) {

        event.preventDefault();

    }


    const form =
        getElement(
            "propertyForm"
        );


    if (!form) {

        alert(
            "Property submission form was not found."
        );

        return;

    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.innerText =
                "SUBMITTING...";

        }


        // ----------------------------------------------------
        // AUTHENTICATE OWNER
        // ----------------------------------------------------

        await ensureAnonymousLogin();


        // ----------------------------------------------------
        // GET FORM DATA
        // ----------------------------------------------------

        const name =
            getElement(
                "fullName"
            )?.value
                .trim() ||
            "";


        const apartment =
            getElement(
                "apartmentName"
            )?.value
                .trim() ||
            "";


        const phone =
            getElement(
                "phoneNumber"
            )?.value
                .trim() ||
            "";


        const email =
            getElement(
                "email"
            )?.value
                .trim() ||
            "";


        const propertyType =
            getElement(
                "propertyType"
            )?.value ||
            "";


        const listingType =
            getElement(
                "listingType"
            )?.value ||
            "";


        const location =
            getElement(
                "propertyLocation"
            )?.value
                .trim() ||
            "";


        const price =
            Number(
                getElement(
                    "propertyPrice"
                )?.value ||
                0
            );


        const description =
            getElement(
                "propertyDescription"
            )?.value
                .trim() ||
            "";


        // ----------------------------------------------------
        // VALIDATION
        // ----------------------------------------------------

        if (
            !name ||
            !phone ||
            !propertyType ||
            !listingType ||
            !location ||
            !price ||
            !description
        ) {

            alert(
                "Please fill in all required property details."
            );

            return;

        }


        // ----------------------------------------------------
        // FEATURES
        // ----------------------------------------------------

        const featureCheckboxes =
            document.querySelectorAll(
                'input[name="features"]:checked'
            );


        const features =
            Array.from(
                featureCheckboxes
            )
            .map(
                function(item) {

                    return item.value;

                }
            );


        // ----------------------------------------------------
        // PHOTO FILES
        // ----------------------------------------------------

        const photoInput =
            getElement(
                "propertyPhoto"
            );


        const files =
            photoInput
                ?
                Array.from(
                    photoInput.files ||
                    []
                )
                :
                [];


        if (
            files.length >
            5
        ) {

            alert(
                "Please select a maximum of 5 photos."
            );

            return;

        }


        // ----------------------------------------------------
        // UPLOAD PHOTOS
        // ----------------------------------------------------

        const photos = [];


        for (
            let i = 0;
            i < files.length;
            i++
        ) {

            if (submitButton) {

                submitButton.innerText =
                    "UPLOADING PHOTO " +
                    (i + 1) +
                    " OF " +
                    files.length +
                    "...";

            }


            const photoURL =
                await uploadPropertyPhoto(
                    files[i],
                    i
                );


            photos.push(
                photoURL
            );

        }


        // ----------------------------------------------------
        // PROPERTY DATA
        // ----------------------------------------------------

        const currentUser =
            auth.currentUser;


        const propertyData = {

            name:
                name,

            apartment:
                apartment,

            phone:
                phone,

            email:
                email,

            propertyType:
                propertyType,

            listingType:
                listingType,

            location:
                location,

            price:
                price,

            description:
                description,

            features:
                features,

            photos:
                photos,

            paymentAmount:
                100,

            paymentCurrency:
                "KES",

            paymentStatus:
                "PENDING",

            status:
                "published",

            source:
                "owner",

            ownerUid:
                currentUser
                    ?
                    currentUser.uid
                    :
                    "",

            createdAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp(),

            updatedAt:
                firebase.firestore
                    .FieldValue
                    .serverTimestamp()

        };


        // ----------------------------------------------------
        // SAVE PROPERTY TO FIRESTORE
        // ----------------------------------------------------

        if (submitButton) {

            submitButton.innerText =
                "SAVING PROPERTY...";

        }


        await db
            .collection(
                "properties"
            )
            .add(
                propertyData
            );


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        alert(
    "✅ PROPERTY SUBMITTED SUCCESSFULLY!\n\n" +
    "Your property has been received.\n\n" +
    "PAYMENT REQUIRED: KSh 100\n\n" +
    "Please proceed to make the KSh 100 payment to have your property published."
);
const paymentPhone = prompt(
    "💳 VIODA PROPERTY HUB PAYMENT\n\n" +
    "Payment required: KSh 100\n\n" +
    "Enter the M-Pesa phone number to receive the payment request:\n\n" +
    "Example: 0712345678"
);

if (paymentPhone) {

    const cleanedPhone =
        paymentPhone
            .replace(/\s+/g, "")
            .replace(/-/g, "");

    alert(
        "📱 PAYMENT REQUEST READY\n\n" +
        "Amount: KSh 100\n" +
        "Phone: " + cleanedPhone + "\n\n" +
        "The M-Pesa payment request will be initiated here."
    );
}
        form.reset();


        // Close form modal if present.
        const formModal =
            getElement(
                "propertyFormModal"
            );


        if (formModal) {

            formModal.style.display =
                "none";

        }

    }

    catch(error) {

        console.error(
            "PROPERTY SUBMISSION ERROR:",
            error
        );


        alert(
            "❌ PROPERTY SUBMISSION FAILED.\n\n" +
            error.message
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerText =
                "SUBMIT PROPERTY";

        }

    }

}

window.submitProperty =
    submitProperty;


// ============================================================
// ADMIN LOGIN
// ============================================================

function setupAdminLogin() {

    const loginForm =
        getElement(
            "adminLoginForm"
        );


    if (!loginForm) {

        return;

    }


    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                getElement(
                    "adminEmail"
                )?.value
                    .trim() ||
                "";


            const password =
                getElement(
                    "adminPassword"
                )?.value ||
                "";


            const message =
                getElement(
                    "loginMessage"
                );


            const loginButton =
                getElement(
                    "loginButton"
                );


            if (
                !email ||
                !password
            ) {

                if (message) {

                    message.innerText =
                        "Please enter your email and password.";

                    message.style.color =
                        "red";

                }

                return;

            }


            if (loginButton) {

                loginButton.disabled =
                    true;

                loginButton.innerText =
                    "LOGGING IN...";

            }


            try {

                await auth
                    .signInWithEmailAndPassword(
                        email,
                        password
                    );


                if (message) {

                    message.innerText =
                        "✅ Login successful.";

                    message.style.color =
                        "green";

                }

            }

            catch(error) {

                console.error(
                    "ADMIN LOGIN ERROR:",
                    error
                );


                let errorText =
                    "Login failed.";


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    errorText =
                        "Admin account does not exist.";

                }

                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    errorText =
                        "Incorrect password.";

                }

                else if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    errorText =
                        "Incorrect email or password.";

                }

                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    errorText =
                        "Please enter a valid email address.";

                }

                else {

                    errorText =
                        error.message;

                }


                if (message) {

                    message.innerText =
                        "❌ " +
                        errorText;

                    message.style.color =
                        "red";

                }

            }

            finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.innerText =
                        "LOGIN";

                }

            }

        }
    );

}


// ============================================================
// ADMIN AUTH STATE
// ============================================================

function setupAdminAuthState() {

    auth.onAuthStateChanged(
        async function(user) {

            const loginContainer =
                getElement(
                    "loginContainer"
                );


            const dashboard =
                getElement(
                    "dashboard"
                );


            if (user) {

                console.log(
                    "USER LOGGED IN:",
                    user.email ||
                    "Anonymous user"
                );


                // Only show admin dashboard
                // when the page actually contains it.
                if (
                    loginContainer &&
                    dashboard
                ) {

                    loginContainer.style.display =
                        "none";


                    dashboard.style.display =
                        "block";


                    const emailDisplay =
                        getElement(
                            "adminEmailDisplay"
                        );


                    if (emailDisplay) {

                        emailDisplay.innerText =
                            user.email ||
                            "Authenticated user";

                    }


                    await loadAdminProperties();

                }

            }

            else {

                if (
                    loginContainer &&
                    dashboard
                ) {

                    loginContainer.style.display =
                        "block";


                    dashboard.style.display =
                        "none";

                }

            }

        }
    );

}


// ============================================================
// LOAD ADMIN PROPERTIES
// ============================================================

async function loadAdminProperties() {

    const grid =
        getElement(
            "adminPropertyGrid"
        );


    const count =
        getElement(
            "propertyCount"
        );


    if (!grid) {

        return;

    }


    if (!auth.currentUser) {

        grid.innerHTML =
            "<p style='color:red;'>" +
            "Admin is not logged in." +
            "</p>";

        return;

    }


    grid.innerHTML =
        "<p>Loading properties...</p>";


    try {

        const snapshot =
            await db
                .collection(
                    "properties"
                )
                .get();


        adminProperties =
            [];


        snapshot.forEach(
            function(doc) {

                adminProperties.push({

                    id:
                        doc.id,

                    ...doc.data()

                });

            }
        );


        if (count) {

            count.innerText =
                adminProperties.length;

        }


        displayAdminProperties(
            adminProperties
        );

    }

    catch(error) {

        console.error(
            "LOAD ADMIN PROPERTIES ERROR:",
            error
        );


        grid.innerHTML =
            "<p style='color:red;'>" +
            "Could not load properties." +
            "<br><br>" +
            error.message +
            "</p>";

    }

}

window.loadAdminProperties =
    loadAdminProperties;


// ============================================================
// DISPLAY ADMIN PROPERTIES
// ============================================================

function displayAdminProperties(
    properties
) {

    const grid =
        getElement(
            "adminPropertyGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        "";


    if (
        !properties ||
        properties.length === 0
    ) {

        grid.innerHTML =
            "<p>No properties found.</p>";

        return;

    }


    properties.forEach(
        function(property) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "property-card";


            const photos =
                Array.isArray(
                    property.photos
                )
                ?
                property.photos
                :
                [];


            if (
                photos.length > 0
            ) {

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    photos[0];


                image.alt =
                    "Property photo";


                card.appendChild(
                    image
                );

            }


            const title =
                document.createElement(
                    "h3"
                );


            title.innerText =
                property.apartment ||
                property.name ||
                "Property";


            card.appendChild(
                title
            );


            const location =
                document.createElement(
                    "p"
                );


            location.innerText =
                "📍 " +
                (
                    property.location ||
                    "No location"
                );


            card.appendChild(
                location
            );


            const price =
                document.createElement(
                    "p"
                );


            price.innerText =
                "💰 KSh " +
                (
                    property.price ||
                    "No price"
                );


            card.appendChild(
                price
            );


            const owner =
                document.createElement(
                    "p"
                );


            owner.innerText =
                "👤 Owner: " +
                (
                    property.name ||
                    "Not provided"
                );


            card.appendChild(
                owner
            );


            const listing =
                document.createElement(
                    "p"
                );


            listing.innerText =
                "📋 " +
                (
                    property.listingType ||
                    ""
                );


            card.appendChild(
                listing
            );


            const buttons =
                document.createElement(
                    "div"
                );


            buttons.className =
                "card-buttons";


            // ------------------------------------------------
            // VIEW
            // ------------------------------------------------

            const viewButton =
                document.createElement(
                    "button"
                );


            viewButton.type =
                "button";


            viewButton.innerText =
                "VIEW";


            viewButton.onclick =
                function() {

                    viewAdminProperty(
                        property
                    );

                };


            buttons.appendChild(
                viewButton
            );


            // ------------------------------------------------
            // EDIT
            // ------------------------------------------------

            const editButton =
                document.createElement(
                    "button"
                );


            editButton.type =
                "button";


            editButton.innerText =
                "EDIT";


            editButton.className =
                "edit-button";


            editButton.onclick =
                function() {

                    openEditModal(
                        property
                    );

                };


            buttons.appendChild(
                editButton
            );


            // ------------------------------------------------
            // DELETE
            // ------------------------------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.type =
                "button";


            deleteButton.innerText =
                "DELETE";


            deleteButton.className =
                "delete-button";


            deleteButton.onclick =
                function() {

                    deleteProperty(
                        property
                    );

                };


            buttons.appendChild(
                deleteButton
            );


            card.appendChild(
                buttons
            );


            grid.appendChild(
                card
            );

        }
    );

}


// ============================================================
// ADMIN VIEW PROPERTY
// ============================================================

function viewAdminProperty(
    property
) {

    viewProperty(
        property
    );

}

window.viewAdminProperty =
    viewAdminProperty;


// ============================================================
// OPEN EDIT MODAL
// ============================================================

function openEditModal(
    property
) {

    const modal =
        getElement(
            "editModal"
        );


    if (!modal) {

        alert(
            "Edit window was not found."
        );

        return;

    }


    getElement(
        "editPropertyId"
    ).value =
        property.id;


    getElement(
        "editName"
    ).value =
        property.name ||
        "";


    getElement(
        "editApartment"
    ).value =
        property.apartment ||
        "";


    getElement(
        "editPhone"
    ).value =
        property.phone ||
        "";


    getElement(
        "editEmail"
    ).value =
        property.email ||
        "";


    getElement(
        "editPropertyType"
    ).value =
        property.propertyType ||
        "residential";


    getElement(
        "editListingType"
    ).value =
        property.listingType ||
        "sale";


    getElement(
        "editLocation"
    ).value =
        property.location ||
        "";


    getElement(
        "editPrice"
    ).value =
        property.price ||
        "";


    getElement(
        "editDescription"
    ).value =
        property.description ||
        "";


    const boxes =
        document.querySelectorAll(
            'input[name="editFeatures"]'
        );


    boxes.forEach(
        function(box) {

            box.checked =
                Array.isArray(
                    property.features
                ) &&
                property.features.includes(
                    box.value
                );

        }
    );


    modal.style.display =
        "block";

}

window.openEditModal =
    openEditModal;


// ============================================================
// SAVE EDIT
// ============================================================

function setupEditForm() {

    const form =
        getElement(
            "editPropertyForm"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const propertyId =
                getElement(
                    "editPropertyId"
                )?.value;


            const saveButton =
                getElement(
                    "saveEditButton"
                );


            if (!propertyId) {

                alert(
                    "Property ID is missing."
                );

                return;

            }


            try {

                if (saveButton) {

                    saveButton.disabled =
                        true;

                    saveButton.innerText =
                        "SAVING...";

                }


                const features =
                    Array.from(
                        document.querySelectorAll(
                            'input[name="editFeatures"]:checked'
                        )
                    )
                    .map(
                        function(item) {

                            return item.value;

                        }
                    );


                await db
                    .collection(
                        "properties"
                    )
                    .doc(
                        propertyId
                    )
                    .update({

                        name:
                            getElement(
                                "editName"
                            ).value.trim(),

                        apartment:
                            getElement(
                                "editApartment"
                            ).value.trim(),

                        phone:
                            getElement(
                                "editPhone"
                            ).value.trim(),

                        email:
                            getElement(
                                "editEmail"
                            ).value.trim(),

                        propertyType:
                            getElement(
                                "editPropertyType"
                            ).value,

                        listingType:
                            getElement(
                                "editListingType"
                            ).value,

                        location:
                            getElement(
                                "editLocation"
                            ).value.trim(),

                        price:
                            Number(
                                getElement(
                                    "editPrice"
                                ).value
                            ),

                        description:
                            getElement(
                                "editDescription"
                            ).value.trim(),

                        features:
                            features,

                        updatedAt:
                            firebase.firestore
                                .FieldValue
                                .serverTimestamp()

                    });


                alert(
                    "✅ PROPERTY UPDATED SUCCESSFULLY!"
                );


                closeEditModal();


                await loadAdminProperties();

            }

            catch(error) {

                console.error(
                    "EDIT PROPERTY ERROR:",
                    error
                );


                alert(
                    "❌ PROPERTY COULD NOT BE UPDATED.\n\n" +
                    error.message
                );

            }

            finally {

                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.innerText =
                        "💾 SAVE CHANGES";

                }

            }

        }
    );

}


// ============================================================
// CLOSE EDIT MODAL
// ============================================================

function closeEditModal() {

    const modal =
        getElement(
            "editModal"
        );


    if (modal) {

        modal.style.display =
            "none";

    }

}

window.closeEditModal =
    closeEditModal;


// ============================================================
// DELETE PROPERTY
// ============================================================

async function deleteProperty(
    property
) {

    const propertyName =
        property.apartment ||
        property.name ||
        "this property";


    const confirmed =
        confirm(
            "⚠️ DELETE PROPERTY?\n\n" +
            propertyName +
            "\n\n" +
            "This property will be permanently deleted."
        );


    if (!confirmed) {

        return;

    }


    try {

        // ----------------------------------------------------
        // DELETE FIRESTORE DOCUMENT
        // ----------------------------------------------------

        await db
            .collection(
                "properties"
            )
            .doc(
                property.id
            )
            .delete();


        // ----------------------------------------------------
        // DELETE PHOTOS FROM STORAGE
        // ----------------------------------------------------

        if (
            Array.isArray(
                property.photos
            )
        ) {

            for (
                const photoURL
                of property.photos
            ) {

                try {

                    const reference =
                        storage.refFromURL(
                            photoURL
                        );


                    await reference.delete();

                }

                catch(photoError) {

                    console.warn(
                        "Could not delete photo:",
                        photoError
                    );

                }

            }

        }


        alert(
            "✅ PROPERTY DELETED SUCCESSFULLY!"
        );


        await loadAdminProperties();

    }

    catch(error) {

        console.error(
            "DELETE PROPERTY ERROR:",
            error
        );


        alert(
            "❌ DELETE FAILED.\n\n" +
            error.message
        );

    }

}

window.deleteProperty =
    deleteProperty;


// ============================================================
// ADMIN SEARCH
// ============================================================

function searchAdminProperties() {

    const input =
        getElement(
            "adminSearch"
        );


    if (!input) {

        return;

    }


    const search =
        input.value
            .toLowerCase()
            .trim();


    if (!search) {

        displayAdminProperties(
            adminProperties
        );

        return;

    }


    const filtered =
        adminProperties.filter(
            function(property) {

                const text =
                    (
                        property.name ||
                        ""
                    ) +
                    " " +
                    (
                        property.apartment ||
                        ""
                    ) +
                    " " +
                    (
                        property.location ||
                        ""
                    ) +
                    " " +
                    (
                        property.propertyType ||
                        ""
                    ) +
                    " " +
                    (
                        property.listingType ||
                        ""
                    );


                return text
                    .toLowerCase()
                    .includes(
                        search
                    );

            }
        );


    displayAdminProperties(
        filtered
    );

}

window.searchAdminProperties =
    searchAdminProperties;


// ============================================================
// ADMIN LOGOUT
// ============================================================

async function adminLogout() {

    try {

        await auth.signOut();


        alert(
            "You have been logged out."
        );

    }

    catch(error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );


        alert(
            "Logout failed.\n\n" +
            error.message
        );

    }

}

window.adminLogout =
    adminLogout;


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "=========================================="
        );


        console.log(
            "VIODA PROPERTY HUB SCRIPT LOADED"
        );


        console.log(
            "Firebase Project:",
            firebaseConfig.projectId
        );


        console.log(
            "=========================================="
        );


        // ----------------------------------------------------
        // PUBLIC PROPERTY FORM
        // ----------------------------------------------------

        const propertyForm =
            getElement(
                "propertyForm"
            );


        if (propertyForm) {

            propertyForm.addEventListener(
                "submit",
                submitProperty
            );

        }


        // ----------------------------------------------------
        // ADMIN LOGIN
        // ----------------------------------------------------

        setupAdminLogin();


        // ----------------------------------------------------
        // ADMIN EDIT FORM
        // ----------------------------------------------------

        setupEditForm();


        // ----------------------------------------------------
        // ADMIN AUTH
        // ----------------------------------------------------

        setupAdminAuthState();


        // ----------------------------------------------------
        // CLOSE MODALS
        // ----------------------------------------------------

        window.addEventListener(
            "click",
            function(event) {

                const propertyModal =
                    getElement(
                        "propertyModal"
                    );


                const editModal =
                    getElement(
                        "editModal"
                    );


                if (
                    propertyModal &&
                    event.target ===
                    propertyModal
                ) {

                    closePropertyModal();

                }


                if (
                    editModal &&
                    event.target ===
                    editModal
                ) {

                    closeEditModal();

                }

            }
        );

    }
);


// ============================================================
// FINAL MESSAGE
// ============================================================

console.log(
    "✅ VIODA script.js loaded successfully."
);