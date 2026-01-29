import express from 'express'
import dotenv from "dotenv";
import connectdb from "./db/connection.js"
import restaurantRoute from "./routes/RestaurantApp.js"
import UserRoute from "./routes/UserApp.js"
import RestaurantOwnersRoute from "./routes/RestaurantOwnersApp.js"
import cors from 'cors'

//import authMiddleware from './middleware/AuthMiddleware.js' 

// load .env file
dotenv.config();

const app = express();

// allow frontend to call the server
app.use(cors());

// allow bigger payload size as image uploading is needed for this project. 
app.use(express.json({ limit: "5mb" }));

// create DB connection. 
connectdb();

app.use('/api/restaurants', restaurantRoute);
app.use('/api/users', UserRoute);
app.use('/api/RestaurantOwners', RestaurantOwnersRoute)

app.get('/', (req, res) => {
    res.send('server is running')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on :http://localhost:${PORT}`))