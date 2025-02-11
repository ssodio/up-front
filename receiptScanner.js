// PACKAGES //
const client = require('@veryfi/veryfi-sdk');

// SECRETS //
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USERNAME = process.env.USERNAME;
const API_KEY = process.env.API_KEY;

// OCR //
let veryfiClient = new client(CLIENT_ID, CLIENT_SECRET, USERNAME, API_KEY);

// SCANNED RECEIPT PROCESSING //

async function processReceiptHandler(image) {
    try {
        let receiptData = await processReceipt(image);
        if (!receiptData) {
            return null;
        }
        return receiptData;
    } catch (e) {
        console.log("Error processing receipt [handler]:" + e);
    }
}

function processReceipt(image) {
    return veryfiClient.process_document(image)
        .then((response) => {
            let parsedData = null;
            if (response) {
                parsedData = parseData(response);
            }
            console.log("Successfully processed receipt.");
            return parsedData;
        })
        .catch((e) => {
            console.log("Error processing receipt [processReceipt]:" + e);
            return null;
        });
}

function parseData(data) {
    let receiptData = {
        vendorName: data.vendor.raw_name,
        tax: data.tax,
        tip: data.tip,
        subtotal: data.subtotal,
        total: data.total,
        items: []
    }

    data.line_items.forEach((item) => {
        receiptData.items.push({
            description: item.description,
            total: item.total,
            quantity: item.quantity
        })
    })

    return receiptData;
}
