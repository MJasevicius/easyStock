import React, { useState, useCallback } from 'react';
import Pie from "../components/pie";
import Important from "../components/important";
import Order from '../components/order';
import InventoryList from '../components/inventoryList';
import useWindowSize from '../hooks/useWindowSize';

const Home = () => {
    const [orderProducts, setOrderProducts] = useState([]);
    const [refresher, setRefresher] = useState(false);
    const { width } = useWindowSize();

    const handleAddToOrder = useCallback((selectedProducts) => {
        setOrderProducts((prev) => {
            const productIds = new Set(prev.map((product) => product.id));
            const newProducts = selectedProducts.filter(
                (product) => !productIds.has(product.id)
            );
            return [...prev, ...newProducts];
        });
    }, []);

    const clearOrderProducts = useCallback(() => {
        setOrderProducts([]);
    }, []);

    const removeProducts = useCallback((productsToRemove) => {
        setOrderProducts((prev) =>
            prev.filter(
                (orderProduct) =>
                    !productsToRemove.some((product) => product.id === orderProduct.id)
            )
        );
    }, []);

    const refreshInventory = useCallback(() => {
        setRefresher((prev) => !prev);
    }, []);

    return (
        <>
            <div className="container">Pagrindinis</div>
            <div className="container">
                {width >= 1485 && (
                    <div className="home-column">
                        <Pie />
                        <Important />
                    </div>
                )}
                <div className="home-column inventory-list">
                    <Order 
                        products={orderProducts} 
                        refreshInventory={refreshInventory} 
                        clearOrderProducts={clearOrderProducts}
                        removeProducts={removeProducts}/>
                </div>
                <div className="home-column inventory-list">
                    <InventoryList
                        enableAddToOrder={true}
                        onAddToOrder={handleAddToOrder}
                        refresher={refresher}
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
