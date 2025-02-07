// packages
const Client = require('@veryfi/veryfi-sdk');
require('dotenv').config();

// secrets
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const username = process.env.USERNAME;
const api_key = process.env.API_KEY;

// OCR
let veryfi_client = new Client(client_id, client_secret, username, api_key);

// create an event listener for this later

// const submitButton = document.getElementById('submit');

// submitButton.addEventListener('click', function () {
//     if (!uploaderElem.files) return;
//     const text = handler(image);
//     outputElem.textContent = text;
// });

async function handler(image) {
    try {
        let receipt_data = await processReceipt(image);
        if (!receipt_data) {
            return null;
        }
        return receipt_data;
    } catch (e) {
        console.log("Error processing receipt [handler]:" + e);
    }
}

function processReceipt(image) {
    return veryfi_client.process_document(image)
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
    let finalData = {
        items: [],
        tip: data.tip,
        tax: data.tax,
        subtotal: data.subtotal,
        total: data.total,
        vendor_name: data.vendor.raw_name,
    }

    data.line_items.forEach((item) => {
        finalData.items.push({
            description: item.description,
            total: item.total,
            quantity: item.quantity,
            price: item.total,
            ordered_by: []
        })
    })

    return finalData;
}

// CALCULATIONS
// create an event listener that checks if user submitted inforamtion of confirmed breakdown (could change after they edit)

// load the html elements that hold values into a new json data
    // 

// create new json data that attaches the NAME of someone in their party with each (ITEM+AMOUNT+RATIO) they owe

// TESTING
(async () => {
	console.log(await handler("test-receipt.jpeg"))
})()