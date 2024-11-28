import React, { useEffect, useState } from 'react';
import { fetchAllProducts } from '../api/products/fetchAllProducts';
import { updateProduct } from '../api/products/updateProduct';
import { deleteProduct } from '../api/products/deleteProduct';
import { searchProducts } from '../api/products/searchProducts';

import magnifyingGlass from "../assets/svg/magnifying-glass.svg";
import moreOptions from "../assets/svg/more-options.svg";

const InventoryList = () => {
    const [data, setData] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProducts, setEditedProducts] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const triggerSelectAll = () => {
        if (selectedProducts.length === data.length) {
            setSelectedProducts([]);
            if (isEditing) {
                setEditedProducts({});
            }
        } else {
            const allProductIds = data.map(item => item.id);
            setSelectedProducts(allProductIds);
            if (isEditing) {
                const initialEditedProducts = {};
                allProductIds.forEach(id => {
                    const product = data.find(item => item.id === id);
                    initialEditedProducts[id] = { ...product };
                });
                setEditedProducts(initialEditedProducts);
            }
        }
    };

    const handleCheckboxChange = (id) => {
        if (selectedProducts.includes(id)) {
            setSelectedProducts(selectedProducts.filter(productId => productId !== id));
            if (isEditing) {
                const updatedEditedProducts = { ...editedProducts };
                delete updatedEditedProducts[id];
                setEditedProducts(updatedEditedProducts);
            }
        } else {
            setSelectedProducts([...selectedProducts, id]);
            if (isEditing) {
                const product = data.find(item => item.id === id);
                setEditedProducts({
                    ...editedProducts,
                    [id]: { ...product }
                });
            }
        }
    };

    const handleEditButtonClick = () => {
        if (isEditing) {
            setIsEditing(false);
            setEditedProducts({});
        } else {
            if (selectedProducts.length === 0) {
                alert('Please select at least one product to edit.');
                return;
            }
            const initialEditedProducts = {};
            selectedProducts.forEach(id => {
                const product = data.find(item => item.id === id);
                initialEditedProducts[id] = { ...product };
            });
            setEditedProducts(initialEditedProducts);
            setIsEditing(true);
        }
    };

    const handleInputChange = (id, field, value) => {
        setEditedProducts({
            ...editedProducts,
            [id]: {
                ...editedProducts[id],
                [field]: value
            }
        });
    };

    const handleImageChange = (id, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setEditedProducts({
                ...editedProducts,
                [id]: {
                    ...editedProducts[id],
                    photo: reader.result
                }
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatePromises = Object.keys(editedProducts).map(async (id) => {
                const productData = editedProducts[id];
                const { location, name, photo, unit, price, count, alert_level } = productData;
                const updateData = {
                    location,
                    name,
                    photo,
                    unit,
                    price: price !== undefined ? Number(price) : undefined,
                    count: count !== undefined ? Number(count) : undefined,
                    alert_level: alert_level !== undefined ? Number(alert_level) : undefined,
                };
                await updateProduct(id, updateData);
            });
            await Promise.all(updatePromises);
            alert('Products updated successfully.');
            const updatedData = await fetchAllProducts();
            setData(updatedData);
            setIsEditing(false);
            setEditedProducts({});
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error updating products:', error.message);
            alert('Error updating products: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProducts = async () => {
        if (selectedProducts.length === 0) {
            alert('Please select at least one product to delete.');
            return;
        }
        if (!window.confirm('Are you sure you want to delete the selected products?')) {
            return;
        }
        try {
            const deletePromises = selectedProducts.map(async (id) => {
                await deleteProduct(id);
            });
            await Promise.all(deletePromises);
            alert('Products deleted successfully.');
            const updatedData = await fetchAllProducts();
            setData(updatedData);
            setSelectedProducts([]);
        } catch (error) {
            console.error('Error deleting products:', error.message);
            alert('Error deleting products: ' + error.message);
        }
    };

    const handleAddToOrder = () => {
        if (selectedProducts.length === 0) {
            alert('Please select at least one product to add to the order.');
            return;
        }
        // Implement functionality to add products to order
    };

    const handleSearch = async () => {
        try {
            if (searchQuery.trim() === '') {
                const allProducts = await fetchAllProducts();
                setData(allProducts);
            } else {
                const results = await searchProducts(searchQuery);
                setData(results);
            }
        } catch (error) {
            console.error('Error searching products:', error.message);
            alert('Error searching products: ' + error.message);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const allProducts = await fetchAllProducts();
                setData(allProducts);
            } catch (error) {
                console.error('Error fetching products:', error.message);
                alert('Error fetching products: ' + error.message);
            }
        };
        loadData();
    }, []);

    return (
        <div className='main-container inventory-inside'>
            <div className="inventory-top">
                <div className='title-small'>
                    Inventorius
                </div>

                <div className="search-bar">
                    <div className="search ">
                        <input
                            type="text"
                            placeholder="Paieška"
                            name="searchBar"
                            id="searchBar"
                            className='search-input'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                        <img
                            src={magnifyingGlass}
                            alt=""
                            className='magnifying-glass hover-darken clickable'
                            onClick={handleSearch}
                        />
                    </div>
                    {/* <div className="filters hover-darken clickable">
                        <div>
                            Filtrai
                        </div>
                        <img src={moreOptions} alt="" />
                    </div> */}
                </div>
                <div></div>
            </div>
            <div className="overflow-scroll">
                <table className="goods-list">
                    <colgroup>
                        <col style={{ width: '40px' }} />
                        <col style={{ width: '60px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '150px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '200px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '150px' }} />
                    </colgroup>
                    <thead>
                        <tr className='table-row'>
                            <th>
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    id="checkAll"
                                    onChange={triggerSelectAll}
                                    checked={selectedProducts.length === data.length && data.length > 0}
                                />
                            </th>
                            <th>ID</th>
                            <th>Vieta</th>
                            <th>Pavadinimas</th>
                            <th>Nuotrauka</th>
                            <th>Plati informacija</th>
                            <th>Mat. vnt.</th>
                            <th>Kaina</th>
                            <th>Kiekis</th>
                            <th>Įspėjimo riba</th>
                            <th>Pridėjimo data</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {data.map((item, index) => {
                            const isSelected = selectedProducts.includes(item.id);
                            const isEditable = isEditing && isSelected;
                            return (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(item.id)}
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="text"
                                                value={editedProducts[item.id]?.location || ''}
                                                onChange={(e) => handleInputChange(item.id, 'location', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.location
                                        )}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="text"
                                                value={editedProducts[item.id]?.name || ''}
                                                onChange={(e) => handleInputChange(item.id, 'name', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.name
                                        )}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(item.id, e.target.files[0])}
                                                />
                                                {editedProducts[item.id]?.photo && (
                                                    <img
                                                        src={editedProducts[item.id].photo}
                                                        alt=""
                                                        style={{ maxWidth: '100%', height: 'auto' }}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            item.photo && (
                                                <img
                                                    src={item.photo}
                                                    alt=""
                                                    style={{ maxWidth: '100%', height: 'auto' }}
                                                />
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {Object.keys(item.more_info).map((attribute, idx) => (
                                            <div className='more-info' key={idx}>
                                                {item.more_info[attribute]}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="text"
                                                value={editedProducts[item.id]?.unit || ''}
                                                onChange={(e) => handleInputChange(item.id, 'unit', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.unit
                                        )}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="number"
                                                value={editedProducts[item.id]?.price || ''}
                                                onChange={(e) => handleInputChange(item.id, 'price', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.price
                                        )}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="number"
                                                value={editedProducts[item.id]?.count || ''}
                                                onChange={(e) => handleInputChange(item.id, 'count', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.count
                                        )}
                                    </td>
                                    <td>
                                        {isEditable ? (
                                            <input
                                                type="number"
                                                value={editedProducts[item.id]?.alert_level || ''}
                                                onChange={(e) => handleInputChange(item.id, 'alert_level', e.target.value)}
                                                className="editable-input"
                                            />
                                        ) : (
                                            item.alert_level
                                        )}
                                    </td>
                                    <td>{item.created_at}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="inventory-bottom">
                <div
                    className={`option-button hover-darken clickable ${
                        selectedProducts.length === 0 || isEditing ? 'disabled' : ''
                    }`}
                    onClick={!isEditing && selectedProducts.length > 0 ? handleAddToOrder : null}
                >
                    Pridėti į užsakymą
                </div>
                <div
                    className={`option-button hover-darken clickable ${
                        selectedProducts.length === 0 ? 'disabled' : ''
                    }`}
                    onClick={handleEditButtonClick}
                >
                    Redaguoti
                </div>
                <div
                    className={`option-button hover-darken clickable ${
                        selectedProducts.length === 0 || isEditing ? 'disabled' : ''
                    }`}
                    onClick={!isEditing && selectedProducts.length > 0 ? handleDeleteProducts : null}
                >
                    Pašalinti
                </div>
            </div>
            {isEditing && (
                <div className="save-container">
                    <button
                        className="save-button"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default InventoryList;
