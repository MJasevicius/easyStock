import React, { useState, useEffect } from 'react';

import buttonCross from "../assets/svg/button-cross.svg";
import buttonSuccess from "../assets/svg/button-success.svg";

const initialData = [
    {
        id: "00001",
        location: "A01",
        name: "Siūlai",
        photo: "ABC",
        moreInfo: {
            spalva: "raudona",
            atspalvis: "bordo",
            storis: "12",
            sudetis: "50% merinas, 50% vilna",
        },
        unit: "kg",
        price: "16",
        count: "7",
    },
];

const Order = () => {
    const [data, setData] = useState(initialData);
    const [subtotal, setSubtotal] =useState(0)
    const [discount, setDiscount] = useState(0)
    const [total, setTotal] = useState(0)

    const updateSubtotal = () => {
        const prices = document.getElementsByClassName("price");
        const counts = document.getElementsByClassName("count");
        let total = 0;
        
        Array.from(prices).forEach((element, index) => {
            const price = element.value ? element.value : element.placeholder;         
            const count = Array.from(counts)[index].value ? Array.from(counts)[index].value : Array.from(counts)[index].placeholder;
            total += price * count
        });
        setSubtotal(total)
    }

    const updateDiscount = () => {
        const discountElement = document.getElementById('applyDiscount');
        const discountValue = document.getElementById('discountValue');
    
        if (discountElement.checked) {
            discountValue.disabled = false;
            const discount = discountValue.value ? discountValue.value : 0; 
            setDiscount(discount); 
        } else {
            discountValue.disabled = true;
            setDiscount(0)
        }
    }

    const updateTotal = () => {
        setTotal(subtotal - discount)
    }

    // const addItem = () => {
    //     const newItem = {
    //         id: "00002", // Change ID to ensure uniqueness
    //         location: "B02",
    //         name: "Naujas Siūlai",
    //         photo: "ABC",
    //         moreInfo: {
    //             spalva: "mėlyna",
    //             atspalvis: "turkio",
    //             storis: "10",
    //             sudetis: "60% medvilnė, 40% poliesteris",
    //         },
    //         unit: "kg",
    //         price: "18",
    //         count: "5",
    //     };

    //     setData((prevData) => [...prevData, newItem]); // Update state
    // };

    useEffect(() => {
        updateSubtotal();
    }, [data]);

    useEffect(() => {
        updateDiscount();
    }, [])

    useEffect(() => {
        updateTotal();
    }, [discount, subtotal])

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
                    {data.map((item,index) =>{
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
                                {Object.keys(item.moreInfo).map((atribute,index) =>{
                                    return (
                                        <>
                                        {atribute}:{Object.values(item.moreInfo)[index]} <br />
                                        </>
                                    )
                                })}
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
                        <img src={buttonSuccess} alt="" className='img-preview hover-darken clickable'/>
                    </div>
                </div>
            </div>




        </div>
    );
}

export default Order;
