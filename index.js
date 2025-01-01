const express = require('express');
const app = express();
const cors = require('cors');
const port =  process.env.PORT || 6001;
const mongoose = require('mongoose');
require('dotenv').config()
const jwt = require('jsonwebtoken');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// middleware
app.use(cors());
app.use(express.json());


//  mongodb config
mongoose
.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodi-client.va8bh.mongodb.net/demo-foodi-client?retryWrites=true&w=majority&appName=demo-foodi-client`
)
.then(
  console.log("MongoDB Connected Successfully")
).catch((error) => console.log("Error connecting to MongoDB", error)
);
// require('crypto').randomBytes(64).toString('hex')



 // jwt authentication
 app.post('/jwt', async(req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1hr'
  })
  res.send({token});
})
// ctrl shift F



//   import routes here
const menuRoutes = require('./api/routes/menuRoutes');
app.use('/menu', menuRoutes)

const cartRoutes = require('./api/routes/cartRoutes');
app.use('/carts', cartRoutes);

const userRoutes = require('./api/routes/userRoutes');
app.use('/users', userRoutes);

const paymentRoutes = require('./api/routes/paymentRoutes')
app.use('/payments', paymentRoutes);

const adminStats = require('./api/routes/adminStats')
app.use('/adminStats', adminStats);


const orderStats = require('./api/routes/orderStats')
app.use('/orderStats', orderStats);

// stripe payment routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = parseInt(price*100);

// Create a PaymentIntent with the order amount and currency
const paymentIntent = await stripe.paymentIntents.create({
  amount: amount,
  currency: "INR",
  payment_method_types: ["card"]
});

res.send({
  clientSecret: paymentIntent.client_secret,
});
});
app.get('/', (req, res) => {
  res.send('Hello, Poorvi!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
































