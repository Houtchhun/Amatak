
// Helper to get current user's email
function getCurrentUserEmail() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("loginEmail") || null;
}

// Get cart items for the current user from localStorage
export function getCart() {
    if (typeof window === "undefined") return [];
    const email = getCurrentUserEmail();
    if (!email) return [];
    try {
        const cartData = localStorage.getItem(`cart_${email}`);
        if (!cartData) return [];
        const cart = JSON.parse(cartData);
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Error reading cart from localStorage:", error);
        return [];
    }
}

// Save cart items for the current user to localStorage
function saveCart(cart) {
    if (typeof window === "undefined") return;
    const email = getCurrentUserEmail();
    if (!email) return;
    try {
        localStorage.setItem(`cart_${email}`, JSON.stringify(cart));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        throw new Error("Failed to save cart");
    }
}

// Check if the user is authenticated
function isAuthenticated() {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isAuthenticated") === "true";
}

// Validate cart item
function validateCartItem(item) {
    if (!item || typeof item !== 'object') {
        throw new Error("Invalid item: must be an object");
    }
    if (!item.id) {
        throw new Error("Invalid item: missing id");
    }
    if (!item.name) {
        throw new Error("Invalid item: missing name");
    }
    if (typeof item.price !== 'number' || item.price < 0) {
        throw new Error("Invalid item: price must be a positive number");
    }
    return true;
}

// Add an item to the cart (merge by id, color, size)
export function addToCart(item) {
    try {
        if (!isAuthenticated()) {
            throw new Error("Please sign in or sign up before adding to cart.");
        }

        validateCartItem(item);

        const cart = getCart();
        const existingItemIndex = cart.findIndex(
            cartItem => cartItem.id === item.id &&
                       cartItem.color === item.color &&
                       cartItem.size === item.size
        );

        const quantity = Math.max(1, parseInt(item.quantity) || 1);
        
        if (existingItemIndex > -1) {
            // Update existing item quantity
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            const newItem = {
                id: item.id,
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                image: item.image || "/placeholder.svg",
                color: item.color || "default",
                size: item.size || "default",
                quantity: quantity,
                category: item.category || "",
                inStock: item.inStock !== false,
                addedAt: new Date().toISOString()
            };
            cart.push(newItem);
        }

        saveCart(cart);
        return { success: true, cart };
    } catch (error) {
        console.error("Error adding item to cart:", error);
        throw error;
    }
}

// Remove an item from the cart
export function removeFromCart(id, color = "default", size = "default") {
    try {
        const cart = getCart();
        const updatedCart = cart.filter(
            item => !(item.id === id && item.color === color && item.size === size)
        );
        saveCart(updatedCart);
        return { success: true, cart: updatedCart };
    } catch (error) {
        console.error("Error removing item from cart:", error);
        throw error;
    }
}

// Update item quantity in cart
export function updateCartItemQuantity(id, color, size, newQuantity) {
    try {
        const quantity = Math.max(1, parseInt(newQuantity) || 1);
        const cart = getCart();
        const itemIndex = cart.findIndex(
            item => item.id === id && item.color === color && item.size === size
        );
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity = quantity;
            saveCart(cart);
            return { success: true, cart };
        } else {
            throw new Error("Item not found in cart");
        }
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        throw error;
    }
}

// Get cart summary
export function getCartSummary() {
    const cart = getCart();
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const savings = cart.reduce((total, item) => {
        if (item.originalPrice && item.originalPrice > item.price) {
            return total + ((item.originalPrice - item.price) * item.quantity);
        }
        return total;
    }, 0);
    
    return {
        itemCount,
        subtotal,
        savings,
        isEmpty: cart.length === 0
    };
}

// Clear the cart for the current user
export function clearCart() {
    try {
        if (typeof window !== "undefined") {
            const email = getCurrentUserEmail();
            if (email) {
                localStorage.removeItem(`cart_${email}`);
                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
            }
        }
        return { success: true };
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}
