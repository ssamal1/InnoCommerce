
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductList.css';
import previousArrow from './previous-arrow.png';
import nextArrow from './next-arrow.png';
import Cart from './Cart';
import cartIcon from './cart.png';

function ProductList() {
  //State Variables
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImages, setSelectedImages] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  // Fetches products from API
  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then(response => {
        setProducts(response.data.products || []);
        const initialSelectedImages = {};
        response.data.products.forEach(product => {
          initialSelectedImages[product.id] = 0;
        });
        setSelectedImages(initialSelectedImages);
      })
      .catch(error => {
        console.error('Error fetching products: ', error);
      });
  }, []);

  // Filtering based on search term
  const filteredProducts = products.filter(product =>
    (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Function that handles the image carousel
  const handleImageChange = (productId, direction) => {
    const productIndex = filteredProducts.findIndex(product => product.id === productId);
    const maxIndex = filteredProducts[productIndex].images.length - 1;
    let newIndex = selectedImages[productId] + direction;
    if (newIndex < 0) {
      newIndex = maxIndex;
    } else if (newIndex > maxIndex) {
      newIndex = 0;
    }
    setSelectedImages(prevState => ({
      ...prevState,
      [productId]: newIndex
    }));
  };

  // Function to add a project to the cart
  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      // If the product is not in the cart it adds it of quantity 1
      setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
    }
    // Show added to cart message and hide it after 3 seconds
    setShowAddedToCart(true); 
    setTimeout(() => setShowAddedToCart(false), 3000); 
  };

  // Function to toggle visibility of cart
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
    if (!isCartOpen) {
      document.body.classList.add('disable-scroll');
    } else {
      document.body.classList.remove('disable-scroll');
    }
  };


  return (
    <div className="product-list-container">
      <div className="header">
        <h1 className="title">InnoCommerce</h1>
        {/* Search bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search by name or category"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        {/* Cart button */}
        <button className="cart-button" onClick={toggleCart}>
          <img src={cartIcon} alt="Cart" style={{ width: '60px', height: '50px' }} />
        </button>
      </div>
      {/* Cart section */}
      <div className={`cart-container ${isCartOpen ? 'open' : ''}`}>
        {/* Render Cart component */}
        <Cart cart={cart} setCart={setCart} toggleCart={toggleCart} />
      </div>
      {/* Added to cart message */}
      <div className={`added-to-cart ${showAddedToCart ? 'show' : ''}`}>Added to cart</div>
      {/* Product container */}
      <div className="product-container">
        {/* Map through filtered products and render each product */}
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="product-item"
            onClick={() => addToCart(product)}
            onMouseEnter={() => setSelectedImages(prevState => ({
              ...prevState,
              [product.id]: 1
            }))}
            onMouseLeave={() => setSelectedImages(prevState => ({
              ...prevState,
              [product.id]: 0
            }))}
          >
            <div className="product-content">
              {/* Product image */}
              <img
                src={product.images[selectedImages[product.id]]}
                alt={product.name}
                className="product-image"
              />
              {/* Product description */}
              <div className="product-description" style={{ color: selectedImages[product.id] ? 'blue' : 'black' }}>
                <p>{product.brand}</p>
                <p>{product.title}</p>
                <p>{product.description}</p>
                <p><span className="discount-container">-{product.discountPercentage}%</span> ${product.price}</p>
                <p>Rating: {product.rating}   Stock: {product.stock}</p>
              </div>
            </div>
            {/* Image navigation */}
            <div className="image-navigation">
              {/* Previous image button */}
              <button className="arrow-button" onClick={(e) => { e.stopPropagation(); handleImageChange(product.id, -1) }}>
                <img src={previousArrow} alt="Previous" />
              </button>
              {/* Next image button */}
              <button className="arrow-button" onClick={(e) => { e.stopPropagation(); handleImageChange(product.id, 1) }}>
                <img src={nextArrow} alt="Next" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
