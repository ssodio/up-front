// PACKAGES  //

require('dotenv').config();


// REDIRECTS AND TOGGLES //

function redirectToHome() {
    window.location.href = 'home.html';
}

function redirectToAddPeople() {
    window.location.href = 'addPeople.html';
}

function redirectToProcessReceipt() {
    savePeople();
    window.location.href = 'processReceipt.html';
}

function showInputReceiptBlock() {
    const inputReceiptBlock = document.getElementById('inputReceiptBlock');
    const editReceiptBlock = document.getElementById('editReceiptBlock');
    const splitReceiptDisplayBlock = document.getElementById('splitReceiptDisplayBlock');

    inputReceiptBlock.classList.add('show');
    editReceiptBlock.classList.remove('show');
    splitReceiptDisplayBlock.classList.remove('show');
}

function showEditReceiptBlock() {
    const inputReceiptBlock = document.getElementById('inputReceiptBlock');
    const editReceiptBlock = document.getElementById('editReceiptBlock');
    const splitReceiptDisplayBlock = document.getElementById('splitReceiptDisplayBlock');

    inputReceiptBlock.classList.remove('show');
    editReceiptBlock.classList.add('show');
    splitReceiptDisplayBlock.classList.remove('show');
}

function showSplitReceiptDisplayBlock() {
    const inputReceiptBlock = document.getElementById('inputReceiptBlock');
    const editReceiptBlock = document.getElementById('editReceiptBlock');
    const splitReceiptDisplayBlock = document.getElementById('splitReceiptDisplayBlock');

    inputReceiptBlock.classList.remove('show');
    editReceiptBlock.classList.remove('show');
    splitReceiptDisplayBlock.classList.add('show');
}


// ADD AND REMOVE PEOPLE //

function addPerson() {
    const newPerson = document.getElementById('newPerson').value;

    // no duplicate names allowed
    const currAllAddedPeople = getPeople();
    if (currAllAddedPeople.includes(newPerson)) {
        console.log('already added person with that name');
    } else {
        const newPersonEntry = document.createElement('div');
        newPersonEntry.id = 'personEntry-' + newPerson;

        const newPersonName = document.createElement('p');
        newPersonName.classList.add('allAddedPeople');
        newPersonName.textContent = newPerson;

        const minus = document.createElement('img');
        minus.src = './img/minus.png';
        minus.onclick = function () {
            removePerson('personEntry-' + newPerson);
        };

        newPersonEntry.appendChild(newPersonName);
        newPersonEntry.appendChild(minus);

        document.getElementById('addedPeople').appendChild(newPersonEntry);
    }

    document.getElementById('addNameInput').reset();
}

function removePerson(newPersonEntryId) {
    const newPersonEntry = document.getElementById(newPersonEntryId);
    document.getElementById('addedPeople').removeChild(newPersonEntry);
}

function getPeople() {
    const people = document.querySelectorAll('p.allAddedPeople');

    const peopleList = [];

    people.forEach(function (p) {
        peopleList.push(p.textContent);
    });

    return peopleList;
}

function savePeople() {
    const peopleList = getPeople();

    localStorage.setItem('peopleList', JSON.stringify(peopleList));
}


// INPUT RECEIPT //

function editItems() {
    const addItemEntryContainer = document.getElementById('addItemEntry');
    const editItemsButton = document.getElementById('editItemsButton');
    const doneEditItemsButton = document.getElementById('doneEditItemsButton');

    //also show the minus signs
    addItemEntryContainer.classList.add('show');
    editItemsButton.classList.remove('show');
    doneEditItemsButton.classList.add('show');
}

function doneEditItems() {
    const addItemEntryContainer = document.getElementById('addItemEntry');
    const editItemsButton = document.getElementById('editItemsButton');
    const doneEditItemsButton = document.getElementById('doneEditItemsButton');

    //also remove minus signs
    addItemEntryContainer.classList.remove('show');
    editItemsButton.classList.add('show');
    doneEditItemsButton.classList.remove('show');
}

function addItemEntry() {
    const addItemDescriptionInput = document.getElementById('addItemDescriptionInput');
    const addItemTotalInput = document.getElementById('addItemTotalInput');
    const addItemIndex = createNewItemIndex();

    addItem(addItemIndex, addItemDescriptionInput.innerText, addItemTotalInput.innerText);

    addItemDescriptionInput.innerText = "Enter item here...";
    addItemTotalInput.innerText = "0.00";
}

