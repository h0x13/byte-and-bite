const API_URL = 'https://0x13.pythonanywhere.com';

document.addEventListener('DOMContentLoaded', function () {
    const foodMenuSection = document.querySelector('.food-menu');
    const menuHeading = foodMenuSection.querySelector('h2');
    
    foodMenuSection.innerHTML = '';
    foodMenuSection.appendChild(menuHeading);


    function createMenuItem(item) {
        if (item.price === null || item.price === undefined) {
            return `<li>${item.name}</li>`;
        }
        return `<li>${item.name} - <strong>₱${item.price.toFixed(0)}</strong></li>`;
    }

    function createMenuCategory(title, items, imageSrc) {
        const category = document.createElement('div');
        category.className = 'menu-category';
        category.innerHTML = `
            <img src="${imageSrc}" alt="${title}" class="menu-image">
            <div class="menu-details">
                <h4>${title}</h4>
                <ul>${items.map(createMenuItem).join('')}</ul>
            </div>
        `;
        return category;
    }

    function createMenuGroup(title, categories) {
        const group = document.createElement('div');
        group.className = 'menu-group';
        
        const heading = document.createElement('h3');
        heading.textContent = title;
        group.appendChild(heading);
        
        categories.forEach(category => group.appendChild(category));
        
        const orderButton = document.createElement('a');
        orderButton.href = 'order.html';
        orderButton.innerHTML = '<button class="order-btn">Order Now</button>';
        group.appendChild(orderButton);
        
        return group;
    }

    function fetchData(endpoint) {
        return fetch(`${API_URL}${endpoint}`).then(response => response.json());
    }

    Promise.all([
        fetchData('/foods/bread'),
        fetchData('/foods/filling'),
        fetchData('/foods/spread')
    ]).then(([breadData, fillingData, spreadData]) => {
        const sandwichGroup = createMenuGroup('Sandwich', [
            createMenuCategory('Bread', breadData, `${API_URL}/image/burger_bun.png`),
            createMenuCategory('Fillings', fillingData, `${API_URL}/image/fillings.png`),
            createMenuCategory('Spreads', spreadData, `${API_URL}/image/spreads.png`)
        ]);
        
        foodMenuSection.appendChild(sandwichGroup);
        
        return Promise.all([
            fetchData('/drinks/flavor'),
            fetchData('/drinks/add-on')
        ]);
    }).then(([flavorData, addonData]) => {
        const groupedFlavors = {};
        
        flavorData.forEach(flavor => {
            if (!groupedFlavors[flavor.name]) {
                groupedFlavors[flavor.name] = { name: flavor.name, sizes: {} };
            }
            groupedFlavors[flavor.name].sizes[flavor.size] = flavor.price;
        });

        const formattedFlavors = Object.values(groupedFlavors).map(flavor => ({
            name: `
                ${flavor.name} - <strong>
                Small: ₱${flavor.sizes.small?.toFixed(0) || 'N/A'} |
                Medium: ₱${flavor.sizes.medium?.toFixed(0) || 'N/A'} |
                Large: ₱${flavor.sizes.large?.toFixed(0) || 'N/A'}</strong>`
        }));
        
        const drinksGroup = createMenuGroup('Drinks', [
            createMenuCategory('Flavors', formattedFlavors, `${API_URL}/image/drinks.png`),
            createMenuCategory('Add-ons', addonData, `${API_URL}/image/addons.png`)
        ]);
        
        foodMenuSection.appendChild(drinksGroup);
    }).catch(error => {
        console.error('Error fetching menu data:', error);
        foodMenuSection.innerHTML += `
            <div class="error-message">
                <p>Sorry, we couldn't load the menu data. Please try again later.</p>
            </div>
        `;
    });
});
