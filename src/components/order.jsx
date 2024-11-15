import React, { useState } from 'react';

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

    const addItem = () => {
        const newItem = {
            id: "00002", // Change ID to ensure uniqueness
            location: "B02",
            name: "Naujas Siūlai",
            photo: "ABC",
            moreInfo: {
                spalva: "mėlyna",
                atspalvis: "turkio",
                storis: "10",
                sudetis: "60% medvilnė, 40% poliesteris",
            },
            unit: "kg",
            price: "18",
            count: "5",
        };

        setData((prevData) => [...prevData, newItem]); // Update state
    };

    return (
        <div className='main-container order' onClick={addItem}>
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
                            <input type="checkbox" name="applyDiscount" id="applyDiscount" />
                            <label htmlFor="applyDiscount">Taikyti nuolaidą</label>
                        </div>
                            <input type="text" name="orderCustomerCode" id="orderCustomerCode" className='text-input'/>

                    </div>
                </div>
            </div>
            <hr />

            <div className="center">
                Užsakymo turinys
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
                            <input type="text" name="" id="" className='list-input' value={item.price}/>
                        </td>
                        <td>
                        <input type="text" name="" id="" className='list-input' value={item.count}/>
                        </td>
                    </tr>
                    )
                })}
            </table>




        </div>
    );
}

export default Order;
