const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const testEndpoints = async () => {
    try {
        console.log("=== Testing Products ===");

        // 1. Create multiple products
        console.log("Creating products...");
        const productData = [
            { location: "Warehouse A", name: "Widget", photo: "widget.jpg", unit: "pcs", price: 10.5, count: 100, alert_level: 10, more_info: ["Info1", "Info2", "Info3", "Info4", "Info5"] },
            { location: "Warehouse B", name: "Gadget", photo: "gadget.jpg", unit: "pcs", price: 20.5, count: 200, alert_level: 20, more_info: ["Info1", "Info2", "Info3", "Info4", "Info5"] },
            { location: "Warehouse C", name: "Device", photo: "device.jpg", unit: "pcs", price: 30.5, count: 300, alert_level: 30, more_info: ["Info1", "Info2", "Info3", "Info4", "Info5"] }
        ];

        const productIds = [];
        for (const product of productData) {
            const productResponse = await axios.post(`${BASE_URL}/products`, product);
            productIds.push(productResponse.data.id);
            console.log(`Product created with ID: ${productResponse.data.id}`);
        }

        // 2. Retrieve All Products
        console.log("Fetching all products...");
        const products = await axios.get(`${BASE_URL}/products`);
        console.log("Products:", products.data);

        // 3. Retrieve Product by ID
        console.log("Fetching product by ID...");
        const singleProduct = await axios.get(`${BASE_URL}/products/${productIds[0]}`);
        console.log("Product Details:", singleProduct.data);

        // 4. Update Product
        console.log("Updating product...");
        await axios.put(`${BASE_URL}/products/${productIds[0]}`, {
            location: "Warehouse B",
            name: "Updated Widget",
            photo: "updated_widget.jpg",
            unit: "box",
            price: 12.5,
            count: 80,
            alert_level: 15
        });
        console.log("Product updated successfully.");

        // 5. Add More Info to Product
        console.log("Adding more info to product...");
        await axios.post(`${BASE_URL}/products/${productIds[0]}/more-info`, {
            info1: "Extra Info1",
            info2: "Extra Info2",
            info3: "Extra Info3",
            info4: "Extra Info4",
            info5: "Extra Info5"
        });
        console.log("More info added successfully.");

        // 6. Delete Product (Commented out)
        // console.log("Deleting product...");
        // await axios.delete(`${BASE_URL}/products/${productIds[0]}`);
        // console.log("Product deleted successfully.");

        console.log("=== Testing Orders ===");

        // 1. Create an Order
        console.log("Creating an order...");
        const orderResponse = await axios.post(`${BASE_URL}/orders`, {
            date: "2024-11-23",
            comment: "Urgent order",
            client: "John Doe",
            client_code: "JD001",
            client_pvm_code: "PVM001",
            keep_in_inventory: true,
            discount: 10
        });
        const orderId = orderResponse.data.id;
        console.log("Order created with ID:", orderId);

        // 2. Retrieve All Orders
        console.log("Fetching all orders...");
        const orders = await axios.get(`${BASE_URL}/orders`);
        console.log("Orders:", orders.data);

        // 3. Add multiple items to order
        console.log("Adding items to order...");
        for (let i = 0; i < productIds.length; i++) {
            await axios.post(`${BASE_URL}/orders/${orderId}/items`, {
                item_id: productIds[i],
                price: productData[i].price,
                count: 2  // You can change the count as needed
            });
            console.log(`Item ${productIds[i]} added to order.`);
        }

        // 4. Retrieve Items for an Order
        console.log("Fetching items for order...");
        const orderItems = await axios.get(`${BASE_URL}/orders/${orderId}/items`);
        console.log("Order Items:", orderItems.data);

        // 5. Retrieve All Orders with Items
        console.log("Fetching all orders with associated items...");
        const ordersInfo = await axios.get(`${BASE_URL}/orders/info`);
        console.log("Orders with Items:", JSON.stringify(ordersInfo.data, null, 2));

        console.log("All tests completed successfully!");
    } catch (error) {
        console.error("Error during tests:", error.response ? error.response.data : error.message);
    }
};

testEndpoints();
