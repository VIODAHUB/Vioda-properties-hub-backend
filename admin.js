<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>VIODA Properties Hub - Admin</title>


    <!-- ================================================= -->
    <!-- FIREBASE SDK -->
    <!-- ================================================= -->

    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>

    <script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js"></script>


    <!-- ================================================= -->
    <!-- PAGE STYLE -->
    <!-- ================================================= -->

    <style>

        * {
            box-sizing: border-box;
        }


        body {
            font-family: Arial, sans-serif;
            background: #f5f0ff;
            margin: 0;
        }


        /* ================= HEADER ================= */

        .header {
            background: purple;
            color: white;
            text-align: center;
            padding: 20px;
        }

        .header h1 {
            margin: 0;
        }


        /* ================= LOGIN ================= */

        .login-container {
            max-width: 420px;
            margin: 50px auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }


        .login-container h2 {
            color: #6a0dad;
            text-align: center;
        }


        label {
            display: block;
            margin-top: 15px;
            margin-bottom: 5px;
            font-weight: bold;
        }


        input,
        select,
        textarea {
            width: 100%;
            padding: 11px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }


        textarea {
            min-height: 120px;
            resize: vertical;
        }


        button {
            background: purple;
            color: white;
            border: none;
            padding: 11px 18px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        }


        button:hover {
            background: #6a0dad;
        }


        button:disabled {
            background: #aaa;
            cursor: not-allowed;
        }


        .login-button {
            width: 100%;
            margin-top: 20px;
        }


        .test-button {
            width: 100%;
            margin-top: 12px;
            background: #008000;
        }


        .test-button:hover {
            background: #006400;
        }


        #loginMessage {
            text-align: center;
            margin-top: 15px;
            font-weight: bold;
        }


        /* ================= DASHBOARD ================= */

        #dashboard {
            display: none;
            max-width: 1200px;
            margin: auto;
            padding: 20px;
        }


        .dashboard-top {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.12);
        }


        .dashboard-top h2 {
            color: #6a0dad;
        }


        .dashboard-buttons {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }


        .dashboard-buttons button {
            margin-top: 5px;
        }


        .logout-button {
            background: #b00020;
        }


        .logout-button:hover {
            background: #800018;
        }


        .home-button {
            background: #444;
        }


        .home-button:hover {
            background: #222;
        }


        /* ================= SEARCH ================= */

        .search-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
        }


        /* ================= PROPERTY GRID ================= */

        #adminPropertyGrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }


        .property-card {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.12);
        }


        .property-card img {
            width: 100%;
            height: 210px;
            object-fit: cover;
            border-radius: 8px;
        }


        .property-card h3 {
            color: #6a0dad;
        }


        .property-card p {
            margin: 8px 0;
        }


        .card-buttons {
            display: flex;
            gap: 8px;
            margin-top: 15px;
        }


        .card-buttons button {
            flex: 1;
        }


        .delete-button {
            background: #b00020;
        }


        .delete-button:hover {
            background: #800018;
        }


        .edit-button {
            background: #0066cc;
        }


        .edit-button:hover {
            background: #004c99;
        }


        /* ================= MODALS ================= */

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow-y: auto;
            background: rgba(0,0,0,0.65);
            padding: 20px;
        }


        .modal-content {
            background: white;
            max-width: 700px;
            margin: 30px auto;
            padding: 25px;
            border-radius: 10px;
        }


        .modal-content h2 {
            color: #6a0dad;
        }


        .close-button {
            float: right;
            background: #555;
        }


        .close-button:hover {
            background: #333;
        }


        /* ================= PHOTOS ================= */

        .photo-gallery {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 15px;
        }


        .photo-gallery img {
            width: 100%;
            height: 220px;
            object-fit: cover;
            border-radius: 8px;
        }


        /* ================= FEATURES ================= */

        .feature-checkboxes {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
        }


        .feature-checkboxes label {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
            font-weight: normal;
        }


        .feature-checkboxes input {
            width: auto;
        }


        .save-edit-button {
            width: 100%;
            margin-top: 20px;
            background: #008000;
        }


        .save-edit-button:hover {
            background: #006400;
        }


        /* ================= MOBILE ================= */

        @media (max-width: 900px) {

            #adminPropertyGrid {
                grid-template-columns: repeat(2, 1fr);
            }

        }


        @media (max-width: 600px) {

            #adminPropertyGrid {
                grid-template-columns: 1fr;
            }


            .photo-gallery {
                grid-template-columns: 1fr;
            }


            .card-buttons {
                flex-direction: column;
            }


            .feature-checkboxes {
                grid-template-columns: 1fr;
            }


            .dashboard-buttons {
                flex-direction: column;
            }


            .dashboard-buttons button {
                width: 100%;
            }

        }

    </style>

