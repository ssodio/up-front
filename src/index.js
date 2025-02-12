// PACKAGES //
require('dotenv').config();

// REDIRECTS //

function redirectToHome() {
    window.location.href = 'home.html';
}

function redirectToAddPeople() {
    window.location.href = 'addPeople.html';
}

function redirectToInputSelect() {
    savePeople();
    window.location.href = 'receiptInputSelect.html';
}

function redirectToReceiptScanner() {
    window.location.href = 'receiptScanner.html';
}

function redirectToEditReceipt() {
    window.location.href = 'editReceipt.html';
    scanReceipt();
}

function redirectToTextDisplay() {
    window.location.href = 'textDisplay.html';
}

// ADD AND REMOVE PEOPLE //

function addPerson() {
    const newPerson = document.getElementById('newPerson').value;

    const newPersonEntry = document.createElement('div');
    newPersonEntry.id = 'newPersonEntry-' + newPerson;

    const newPersonName = document.createElement('p');
    newPersonName.classList.add('allAddedPeople');
    newPersonName.textContent = newPerson;

    const minus = document.createElement('img');
    minus.src = './img/minus.png';
    minus.onclick = function () {
        removePerson('newPersonEntry-' + newPerson);
    };

    newPersonEntry.appendChild(newPersonName);
    newPersonEntry.appendChild(minus);

    document.getElementById('addedPeople').appendChild(newPersonEntry);
    document.getElementById('addNameInput').reset();
}

function removePerson(newPersonEntryId) {
    const newPersonEntry = document.getElementById(newPersonEntryId);
    document.getElementById('addedPeople').removeChild(newPersonEntry);
}

function savePeople() {
    const people = document.querySelectorAll('p.allAddedPeople');

    const peopleList = [];

    people.forEach(function (p) {
        peopleList.push(p.textContent);
    });

    localStorage.setItem('peopleList', JSON.stringify(peopleList));
}

// INPUT RECEIPT //


// SCANNED RECEIPT PROCESSING //

function scanReceipt() {
    const savedPeopleList = localStorage.getItem('peopleList');
    const people = JSON.parse(savedPeopleList);

    // call processReceipt
    // const receipt = null;

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
    // prepare html elements to be filled with whatever is returned by process Receipt!!
    for (let i = 0; i < items.length; i++) {
        const currItem = items[i];

        const newItemEntry = document.createElement('div');
        newItemEntry.id = 'newItemEntry-' + i;

        const newItemDescription = document.createElement('p');
        newItemDescription.textContent = currItem.description;
        newItemDescription.setAttribute('contenteditable', 'true');

        const newItemTotal = document.createElement('p');
        newItemTotal.classList.add('itemAmounts');
        newItemTotal.textContent = currItem.total;
        newItemTotal.setAttribute('contenteditable', 'true');
        newItemTotal.oninput = updateSubtotalAndTotal();
    
        const newOrderedByDropdown = document.createElement('select');
        people.forEach(person => {
            const option = document.createElement('option');
            option.value = person.toLowerCase().replace(" ", "_");
            option.textContent = person;
            newOrderedByDropdown.appendChild(option);
        })

        newItemEntry.appendChild(newItemDescription);
        newItemEntry.appendChild(newItemTotal);
        newItemEntry.appendChild(newOrderedByDropdown);

        document.getElementById('receiptItems').appendChild(newItemEntry);
    }

    document.getElementById('vendorName').innerText = receipt.vendorName;
    document.getElementById('subtotal').innerText = receipt.subtotal;
    document.getElementById('tax').innerText = receipt.tax;
    document.getElementById('tip').innerText = receipt.tip;
    document.getElementById('checkTotal').innerText = receipt.total;
}

function updateSubtotalAndTotal() {
    const itemAmounts = document.querySelectorAll('.itemAmounts');
    const taxTipAmounts = document.querySelectorAll('.taxTipAmounts');

    let subtotalValue = 0;

    itemAmounts.forEach(itemAmount => {
        const itemAmountValue = parseFloat(itemAmount.value);

        // Only add valid numbers to the sum
        if (!isNaN(itemAmountValue)) {
            subtotalValue += itemAmountValue;
        }
    });

    let checkTotalValue = subtotalValue;

    taxTipAmounts.forEach(taxTipAmount => {
        const taxTipAmountValue = parseFloat(taxTipAmount.value);

        // Only add valid numbers to the sum
        if (!isNaN(taxTipAmountValue)) {
            checkTotalValue += taxTipAmountValue;
        }
    });

    const subtotalElement = document.getElementById('subtotal');
    const checkTotalElement = document.getElementById('checkTotal');
    
    // Update the subtotal and checkTotal display
    subtotalElement.innerText = subtotalValue;
    checkTotalElement.innerText = checkTotalValue;
}

// CONFIRMED RECEIPT PROCESSING //



// GENERATE TEXT MESSAGE //

// function generateTextMessage(names_and_total_amount_owed) {
// }