function addItem(index, itemDescription, itemTotal) {
    const savedPeopleList = localStorage.getItem('peopleList');
    const people = JSON.parse(savedPeopleList);

    const newItemEntry = document.createElement('div');
    newItemEntry.id = index;

    const newItemDescription = document.createElement('p');
    newItemDescription.classList.add('itemDescriptions');
    newItemDescription.textContent = itemDescription;
    newItemDescription.setAttribute('contenteditable', 'true');

    const newItemTotal = document.createElement('p');
    newItemTotal.id = "itemTotal-" + index;
    newItemTotal.classList.add('itemAmounts');
    newItemTotal.textContent = itemTotal;
    newItemTotal.setAttribute('contenteditable', 'true');
    newItemTotal.onblur = function () {
        changeAmount("itemTotal-" + index);
    }
    newItemTotal.onfocus = function () {
        savePreviousAmount("itemTotal-" + index);
    }

    const newOrderedByDropdown = document.createElement('select');
    newOrderedByDropdown.classList.add('itemOrderedBys');
    newOrderedByDropdown.multiple = true;
    people.forEach(person => {
        const option = document.createElement('option');
        option.value = person.toLowerCase().replace(" ", "_");
        option.textContent = person;
        newOrderedByDropdown.appendChild(option);
    })

    const newRemoveItemButton = document.createElement('img');
    newRemoveItemButton.src = './img/minus.png';
    newRemoveItemButton.id = 'itemRemoveButton-' + index;
    newRemoveItemButton.onclick = function () {
        removeItem(index);
    }

    newItemEntry.appendChild(newItemDescription);
    newItemEntry.appendChild(newItemTotal);
    newItemEntry.appendChild(newOrderedByDropdown);
    newItemEntry.appendChild(newRemoveItemButton);

    document.getElementById('receiptItems').appendChild(newItemEntry);

    updateSubtotalAndTotal();
}

function removeItem(itemId) {
    const itemToRemove = document.getElementById(itemId);
    document.getElementById('receiptItems').removeChild(itemToRemove);

    updateSubtotalAndTotal();
}

function createNewItemIndex() {
    const itemEntryContainer = document.getElementById('receiptItems');

    // Get the immediate children of the parent
    const itemEntries = Array.from(itemEntryContainer.children)
        .filter(child => child.id) // Filter out elements without an id
        .map(child => child.id); // Get the id of each child

    return Math.max(itemEntries) + 1;
}

// SCANNED RECEIPT PROCESSING //

function clickUpload() {
    document.getElementById('receiptUpload').click();
}

function uploadReceipt() {
    const uploadedReceipt = document.getElementById('receiptUpload');
    const receiptFile = uploadedReceipt.files[0];  // Get the uploaded file
    if (receiptFile) {
        scanReceipt(receiptFile);
        showEditReceiptBlock();
    }
}

function scanReceipt(receiptFile) {
    // call processReceipt
    // const receipt = processReceipt(receiptFile);

    const receipt = {
        vendorName: "Taco Bell",
        tax: 6.57,
        tip: 2.00,
        subtotal: 20.25,
        total: 28.82,
        items: [
            {
                description: "Chicken Chalupa",
                total: 14.55,
                quantity: 2
            },
            {
                description: "Nacho Fries",
                total: 3.52,
                quantity: 1
            },
            {
                description: "Potato Taco",
                total: 2.18,
                quantity: 1
            }
        ]
    };

    const items = receipt.items;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        addItem(i, item.description, item.total);
    }

    document.getElementById('vendorName').innerText = receipt.vendorName;
    document.getElementById('subtotal').innerText = receipt.subtotal;
    document.getElementById('tax').innerText = receipt.tax;
    document.getElementById('tip').innerText = receipt.tip;
    document.getElementById('checkTotal').innerText = receipt.total;
}

function changeAmount(amountId) {
    const amountElement = document.getElementById(amountId);
    const amount = (amountElement.innerText).trim();

    // Check if input is valid amount
    if (isValidAmount(amount)) {
        updateSubtotalAndTotal();
        document.getElementById(amountId).innerText = amount;
    } else {
        amountElement.innerText = localStorage.getItem('previousAmount');
    }
}

function updateSubtotalAndTotal() {
    const itemAmounts = document.querySelectorAll('.itemAmounts');
    const taxTipAmounts = document.querySelectorAll('.taxTipAmounts');

    let subtotalValue = 0;

    itemAmounts.forEach(itemAmount => {
        const itemAmountValue = parseFloat(itemAmount.innerText);

        // Only add valid numbers to the sum
        if (!isNaN(itemAmountValue)) {
            subtotalValue += itemAmountValue;
        }
    });

    let checkTotalValue = subtotalValue;

    taxTipAmounts.forEach(taxTipAmount => {
        const taxTipAmountValue = parseFloat(taxTipAmount.innerText);

        // Only add valid numbers to the sum
        if (!isNaN(taxTipAmountValue)) {
            checkTotalValue += taxTipAmountValue;
        }
    });

    // Update the subtotal and checkTotal display
    document.getElementById('subtotal').innerText = subtotalValue;
    document.getElementById('checkTotal').innerText = checkTotalValue;
}

function savePreviousAmount(amountId) {
    let previousAmount = document.getElementById(amountId).innerText;

    localStorage.setItem('previousAmount', previousAmount);
}

