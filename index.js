// PACKAGES //
const client = require('@veryfi/veryfi-sdk');
require('dotenv').config();

// SECRETS //
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USERNAME = process.env.USERNAME;
const API_KEY = process.env.API_KEY;

// OCR //
let veryfiClient = new client(CLIENT_ID, CLIENT_SECRET, USERNAME, API_KEY);

// create an event listener for this later

// const submitButton = document.getElementById('submit');

// submitButton.addEventListener('click', function () {
//     if (!uploaderElem.files) return;
//     const text = handler(image);
//     outputElem.textContent = text;
// });

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
        items: [],
        tip: data.tip,
        tax: data.tax,
        subtotal: data.subtotal,
        total: data.total,
        vendorName: data.vendor.raw_name,
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

// CALCULATIONS //

// create an event listener that checks if user submitted inforamtion of confirmed breakdown (could change after they edit)

function splitTheBill() {
    let confirmedReceipt = processConfirmedReceipt();

    let peopleWithItems = pairPeopleWithItems(confirmedReceipt, people);

    let peopleWithAmountOwed = [];
    let peopleWithItemsEntries = Object.entries(peopleWithItems);

    peopleWithItemsEntries.forEach(([person, items]) => {
        peopleWithAmountOwed.push({
            person: person,
            amountOwed: calculateTotalAmountOwed(items)
        })
    });

    let messageData = {
        vendorName: confirmedReceipt[vendorName],
        peopleWithAmountOwed: peopleWithAmountOwed
    }
    return messageData;
}

// load the html elements that hold values into a new object
function processConfirmedReceipt() {
    let confirmedReceiptData = {
        items: [],
        tip: "",
        tax: "",
        subtotal: "",
        total: "",
        vendorName: "",
    }

    FILL.forEach((item) => {
        confirmedReceiptData.items.push({
            description: "",
            total: "",
            quantity: "",
            orderedBy: [],
            numPeopleSharingItem: ""
        })
    })

    return confirmedReceiptData;
}

function gatherValuesOfConfirmedReceipt() {

}

function pairPeopleWithItems(receipt, people) {
    const items = receipt[items];

    let peopleWithItems = {};

    people.forEach(person => {
        let newPerson = person;
        let newItems = [];

        peopleWithItems[newPerson] = newItems;
    });

    items.forEach(item => {
        let calculatedItemAmountOwed = calculateItemAmountOwed(receipt[total], receipt[subtotal], receipt[tip], receipt[tax], receipt[numPeopleSharingItem]);

        item.orderedBy.forEach(person => {
            peopleWithItems[person].push({
                description: item[description],
                amountOwed: calculatedItemAmountOwed
            })
        });
    });

    return peopleWithItems;
}

function calculateItemAmountOwed(itemTotal, subtotal, tip, tax, numPeopleSharingItem) {
    let sharedItemRatio = 1 / numPeopleSharingItem; // in case the item is shared
    let itemToSubtotalRatio = itemTotal / subtotal;

    return (itemTotal + (itemToSubtotalRatio * (tip + tax))) * sharedItemRatio;
}

function calculateTotalAmountOwed(items) {
    let totalAmountOwed = 0;

    for (let i = 0; i < items.length; i++) {
        totalAmountOwed += items[i][amountOwed];
    }

    return roundUpToNearestCent(totalAmountOwed);
}

function roundUpToNearestCent(num) {
    return Math.ceil(num * 100) / 100;
}

// GENERATE TEXT MESSAGE //

function generateTextMessage(names_and_total_amount_owed) {

}

// TESTING //

// (async () => {
// 	console.log(await processReceiptHandler("test-receipt-1.jpeg"))
//     console.log(await processReceiptHandler("test-receipt-2.jpg"))
//     console.log(await processReceiptHandler("test-receipt-3.jpeg"))
//     console.log(await processReceiptHandler("test-receipt-4.jpg"))
// })()