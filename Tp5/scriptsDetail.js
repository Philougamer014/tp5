document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('index')) {
        const index = parseInt(urlParams.get('index'));
        if (!isNaN(index)) {
            if (index > 49) {  // Supposant que le nombre maximum de produits est de 50
                window.location.href = '404.html'; // Redirige vers la page 404
            } else {
                displayProductWithIndex(index);
            }
        } else {
            console.error('Invalid index parameter');
        }
    } else {
        console.error('Index parameter not found in URL');
    }
});

function displayProductWithIndex(index) {
    fetch('https://dummyjson.com/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const dataProducts = data.products;
            if (index >= 0 && index < dataProducts.length) {
                const product = dataProducts[index];

                document.getElementById("product-image").src = product.thumbnail;
                document.getElementById("product-title").innerText = product.title;

                const priceElement = document.getElementById("price");
                priceElement.innerText = `$${product.price}`;
                priceElement.classList.add('price');

                document.getElementById("description").innerText = product.description;

                // Affichage des informations supplémentaires
                document.getElementById("category").innerText = product.category;
                document.getElementById("stock").innerText = `In stock: ${product.stock}`;
                document.getElementById("brand").innerText = product.brand;
                document.getElementById("rating").innerText = `Rating: ${product.rating}`;

                // Si vous voulez afficher les images supplémentaires dans une liste ou un carrousel
                const imageList = document.getElementById("additional-images");
                imageList.innerHTML = "";
                product.images.forEach(function (image, index) {
                    const img = document.createElement("img");
                    img.src = image;
                    img.alt = `Image ${index + 1}`;
                    img.style.width = "100px";  // Taille ajustable selon le besoin
                    img.classList.add('m-1');  // Ajout d'une petite marge
                    imageList.appendChild(img);
                });
            } else {
                console.error('Invalid index');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
