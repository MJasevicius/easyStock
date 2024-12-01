import React, { useState } from 'react';
import Pie from "../components/pie";
import Important from "../components/important";
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Home = () => {
    const [orderProducts, setOrderProducts] = useState([]);

    const handleAddToOrder = (selectedProducts) => {
        setOrderProducts((prev) => {
            const productIds = new Set(prev.map((product) => product.id));
            const newProducts = selectedProducts.filter(
                (product) => !productIds.has(product.id)
            );
            return [...prev, ...newProducts];
        });
    };

    return (
        <>
            <div className="container">
                Pagrindinis
            </div>
            <div className='container'>
                <div className="home-column">
                    <Pie />
                    <Important />
                </div>
                <div className="home-column middle-column">
                    <Order products={orderProducts} />
                </div>
                <div className="home-column inventory-list">
                    <InventoryList enableAddToOrder={true} onAddToOrder={handleAddToOrder} />
                </div>
            </div>
        </>
    );
};

export default Home;
