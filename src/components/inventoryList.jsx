import React from 'react';

import magnifyingGlass from "../assets/svg/magnifying-glass.svg";
import moreOptions from "../assets/svg/more-options.svg"

const InventoryList = () => {

    let data = [
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
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
            alert: "10"
        },
    ];

    return (
        <div className='main-container inventory-inside'>
            <div className="inventory-top">
                    <div className='title-small'>
                        Inventorius
                    </div>

                    <div className="search-bar">
                        <div className="search ">
                            <input type="text" placeholder="Paieška" name="searchBar" id="searchBar" className='search-input' />
                            <img src={magnifyingGlass} alt=""  className='magnifying-glass hover-darken clickable'/>
                        </div>
                        <div className="filters hover-darken clickable">
                            <div>
                                Filtrai
                            </div>
                            <img src={moreOptions} alt="" />
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            <div className="overflow-scroll">
                <table className="goods-list">
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
                            <th>Įspėjimo riba</th>
                        </tr>
                    </thead>
                    <tbody className=''>
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
                                    {item.price}
                                </td>
                                <td>
                                    {item.count}
                                </td>
                                <td>
                                    {item.alert}
                                </td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className="inventory-bottom">
                <div className="option-button hover-darken clickable">
                    Pridėti į užsakymą
                </div>
                <div className="option-button hover-darken clickable">
                    Redaguoti
                </div>
                <div className="option-button hover-darken clickable">
                    Pašalinti
                </div>
                <div className="option-button hover-darken clickable">
                Suderinti įspėjimo ribą
                </div>
                  
            </div>
        </div>
    );
}

export default InventoryList;
