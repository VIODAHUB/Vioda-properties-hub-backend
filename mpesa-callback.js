// ============================================================
// VIODA PROPERTY HUB
// M-PESA DARAJA CALLBACK
// PROPERTY CONTACT PAYMENT
// ============================================================

const admin = require("firebase-admin");

// ============================================================
// INITIALIZE FIREBASE ADMIN
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
    // ONLY ACCEPT POST REQUEST
    // --------------------------------------------------------

    if (req.method !== "POST") {

        return res.status(405).json({
            success: false,
            message: "Method not allowed"
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
                message: "Callback received."
            });
        }


        // ----------------------------------------------------
        // CALLBACK INFORMATION
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
        // PAYMENT FAILED / CANCELLED
        // ====================================================

        if (resultCode !== 0) {

            console.log(
                "❌ M-PESA PAYMENT NOT SUCCESSFUL"
            );

            console.log(
                "Reason:",
                resultDescription
            );


            // We do NOT expose payment information
            // on the public website.

            return res.status(200).json({
                success: true,
                message:
                    "Payment callback received."
            });
        }


        // ====================================================
        // PAYMENT SUCCESSFUL
        // ====================================================

        console.log(
            "✅ M-PESA PAYMENT SUCCESSFUL"
        );


        // ----------------------------------------------------
        // EXTRACT CALLBACK METADATA
        // ----------------------------------------------------

        const metadata =
            stkCallback.CallbackMetadata;


        let amount = 0;

        let mpesaReceiptNumber = "";

        let transactionDate = "";

        let phoneNumber = "";


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
                            Number(
                                item.Value
                            );
                    }


                    if (
                        item.Name ===
                        "MpesaReceiptNumber"
                    ) {

                        mpesaReceiptNumber =
                            String(
                                item.Value
                            );
                    }


                    if (
                        item.Name ===
                        "TransactionDate"
                    ) {

                        transactionDate =
                            String(
                                item.Value
                            );
                    }


                    if (
                        item.Name ===
                        "PhoneNumber"
                    ) {

                        phoneNumber =
                            String(
                                item.Value
                            );
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


        // ====================================================
        // VERIFY PAYMENT AMOUNT
        // ====================================================

        if (amount !== 100) {

            console.log(
                "⚠️ PAYMENT AMOUNT IS NOT KSh 100."
            );

            return res.status(200).json({
                success: true,
                message:
                    "Payment received but amount is not valid."
            });
        }


        // ====================================================
        // FIND THE PAYMENT TRANSACTION
        // ====================================================
        //
        // We use the CheckoutRequestID to find the
        // temporary payment record created by STK Push.
        //
        // The STK Push endpoint must create this record.
        //
        // ====================================================

        const paymentSnapshot =
            await db
                .collection("propertyPayments")
                .where(
                    "checkoutRequestId",
                    "==",
                    checkoutRequestId
                )
                .limit(1)
                .get();


        if (paymentSnapshot.empty) {

            console.log(
                "⚠️ NO PAYMENT RECORD FOUND FOR:",
                checkoutRequestId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Payment callback received."
            });
        }


        const paymentDoc =
            paymentSnapshot.docs[0];

        const paymentData =
            paymentDoc.data();


        const userId =
            paymentData.userId || "";

        const propertyId =
            paymentData.propertyId || "";


        console.log(
            "Client User ID:",
            userId
        );

        console.log(
            "Property ID:",
            propertyId
        );


        // ====================================================
        // VALIDATE CLIENT AND PROPERTY
        // ====================================================

        if (!userId || !propertyId) {

            console.log(
                "⚠️ Payment record is missing userId or propertyId."
            );

            return res.status(200).json({
                success: true,
                message:
                    "Payment callback received."
            });
        }


        // ====================================================
        // PREVENT DUPLICATE PAYMENT PROCESSING
        // ====================================================

        if (
            paymentData.status ===
            "PAID"
        ) {

            console.log(
                "ℹ️ PAYMENT ALREADY PROCESSED."
            );

            return res.status(200).json({
                success: true,
                message:
                    "Payment already processed."
            });
        }


        // ====================================================
        // VERIFY PROPERTY EXISTS
        // ====================================================

        const propertyRef =
            db
                .collection("properties")
                .doc(propertyId);

        const propertySnapshot =
            await propertyRef.get();


        if (!propertySnapshot.exists) {

            console.log(
                "⚠️ PROPERTY NOT FOUND:",
                propertyId
            );

            return res.status(200).json({
                success: true,
                message:
                    "Property not found."
            });
        }


        // ====================================================
        // CALCULATE 7-DAY ACCESS
        // ====================================================

        const now =
            new Date();

        const expiresAt =
            new Date(
                now.getTime() +
                (
                    7 *
                    24 *
                    60 *
                    60 *
                    1000
                )
            );


        // ====================================================
        // SAVE VIEWER ACCESS
        // ====================================================

        const viewedPropertyRef =
            db
                .collection("users")
                .doc(userId)
                .collection("viewedProperties")
                .doc(propertyId);


        await viewedPropertyRef.set({

            propertyId:
                propertyId,

            paid:
                true,

            paymentAmount:
                100,

            paymentCurrency:
                "KES",

            paymentStatus:
                "PAID",

            paidAt:
                admin.firestore
                    .FieldValue
                    .serverTimestamp(),

            expiresAt:
                admin.firestore
                    .Timestamp
                    .fromDate(
                        expiresAt
                    ),

            mpesaReceiptNumber:
                mpesaReceiptNumber,

            mpesaPhone:
                phoneNumber,

            mpesaTransactionDate:
                transactionDate,

            checkoutRequestId:
                checkoutRequestId,

            merchantRequestId:
                merchantRequestId,

            updatedAt:
                admin.firestore
                    .FieldValue
                    .serverTimestamp()

        }, {
            merge: true
        });


        console.log(
            "✅ 7-DAY PROPERTY ACCESS GRANTED"
        );

        console.log(
            "User:",
            userId
        );

        console.log(
            "Property:",
            propertyId
        );


        // ====================================================
        // UPDATE PAYMENT RECORD
        // ====================================================

        await paymentDoc.ref.update({

            status:
                "PAID",

            amount:
                100,

            paymentCurrency:
                "KES",

            mpesaReceiptNumber:
                mpesaReceiptNumber,

            mpesaPhone:
                phoneNumber,

            mpesaTransactionDate:
                transactionDate,

            resultCode:
                resultCode,

            resultDescription:
                resultDescription,

            paidAt:
                admin.firestore
                    .FieldValue
                    .serverTimestamp(),

            updatedAt:
                admin.firestore
                    .FieldValue
                    .serverTimestamp()

        });


        // ====================================================
        // DO NOT UPDATE PUBLIC PROPERTY PAYMENT STATUS
        // ====================================================
        //
        // This payment belongs to the VIEWER.
        //
        // We intentionally do NOT change:
        //
        // properties.paymentStatus
        //
        // because ordinary visitors should not see
        // payment information on the public website.
        //
        // ====================================================


        console.log(
            "================================================"
        );

        console.log(
            "✅ VIODA PAYMENT PROCESSING COMPLETE"
        );

        console.log(
            "7-DAY ACCESS GRANTED"
        );

        console.log(
            "================================================"
        );


        // ====================================================
        // RESPOND TO SAFARICOM
        // ====================================================

        return res.status(200).json({

            success: true,

            message:
                "Payment processed successfully."

        });

    }


    catch (error) {

        console.error(
            "❌ VIODA CALLBACK ERROR:",
            error
        );


        // Always acknowledge the callback.

        return res.status(200).json({

            success: false,

            message:
                "Callback received but processing failed."

        });
    }
};
