const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/findaddis')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);

// Seed Route
app.get('/api/seed', async (req, res) => {
    await Restaurant.deleteMany({});

    const sampleRestaurants = [
        {
            id: "lucy",
            name: "Lucy Ethiopian Restaurant",
            category: "Ethiopian",
            rating: 4.6,
            price: "$$",
            address: "Bole, Addis Ababa",
            images: ["/images/lucy.jpg"],
            hours: "08:00 - 23:00",
            description: "Traditional Ethiopian dishes served with authentic injera and a warm atmosphere.",
            menu: ["Doro Wat", "Tibs", "Shiro"],
            reviews: [
                { user: "Marta", rating: 5, text: "Amazing flavours!", date: "2025-10-10" },
            ],
            location: { lat: 9.006, lng: 38.785 }
        },
        {
            id: "tomoca",
            name: "Tomoca Coffee",
            category: "Cafe",
            rating: 4.5,
            price: "$",
            address: "Multiple locations, Addis Ababa",
            images: ["/images/tomoca.png"],
            hours: "07:00 - 20:00",
            description: "Historic Ethiopian coffee roaster, known for strong, aromatic brews.",
            menu: ["Ethiopian coffee", "Pastries"],
            reviews: [],
            location: { lat: 9.021, lng: 38.752 }
        },
        {
            id: "kategna",
            name: "Kategna",
            category: "Ethiopian",
            rating: 4.4,
            price: "$$",
            address: "Old Airport, Addis Ababa",
            images: ["/images/kategna.png"],
            hours: "10:00 - 22:00",
            description: "Local favorite serving homestyle Ethiopian favorites in a relaxed setting.",
            menu: ["Kitfo", "Tibs"],
            reviews: [],
            location: { lat: 8.995, lng: 38.730 }
        },
        {
            id: "addiscafe",
            name: "Addis Cafe",
            category: "Cafe",
            rating: 4.0,
            price: "$",
            address: "Piassa, Addis Ababa",
            images: ["/images/addis-cafe.jpg"],
            hours: "07:00 - 20:00",
            description: "Cozy spot for coffee and light bites.",
            menu: ["Coffee", "Pastries", "Sandwiches"],
            reviews: [{ user: "Sam", rating: 4, text: "Nice coffee and calm place.", date: "2025-09-21" }],
            location: { lat: 9.030, lng: 38.753 }
        },
        {
            id: "italiano",
            name: "Italiano Corner",
            category: "Italian",
            rating: 4.2,
            price: "$$$",
            address: "Kazanchis, Addis Ababa",
            images: ["/images/italiano.webp"],
            hours: "11:00 - 22:00",
            description: "Wood-fired pizzas and homemade pasta (popular with locals and expats).",
            menu: ["Margherita", "Carbonara"],
            reviews: [],
            location: { lat: 9.015, lng: 38.766 }
        },
    ];
    try {
        const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);
        res.json(createdRestaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
