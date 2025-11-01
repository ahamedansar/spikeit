// Function to load data from Local Storage
const loadData = (key) => {
    try {
        const serializedData = localStorage.getItem(key);
        return serializedData ? JSON.parse(serializedData) : [];
    } catch (e) {
        console.error("Error loading data from localStorage:", e);
        return [];
    }
};

// Function to save data to Local Storage
const saveData = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
    }
};

let cart = loadData('cart');
let wishlist = loadData('wishlist');

// Utility to format price
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
};

// ===============================================
// CART FUNCTIONALITY
// ===============================================

const updateCartUI = () => {
    const cartCountElement = document.getElementById('cart-count');
    const container = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    const emptyMessage = document.getElementById('empty-cart-message');

    let totalItems = 0;
    let totalPrice = 0;

    // 1. Update Count Badge
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
    });

    if (totalItems > 0) {
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = 'block';
        emptyMessage.style.display = 'none';
    } else {
        cartCountElement.style.display = 'none';
        emptyMessage.style.display = 'block';
    }

    // 2. Update Total Price
    totalPriceElement.textContent = formatPrice(totalPrice);

    // 3. Render Items in Offcanvas
    container.innerHTML = '';
    if (cart.length > 0) {
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex align-items-center border-bottom py-2 cart-item';
            itemElement.dataset.id = item.id;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain;" class="rounded me-3 p-1 border">
                <div class="flex-grow-1">
                    <h6 class="mb-0 fs-6">${item.name}</h6>
                    <small class="text-muted">₹ ${formatPrice(item.price)} x ${item.quantity}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger remove-item-btn" data-id="${item.id}">X</button>
            `;
            container.appendChild(itemElement);
        });
    }
    
    saveData('cart', cart);
};

const addToCart = (productData) => {
    const existingItem = cart.find(item => item.id === productData.id);

    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item exists
    } else {
        cart.push({ ...productData, quantity: 1 }); // Add new item
    }

    updateCartUI();
    // Optional: Show a toast/alert that item was added
};

const removeFromCart = (itemId) => {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
};

// Event Delegation for Remove buttons (inside the offcanvas)
document.getElementById('cartOffcanvas').addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-item-btn')) {
        const itemId = e.target.dataset.id;
        removeFromCart(itemId);
    }
});

// ===============================================
// WISHLIST FUNCTIONALITY
// ===============================================

const updateWishlistUI = () => {
    const wishlistCountElement = document.getElementById('wishlist-count');
    
    // 1. Update Count Badge
    const count = wishlist.length;
    if (count > 0) {
        wishlistCountElement.textContent = count;
        wishlistCountElement.style.display = 'block';
    } else {
        wishlistCountElement.style.display = 'none';
    }
    
    // 2. Update Icons
    document.querySelectorAll('.wishlist-icon').forEach(button => {
        const container = button.closest('.product-item-container');
        if (!container) return;
        
        const id = container.dataset.id;
        const icon = button.querySelector('i');
        
        if (wishlist.some(item => item.id === id)) {
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill'); // Use a filled heart for wishlisted items
        } else {
            icon.classList.remove('bi-heart-fill');
            icon.classList.add('bi-heart');
        }
    });

    saveData('wishlist', wishlist);
};

const toggleWishlist = (productData, button) => {
    const index = wishlist.findIndex(item => item.id === productData.id);
    
    if (index > -1) {
        wishlist.splice(index, 1); // Remove from wishlist
    } else {
        wishlist.push(productData); // Add to wishlist
    }

    updateWishlistUI();
};

// ===============================================
// INITIALIZATION AND EVENT LISTENERS
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial UI render
    updateCartUI();
    updateWishlistUI();
    
    // Event listener for all "Add to cart" buttons
    document.querySelectorAll('.add-to-cart-overlay button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Get data from the closest product container
            const container = e.target.closest('.product-item-container');
            if (!container) return;

            const productData = {
                id: container.dataset.id,
                name: container.dataset.name,
                image: container.dataset.image,
                price: parseFloat(container.querySelector('.product-price').dataset.price)
            };
            addToCart(productData);
        });
    });

    // Event listener for all wishlist icons
    document.querySelectorAll('.wishlist-icon').forEach(button => {
        button.addEventListener('click', (e) => {
            // Stop the click from propagating to the overlay or card if needed
            e.stopPropagation(); 
            
            const container = e.target.closest('.product-item-container');
            if (!container) return;
            
            const productData = {
                id: container.dataset.id,
                name: container.dataset.name,
                image: container.dataset.image,
                price: parseFloat(container.querySelector('.product-price').dataset.price)
            };
            toggleWishlist(productData, button);
        });
    });
});