</head>


<body>


    <!-- ================================================= -->
    <!-- HEADER -->
    <!-- ================================================= -->

    <div class="header">

        <h1>
            VIODA PROPERTIES HUB
        </h1>

        <p>
            ADMINISTRATION DASHBOARD
        </p>

    </div>


    <!-- ================================================= -->
    <!-- LOGIN -->
    <!-- ================================================= -->

    <div
        class="login-container"
        id="loginContainer"
    >

        <h2>
            🔐 ADMIN LOGIN
        </h2>


        <form id="adminLoginForm">

            <label>
                Admin Email
            </label>

            <input
                type="email"
                id="adminEmail"
                placeholder="Enter admin email"
                autocomplete="username"
                required
            >


            <label>
                Password
            </label>

            <input
                type="password"
                id="adminPassword"
                placeholder="Enter password"
                autocomplete="current-password"
                required
            >


            <button
                type="submit"
                class="login-button"
                id="loginButton"
            >
                LOGIN
            </button>

        </form>


        <!-- JAVASCRIPT TEST BUTTON -->

        <button
            type="button"
            class="test-button"
            onclick="testJavaScript()"
        >
            🧪 TEST JAVASCRIPT
        </button>

<button
    class="test-button"
    type="button"
    onclick="openAdminPostModal()"
>
    ➕ POST PROPERTY FOR OWNER
