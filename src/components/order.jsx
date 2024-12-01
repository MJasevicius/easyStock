import React, { useState, useEffect } from 'react';
// import { addProductsToOrder, createOrder, updateProduct } from './api'; 
import { addProductsToOrder } from '../api/orders/addProductsToOrder';
import { createOrder } from '../api/orders/createOrder';
import {updateProduct} from '../api/products/updateProduct'
import buttonCross from "../assets/svg/button-cross.svg";
import buttonSuccess from "../assets/svg/button-success.svg";

const Order = ({ products }) => {
    const [subtotal, setSubtotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

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
            // Step 1: Create the order
            const orderResponse = await createOrder(orderData);
            const orderId = orderResponse.id;

            // Step 2: Prepare product data
            const orderProducts = products.map((product, index) => {
                const priceInput = document.getElementsByClassName('price')[index];
                const countInput = document.getElementsByClassName('count')[index];
                return {
                    id: product.id,
                    price: priceInput.value || priceInput.placeholder,
                    count: countInput.value || countInput.placeholder,
                };
            });

            // Step 3: Add products to the order
            console.log('Products:', JSON.stringify(orderProducts, null, 2));
            
            await addProductsToOrder(orderId, orderProducts);

            // Step 4: Update inventory (if applicable)
            if (!orderData.keep_in_inventory) {
                for (const product of orderProducts) {
                    const updatedCount = product.count - product.count; // Deduct the count
                    await updateProduct(product.id, { count: updatedCount });
                }
            }

            alert('Order successfully created!');
        } catch (error) {
            console.error('Error processing order:', error);
            alert('An error occurred while processing the order. Please try again.');
        }
    };

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
            Naujas užsakymas 
            <hr />
            <div className="order-header">
                <div className="home-column">
                    <div className="order-input">
                        <label htmlFor="orderId">Užsakymo ID</label>
                        <input type="text" name="orderId" id="orderId" className='text-input'/>
                    </div>

                    <div className="order-input">
                        <label htmlFor="orderDate">Data</label>
                        <input type="text" name="orderDate" id="orderDate" className='text-input'/>
                    </div>

                    <div className="order-input">
                        <label htmlFor="orderInfo">Papildoma informacija</label>
                        <input type="text" name="orderInfo" id="orderInfo" className='text-input'/>
                    </div>
                </div>
                <div className="home-column">
                    <div className="order-input">
                        <label htmlFor="orderCustomer">Klientas</label>
                        <input type="text" name="orderCustomer" id="orderCustomer" className='text-input'/>
                    </div>

                    <div className="order-input">
                        <label htmlFor="orderCustomerCode">Įmonės arba ind. veiklos kodas</label>
                        <input type="text" name="orderCustomerCode" id="orderCustomerCode" className='text-input'/>
                    </div>

                    <div className="order-input">
                        <label htmlFor="orderPvmCode">PVM mokėtojo kodas</label>
                        <input type="text" name="orderPvmCode" id="orderPvmCode" className='text-input'/>
                    </div>
                </div>
                <div className="home-column">
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
                <div className='remove hover-darken clickable'>
                    pašalinti
                </div>

                <table className='goods-list'>
                    <thead>
                        <tr className='table-row'>
                            <th><input type="checkbox" name="checkAll" id="checkAll" /></th>
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
                    {products.map((item,index) =>{
                        return (
                        <tr>
                            <td>
                                <input type="checkbox" name="checkAll" id="checkAll" />
                            </td>
                            <td>
                                {item.id}
                            </td>
                            <td>
                                {item.location}
                            </td>
                            <td>
                                {item.name}
                            </td>
                            <td>
                                <img src={item.photo} alt=""/>
                            </td>
                            <td>
                            {item.more_info && Object.keys(item.more_info).map((attribute, index) => (
                                <div key={index}>
                                    {attribute}: {item.more_info[attribute]} <br />
                                </div>
                            ))}

                            </td>
                            <td>
                                {item.unit}
                            </td>
                            <td>
                                <input type="text" name="" id="" key={index} className='list-input price' placeholder={item.price} onBlur={updateSubtotal}/>
                            </td>
                            <td>
                                <input type="text" name="" id="" key={index} className='list-input count' placeholder={item.count} onBlur={updateSubtotal}/>
                            </td>
                        </tr>
                        )
                    })}
                </table>
            </div>
            <hr />

            <div className="order-bottom">
                <div className="subtotal">
                    <div>Tarpinė kaina: {subtotal}</div>
                    <div>Nuolaida: {discount}</div>
                </div>
                <div className="total">
                    <div>Viso: {total}</div>
                    <div className='order-confirm'>
                        <img src={buttonCross} alt="" className='img-preview hover-darken clickable'/>
                        <img src={buttonSuccess} alt="" className='img-preview hover-darken clickable' onClick={handleSuccessClick}/>
                    </div>
                </div>
            </div>




        </div>
    );
}

export default Order;
