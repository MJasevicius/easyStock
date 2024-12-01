import React, { useState } from 'react';
import Pie from "../components/pie";
import Important from "../components/important";
import Order from '../components/order';
import InventoryList from '../components/inventoryList';

const Home = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [refresher, setRefresher] = useState(0);

    const handleAddToOrder = (selectedProducts) => {
        setOrderProducts((prev) => {
            const productIds = new Set(prev.map((product) => product.id));
            const newProducts = selectedProducts.filter(
                (product) => !productIds.has(product.id)
            );
            return [...prev, ...newProducts];
        });
    };

    const refreshInventory = () => {
        setRefresher(refresher ? 0 : 1)
    };

    return (
        <>
            <div className="container">Pagrindinis</div>
            <div className="container">
                <div className="home-column">
                    <Pie />
                    <Important />
                </div>
                <div className="home-column middle-column">
                    <Order products={orderProducts} refreshInventory={refreshInventory} />
                </div>
                <div className="home-column inventory-list">
                    <InventoryList enableAddToOrder={true} onAddToOrder={handleAddToOrder} refresher={refresher}/>
                </div>
            </div>
        </>
    );
};

export default Home;
