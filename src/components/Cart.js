import React, { useState, useEffect } from 'react';

function Cart({ cart, setCart, toggleCart }) {
  // State to manage updated cart with quantity changes
  const [updatedCart, setUpdatedCart] = useState(cart);

  // Update the updatedCart state whenever the cart prop changes
  useEffect(() => {
    setUpdatedCart(cart);
  }, [cart]);

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    // Remove the item from updatedCart
    const updatedItems = updatedCart.filter(item => item.id !== productId);
    setUpdatedCart(updatedItems);
    // Also update the cart prop
    const updatedCartItems = cart.filter(item => item.id !== productId);
    setCart(updatedCartItems);
  };
  
  // Function to update the quantity of an item in the cart
  const updateQuantity = (productId, newQuantity) => {
    const updatedItems = updatedCart.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setUpdatedCart(updatedItems);
  };

  // Calculate subtotal for each item in the cart
  const calculateSubtotal = (item) => {
    return item.price * item.quantity;
  };

  // Calculate total price of all items in cart
  const calculateTotal = () => {
    let total = 0;
    updatedCart.forEach(item => {
      total += calculateSubtotal(item);
    });
    return total;
  };

  return (
    <div className="cart-content">
      {/* Cart header */}
      <div className="cart-header">
        <h2>Cart</h2>
        {/* Button to close the cart */}
        <button className="close-button" onClick={toggleCart}>X</button>
      </div>
      {/* Subtotal section */}
      <div className="subtotal">
        <h3>Subtotal</h3>
        {/* Display total price of all items in the cart */}
        <p>Total: ${calculateTotal()}</p>
      </div>
      {/* Product container */}
      <div className="product-container">
        {/* Map through updatedCart and render each product */}
        {updatedCart.map((item, index) => (
          <div key={index} className="product-item">
            {/* Product content */}
            <div className="product-content">
              {/* Product image */}
              <img src={item.images[0]} alt={item.title} className="product-image" />
              {/* Product description */}
              <div className="product-description">
                <p>{item.title}</p>
                <p>Price: ${item.price}</p>
                {/* Input field to update quantity */}
                <p>Quantity: <input type="number" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} /></p>
                {/* Button to remove the item from the cart */}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