</button>
        <div id="loginMessage"></div>


        <p style="text-align:center;margin-top:20px;">

            <a href="index.html">
                ← Back to VIODA Property Hub
            </a>

        </p>

    </div>


    <!-- ================================================= -->
    <!-- ADMIN DASHBOARD -->
    <!-- ================================================= -->

    <div id="dashboard">


        <div class="dashboard-top">

            <h2>
                🏠 ADMIN DASHBOARD
            </h2>


            <p>
                Logged in as:
                <strong id="adminEmailDisplay"></strong>
            </p>


            <div class="dashboard-buttons">


                <button
                    type="button"
                    onclick="loadAdminProperties()"
                >
                    🔄 REFRESH PROPERTIES
                </button>

                <button
                    type="button"
                    class="home-button"
                    onclick="window.location.href='index.html'"
                >
                    🏠 PUBLIC WEBSITE
                </button>


                <button
                    type="button"
                    class="logout-button"
                    onclick="adminLogout()"
                >
                    🚪 LOGOUT
                </button>

            </div>

        </div>


        <!-- ================================================= -->
        <!-- SEARCH -->
        <!-- ================================================= -->

        <div class="search-box">

            <h2>
                🔎 SEARCH PROPERTIES
            </h2>


            <input
                type="text"
                id="adminSearch"
                placeholder="Search by location, owner or property name"
                oninput="searchAdminProperties()"
            >

        </div>


        <!-- ================================================= -->
        <!-- PROPERTY COUNT -->
        <!-- ================================================= -->

        <div class="dashboard-top">

            <h2>
                AVAILABLE PROPERTIES
            </h2>


            <p>
                Total properties:
                <strong id="propertyCount">0</strong>
            </p>

        </div>


        <!-- ================================================= -->
        <!-- PROPERTY GRID -->
        <!-- ================================================= -->

        <div id="adminPropertyGrid"></div>

    </div>


    <!-- ================================================= -->
    <!-- VIEW PROPERTY MODAL -->
    <!-- ================================================= -->

    <div
        class="modal"
        id="propertyModal"
    >

        <div class="modal-content">


            <button
                type="button"
                class="close-button"
                onclick="closePropertyModal()"
            >
                CLOSE
            </button>


            <h2 id="modalTitle">
                Property
            </h2>


            <div id="modalPhotos"></div>


            <p id="modalLocation"></p>

            <p id="modalPrice"></p>

            <p id="modalListing"></p>

            <p id="modalOwner"></p>

            <p id="modalPhone"></p>

            <p id="modalEmail"></p>

            <p id="modalDescription"></p>

            <p id="modalFeatures"></p>


        </div>

    </div>


    <!-- ================================================= -->
    <!-- EDIT PROPERTY MODAL -->
    <!-- ================================================= -->

    <div
        class="modal"
        id="editModal"
    >

        <div class="modal-content">


            <button
                type="button"
                class="close-button"
                onclick="closeEditModal()"
            >
                CLOSE
            </button>


            <h2>
                ✏️ EDIT PROPERTY
            </h2>


            <form id="editPropertyForm">


                <input
                    type="hidden"
                    id="editPropertyId"
                >


                <label>
                    Owner Full Name
                </label>

                <input
                    type="text"
                    id="editName"
                    required
                >


                <label>
                    Apartment / Property Name
                </label>

                <input
                    type="text"
                    id="editApartment"
                >


                <label>
                    Phone Number
                </label>

                <input
                    type="tel"
                    id="editPhone"
                    required
                >


                <label>
                    Email
                </label>

                <input
                    type="email"
                    id="editEmail"
                >


                <label>
                    Property Type
                </label>

                <select
                    id="editPropertyType"
                    required
                >

                    <option value="residential">
                        Residential House
                    </option>

                    <option value="apartment">
                        Apartment
                    </option>

                    <option value="air BnB">
                        Air BnB
                    </option>

                    <option value="commercial">
                        Commercial Property
                    </option>

                    <option value="land">
                        Land
                    </option>

                    <option value="car">
                        Car
                    </option>

                </select>


                <label>
                    Listing Type
                </label>

                <select
                    id="editListingType"
                    required
                >

                    <option value="sale">
                        For Sale
                    </option>

                    <option value="rent">
                        For Rent
                    </option>

                    <option value="lease">
                        For Lease
                    </option>

                    <option value="hire">
                        For Hire
                    </option>

                </select>


                <label>
                    Location
                </label>

                <input
                    type="text"
                    id="editLocation"
                    required
                >


                <label>
                    Price
                </label>

                <input
                    type="number"
                    id="editPrice"
                    required
                >


                <label>
                    Description
                </label>

                <textarea
                    id="editDescription"
                    required
                ></textarea>


                <h3>
                    Property Features
                </h3>


                <div class="feature-checkboxes">


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="parking"
                        >

                        Parking

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="water"
                        >

                        Reliable Water

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="wifi"
                        >

                        Wi-Fi Internet

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="electricity"
                        >

                        Electricity

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="security"
                        >

                        Security

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            name="editFeatures"
                            value="Access"
                        >

                        Access Roads

                    </label>


                </div>


                <button
                    type="submit"
                    class="save-edit-button"
                    id="saveEditButton"
                >
                    💾 SAVE CHANGES
                </button>


            </form>

        </div>

    </div>
<!-- ================================================= -->
<!-- ADMIN POST PROPERTY MODAL -->
<!-- ================================================= -->

<div
    class="modal"
    id="adminPostModal"
