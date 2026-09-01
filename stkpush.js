// ============================================================
// VIODA PROPERTY HUB
// MPESA DARaja SANDBOX - STK PUSH
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
        // GET PHONE NUMBER FROM WEBSITE
        // ----------------------------------------------------

        const {
            phone,
            propertyId
        } = req.body || {};

        if (!phone) {

            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });

        }

        // ----------------------------------------------------
        // FORMAT KENYAN PHONE NUMBER
        // ----------------------------------------------------

        let phoneNumber =
            String(phone)
                .replace(/\s+/g, "")
                .replace(/^\+/, "");

        if (phoneNumber.startsWith("07")) {

            phoneNumber =
                "254" + phoneNumber.substring(1);

        }

        else if (phoneNumber.startsWith("01")) {

            phoneNumber =
                "254" + phoneNumber.substring(1);

        }

        // Must now look like 2547XXXXXXXX or 2541XXXXXXXX

        if (!/^254[17]\d{8}$/.test(phoneNumber)) {

            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid Kenyan Safaricom phone number."
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
                "M-PESA environment variables are missing."
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
                            "Basic " + credentials
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
                "TOKEN ERROR:",
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
        // GENERATE PASSWORD
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
                                100,

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
                                propertyId ||
                                "VIODA",

                            TransactionDesc:
                                "VIODA Property Listing"
                        })
                }
            );

        const stkData =
            await stkResponse.json();

        console.log(
            "STK RESPONSE:",
            stkData
        );

        // ----------------------------------------------------
        // CHECK RESPONSE
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

        // ----------------------------------------------------
        // SUCCESSFUL STK REQUEST
        // ----------------------------------------------------

        return res.status(200).json({

            success: true,

            message:
                "M-Pesa payment request sent.",

            checkoutRequestId:
                stkData.CheckoutRequestID,

            merchantRequestId:
                stkData.MerchantRequestID,

            customerMessage:
                stkData.CustomerMessage ||
                "Please check your phone and enter your M-Pesa PIN."
        });

    }

    catch (error) {

        console.error(
            "STK PUSH ERROR:",
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