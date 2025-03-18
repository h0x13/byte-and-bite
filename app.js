let cart = [];
let total = 0;
let selectedDrinkFlavor = "";

// Drink prices will be populated dynamically from the API
let drinkPrices = {};

const API_URL = 'https://0x13.pythonanywhere.com';

// Fetch and display menu items
async function fetchMenu() {
    try {
        const foodsResponse = await fetch(`${API_URL}/foods`);
        const foods = await foodsResponse.json();
        const drinksResponse = await fetch(`${API_URL}/drinks`);
        const drinks = await drinksResponse.json();

        // Populate drinkPrices dynamically
        populateDrinkPrices(drinks);

        // Populate the menu
        populateMenu(foods, drinks);
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Populate drinkPrices from the drinks data
function populateDrinkPrices(drinks) {
    const uniqueFlavors = new Set();

    drinks.forEach(drink => {
        if (drink.type === 'flavor') {
            uniqueFlavors.add(drink.name);
        }
    });

    uniqueFlavors.forEach(flavor => {
        drinkPrices[flavor] = {
            "Small": drinks.find(d => d.name === flavor && d.size === "small")?.price || 0,
            "Medium": drinks.find(d => d.name === flavor && d.size === "medium")?.price || 0,
            "Large": drinks.find(d => d.name === flavor && d.size === "large")?.price || 0
        };
    });
}

// Populate the menu dynamically
function populateMenu(foods, drinks) {
    const menuContainer = document.getElementById('menu');

    // Group foods by type
    const foodCategories = {};
    foods.forEach(food => {
        if (!foodCategories[food.type]) {
            foodCategories[food.type] = [];
        }
        foodCategories[food.type].push(food);
    });

    // Create food categories dynamically
    for (const [category, items] of Object.entries(foodCategories)) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h3>${capitalizeFirstLetter(category)}</h3>`;
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'items';

        items.forEach(item => {
            itemsDiv.appendChild(createItemButton(item));
        });

        categoryDiv.appendChild(itemsDiv);
        menuContainer.appendChild(categoryDiv);
    }

    // Create drinks section
    const drinksSection = document.createElement('div');
    drinksSection.innerHTML = '<h2>Drinks</h2>';
    menuContainer.appendChild(drinksSection);

    // Group drinks by type
    const drinkCategories = {};
    drinks.forEach(drink => {
        if (!drinkCategories[drink.type]) {
            drinkCategories[drink.type] = [];
        }
        drinkCategories[drink.type].push(drink);
    });

    // Create drink categories dynamically
    for (const [category, items] of Object.entries(drinkCategories)) {
        if (category === 'add-on') {
            continue;
        }
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `<h3>${capitalizeFirstLetter(category)}</h3>`;
        const itemsDiv = document.createElement('div');
        itemsDiv.className = 'items';

        // For flavors, only display each flavor once
        if (category === 'flavor') {
            const uniqueFlavors = {};

            items.forEach(item => {
                if (!uniqueFlavors[item.name]) {
                    uniqueFlavors[item.name] = [item.name, item.image];
                }
            });

            Object.entries(uniqueFlavors).forEach(([id, [flavor, image]]) => {
                const button = document.createElement('button');
                button.className = 'item';
                button.style.backgroundImage = `url(https://${image})`;
                button.setAttribute('data-name', flavor);
                button.textContent = flavor;
                itemsDiv.appendChild(button);
            });
        } else {
            items.forEach(item => {
                itemsDiv.appendChild(createItemButton(item));
            });
        }

        categoryDiv.appendChild(itemsDiv);
        menuContainer.appendChild(categoryDiv);
    }

    // Add sizes section (before add-ons)
    const sizesDiv = document.createElement('div');
    sizesDiv.innerHTML = '<h3>Sizes</h3>';
    const sizesButtonsDiv = document.createElement('div');
    sizesButtonsDiv.className = 'items';
    const sizes = ["Small", "Medium", "Large"];
    sizes.forEach(size => {
        const button = document.createElement('button');
        button.className = 'item size';
        button.setAttribute('data-size', size);
        button.textContent = size;
        sizesButtonsDiv.appendChild(button);
    });
    sizesDiv.appendChild(sizesButtonsDiv);
    menuContainer.appendChild(sizesDiv);

    // Add add-ons section (after sizes)
    const addonsDiv = document.createElement('div');
    addonsDiv.innerHTML = '<h3>Add-ons</h3>';
    const addonsButtonsDiv = document.createElement('div');
    addonsButtonsDiv.className = 'items';
    const addons = drinks.filter(drink => drink.type === 'add-on');
    addons.forEach(addon => {
        addonsButtonsDiv.appendChild(createItemButton(addon));
    });
    addonsDiv.appendChild(addonsButtonsDiv);
    menuContainer.appendChild(addonsDiv);

    // Attach event listeners to items
    document.querySelectorAll('.item').forEach(button => {
        button.addEventListener('click', handleItemClick);
    });
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Create a button for an item
function createItemButton(item) {
    const button = document.createElement('button');
    button.className = 'item';
    button.setAttribute('data-name', item.name);
    button.setAttribute('data-price', item.price);
    button.style.backgroundImage = `url(https://${item.image})`;
    // button.setAttribute('data-id', item.id);
    button.textContent = `${item.name} (₱${item.price})`;
    return button;
}

