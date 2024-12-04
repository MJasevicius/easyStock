const express = require('express');
const app = express();
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');
const db = require('./db/database');
const PORT = 3000;

app.use(cors({
    origin: 'http://localhost:1420',
}));
app.use(express.json({
    limit: "500mb"
}));

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
