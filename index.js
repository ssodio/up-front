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

// HANDLER
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

// RECEIPT PROCESSING
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
            quantity: item.quantity
        })
    })

    return finalData;
}

// CALCULATIONS

// create an event listener that checks if user submitted inforamtion of confirmed breakdown (could change after they edit)

function splitTheBill() {
    // call processConfirmedReceipt

    // call pairNameWithItems with the items in return value of processConfirmedReceipt
        // call calculateItemAmountOwed inside of this function

    // using the list of json objects created by the pairNameWithItems function: 
        // loop through each json object, and call calculateTotalAmountOwed
            // use this returned value to add a new variable (total_amount_owed) to the json object; this attaches the NAME of someone in their party with the TOTAL AMOUNT they owe
}

// load the html elements that hold values into a new json object
function processConfirmedReceipt() {
    // keep same schema as what's seen in parseData
        // include an ordered_by list AND num_people_sharing_item integer for each item

    // RETURNS A JSON OBJECT
}

// create a list of json objects that attaches the NAME of someone in their party with the ITEMS they ordered
function pairNameWithItems(items) {
    // loop through each item
        // for each name found in the order_by list, call calculateItemAmountOwed, then push that item_description and item_amount_owed onto the person's ITEM list
            // make note that this new item variable just has the item_description and item_amount_owed bc that's all we need now
            // {item_description: ____, item_amount_owed: ____}

    // RETURNS A LIST OF JSON OBJECTS
}

function calculateItemAmountOwed(item_total, subtotal, tip, tax, num_people_sharing_item) {
    // let shared_item_ratio = 1 / num_people_sharing_item;

    // RETURNS A FLOAT
}

function calculateTotalAmountOwed(name_and_items) {
    // take sum of item_amount_owed

    // RETURNS A FLOAT
}

// GENERATE TEXT MESSAGE

function generateTextMessage(names_and_total_amount_owed) {
    
}

// TESTING
// (async () => {
// 	console.log(await handler("test-receipt-1.jpeg"))
//     console.log(await handler("test-receipt-2.jpg"))
//     console.log(await handler("test-receipt-3.jpeg"))
//     console.log(await handler("test-receipt-4.jpg"))
// })()