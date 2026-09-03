// ============================================================
// VIODA PROPERTY HUB
// M-PESA DARAJA SANDBOX - STK PUSH
// PROPERTY CONTACT PAYMENT
// ============================================================

export default async function handler(req, res) {

    // --------------------------------------------------------
    // ONLY ACCEPT POST REQUESTS
    // --------------------------------------------------------

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {

        // ----------------------------------------------------
        // GET PAYMENT INFORMATION FROM WEBSITE
        // ----------------------------------------------------

        const {
            phone,
            propertyId,
            userId,
            amount
        } = req.body || {};

        // ----------------------------------------------------
        // VALIDATE REQUIRED INFORMATION
        // ----------------------------------------------------

        if (!phone) {

            return res.status(400).json({
                success: false,
                message: "M-Pesa phone number is required."
            });
        }

        if (!propertyId) {

            return res.status(400).json({
                success: false,
                message: "Property ID is required."
            });
        }

        if (!userId) {

            return res.status(401).json({
                success: false,
                message:
                    "Please login to your VIODA account before making payment."
            });
        }

        // ----------------------------------------------------
        // PAYMENT AMOUNT
        // ----------------------------------------------------
        // Default is KSh 100.
        // We keep this controlled on the server.

        const paymentAmount = 100;

        // ----------------------------------------------------
        // FORMAT KENYAN PHONE NUMBER
        // ----------------------------------------------------

        let phoneNumber =
            String(phone)
                .replace(/\s+/g, "")
                .replace(/^\+/, "");

        if (phoneNumber.startsWith("07")) {

            phoneNumber =
                "254" +
                phoneNumber.substring(1);

        }

        else if (phoneNumber.startsWith("01")) {

            phoneNumber =
                "254" +
                phoneNumber.substring(1);
        }

        // ----------------------------------------------------
        // VALIDATE PHONE NUMBER
        // ----------------------------------------------------

        if (!/^254[17]\d{8}$/.test(phoneNumber)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid Kenyan phone number."
            });
        }

        // ----------------------------------------------------
        // ENVIRONMENT VARIABLES
        // ----------------------------------------------------

        const consumerKey =
            process.env.MPESA_CONSUMER_KEY;

        const consumerSecret =
            process.env.MPESA_CONSUMER_SECRET;

        const passkey =
            process.env.MPESA_PASSKEY;

        const shortcode =
            process.env.MPESA_SHORTCODE;

        if (
            !consumerKey ||
            !consumerSecret ||
            !passkey ||
            !shortcode
        ) {

            console.error(
                "M-PESA ENVIRONMENT VARIABLES ARE MISSING."
            );

            return res.status(500).json({
                success: false,
                message:
                    "M-Pesa configuration is incomplete."
            });
        }

        // ----------------------------------------------------
        // GET ACCESS TOKEN
        // ----------------------------------------------------

        const credentials =
            Buffer
                .from(
                    consumerKey +
                    ":" +
                    consumerSecret
                )
                .toString("base64");

        const tokenResponse =
            await fetch(
                "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Basic " +
                            credentials
                    }
                }
            );

        const tokenData =
            await tokenResponse.json();

        if (
            !tokenResponse.ok ||
            !tokenData.access_token
        ) {

            console.error(
                "M-PESA TOKEN ERROR:",
                tokenData
            );

            return res.status(500).json({
                success: false,
                message:
                    "Could not obtain M-Pesa access token."
            });
        }

        const accessToken =
            tokenData.access_token;

        // ----------------------------------------------------
        // TIMESTAMP
        // ----------------------------------------------------

        const now =
            new Date();

        const timestamp =
            now.getFullYear().toString() +

            String(
                now.getMonth() + 1
            ).padStart(2, "0") +

            String(
                now.getDate()
            ).padStart(2, "0") +

            String(
                now.getHours()
            ).padStart(2, "0") +

            String(
                now.getMinutes()
            ).padStart(2, "0") +

            String(
                now.getSeconds()
            ).padStart(2, "0");

        // ----------------------------------------------------
        // GENERATE DARAJA PASSWORD
        // ----------------------------------------------------

        const password =
            Buffer
                .from(
                    shortcode +
                    passkey +
                    timestamp
                )
                .toString("base64");

        // ----------------------------------------------------
        // CALLBACK URL
        // ----------------------------------------------------

        const host =
            req.headers.host;

        const protocol =
            req.headers["x-forwarded-proto"] ||
            "https";

        const callbackUrl =
            protocol +
            "://" +
            host +
            "/api/mpesa-callback";

        // ----------------------------------------------------
        // STK PUSH REQUEST
        // ----------------------------------------------------

        const stkResponse =
            await fetch(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                {
                    method: "POST",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            accessToken,

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            BusinessShortCode:
                                Number(shortcode),

                            Password:
                                password,

                            Timestamp:
                                timestamp,

                            TransactionType:
                                "CustomerPayBillOnline",

                            Amount:
                                paymentAmount,

                            PartyA:
                                Number(
                                    phoneNumber
                                ),

                            PartyB:
                                Number(shortcode),

                            PhoneNumber:
                                Number(
                                    phoneNumber
                                ),

                            CallBackURL:
                                callbackUrl,

                            AccountReference:
                                "VIODA-" +
                                propertyId,

                            TransactionDesc:
                                "VIODA Property Contact Access"
                        })
                }
            );

        const stkData =
            await stkResponse.json();

        console.log(
            "================================================"
        );

        console.log(
            "VIODA STK PUSH RESPONSE"
        );

        console.log(
            JSON.stringify(
                stkData,
                null,
                2
            )
        );

        console.log(
            "Client User ID:",
            userId
        );

        console.log(
            "Property ID:",
            propertyId
        );

        console.log(
            "================================================"
        );

        // ----------------------------------------------------
        // CHECK STK RESPONSE
        // ----------------------------------------------------

        if (
            !stkResponse.ok ||
            stkData.ResponseCode !== "0"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    stkData.errorMessage ||
                    stkData.ResponseDescription ||
                    stkData.CustomerMessage ||
                    "M-Pesa payment request failed.",

                data:
                    stkData
            });
        }
// ====================================================
// SAVE PAYMENT RECORD
// ====================================================

await db
    .collection("propertyPayments")
    .add({

        userId:
            userId,

        propertyId:
            propertyId,

        amount:
            paymentAmount,

        paymentCurrency:
            "KES",

        status:
            "PENDING",

        phone:
            phoneNumber,

        checkoutRequestId:
            stkData.CheckoutRequestID,

        merchantRequestId:
            stkData.MerchantRequestID,

        createdAt:
            firebase.firestore
                .FieldValue
                .serverTimestamp(),

        updatedAt:
            firebase.firestore
                .FieldValue
                .serverTimestamp()
    });
        // ----------------------------------------------------
        // RETURN SUCCESS
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "M-Pesa payment request sent successfully.",

            checkoutRequestId:
                stkData.CheckoutRequestID,

            merchantRequestId:
                stkData.MerchantRequestID,

            customerMessage:
                stkData.CustomerMessage ||
                "Please check your phone and enter your M-Pesa PIN.",

            propertyId:
                propertyId,

            userId:
                userId,

            amount:
                paymentAmount
        });

    }

    catch (error) {

        console.error(
            "❌ VIODA STK PUSH ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to start M-Pesa payment.",

            error:
                error.message
        });
    }
}
