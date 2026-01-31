import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import RestaurantsContext from "../context/RestaurantsContext";
import FeaturedCard from "../components/home/FeaturedCard";
import OwnerRestaurantRegistrationForm from "../components/owner/OwnerAddRestaurantForm";
import axios from "axios";

function OwnerDashboard() {
    const { user, token } = useContext(AuthContext);
    const { setRestaurants } = useContext(RestaurantsContext); // update global context
    const [ownerRestaurants, setOwnerRestaurants] = useState([]); // local state for this dashboard
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    // Fetch owned restaurants on mount
    useEffect(() => {
        const fetchOwnedRestaurants = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/owners/restaurants", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOwnerRestaurants(res.data); // res.data is an array of restaurant objec
            } catch (err) {
                console.error("Failed to fetch owned restaurants:", err);
            }
        };
        if (token) fetchOwnedRestaurants();
    }, [token])

    return (
        <main className="dashboard-page container">
            <h1>Welcome, {user.name}</h1>

            <section className="dashboard-actions">
                <button
                    className="button button-primary"
                    onClick={() => setShowForm(!showForm)} // show form on click
                >
                    + Add New Restaurant
                </button>
            </section>

            {/* Show form when toggled */}
            {showForm && (
                <OwnerRestaurantRegistrationForm
                    ownerId={user._id}
                    onSuccess={(newRestaurant) => {
                        setOwnerRestaurants([...ownerRestaurants, newRestaurant]); // update local state
                        setRestaurants((prev) => [...prev, newRestaurant]); // update global context
                        setShowForm(false); // hide form
                        navigate(`/owner/restaurants/${newRestaurant._id}/edit`);
                    }}
                />
            )}

            <section className="owner-restaurants">
                <h2>Your Restaurants</h2>
                {ownerRestaurants.length === 0 ? (
                    <p>No restaurants yet</p>
                ) : (
                    <div className="featured-row">
                        {ownerRestaurants.map((r) => (
                            <FeaturedCard key={r._id} restaurant={r} showDeleteButton={true} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default OwnerDashboard;
