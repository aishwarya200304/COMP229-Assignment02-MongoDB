const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const mongoURI = 'mongodb+srv://aishwaryapawar04:aishwarya04@marketplace.kubrgcd.mongodb.net/Marketplace'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');


  const productsData = [
    {
      name: "Men's Watch",
      description: 'Stylish and durable wristwatch',
      price: 79.99,
      quantity: 10,
      category: 'Men',
    },
    {
      name: "Women's Ring",
      description: 'Diamond ring',
      price: 99.99,
      quantity: 5,
      category: 'Women',
    },
    {
      name: 'Video Game',
      description: 'Entertaining video game for teens',
      price: 49.99,
      quantity: 20,
      category: 'Teens',
    },
  ];


  try {
    await Product.deleteMany({}); 
    await Product.insertMany(productsData);
    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('An error occurred while adding products:', error);
  }
});


const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  category: String,
}));


const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;
    const product = new Product({ name, description, price, quantity, category });
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the product.' });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching products.' });
  }
};

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, quantity, category } = req.body;
    const product = await Product.findByIdAndUpdate(productId, { name, description, price, quantity, category }, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while updating the product.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting the product.' });
  }
};

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({}); 
    res.json({ message: "All  products deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while deleting all products.' });
  }
};



app.post('/api/products', createProduct);
app.get('/api/products', getProducts);
app.get('/api/products/:id', getProduct);
app.put('/api/products/:id', updateProduct);
app.delete('/api/products/:id', deleteProduct);
app.delete('/api/products', deleteAllProducts);



app.get('/', (req, res) => {
  res.json({ message: 'Welcome to DressStore Application' });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
