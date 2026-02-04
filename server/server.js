import express from 'express'
import dotenv from "dotenv";
import connectdb from "./db/connection.js"
import restaurantRoute from "./routes/RestaurantApp.js"
import UserRoute from "./routes/UserApp.js"
import RestaurantOwnersRoute from "./routes/RestaurantOwnersApp.js"
import AdminRoute from "./routes/AdminApp.js"
import cors from 'cors'


//import authMiddleware from './middleware/AuthMiddleware.js' 

// load .env file
dotenv.config();

const app = express();

// allow frontend to call the server
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/api/health', (req, res) => res.send('API is live'));

// allow bigger payload size
app.use(express.json({ limit: "5mb" }));

// create DB connection. 
connectdb();

app.use('/api/restaurants', restaurantRoute);
app.use('/api/users', UserRoute);
app.use('/api/owners', RestaurantOwnersRoute);
app.use('/api/admin', AdminRoute);


app.get('/', (req, res) => {
    res.send('server is running')
})

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`server running on :http://localhost:${PORT}`))
}

export default app;
