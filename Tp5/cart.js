document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href;
    let cart = parseCartFromUrl(currentUrl);
    fetchCartItems(cart);
    setHomeLink(createCartUrl('index.html', cart));
});

function parseCartFromUrl(url) {
    const urlObj = new URL(url);
    const queryParams = new URLSearchParams(urlObj.search);
    let cart = [];
    const productIds = queryParams.getAll('productId');
    const quantities = queryParams.getAll('quantity');

    if (productIds.length === quantities.length) {
        productIds.forEach((productId, index) => {
            cart.push({
                id: parseInt(productId, 10),
                quantity: parseInt(quantities[index], 10)
            });
        });
    } else {
        console.error('Mismatch in product IDs and quantities.');
    }
    return cart;
}

function fetchCartItems(cart) {
    fetch('https://dummyjson.com/products')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const products = data.products;
            const cartItems = cart.map(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    return {
                        ...product,
                        quantity: cartItem.quantity
                    };
                } else {
                    console.error(`Product with ID ${cartItem.id} not found.`);
                    return null;
                }
            }).filter(item => item !== null); // Remove any null items
            displayCartItems(cartItems);
            setPriceLink(createPriceLink('achat.html', calculateTotalPrice(cartItems))); // Set the link with total price
        })
        .catch(error => {
            console.error('There was a problem fetching the cart items:', error);
            alert('Failed to load cart items.');
        });
}

function displayCartItems(cartItems) {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Clear the container before adding new items
    let totalPrice = 0;

    cartItems.forEach(item => {
        const totalPriceForItem = item.price * item.quantity;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${item.thumbnail}" alt="${item.title}" style="width: 50px; height: auto;">
                ${item.title}
            </td>
            <td>${item.price.toFixed(2)} €</td>
            <td>${item.quantity}</td>
            <td>${totalPriceForItem.toFixed(2)} €</td>
            <td class="text-right">
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Retirer</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
        totalPrice += totalPriceForItem;
    });

    totalPriceContainer.textContent = `${totalPrice.toFixed(2)} €`;
}

function removeFromCart(productId) {
    const urlObj = new URL(window.location.href);
    const queryParams = new URLSearchParams(urlObj.search);

    const newParams = [];
    let skipNext = false;

    for (let [key, value] of queryParams.entries()) {
        if (key === 'productId' && parseInt(value, 10) === productId) {
            skipNext = true;
            continue;
        }
        if (key === 'quantity' && skipNext) {
            skipNext = false;
            continue;
        }
        newParams.push(`${key}=${value}`);
    }

    const newUrl = `${urlObj.origin}${urlObj.pathname}?${newParams.join('&')}`;
    window.location.href = newUrl;
}

function createCartUrl(baseUrl, cart) {
    const queryParams = new URLSearchParams();
    cart.forEach(item => {
        queryParams.append('productId', item.id);
        queryParams.append('quantity', item.quantity);
    });
    return `${baseUrl}?${queryParams.toString()}`;
}

function setHomeLink(url) {
    const homeLink = document.getElementById('Accueil');
    if (homeLink) {
        homeLink.href = url;
        console.log('Home link set to:', url); // Pour déboguer
    } else {
        console.error('Le lien avec l\'ID "Accueil" n\'existe pas sur la page.');
    }
}

function calculateTotalPrice(cartItems) {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function createPriceLink(baseUrl, totalPrice) {
    return `${baseUrl}?totalPrice=${totalPrice}`;
}

function setPriceLink(url) {
    const priceLink = document.getElementById('price-link'); // Assurez-vous que l'élément avec cet ID existe dans votre HTML
    if (priceLink) {
        priceLink.href = url;
        console.log('Price link set to:', url); // Pour déboguer
    } else {
        console.error('Le lien avec l\'ID "price-link" n\'existe pas sur la page.');
    }
    priceLink.onclick = () => {
        window.location.href = url;
    };
}



