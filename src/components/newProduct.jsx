import React, { useState } from "react";
import { createProduct } from "../api/products/createProduct";

const NewProduct = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState("");
  const [productDetails, setProductDetails] = useState([{ name: "", value: "" }]);
  const [product, setProduct] = useState({
    location: "",
    name: "",
    photo: "",
    unit: "",
    price: 0,
    count: 0,
    alert_level: 0,
    more_info: [],
  });

  const handleProductChange = (field, value) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      [field]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Pasirinktas failas nėra paveikslėlis.");
        setCroppedImage(null);
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onload = () => {
        cropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        (img.width - size) / 2,
        (img.height - size) / 2,
        size,
        size,
        0,
        0,
        size,
        size
      );
      const croppedDataUrl = canvas.toDataURL("image/jpeg");
      setCroppedImage(croppedDataUrl);
      handleProductChange("photo", croppedDataUrl);
    };
    img.onerror = () => {
      setError("Nepavyko apdoroti paveikslėlio.");
    };
    img.src = imageSrc;
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...productDetails];
    updatedDetails[index][field] = value;
    setProductDetails(updatedDetails);
    handleProductChange(
      "more_info",
      updatedDetails.map((detail) => `${detail.name}:${detail.value}`)
    );
  };

  const addDetail = () => {
    if (productDetails.length < 5) {
      setProductDetails([...productDetails, { name: "", value: "" }]);
    }
  };

  const removeDetail = (index) => {
    const updatedDetails = productDetails.filter((_, i) => i !== index);
    setProductDetails(updatedDetails);
    handleProductChange(
      "more_info",
      updatedDetails.map((detail) => `${detail.name}:${detail.value}`)
    );
  };

  const submitProduct = async () => {
    const newProduct = { ...product, photo: croppedImage };
    try {
      await createProduct(newProduct);
      alert("Product successfully added!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="main-container new-product-container">
      <div className="title-small">Naujas produktas</div>
      <div className="product-info-holder">
        <div>
        <div className="product-info">
          <div className="order-input">
            <label htmlFor="orderLocation">Prekės vieta</label>
            <input
              type="text"
              name="orderLocation"
              id="orderLocation"
              onChange={(e) => handleProductChange("location", e.target.value)}
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderUnits">Matavimo vienetai</label>
            <input
              type="text"
              name="orderUnits"
              id="orderUnits"
              onChange={(e) => handleProductChange("unit", e.target.value)}
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderPrice">Prekės Kaina</label>
            <input
              type="number"
              name="orderPrice"
              id="orderPrice"
              onChange={(e) => handleProductChange("price", parseFloat(e.target.value))}
              className="text-input"
            />
          </div>
        </div>
        <div className="product-info">
          <div className="order-input">
            <label htmlFor="orderName">Prekės pavadinimas</label>
            <input
              type="text"
              name="orderName"
              id="orderName"
              onChange={(e) => handleProductChange("name", e.target.value)}
              className="text-input"
            />
          </div>
          
          <div className="order-input">
            <label htmlFor="orderWarningLimit">Prekės Įspėjimo riba</label>
            <input
              type="number"
              name="orderWarningLimit"
              onChange={(e) => handleProductChange("alert_level", parseInt(e.target.value, 10))}
              id="orderWarningLimit"
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderAmmount">Prekės kiekis</label>
            <input
              type="number"
              name="orderAmmount"
              id="orderAmmount"
              onChange={(e) => handleProductChange("count", parseInt(e.target.value, 10))}
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="productImage">Prekės nuotrauka</label>
            <input
              type="file"
              name="productImage"
              id="productImage"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
        <div className="product-info">
          {croppedImage && (
            <div className="image-preview-container">
              <div className="image-preview">
                <img
                  src={croppedImage}
                  alt="Prekės nuotrauka"
                  className="preview-img"
                />
              </div>
            </div>
          )}
        </div>
        </div>
        <div className="product-info">
          <div className="product-details">
            Prekės savybės
            {productDetails.map((detail, index) => (
              <div key={index} className="detail-row order-input">
                <input
                  type="text"
                  placeholder="Savybės pavadinimas"
                  value={detail.name}
                  onChange={(e) => handleDetailChange(index, "name", e.target.value)}
                  className="text-input"
                />
                <input
                  type="text"
                  placeholder="Savybės reikšmė"
                  value={detail.value}
                  onChange={(e) => handleDetailChange(index, "value", e.target.value)}
                  className="text-input"
                />
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="remove-button"
                >
                  Šalinti
                </button>
              </div>
            ))}
            {productDetails.length < 5 && (
              <button type="button" onClick={addDetail} className="add-button">
                Pridėti savybę
              </button>
            )}
          </div>
        </div>
      </div>
      <button type="button" onClick={submitProduct} className="save-button">
        Pridėti produktą
      </button>
    </div>
  );
};

export default NewProduct;