>

    <div class="modal-content">

        <button
            type="button"
            class="close-button"
            onclick="closeAdminPostModal()"
        >
            CLOSE
        </button>

        <h2>
            ➕ POST PROPERTY FOR OWNER
        </h2>

        <p>
            Use this form when an owner is unable to submit
            the property themselves.
        </p>

        <form id="adminPostPropertyForm">

            <!-- OWNER -->

            <label>
                Owner Full Name
            </label>

            <input
                type="text"
                id="adminPostName"
                placeholder="Enter owner's full name"
                required
            >


            <!-- APARTMENT / PROPERTY NAME -->

            <label>
                Apartment / Property Name
            </label>

            <input
                type="text"
                id="adminPostApartment"
                placeholder="Enter property name"
            >


            <!-- PHONE -->

            <label>
                Owner Phone Number
            </label>

            <input
                type="tel"
                id="adminPostPhone"
                placeholder="e.g. 0724123456"
                required
            >


            <!-- EMAIL -->

            <label>
                Owner Email
            </label>

            <input
                type="email"
                id="adminPostEmail"
                placeholder="Owner email address"
            >


            <!-- PROPERTY TYPE -->

            <label>
                Property Type
            </label>

            <select
                id="adminPostPropertyType"
                required
            >

                <option value="">
                    Select Property Type
                </option>

                <option value="residential">
                    Residential House
                </option>

                <option value="apartment">
                    Apartment
                </option>

                <option value="air BnB">
                    Air BnB
                </option>

                <option value="commercial">
                    Commercial Property
                </option>

                <option value="land">
                    Land
                </option>

                <option value="car">
                    Car
                </option>

            </select>


            <!-- LISTING TYPE -->

            <label>
                Listing Type
            </label>

            <select
                id="adminPostListingType"
                required
            >

                <option value="">
                    Select Listing Type
                </option>

                <option value="sale">
                    For Sale
                </option>

                <option value="rent">
                    For Rent
                </option>

                <option value="lease">
                    For Lease
                </option>

                <option value="hire">
                    For Hire
                </option>

            </select>


            <!-- LOCATION -->

            <label>
                Property Location
            </label>

            <input
                type="text"
                id="adminPostLocation"
                placeholder="e.g. Homabay, Rongo"
                required
            >


            <!-- PRICE -->

            <label>
                Price
            </label>

            <input
                type="number"
                id="adminPostPrice"
                placeholder="Enter price in KSh"
                required
            >


            <!-- DESCRIPTION -->

            <label>
                Property Description
            </label>

            <textarea
                id="adminPostDescription"
                placeholder="Describe the property..."
                required
            ></textarea>


            <!-- FEATURES -->

            <h3>
                Property Features
            </h3>

            <div class="feature-checkboxes">

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="parking"
                    >
                    Parking
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="water"
                    >
                    Reliable Water
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="wifi"
                    >
                    Wi-Fi Internet
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="electricity"
                    >
                    Electricity
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="security"
                    >
                    Security
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="adminPostFeatures"
                        value="Access"
                    >
                    Access Roads
                </label>

            </div>


            <!-- PHOTOS -->

            <label>
                Property Photos
            </label>

            <input
                type="file"
                id="adminPostPhotos"
                accept="image/*"
                multiple
            >

            <p style="font-size:13px;color:#666;">
                You can select multiple photos.
            </p>


            <!-- SUBMIT -->

            <button
                type="submit"
                id="adminPostButton"
                class="save-edit-button"
            >
                📤 POST PROPERTY
            </button>

        </form>

        <div
            id="adminPostMessage"
            style="
                margin-top:15px;
                text-align:center;
                font-weight:bold;
            "
        ></div>

    </div>

</div>

    <!-- ================================================= -->
    <!-- LOAD COMMON JAVASCRIPT -->
    <!-- ================================================= -->

    <script src="script.js"></script>


</body>

</html>