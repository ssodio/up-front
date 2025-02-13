const { pairPeopleWithItems, calculateItemAmountOwed, calculateTotalAmountOwed } = require('../src/calculation');

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
            quantity: 2,
            orderedBy: ["Josephine", "Gabby"],
            numPeopleSharingItem: 2
        },
        {
            description: "Nacho Fries",
            total: 3.52,
            quantity: 1,
            orderedBy: ["Gabby", "Susie"],
            numPeopleSharingItem: 2
        },
        {
            description: "Potato Taco",
            total: 2.18,
            quantity: 1,
            orderedBy: ["Susie"],
            numPeopleSharingItem: 1
        }
    ]
};

const people = ["Susie", "Josephine", "Gabby"];

test('calculateItemAmountOwed', () => {
    // Chicken Chalupa
    const testItemAmountOwedChickenChalupa = calculateItemAmountOwed(14.55, 20.25, 2.00, 6.57, 2);
    expect(testItemAmountOwedChickenChalupa).toBeBetween(10.35, 10.37); // 10.36

    // Nacho Fries
    const testItemAmountOwedNachoFries = calculateItemAmountOwed(3.52, 20.25, 2.00, 6.57, 2);
    expect(testItemAmountOwedNachoFries).toBeBetween(2.5, 2.52); // 2.51

    // Potato Taco
    const testItemAmountOwedPotatoTaco = calculateItemAmountOwed(2.18, 20.25, 2.00, 6.57, 1);
    expect(testItemAmountOwedPotatoTaco).toBeBetween(3.1, 3.12); // 3.11
});

test('calculateTotalAmountOwed', () => {
    // Susie
    const itemsSusie = [
        {
            description: "Nacho Fries",
            amountOwed: 2.51
        },
        {
            description: "Potato Taco",
            amountOwed: 3.11
        }
    ];
    const testTotalAmountOwedSusie = calculateTotalAmountOwed(itemsSusie);
    expect(testTotalAmountOwedSusie).toBe(5.62);

    // Gabby
    const itemsGabby = [
        {
            description: "Chicken Chalupa",
            amountOwed: 10.36
        },
        {
            description: "Nacho Fries",
            amountOwed: 2.51
        }
    ];
    const testTotalAmountOwedGabby = calculateTotalAmountOwed(itemsGabby);
    expect(testTotalAmountOwedGabby).toBe(12.87);

    // Josephine
    const itemsJosephine = [
        {
            description: "Chicken Chalupa",
            amountOwed: 10.36 
        }
    ];
    const testTotalAmountOwedJosephine = calculateTotalAmountOwed(itemsJosephine);
    expect(testTotalAmountOwedJosephine).toBe(10.36);
});

test('pairPeopleWithItems', () => {
    const testPeopleWithItems = pairPeopleWithItems(receipt, people);

    const expectedPeopleWithItems = {
        "Susie": [
            {
                description: "Nacho Fries",
                amountOwed: 2.51
            },
            {
                description: "Potato Taco",
                amountOwed: 3.11
            }
        ],
        "Josephine": [
            {
                description: "Chicken Chalupa",
                amountOwed: 10.36 
            }
        ],
        "Gabby": [
            {
                description: "Chicken Chalupa",
                amountOwed: 10.36
            },
            {
                description: "Nacho Fries",
                amountOwed: 2.51
            }
        ]
    };

    expect(Object.keys(testPeopleWithItems)).toEqual(expect.arrayContaining(people));

    expect(testPeopleWithItems.Susie.length).toBe(2);
    expect(testPeopleWithItems.Susie[0].amountOwed).toBeBetween(2.5, 2.52); // 2.51 - "Nacho Fries"
    expect(testPeopleWithItems.Susie[1].amountOwed).toBeBetween(3.1, 3.12); // 3.11 - "Potato Taco"

    expect(testPeopleWithItems.Josephine.length).toBe(1);
    expect(testPeopleWithItems.Josephine[0].amountOwed).toBeBetween(10.35, 10.37); // 10.36 - "Chicken Chalupa"

    expect(testPeopleWithItems.Gabby.length).toBe(2);
    expect(testPeopleWithItems.Gabby[0].amountOwed).toBeBetween(10.35, 10.37); // 10.36 - "Chicken Chalupa"
    expect(testPeopleWithItems.Gabby[1].amountOwed).toBeBetween(2.5, 2.52); // 2.51 - "Nacho Fries"
});

expect.extend({
    toBeBetween(received, floor, ceiling) {
      if (received > floor && received < ceiling) {
        return {
          message: () => `expected ${received} to be between ${floor} and ${ceiling}`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be between ${floor} and ${ceiling}`,
          pass: false,
        };
      }
    },
  });
  