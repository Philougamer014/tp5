document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href; // Déclaration correcte de currentUrl
    let cart = parseCartFromUrl(currentUrl); // Parsing du panier à partir de l'URL
    setCartLink(createCartUrl('cart.html', cart))

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('index')) {
        const index = parseInt(urlParams.get('index'));
        if (!isNaN(index) && index >= 0 && index <= 49) {
            displayProductWithIndex(index, cart); // Passer le panier à la fonction pour utilisation ultérieure
        } else {
            window.location.href = '404.html'; // Redirection vers une page 404 si l'index est invalide
        }
    } else {
        console.error('Index parameter not found in URL');
    }
});

function displayProductWithIndex(index, cart) { // Ajouter cart comme paramètre pour un accès global
    fetch('https://dummyjson.com/products')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const dataProducts = data.products;
            const product = dataProducts[index];
            if (product) {
                updateProductDetails(product, cart); // Passer le panier à updateProductDetails
            } else {
                console.error('Invalid index');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateProductDetails(product, cart) { // Ajouter cart comme paramètre pour un accès global
    const imgElement = document.getElementById("product-image");
    const titleElement = document.getElementById("product-title");
    const priceElement = document.getElementById("price");
    const descElement = document.getElementById("description");
    const categoryElement = document.getElementById("category");
    const stockElement = document.getElementById("stock");
    const brandElement = document.getElementById("brand");
    const ratingElement = document.getElementById("rating");
    const imageList = document.getElementById("additional-images");
    const buyButton = document.getElementById("buy-button");

    imgElement.src = product.thumbnail;
    imgElement.alt = product.title;
    titleElement.innerText = product.title;
    priceElement.innerText = `$${product.price}`;
    descElement.innerText = product.description;
    categoryElement.innerText = product.category;
    stockElement.innerText = `In stock: ${product.stock}`;
    brandElement.innerText = product.brand;
    ratingElement.innerText = `Rating: ${product.rating}`;

    imageList.innerHTML = "";
    product.images.forEach((image, index) => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = `Image ${index + 1}`;
        img.style.width = "100px";
        img.classList.add('m-1');
        imageList.appendChild(img);
    });

    buyButton.onclick = () => {
        addToCart(product.id, cart); 
    };
}

function addToCart(productId, cart) {
    const productIndex = cart.findIndex(item => item[0] === productId);
    if (productIndex > -1) {
        cart[productIndex][1] += 1;
    } else {
        cart.push([productId, 1]);
    }
    console.log(cart);
    setHomeLink(createCartUrl('index.html', cart));
    setCartLink(createCartUrl('cart.html', cart))
}

function createCartUrl(url, cart) {
    const baseUrl = url;
    const queryParams = new URLSearchParams();
    cart.forEach(item => {
        queryParams.append('productId', item[0]);
        queryParams.append('quantity', item[1]);
    });
    return `${baseUrl}?${queryParams.toString()}`;
}

function setHomeLink(url) {
    const homeLink = document.getElementById('Accueil');
    if (homeLink) {
        homeLink.href = url;
    } else {
        console.error('Le lien avec l\'ID "Accueil" n\'existe pas sur la page.');
    }
}

function setCartLink(url) {
    const homeLink = document.getElementById('cart');
    if (homeLink) {
        homeLink.href = url;
    } else {
        console.error('Le lien avec l\'ID "cart" n\'existe pas sur la page.');
    }
}

function parseCartFromUrl(url) {
    const urlObj = new URL(url);
    const queryParams = new URLSearchParams(urlObj.search);
    let cart = [];
    const products = queryParams.getAll('productId');
    const quantities = queryParams.getAll('quantity');
    if (products.length === quantities.length) {
        products.forEach((productId, index) => {
            cart.push([parseInt(productId, 10), parseInt(quantities[index], 10)]);
        });
    } else {
        console.error('Les paramètres des produits et des quantités ne correspondent pas.');
    }
    return cart;
}
