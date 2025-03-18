
let cart = [];
let total = 0;
let selectedDrinkFlavor = "";

const drinkPrices = {
    "Orange": { "Small": 20, "Medium": 30, "Large": 40 },
    "Watermelon": { "Small": 25, "Medium": 35, "Large": 45 },
    "Mango": { "Small": 40, "Medium": 50, "Large": 60 },
    "Apple": { "Small": 20, "Medium": 30, "Large": 40 },
    "Melon": { "Small": 35, "Medium": 45, "Large": 55 },
    "Pomelo": { "Small": 30, "Medium": 40, "Large": 50 }
};

// Handle item clicks
document.querySelectorAll('.item').forEach(button => {
    button.addEventListener('click', () => {
        let itemName = button.getAttribute('data-name');
        let itemPrice = button.getAttribute('data-price') ? parseInt(button.getAttribute('data-price')) : 0;

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
    });
});

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

// Handle order placement
document.getElementById('placeOrder')?.addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to place an order.");
        return;
    }

    let orderSummary = "Order Summary:\n";
    cart.forEach(item => {
        orderSummary += `${item.name} - ₱${item.price}\n`;
    });
    orderSummary += `Total: ₱${total}\n\n`;

    alert(orderSummary + "\nThank you for your order!");
    cart = [];
    updateCart();
});

// Handle search icon clicks
document.querySelector('#searchicon1')?.addEventListener('click', function(){
    document.querySelector('#searchinput1').style.display = 'flex';
    this.style.display = 'none';
});

document.querySelector('#searchicon2')?.addEventListener('click', function(){
    document.querySelector('#searchinput2').style.display = 'flex';
    this.style.display = 'none';
});

// Mobile navigation menu
const bar = document.querySelector('.fa-bars');
const cross = document.querySelector('#hdcross');
const headerbar = document.querySelector('.headerbar');

bar?.addEventListener('click', function(){
    setTimeout(() => {
        cross.style.display = 'block';
    }, 200);
    headerbar.style.right = '0%';
});

cross?.addEventListener('click', function(){
    cross.style.display = 'none';
    headerbar.style.right = '-100%';
});

// Handle payment and delivery options
document.addEventListener("DOMContentLoaded", function () {
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

        let orderSummary = "Order Summary:\n";
        cart.forEach(item => {
            orderSummary += `${item.name} - ₱${item.price}\n`;
        });
        orderSummary += `Total: ₱${total}\n\n`;

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

        alert(orderSummary + customerDetails + "\nThank you for your order!");
        cart = [];
        updateCart();
    });
});
