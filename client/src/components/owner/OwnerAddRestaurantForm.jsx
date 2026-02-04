import React from "react";
import { useState, useContext } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import RestaurantsContext from "../../context/RestaurantsContext";

function OwnerRestaurantRegistrationForm({ onSuccess }) {
    const initialForm = { name: "", category: "", address: "", hours: "", description: "", menu: "", latitude: "", longitude: "" };
    const [form, setForm] = useState(initialForm);
    const [imageDataUrl, setImageDataUrl] = useState(""); // full data URL with prefix
    const [imagePreview, setImagePreview] = useState(null);
    const { token } = useContext(AuthContext);
    const { addRestaurant } = useContext(RestaurantsContext);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Please select a valid image (jpg, png, gif, webp).");
            return;
        }

        const maxSize = 3 * 1024 * 1024; // 3MB
        if (file.size > maxSize) {
            alert("Image is too large. Max size is 3MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            // reader.result is a data URL: data:<type>;base64,<data>
            const dataUrl = reader.result;
            // store the full data URL (including the data:image/...;base64, prefix)
            setImageDataUrl(dataUrl);
            setImagePreview(dataUrl);
        };
        reader.readAsDataURL(file);
    };


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const payload = {
                name: form.name,
                category: form.category,
                address: form.address,
                hours: form.hours,
                description: form.description,
                menu: form.menu ? form.menu.split(",").map(item => item.trim()) : [],
                location: {
                    lat: form.latitude,
                    lng: form.longitude
                },
                images: imageDataUrl ? [imageDataUrl] : [] // send as an array with full data URL prefix
            };

            const res = await axios.post("/api/restaurants",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

            if (res.status >= 200 && res.status < 300) {
                const created = res.data;
                alert("Restaurant created successfully!");

                // notify parent (OwnerDashboard) if provided, otherwise add to global context
                if (typeof onSuccess === 'function') {
                    onSuccess(created);
                } else if (typeof addRestaurant === 'function') {
                    addRestaurant(created);
                }

                // reset form
                setForm(initialForm);
                setImageDataUrl("");
                setImagePreview(null);
            } else {
                alert(res.data?.message || "Error creating restaurant");
            }
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Server error");
        }
    }

    return (
        <form className="signup-form" onSubmit={handleSubmit}>
            <InputField name="name" label="Name" value={form.name} onChange={handleChange} placeholder="Restaurant name" />
            <InputField name="category" label="Category" value={form.category} onChange={handleChange} placeholder="Ethiopian,Italian..." />
            <InputField name="address" label="Address" value={form.address} onChange={handleChange} placeholder="Bole, Addis Ababa" />
            <InputField name="hours" label="Hours" type="text" value={form.hours} onChange={handleChange} placeholder="Enter Working hours" />
            <InputField name="description" label="Description" value={form.description} onChange={handleChange} placeholder="Enter what you serve" />
            <InputField name="menu" label="Menu" type="text" value={form.menu} onChange={handleChange} placeholder="e.g. injera, tibs, coffee" />
            <InputField name="latitude" label="Latitude" type="number" value={form.latitude} onChange={handleChange} placeholder="Lat" />
            <InputField name="longitude" label="Longitude" type="number" value={form.longitude} onChange={handleChange} placeholder="Long" />
            <div className="form-group" style={{ marginBottom: 12 }}>
                <label htmlFor="image">Profile Image</label>
                <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview && (
                    <div style={{ marginTop: 8 }}>
                        <img src={imagePreview} alt="Preview" style={{ width: 150, height: 'auto', display: 'block', borderRadius: 6 }} />
                        <button type="button" style={{ marginTop: 6 }} onClick={() => { setImagePreview(null); setImageDataUrl(""); }}>Remove</button>
                    </div>
                )}
            </div>

            <Button type="submit">Add Restaurant</Button>
        </form>
    );
}

export default OwnerRestaurantRegistrationForm;
