document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const totalPrice = urlParams.get('totalPrice') || '0.00';

    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `${totalPrice} €`;

    const form = document.getElementById('checkout-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let connected;
        
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipCode = document.getElementById('zip-code').value;
        const country = document.getElementById('country').value;
        const cardName = document.getElementById('card-name').value;
        const cardNumber = document.getElementById('card-number').value;
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        
        if (validateForm(fullName, email, address, city, zipCode, country, cardName, cardNumber, expiryDate, cvv, connected)) {
            alert('Achat finalisé avec succès !');
            // Ajouter ici le code pour traiter le paiement et finaliser la commande
        } else {
            alert('Veuillez remplir tous les champs correctement.');
        }
    });
});

function validateForm(fullName, email, address, city, zipCode, country, cardName, cardNumber, expiryDate, cvv, connected) {
    // Exemple de validation simple, vous pouvez améliorer ceci selon vos besoins
    if (!fullName || !email || !address || !city || !zipCode || !country || !cardName || !cardNumber || !expiryDate || !cvv) {
        return false;
    }
    if (!validateEmail(email)) {
        return false;
    }
    if (!validateCardNumber(cardNumber)) {
        return false;
    }
    if (!validateExpiryDate(expiryDate)) {
        return false;
    }
    if (!validateCVV(cvv)) {
        return false;
    }
    if (!connected) {
        return false;
    }
    return true;
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

function validateCardNumber(cardNumber) {
    const re = /^[0-9]{16}$/;
    return re.test(String(cardNumber));
}

function validateExpiryDate(expiryDate) {
    const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    return re.test(String(expiryDate));
}

function validateCVV(cvv) {
    const re = /^[0-9]{3,4}$/;
    return re.test(String(cvv));
}
