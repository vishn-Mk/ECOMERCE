const express=require('express');
const app=express()
const mongoose=require("mongoose");
const authRouter = require('./router/auth_routes');
const product_routes = require('./router/product_routes');
const cartRouter = require('./router/cart_routes');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log('database connected')
}).catch((error)=>{
    console.log(error)
})
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/auth',authRouter);
app.use('/api/products',product_routes);

app.use('/api/cart',cartRouter);
app.use('/api/Wishlist',product_routes);

app.listen(process.env.PORT,()=>{console.log('server started');})