import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inventory.css';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore'; // Correct Firestore import

const db = getFirestore(); // Initialize Firestore instance

const Inventory = () => {
    const [ingredients, setIngredients] = useState([]);
    const [newImage, setNewImage] = useState(null);
    const [unitType, setUnitType] = useState('weight');
    const [selectedUnit, setSelectedUnit] = useState('g');
    const [publishDate, setPublishDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const navigate = useNavigate();

    // Fetch ingredients from Firestore
    const fetchIngredients = async () => {
        const ingredientsCollection = collection(db, 'ingredients');
        const ingredientSnapshot = await getDocs(ingredientsCollection);
        const ingredientList = ingredientSnapshot.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
        setIngredients(ingredientList);
    };

    useEffect(() => {
        fetchIngredients();
    }, []); // Fetch on mount

    // Timer that updates every minute to check expiry status
    const updateExpiryTimer = () => {
        setIngredients(prevIngredients => {
            return prevIngredients.map(ingredient => {
                const expiry = new Date(ingredient.expiryDate);
                const now = new Date();
                const timeDifference = expiry - now;
                const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                return {
                    ...ingredient,
                    daysLeft
                };
            });
        });
    };

    useEffect(() => {
        const interval = setInterval(updateExpiryTimer, 60000);
        return () => clearInterval(interval);
    }, []);

    // Add new ingredient to Firestore
    const handleAddIngredient = async (e) => {
        e.preventDefault();
        const newIngredient = {
            name: e.target.name.value,
            type: e.target.type.value,
            brand: e.target.brand.value,
            stock: parseInt(e.target.stock.value),
            unit: selectedUnit,
            image: newImage,
            publishDate: publishDate,
            expiryDate: expiryDate,
            daysLeft: calculateDaysLeft(expiryDate)
        };

        // Add new ingredient to Firestore
        try {
            await addDoc(collection(db, 'ingredients'), newIngredient);
            fetchIngredients(); // Refresh the ingredients list
        } catch (error) {
            console.error('Error adding ingredient: ', error);
        }

        // Reset form state
        setNewImage(null);
        setPublishDate('');
        setExpiryDate('');
    };

    // Calculate days left before expiry
    const calculateDaysLeft = (expiryDate) => {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const timeDifference = expiry - now;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result); // Set the base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    // Helper function to delete an ingredient from Firestore
    const handleDelete = async (id) => {
        try {
            const ingredientDoc = doc(db, 'ingredients', id);
            await deleteDoc(ingredientDoc);
            fetchIngredients(); // Refresh the ingredients list
        } catch (error) {
            console.error('Error deleting ingredient: ', error);
        }
    };

    // Handle stock change (increase or decrease)
    const handleStockChange = async (id, action) => {
        try {
            const ingredientDoc = doc(db, 'ingredients', id);
            const ingredientSnapshot = await getDoc(ingredientDoc);
            const ingredientData = ingredientSnapshot.data();

            if (ingredientData) {
                let updatedStock = ingredientData.stock;

                // Update the stock based on action ('add' or 'subtract')
                if (action === 'add') {
                    updatedStock += 1; // Increase stock
                } else if (action === 'subtract' && updatedStock > 0) {
                    updatedStock -= 1; // Decrease stock, ensuring it doesn't go below 0
                }

                // Update Firestore with the new stock value
                await updateDoc(ingredientDoc, { stock: updatedStock });
                fetchIngredients(); // Refresh the ingredients list after update
            }
        } catch (error) {
            console.error('Error updating stock: ', error);
        }
    };

    // Unit options for Weight and Volume
    const weightUnits = ['g', 'kg', 'oz', 'lb', 'mg'];
    const volumeUnits = ['mL', 'L', 'Cups', 'fl oz', 'tsp', 'tbsp', 'qt'];

    // Helper function to determine the background color based on days left
    const getDaysLeftBackground = (daysLeft) => {
        if (daysLeft <= 0) return 'expired'; // Red
        if (daysLeft <= 15) return 'warning'; // Orange
        return 'safe'; // Green
    };

    return (
        <div className="inventory-container">
            <h2 className="inventory-title">Inventory</h2>

            {/* Add Ingredient Form */}
            <form onSubmit={handleAddIngredient} className="add-ingredient">
                <input type="text" name="name" placeholder="Ingredient Name" required />
                <input type="text" name="type" placeholder="Ingredient Type" required />
                <input type="text" name="brand" placeholder="Brand" required />
                <input type="number" name="stock" placeholder="Stock Amount" required />

                {/* Unit Type Selector (Weight or Volume) */}
                <div>
                    <label>Unit Type: </label>
                    <select onChange={(e) => setUnitType(e.target.value)} value={unitType}>
                        <option value="weight">Weight-Based</option>
                        <option value="volume">Volume-Based</option>
                    </select>
                </div>

                {/* Unit Selector (Based on Weight or Volume) */}
                <div>
                    <label>Unit: </label>
                    <select onChange={(e) => setSelectedUnit(e.target.value)} value={selectedUnit}>
                        {(unitType === 'weight' ? weightUnits : volumeUnits).map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date of Publish */}
                <div>
                    <label>Date of Publish: </label>
                    <input
                        type="date"
                        name="publishDate"
                        value={publishDate}
                        onChange={(e) => setPublishDate(e.target.value)}
                        required
                    />
                </div>

                {/* Expiry Date */}
                <div>
                    <label>Expiry Date: </label>
                    <input
                        type="date"
                        name="expiryDate"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        required
                    />
                </div>

                {/* File Input for Image Upload */}
                <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
                <button type="submit">Add Ingredient</button>
            </form>

            {/* Back to Dashboard Button */}
            <div className="back-to-dashboard">
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>

            {/* Ingredient List */}
            <div className="ingredient-list">
                {ingredients.map(ingredient => (
                    <div key={ingredient.id} className="ingredient-item">
                        <div className="ingredient-details">
                            {/* Display the image if available */}
                            {ingredient.image && <img src={ingredient.image} alt={ingredient.name} className="ingredient-img" />}
                            <div>
                                <h3>{ingredient.name}</h3>
                                <p>Type: {ingredient.type}</p>
                                <p>Brand: {ingredient.brand}</p>
                                <p>Status: {ingredient.stock <= 10 ? 'Shortage' : 'Has Stock'}</p>
                                <p>Stock: {ingredient.stock} {ingredient.unit}</p>
                                <p>Publish Date: {ingredient.publishDate}</p>
                                <p>Expiry Date: {ingredient.expiryDate}</p>
                                <p className={`days-left ${getDaysLeftBackground(ingredient.daysLeft)}`}>
                                    Days Left: {ingredient.daysLeft} {ingredient.daysLeft <= 0 ? '(Expired)' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="ingredient-actions">
                            <button onClick={() => handleStockChange(ingredient.id, 'add')}>+</button>
                            <button onClick={() => handleStockChange(ingredient.id, 'subtract')}>-</button>
                            <button className="delete-btn" onClick={() => handleDelete(ingredient.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
