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

module.exports = { pairPeopleWithItems, calculateItemAmountOwed, calculateTotalAmountOwed };