function isValidAmount(amount) {
    const pattern = /^\d+(\.\d+)?$/; // Matches positive integers and positive floats
    return pattern.test(amount);
}

// CONFIRMED RECEIPT PROCESSING //

function splitTheBill() {
    const confirmedReceipt = processConfirmedReceipt();

    const savedPeopleList = localStorage.getItem('peopleList');
    const people = JSON.parse(savedPeopleList);
    const messageData = getBillSplitData(confirmedReceipt, people);

    generateTextMessage(messageData);

    showSplitReceiptDisplayBlock();
}

function processConfirmedReceipt() {
    let confirmedReceiptData = {
        vendorName: document.getElementById('vendorName').innerText,
        tax: parseFloat(document.getElementById('tax').innerText),
        tip: parseFloat(document.getElementById('tip').innerText),
        subtotal: parseFloat(document.getElementById('subtotal').innerText),
        total: parseFloat(document.getElementById('checkTotal').innerText),
        items: []
    }

    const itemEntries = document.getElementById('receiptItems');

    for (let i = 0; i < itemEntries.children.length; i++) {
        let currItemEntry = itemEntries.children[i];

        let currItemDescription = currItemEntry.querySelector(".itemDescriptions");
        let currItemAmount = currItemEntry.querySelector(".itemAmounts");
        let currItemOrderedByDropdown = currItemEntry.querySelector(".itemOrderedBys");

        let currItemOrderedByList = getOrderedByList(currItemOrderedByDropdown);

        confirmedReceiptData.items.push({
            description: currItemDescription.innerText,
            total: parseFloat(currItemAmount.innerText),
            orderedBy: currItemOrderedByList,
            numPeopleSharingItem: currItemOrderedByList.length
        })
    }

    return confirmedReceiptData;
}

function getOrderedByList(orderedByDropdown) {
    const orderedByList = Array.from(orderedByDropdown.selectedOptions).map(option => option.text);

    return orderedByList;
}

// GENERATE TEXT MESSAGE //

function generateTextMessage(messageData) {
    let message = "Here's the breakdown for the bill from " + messageData.vendorName + ":\n";

    messageData.peopleWithAmountOwed.forEach(personWithAmountOwed => {
        message += personWithAmountOwed.person + ": $" + personWithAmountOwed.amountOwed + "\n";
    });

    message += "Feel free to send your share via:\nVenmo: @fronter\nZelle: (XXX) XXX - XXXX\nThank you! 😎";

    displayTextMessage(message);
}

function displayTextMessage(message) {
    const splitReceiptText = document.getElementById('splitReceiptText');

    splitReceiptText.innerText = message;
}

// CALCULATIONS //

function getBillSplitData(confirmedReceipt, people) {
    let peopleWithItems = pairPeopleWithItems(confirmedReceipt, people);

    let peopleWithAmountOwed = [];
    let peopleWithItemsEntries = Object.entries(peopleWithItems);

    peopleWithItemsEntries.forEach(([person, items]) => {
        peopleWithAmountOwed.push({
            person: person,
            amountOwed: calculateTotalAmountOwed(items)
        })
    });

    let billSplitData = {
        vendorName: confirmedReceipt.vendorName,
        peopleWithAmountOwed: peopleWithAmountOwed
    }

    return billSplitData;
}

function pairPeopleWithItems(receipt, people) {
    const allItems = receipt.items;

    let peopleWithItems = {};

    people.forEach((person) => {
        let newPerson = person;
        let newItems = [];

        peopleWithItems[newPerson] = newItems;
    });

    allItems.forEach((item) => {
        let calculatedItemAmountOwed = calculateItemAmountOwed(item.total, receipt.subtotal, receipt.tip, receipt.tax, item.numPeopleSharingItem);
        let description = item.description;

        item.orderedBy.forEach(person => {
            peopleWithItems[person].push({
                description: description,
                amountOwed: calculatedItemAmountOwed
            })
        });
    });

    return peopleWithItems;
}

function calculateItemAmountOwed(itemTotal, subtotal, tip, tax, numPeopleSharingItem) {
    let sharedItemRatio = 1 / numPeopleSharingItem; // in case the item is shared
    let itemToSubtotalRatio = itemTotal / subtotal;
    let itemAmountOwed = (itemTotal + (itemToSubtotalRatio * (tip + tax))) * sharedItemRatio;

    return itemAmountOwed;
}

function calculateTotalAmountOwed(items) {
    let totalAmountOwed = 0;

    for (let i = 0; i < items.length; i++) {
        totalAmountOwed += items[i].amountOwed;
    }

    return roundUpToNearestCent(totalAmountOwed);
}

function roundUpToNearestCent(num) {
    let rounded = Math.ceil(num * 100) / 100;
    let clipped = parseFloat(rounded.toFixed(2));
    return clipped;
}
