import React from 'react';
import InventoryList from '../components/inventoryList';
import NewProduct from '../components/newProduct';

const Inventory = () => {
    return (
        <>
        <div className="container">
        Inventorius
        </div>
        <div className='container'>
            <div className="home-column inventory-list">
                <InventoryList />
            </div>
            <div className="home-column ">
                <NewProduct />
            </div>
        </div>
        </>
    );
}

export default Inventory;
