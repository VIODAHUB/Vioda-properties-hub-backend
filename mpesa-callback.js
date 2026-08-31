// ============================================================
// VIODA PROPERTY HUB
// M-PESA CALLBACK
// ============================================================

const admin = require("firebase-admin");

// ============================================================
// FIREBASE ADMIN INITIALIZATION
// ============================================================

if (!admin.apps.length) {

    const serviceAccount =
        JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT
        );

    admin.initializeApp({

        credential:
            admin.credential.cert(
                serviceAccount
            )
    });
}

const db =
    admin.firestore();


// ============================================================
// CALLBACK HANDLER
// ============================================================

module.exports = async function handler(req, res) {

    // --------------------------------------------------------
    // ONLY ACCEPT POST
    // --------------------------------------------------------

    if (req.method !== "POST") {

        return res.status(405).json({

            success: false,

            message:
                "Method not allowed"
        });
    }


    try {

        console.log(
            "================================================"
        );

        console.log(
            "VIODA M-PESA CALLBACK RECEIVED"
        );

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );

        console.log(
            "================================================"
        );


        // ----------------------------------------------------
        // GET CALLBACK BODY
        // ----------------------------------------------------

        const body =
            req.body || {};

        const stkCallback =
            body?.Body?.stkCallback;


        if (!stkCallback) {

            console.log(
                "No stkCallback found."
            );

            return res.status(200).json({

                success: true,

                message:
                    "Callback received."
            });
        }


        // ----------------------------------------------------
        // CALLBACK VALUES
        // ----------------------------------------------------

        const resultCode =
            Number(
                stkCallback.ResultCode
            );

        const resultDescription =
            stkCallback.ResultDesc || "";

        const checkoutRequestId =
            stkCallback.CheckoutRequestID || "";

        const merchantRequestId =
            stkCallback.MerchantRequestID || "";


        console.log(
            "Result Code:",
            resultCode
        );

        console.log(
            "Result Description:",
            resultDescription
        );

        console.log(
            "Checkout Request ID:",
            checkoutRequestId
        );

        console.log(
            "Merchant Request ID:",
            merchantRequestId
        );


        // ====================================================
        // FIND PROPERTY
        // ====================================================

        let propertyId = null;

        if (checkoutRequestId) {

            const snapshot =
                await db
                    .collection("properties")
                    .where(
                        "checkoutRequestId",
                        "==",
                        checkoutRequestId
                    )
                    .limit(1)
                    .get();


            if (!snapshot.empty) {

                propertyId =
                    snapshot.docs[0].id;

                console.log(
                    "PROPERTY FOUND:",
                    propertyId
                );

            } else {

                console.log(
                    "NO PROPERTY FOUND FOR CHECKOUT:",
                    checkoutRequestId
                );
            }
        }


        // ====================================================
        // PAYMENT SUCCESSFUL
        // ====================================================

        if (resultCode === 0) {

            console.log(
                "✅ M-PESA PAYMENT SUCCESSFUL"
            );


            // ------------------------------------------------
            // EXTRACT CALLBACK METADATA
            // ------------------------------------------------

            const metadata =
                stkCallback.CallbackMetadata;


            let amount = 0;

            let mpesaReceiptNumber =
                "";

            let transactionDate =
                "";

            let phoneNumber =
                "";


            if (
                metadata &&
                Array.isArray(
                    metadata.Item
                )
            ) {

                metadata.Item.forEach(
                    function(item) {

                        if (
                            item.Name ===
                            "Amount"
                        ) {

                            amount =
                                item.Value;
                        }


                        if (
                            item.Name ===
                            "MpesaReceiptNumber"
                        ) {

                            mpesaReceiptNumber =
                                item.Value;
                        }


                        if (
                            item.Name ===
                            "TransactionDate"
                        ) {

                            transactionDate =
                                item.Value;
                        }


                        if (
                            item.Name ===
                            "PhoneNumber"
                        ) {

                            phoneNumber =
                                item.Value;
                        }

                    }
                );
            }


            console.log(
                "Amount:",
                amount
            );

            console.log(
                "M-Pesa Receipt:",
                mpesaReceiptNumber
            );

            console.log(
                "Phone:",
                phoneNumber
            );


            // =================================================
            // CHECK PAYMENT AMOUNT
            // =================================================

            if (
                Number(amount) !== 100
            ) {

                console.error(
                    "❌ INVALID PAYMENT AMOUNT:",
                    amount
                );


                if (propertyId) {

                    await db
                        .collection(
                            "properties"
                        )
                        .doc(
                            propertyId
                        )
                        .update({

                            paymentStatus:
                                "FAILED",

                            status:
                                "payment_failed",

                            paymentResultCode:
                                resultCode,

                            paymentResultDescription:
                                "Invalid payment amount.",

                            updatedAt:
                                admin.firestore
                                    .FieldValue
                                    .serverTimestamp()
                        });
                }

            }

            // =================================================
            // VALID KSH 100 PAYMENT
            // =================================================

            else if (propertyId) {

                await db
                    .collection(
                        "properties"
                    )
                    .doc(
                        propertyId
                    )
                    .update({

                        // ------------------------------
                        // PAYMENT
                        // ------------------------------

                        paymentStatus:
                            "PAID",

                        paymentAmount:
                            100,

                        paymentCurrency:
                            "KES",

                        // ------------------------------
                        // PUBLISH PROPERTY
                        // ------------------------------

                        status:
                            "published",

                        // ------------------------------
                        // M-PESA INFORMATION
                        // ------------------------------

                        mpesaReceiptNumber:
                            mpesaReceiptNumber,

                        mpesaTransactionDate:
                            transactionDate,

                        mpesaPhone:
                            String(
                                phoneNumber
                            ),

                        merchantRequestId:
                            merchantRequestId,

                        checkoutRequestId:
                            checkoutRequestId,

                        paymentResultCode:
                            resultCode,

                        paymentResultDescription:
                            resultDescription,

                        // ------------------------------
                        // PAYMENT DATE
                        // ------------------------------

                        paidAt:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp(),

                        updatedAt:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp()
                    });


                console.log(
                    "================================================"
                );

                console.log(
                    "✅ PAYMENT CONFIRMED"
                );

                console.log(
                    "✅ PROPERTY PUBLISHED"
                );

                console.log(
                    "PROPERTY ID:",
                    propertyId
                );

                console.log(
                    "================================================"
                );

            }

            else {

                console.log(
                    "⚠️ Payment successful but property was not found."
                );
            }
        }


        // ====================================================
        // PAYMENT FAILED / CANCELLED
        // ====================================================

        else {

            console.log(
                "❌ M-PESA PAYMENT FAILED OR CANCELLED"
            );

            console.log(
                "Result Code:",
                resultCode
            );

            console.log(
                "Result Description:",
                resultDescription
            );


            if (propertyId) {

                await db
                    .collection(
                        "properties"
                    )
                    .doc(
                        propertyId
                    )
                    .update({

                        paymentStatus:
                            "FAILED",

                        status:
                            "payment_failed",

                        paymentResultCode:
                            resultCode,

                        paymentResultDescription:
                            resultDescription,

                        merchantRequestId:
                            merchantRequestId,

                        checkoutRequestId:
                            checkoutRequestId,

                        updatedAt:
                            admin.firestore
                                .FieldValue
                                .serverTimestamp()
                    });


                console.log(
                    "PROPERTY PAYMENT MARKED FAILED:",
                    propertyId
                );
            }
        }


        // ====================================================
        // RESPOND TO SAFARICOM
        // ====================================================

        return res.status(200).json({

            success: true,

            message:
                "Callback received successfully."
        });

    }


    catch(error) {

        console.error(
            "❌ CALLBACK PROCESSING ERROR:",
            error
        );


        // ----------------------------------------------------
        // RETURN 200 TO SAFARICOM
        // ----------------------------------------------------

        return res.status(200).json({

            success: false,

            message:
                "Callback received but processing failed."
        });
    }
};