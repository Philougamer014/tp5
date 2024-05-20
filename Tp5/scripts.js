document.addEventListener('DOMContentLoaded', () => {
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
            displayProductCards(products);
            displayCarouselItems(products);
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
        window.location.href = "detail.html?index=" + randomIndex;
    };
}

function displayProductCards(products) {
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
        linkElement.href = "detail.html?index=" + index;
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
function displayCarouselItems(products) {
    const carouselIndicators = document.getElementById('carousel-indicators');
    const carouselInner = document.getElementById('carousel-inner');
    carouselIndicators.innerHTML = '';
    carouselInner.innerHTML = '';

    products.forEach((product, index) => {
        const indicator = document.createElement('li');
        indicator.setAttribute('data-target', '#carouselExampleIndicators');
        indicator.setAttribute('data-slide-to', index);
        if (index === 0) {
            indicator.classList.add('active');
        }
        carouselIndicators.appendChild(indicator);

        const item = document.createElement('div');
        item.classList.add('carousel-item');
        if (index === 0) {
            item.classList.add('active');
        }

        const imageLink = document.createElement('a');
        imageLink.href = "detail.html?index=" + index;

        const image = document.createElement('img');
        image.src = product.thumbnail;
        image.alt = product.title;
        image.style.width = '100%';  // Utiliser toute la largeur
        image.style.height = '500px'; // Hauteur fixe
        image.style.objectFit = 'cover'; // Assurer que l'image remplit l'espace sans se déformer

        imageLink.appendChild(image);

        item.appendChild(imageLink);

        const caption = document.createElement('div');
        caption.classList.add('carousel-caption');
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