// Handle item clicks
function handleItemClick(event) {
    const button = event.target;
    let itemName = button.getAttribute('data-name');
    let itemPrice = button.getAttribute('data-price') ? parseFloat(button.getAttribute('data-price')) : 0;
    // let itemId = button.getAttribute('data-id')

    // If it's a drink, set it as the selected flavor
    if (drinkPrices[itemName]) {
        selectedDrinkFlavor = itemName;
        alert(`You selected ${itemName}. Now choose a size!`);
        return;
    }

    // If it's a drink size, ensure a flavor is selected first
    if (button.classList.contains('size')) {
        if (!selectedDrinkFlavor) {
            alert("Please select a drink flavor first!");
            return;
        }
        let size = button.getAttribute('data-size');
        if (!drinkPrices[selectedDrinkFlavor][size]) {
            alert("Invalid size selection!");
            return;
        }
        itemName = `${selectedDrinkFlavor} (${size})`;
        itemPrice = drinkPrices[selectedDrinkFlavor][size];
        selectedDrinkFlavor = ""; // Reset after adding
    }

    if (itemName && itemPrice > 0) {
        cart.push({ name: itemName, price: itemPrice });
        updateCart();
    } else {
        alert("Invalid item selection!");
    }
}

// Update the cart display
function updateCart() {
    let cartElement = document.getElementById('cart');
    let totalElement = document.getElementById('total');

    if (!cartElement || !totalElement) return;

    cartElement.innerHTML = '';
    total = 0;

    cart.forEach((item, index) => {
        let itemDiv = document.createElement('div');
        itemDiv.innerHTML = `${item.name} - ₱${item.price} 
            <button class="remove-btn" onclick="removeItem(${index})">❌</button>`;
        cartElement.appendChild(itemDiv);
        total += item.price;
    });

    totalElement.textContent = `₱${total}`;
}

// Remove an item from the cart
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Clear cart
document.getElementById('clearCart')?.addEventListener('click', () => {
    cart = [];
    selectedDrinkFlavor = "";
    updateCart();
});

// Handle payment and delivery options
document.addEventListener("DOMContentLoaded", function () {
    fetchMenu();
    const paymentMethod = document.getElementById("payment-method");
    const gcashDetails = document.getElementById("gcash-details");
    const pickupDelivery = document.getElementById("pickup-delivery");
    const deliveryDetails = document.getElementById("delivery-details");

    paymentMethod?.addEventListener("change", function () {
        gcashDetails.style.display = this.value === "gcash" ? "block" : "none";
    });

    pickupDelivery?.addEventListener("change", function () {
        deliveryDetails.style.display = this.value === "delivery" ? "block" : "none";
    });

    document.getElementById('placeOrder')?.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty. Please add items to place an order.");
            return;
        }

        let customerDetails = `Pickup/Delivery: ${pickupDelivery.value}\n`;
        if (pickupDelivery.value === "delivery") {
            customerDetails += `Address: ${document.getElementById("address").value}\n`;
            customerDetails += `Landmark: ${document.getElementById("landmark").value}\n`;
        }
        customerDetails += `Payment Method: ${paymentMethod.value}\n`;
        if (paymentMethod.value === "gcash") {
            customerDetails += "Please upload your GCash payment screenshot.\n";
        }
        customerDetails += `Customization Notes: ${document.getElementById("custom-notes").value}\n`;

        fetch(`${API_URL}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                customer_name: 'Unknown',
                items: cart,
                payment_method: paymentMethod.value,
                service_type: pickupDelivery.value,
            })
        }).then(response => response.json())
        .then(data => {
            alert(orderSummary + customerDetails + "\nThank you for your order!");
            cart = [];
            updateCart();
            console.log(data);
        }).catch(error => {
            console.error('Transaction Error: ', error);
        })

        let orderSummary = "Order Summary:\n";
        cart.forEach(item => {
            orderSummary += `${item.name} - ₱${item.price}\n`;
        });
        orderSummary += `Total: ₱${total}\n\n`;
    });
});
