document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.href; 
    const cart = parseCartFromUrl(currentUrl);
    setCartLink(createCartUrl('cart.html', cart));
    setHomeLink(createCartUrl('index.html', cart)); // Mettre à jour le lien d'accueil
    console.log(cart); // ne pas effacer ce console log car pour une raison étrange le code ne marchais plus avant que j'ajoute ce console log

    fetch('https://dummyjson.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const products = data.products;
            displayFeaturedProduct(products);
            displayProductCards(products, cart);
            displayCarouselItems(products, cart);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function displayFeaturedProduct(products) {
    const randomIndex = Math.floor(Math.random() * products.length);
    const product = products[randomIndex];

    const imgElement = document.getElementById('image5');
    const titleElement = document.querySelector('.col-md-4 h2');
    const buttonElement = document.querySelector('.col-md-4 button');

    imgElement.src = product.thumbnail;
    imgElement.alt = product.title;
    titleElement.textContent = product.title;
    buttonElement.onclick = () => {
        window.location.href = `detail.html?index=${randomIndex}`;
    };
}

function displayProductCards(products, cart) {
    const uniqueIndexes = generateUniqueRandoms(0, products.length, 4);
    uniqueIndexes.forEach((index, i) => {
        const product = products[index];
        const imgElement = document.getElementById('image' + (i + 1));
        const titleElement = document.getElementById('title' + (i + 1));
        const contentElement = document.getElementById('content' + (i + 1));
        const linkElement = document.getElementById('lien' + (i + 1));

        imgElement.src = product.thumbnail;
        imgElement.alt = product.title;
        titleElement.textContent = product.title;
        contentElement.textContent = product.description;
        linkElement.href = createProductLink(index, cart);
    });
}

function generateUniqueRandoms(min, max, count) {
    const uniqueRandoms = [];
    while (uniqueRandoms.length < count) {
        const randomIndex = Math.floor(Math.random() * (max - min)) + min;
        if (!uniqueRandoms.includes(randomIndex)) {
            uniqueRandoms.push(randomIndex);
        }
    }
    return uniqueRandoms;
}

function displayCarouselItems(products, cart) {
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';

    products.forEach((product, index) => {
        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-slide-to', index);
        indicator.className = index === 0 ? 'active' : '';

        const item = document.createElement('div');
        item.className = 'carousel-item' + (index === 0 ? ' active' : '');
        const imageLink = document.createElement('a');
        imageLink.href = createProductLink(index, cart);
        const image = document.createElement('img');
        image.src = product.thumbnail;
        image.alt = product.title;
        image.style.width = '100%';
        image.style.height = '500px';
        image.style.objectFit = 'cover';

        imageLink.appendChild(image);
        item.appendChild(imageLink);

        const caption = document.createElement('div');
        caption.className = 'carousel-caption';
        const title = document.createElement('h4');
        title.textContent = product.title;
        title.style.fontSize = '24px';
        title.style.color = 'white';

        const description = document.createElement('p');
        description.textContent = product.description;

        caption.appendChild(title);
        caption.appendChild(description);
        item.appendChild(caption);
        carouselInner.appendChild(item);
    });
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

function createProductLink(index, cart) {
    const baseUrl = "detail.html";
    const queryParams = new URLSearchParams();

    queryParams.append('index', index);
    cart.forEach(item => {
        queryParams.append('productId', item[0]);
        queryParams.append('quantity', item[1]);
    });

    return `${baseUrl}?${queryParams.toString()}`;
}

function setCartLink(url) {
    const cartLink = document.getElementById('cart');
    if (cartLink) {
        cartLink.href = url;
    } else {
        console.error('Le lien avec l\'ID "cart" n\'existe pas sur la page.');
    }
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

function createCartUrl(baseUrl, cart) {
    const queryParams = new URLSearchParams();
    cart.forEach(item => {
        queryParams.append('productId', item[0]);
        queryParams.append('quantity', item[1]);
    });
    return `${baseUrl}?${queryParams.toString()}`;
}
