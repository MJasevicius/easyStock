import React from 'react';
import InventoryList from '../components/inventoryList';
import NewProduct from '../components/newProduct';

const Inventory = () => {
    return (
        <div>
            Inventorius
            <div className="home-column inventory-list">
                <InventoryList />
            </div>
        </div>
    );
}

export default Inventory;
