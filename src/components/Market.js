import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Market.css';

const Market = () => {
  const [cart, setCart] = useState([]);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize the navigate function
  const navigate = useNavigate();

  const ingredientsData = {
    "Dry Ingredients": [
      { name: "Flour", price: 50, description: "All-purpose flour", sizes: ["500g", "1kg", "5kg"] },
      { name: "Sugar", price: 40, description: "White sugar", sizes: ["500g", "1kg"] },
      { name: "Brown Sugar", price: 60, description: "Brown sugar", sizes: ["500g", "1kg"] },
      { name: "Spices", price: 80, description: "Mixed spices", sizes: ["50g", "100g"] },
    ],
    "Wet Ingredients": [
      { name: "Water", price: 20, description: "Bottled water", sizes: ["500ml", "1L"] },
      { name: "Milk", price: 60, description: "Whole milk", sizes: ["500ml", "1L", "2L"] },
      { name: "Oil", price: 120, description: "Vegetable oil", sizes: ["500ml", "1L", "5L"] },
    ],
    "Proteins": [
      { name: "Meat", price: 200, description: "Beef meat", sizes: ["500g", "1kg"] },
      { name: "Eggs", price: 100, description: "Eggs (10 pcs)", sizes: ["10pcs", "20pcs"] },
      { name: "Beans", price: 70, description: "Kidney beans", sizes: ["500g", "1kg"] },
    ],
    "Fruits and Vegetables": [
      { name: "Fresh Fruits", price: 120, description: "Assorted fresh fruits", sizes: ["1kg", "2kg"] },
      { name: "Fresh Vegetables", price: 80, description: "Mixed fresh vegetables", sizes: ["500g", "1kg"] },
    ],
    "Dairy": [
      { name: "Cheese", price: 150, description: "Cheddar cheese", sizes: ["200g", "500g"] },
      { name: "Butter", price: 180, description: "Unsalted butter", sizes: ["200g", "500g"] },
      { name: "Yogurt", price: 120, description: "Greek yogurt", sizes: ["500g", "1kg"] },
    ]
  };

  const addToCart = (ingredient, size) => {
    setCart((prevCart) => [...prevCart, { ...ingredient, size }]);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item, index) => index !== id));
  };

  const toggleCartPopup = () => {
    setShowCartPopup(!showCartPopup);
  };

  const handleCheckout = () => {
    const order = {
      items: cart,
      total: cart.reduce((total, item) => total + item.price, 0),
      orderDate: new Date(),
      estimatedDelivery: new Date().setDate(new Date().getDate() + 5),
    };
    setOrderStatus('Your order has been placed. Estimated delivery: 5 days.');
    setCart([]); // Clear cart after checkout
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredIngredients = () => {
    if (!searchTerm) return [];
    return Object.values(ingredientsData).flat().filter(ingredient =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="market-container">
      <h2 className="market-title">Market</h2>

      {/* Go to Dashboard Button */}
      <button
        className="go-to-dashboard"
        onClick={() => navigate('/dashboard')} // Use navigate() instead of window.location.href
      >
        Go to Dashboard
      </button>

      <div className="market-content">
        {/* Left Panel: Categories */}
        <div className="categories">
          <input
            type="text"
            className="search-bar"
            placeholder="Search for ingredients..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <h3>Categories</h3>
          <div className="category-items">
            {Object.keys(ingredientsData).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="category-item"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Ingredient List */}
        <div className="ingredient-panel">
          {selectedCategory && (
            <div>
              <h3>{selectedCategory}</h3>
              <div className="ingredient-list">
                {ingredientsData[selectedCategory].map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <div className="ingredient-details">
                      <h4>{ingredient.name}</h4>
                      <p>{ingredient.description}</p>
                      <p>Price: ₱{ingredient.price}</p>
                      <select>
                        {ingredient.sizes.map((size, idx) => (
                          <option key={idx} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => addToCart(ingredient, ingredient.sizes[0])}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Displaying search results if no category is selected */}
          {!selectedCategory && (
            <div>
              <h3>Search Results</h3>
              <div className="ingredient-list">
                {filteredIngredients().map((ingredient, index) => (
                  <div key={index} className="ingredient-item">
                    <div className="ingredient-details">
                      <h4>{ingredient.name}</h4>
                      <p>{ingredient.description}</p>
                      <p>Price: ₱{ingredient.price}</p>
                      <button onClick={() => addToCart(ingredient, ingredient.sizes[0])}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cart Button */}
      <div className="cart-btn">
        <button onClick={toggleCartPopup}>View Cart ({cart.length})</button>
      </div>

      {/* Cart Popup */}
      {showCartPopup && (
        <div className="cart-popup">
          <div className="cart-popup-header">
            <h3>Your Cart</h3>
            <button onClick={toggleCartPopup}>Close</button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <p>
                    {item.name} ({item.size}) - ₱{item.price}
                  </p>
                  <button onClick={() => removeFromCart(index)}>Remove</button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <button onClick={handleCheckout}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      )}

      {/* Order Status */}
      {orderStatus && <div className="order-status">{orderStatus}</div>}
    </div>
  );
};

export default Market;
