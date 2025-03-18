<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Order</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="order-style.css">
</head>
<body>
    <div class="container">
        <h1>Byte & Bite Ordering System</h1>

        <div class="menu">
            <h2>Sandwich</h2>

            <div class="category">
                <h3>Bread</h3>
                <div class="items">
                    <button class="item" data-name="White Bread" data-price="10">White Bread (₱10)</button>
                    <button class="item" data-name="Whole Wheat" data-price="10">Whole Wheat (₱10)</button>
                    <button class="item" data-name="Burger Bun" data-price="10">Burger Bun (₱10)</button>
                </div>
            </div>

            <div class="category">
                <h3>Fillings</h3>
                <div class="items">
                    <button class="item" data-name="Egg" data-price="10">Egg (₱10)</button>
                    <button class="item" data-name="Lettuce" data-price="10">Lettuce (₱10)</button>
                    <button class="item" data-name="Luncheon Meat" data-price="15">Luncheon Meat (₱15)</button>
                    <button class="item" data-name="Burger Patty" data-price="15">Burger Patty (₱15)</button>
                    <button class="item" data-name="Tomato Slices" data-price="5">Tomato Slices (₱5)</button>
                    <button class="item" data-name="Cheese Slices" data-price="10">Cheese Slices (₱10)</button>
                </div>
            </div>

            <div class="category">
                <h3>Spread</h3>
                <div class="items">
                    <button class="item" data-name="Tuna Mayo" data-price="10">Tuna Mayo (₱10)</button>
                    <button class="item" data-name="Chicken Mayo" data-price="15">Chicken Mayo (₱15)</button>
                    <button class="item" data-name="Ketchup Mayo" data-price="5">Ketchup Mayo (₱5)</button>
                    <button class="item" data-name="Cheese Spread" data-price="10">Cheese Spread (₱10)</button>
                    <button class="item" data-name="Chocolate Spread" data-price="15">Chocolate Spread (₱15)</button>
                    <button class="item" data-name="Peanut Butter" data-price="5">Peanut Butter (₱5)</button>
                </div>
            </div>
        </div>

        <h2>Drinks</h2>
        <div class="category">
            <h3>Flavors</h3>
            <div class="items">
                <button class="item" data-name="Orange">Orange</button>
                <button class="item" data-name="Watermelon">Watermelon</button>
                <button class="item" data-name="Mango">Mango</button>
                <button class="item" data-name="Apple">Apple</button>
                <button class="item" data-name="Melon">Melon</button>
                <button class="item" data-name="Pomelo">Pomelo</button>
            </div>
        </div>

        <h3>Sizes</h3>
        <div class="items">
            <button class="item size" data-size="Small" data-price="0">Small</button>
            <button class="item size" data-size="Medium" data-price="10">Medium</button>
            <button class="item size" data-size="Large" data-price="20">Large</button>
        </div>

        <h3>Add-ons</h3>
        <div class="items">
            <button class="item" data-name="Popping Boba" data-price="15">Popping Boba (₱15)</button>
            <button class="item" data-name="Sliced Fruit" data-price="15">Sliced Fruit (₱15)</button>
            <button class="item" data-name="Sago" data-price="5">Sago (₱5)</button>
            <button class="item" data-name="Nata de Coco" data-price="10">Nata de Coco (₱10)</button>
            <button class="item" data-name="Tapioca Pearls" data-price="10">Tapioca Pearls (₱10)</button>
        </div>

        <h2>Order Summary</h2>
        <div id="cart"></div>
        <p>Total: <span id="total">₱0</span></p>
        <button id="clearCart">Clear Cart</button>

        <h2>Customer Details</h2>
        <label for="pickup-delivery">Pickup or Delivery:</label>
        <select id="pickup-delivery">
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
        </select>

        <div id="delivery-details" style="display: none;">
            <label for="address">Address:</label>
            <input type="text" id="address" placeholder="Enter your address">
            <label for="landmark">Landmark:</label>
            <input type="text" id="landmark" placeholder="Nearest landmark">
        </div>

        <label for="payment-method">Payment Method:</label>
        <select id="payment-method">
            <option value="cash">Cash on Pickup/Delivery</option>
            <option value="gcash">GCash</option>
            <option value="card">Credit/Debit Card</option>
        </select>

        <div id="gcash-details" style="display: none;">
            <h3>Scan to Pay</h3>
            <img src="images/gcashqr.jfif" alt="GCash QR Code" id="gcash-qr" width="200">
            <label for="gcash-receipt">Upload Payment Screenshot:</label>
            <input type="file" id="gcash-receipt" accept="image/*">
        </div>

        <label for="custom-notes">Customization Notes:</label>
        <textarea id="custom-notes" placeholder="Any special requests?"></textarea>

        <button id="placeOrder">Place Order</button>
    </div>

    <footer>
        <p>&copy; 2025 BYTE & BiTE. All rights reserved.</p>
    </footer>

    <script src="app.js"></script>
    <script>
        document.getElementById("pickup-delivery").addEventListener("change", function() {
            document.getElementById("delivery-details").style.display = this.value === "delivery" ? "block" : "none";
        });

        document.getElementById("payment-method").addEventListener("change", function() {
            document.getElementById("gcash-details").style.display = this.value === "gcash" ? "block" : "none";
        });
    </script>
</body>
</html>
