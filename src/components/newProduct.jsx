import React, { useState } from "react";

const NewProduct = () => {
  const [croppedImage, setCroppedImage] = useState(null);
  const [error, setError] = useState("");
  const [productDetails, setProductDetails] = useState([{ name: "", value: "" }]);

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
      const size = Math.min(img.width, img.height); // Ensure the crop is square
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        (img.width - size) / 2, // Center crop horizontally
        (img.height - size) / 2, // Center crop vertically
        size,
        size,
        0,
        0,
        size,
        size
      );

      const croppedDataUrl = canvas.toDataURL("image/jpeg");
      setCroppedImage(croppedDataUrl);
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
    console.log(productDetails);
    
  };

  const addDetail = () => {
    if (productDetails.length < 5) {
      setProductDetails([...productDetails, { name: "", value: "" }]);
    }
  };

  const removeDetail = (index) => {
    const updatedDetails = productDetails.filter((_, i) => i !== index);
    setProductDetails(updatedDetails);
  };

  return (
    <div className="main-container new-product-container">
      <div className="title-small">Naujas produktas</div>
      <div className="product-info-holder">
        <div className="product-info">
          <div className="order-input">
            <label htmlFor="orderID">Prekės ID</label>
            <input
              type="text"
              name="orderID"
              id="orderID"
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderLocation">Prekės vieta</label>
            <input
              type="text"
              name="orderLocation"
              id="orderLocation"
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderLocation">Matavimo vienetai</label>
            <input
              type="text"
              name="orderUnits"
              id="orderUnits"
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderLocation">Prekės Kaina</label>
            <input
              type="text"
              name="orderPrice"
              id="orderPrice"
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
          <div className="order-input">
            <label htmlFor="orderName">Prekės Įspėjimo riba</label>
            <input
              type="text"
              name="orderWarningLimit"
              id="orderWarningLimit"
              className="text-input"
            />
          </div>
          <div className="order-input">
            <label htmlFor="orderName">Prekės kiekis</label>
            <input
              type="text"
              name="orderAmmount"
              id="orderAmmount"
              className="text-input"
            />
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
      <button type="button" onClick={addDetail} className="save-button">
                Pridėti
              </button>
    </div>
  );
};

export default NewProduct;
