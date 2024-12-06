import React, { useState, useEffect } from 'react';
import { addProductsToOrder } from '../api/orders/addProductsToOrder';
import { createOrder } from '../api/orders/createOrder';
import { updateProduct } from '../api/products/updateProduct';
import buttonCross from "../assets/svg/button-cross.svg";
import buttonSuccess from "../assets/svg/button-success.svg";

const Order = ({ products, refreshInventory, clearOrderProducts, removeProducts }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const toggleProductSelection = (productId) => {
        setSelectedProducts((prevSelected) => {
            const newSelected = prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId];
            return newSelected;
        });
    };

    const updateSubtotal = () => {
        const prices = document.getElementsByClassName("price");
        const counts = document.getElementsByClassName("count");
        let total = 0;
        Array.from(prices).forEach((element, index) => {
            const price = element.value ? element.value : element.placeholder;
            const count = Array.from(counts)[index].value ? Array.from(counts)[index].value : Array.from(counts)[index].placeholder;
            total += price * count;
        });
        setSubtotal(total);
    };

    const updateDiscount = () => {
        const discountElement = document.getElementById('applyDiscount');
        const discountValue = document.getElementById('discountValue');
        if (discountElement.checked) {
            discountValue.disabled = false;
            const discount = discountValue.value ? discountValue.value : 0;
            setDiscount(discount);
        } else {
            discountValue.disabled = true;
            setDiscount(0);
        }
    };

    const updateTotal = () => {
        setTotal(subtotal - discount);
    };

    const handleSuccessClick = async () => {
        const orderData = {
            comment: document.getElementById('orderInfo').value,
            client: document.getElementById('orderCustomer').value,
            client_code: document.getElementById('orderCustomerCode').value,
            client_pvm_code: document.getElementById('orderPvmCode').value,
            keep_in_inventory: document.getElementById('keepInventory').checked,
            discount: discount,
        };
        try {
            const orderResponse = await createOrder(orderData);
            const orderId = orderResponse.id;
            const orderProducts = products.map((product, index) => {
                const priceInput = document.getElementsByClassName('price')[index];
                const countInput = document.getElementsByClassName('count')[index];
                return {
                    id: product.id,
                    price: priceInput.value || priceInput.placeholder,
                    count: countInput.value || countInput.placeholder,
                };
            });
            await addProductsToOrder(orderId, orderProducts);
            if (!orderData.keep_in_inventory) {
                for (const product of orderProducts) {
                    const productCount = parseInt(product.count);
                    const existingCount = parseInt(products.find((p) => p.id === product.id).count);
                    if (productCount > existingCount) {
                        alert(`Insufficient inventory for product ID ${product.id}.`);
                        throw new Error(`Insufficient inventory for product ID ${product.id}.`);
                    }
                    const updatedCount = existingCount - productCount;
                    await updateProduct(product.id, { count: updatedCount });
                }
            }
            alert('Order successfully created!');
            clearOrderProducts();
            refreshInventory();
        } catch (error) {
            console.error('Error processing order:', error);
            alert(error.message || 'An error occurred while processing the order. Please try again.');
        }
    };

    const toggleAllSelections = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map((product) => product.id));
        }
    };

    const removeAll = () => removeProducts(products);

    useEffect(() => {
        updateSubtotal();
    }, [products]);

    useEffect(() => {
        updateDiscount();
    }, []);

    useEffect(() => {
        updateTotal();
    }, [discount, subtotal]);

    return (
        <div className='main-container order'>
            <div>
                Naujas užsakymas 
                <hr />
                <div className="order-header">
                    <div className="column-regular">
                        <div className="order-input">
                            <label htmlFor="orderInfo">Papildoma informacija</label>
                            <input type="text" name="orderInfo" id="orderInfo" className='text-input'/>
                        </div>
                        <div className="order-input">
                            <label htmlFor="orderPvmCode">PVM mokėtojo kodas</label>
                            <input type="text" name="orderPvmCode" id="orderPvmCode" className='text-input'/>
                        </div>
                    </div>
                    <div className="column-regular">
                        <div className="order-input">
                            <label htmlFor="orderCustomer">Klientas</label>
                            <input type="text" name="orderCustomer" id="orderCustomer" className='text-input'/>
                        </div>
                        <div className="order-input">
                            <label htmlFor="orderCustomerCode">Įmonės arba ind. veiklos kodas</label>
                            <input type="text" name="orderCustomerCode" id="orderCustomerCode" className='text-input'/>
                        </div>
                    </div>
                    <div className="column-regular">
                        <div className="order-checkbox order-padding">
                            <input type="checkbox" name="keepInventory" id="keepInventory" />
                            <label htmlFor="keepInventory">Neišimti iš inventoriaus</label>
                        </div>
                        <div className="order-input">
                            <div className="order-checkbox">
                                <input type="checkbox" name="applyDiscount" id="applyDiscount" onChange={updateDiscount}/>
                                <label htmlFor="applyDiscount">Taikyti nuolaidą</label>
                            </div>
                            <input type="text" name="discountValue" id="discountValue" className='text-input' onBlur={updateDiscount}/>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="center">
                    Užsakymo turinys
                </div>
                <div className="order-list">
                    <div className='remove hover-darken clickable' onClick={() => {
                        const productsToRemove = products.filter((product) =>
                            selectedProducts.includes(product.id)
                        );
                        removeProducts(productsToRemove);
                        setSelectedProducts([]);
                    }}>
                        pašalinti
                    </div>
                    <table className='goods-list'>
                        <thead>
                            <tr className='table-row'>
                                <th>
                                    <input
                                        type="checkbox"
                                        name="checkAll"
                                        id="checkAll"
                                        onChange={toggleAllSelections}
                                        checked={selectedProducts.length === products.length}
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
                            </tr>
                        </thead>
                        {products.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            onChange={() => toggleProductSelection(item.id)}
                                            checked={selectedProducts.includes(item.id)}
                                        />
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.location}</td>
                                    <td>{item.name}</td>
                                    <td><img src={item.photo} alt=""/></td>
                                    <td>
                                        {item.more_info && Object.keys(item.more_info).map((attribute, index) => (
                                            <div key={index}>
                                                {item.more_info[attribute]} <br />
                                            </div>
                                        ))}
                                    </td>
                                    <td>{item.unit}</td>
                                    <td>
                                        <input type="text" className='list-input price' placeholder={item.price} onBlur={updateSubtotal}/>
                                    </td>
                                    <td>
                                        <input type="text" className='list-input count' placeholder={item.count} onBlur={updateSubtotal}/>
                                    </td>
                                </tr>
                            );
                        })}
                    </table>
                </div>
            </div>
            <div>
                <hr />
                <div className="order-bottom">
                    <div className="subtotal">
                        <div>Tarpinė kaina: {subtotal}</div>
                        <div>Nuolaida: {discount}</div>
                    </div>
                    <div className="total">
                        <div>Viso: {total}</div>
                        <div className='order-confirm'>
                            <img src={buttonCross} alt="" className='img-preview hover-darken clickable' onClick={removeAll}/>
                            <img src={buttonSuccess} alt="" className='img-preview hover-darken clickable' onClick={handleSuccessClick}/>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Order;
