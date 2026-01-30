import { Restaurant, reviewSchema } from '../models/Restaurant.js';
import { Router } from 'express'
import mongoose from 'mongoose';
import RestaurantOwners from '../models/RestaurantOwner.js';
import userAuthMiddleware from '../middleware/UserAuthMiddleware.js'
import ownerAuthMiddleware from '../middleware/ownerAuthMiddleware.js';
import { calculateAverageRating } from '../utils/rating.js'
const route = Router();

route.post('/', ownerAuthMiddleware, async (req, res) => {
   if (req.owner.role != 'owner') {
      return res.status(400).send({ msg: 'Operation not allowed' })
   }
   try {
      // first add the restaurant
      const newRestaurant = new Restaurant(req.body);
      await newRestaurant.save();

      //register restaurant's id for the owner
      const ownerId = req.owner.id;
      await RestaurantOwners.findByIdAndUpdate(ownerId, { $push: { restaurantsOwned: newRestaurant._id } })
      res.status(201).json(newRestaurant);

   } catch (err) {
      res.status(400).json({ error: err.message });
   }
})



route.post('/:id/reviews', userAuthMiddleware, async (req, res) => {
   if (req.user.role !== 'user') {
      return res.status(403).json({ msg: "Operation not allowed" });
   }

   const restaurantId = req.params.id;

   try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) return res.status(404).json({ msg: "Restaurant not found" });

      // Prevent duplicate review
      if (restaurant.reviews.some(r => r.userId === req.user.id)) {
         return res.status(409).json({ msg: "Review already exists for this user" });
      }

      // Add review
      restaurant.reviews.push({
         userId: req.user.id,
         rating: req.body.rating,
         text: req.body.text,
         date: new Date()
      });

      // Recalculate rating
      restaurant.rating = calculateAverageRating(restaurant.reviews);
      await restaurant.save();

      res.status(201).json({
         rating: restaurant.rating,
         reviews: restaurant.reviews
      });

   } catch (err) {
      res.status(400).json({ error: err.message });
   }
})

//get all restaurants or filtered
route.get('/', async (req, res) => {
   try {
      const ratingReq = req.query.rating;
      const category = req.query.category;
      //filter by both category and rating
      if (category && ratingReq) {
         const rating = parseFloat(ratingReq);
         const restaurants = await Restaurant.find({ rating, category });
         return res.status(200).json(restaurants);
      }
      //filter by rating
      if (ratingReq) {
         const rating = parseFloat(ratingReq);
         const restaurants = await Restaurant.find({ rating });
         return res.status(200).json(restaurants);
      }
      //filter by category 
      if (category) {
         const restaurants = await Restaurant.find({ category });
         return res.status(200).json(restaurants);
      }

      // return all without filter
      const restaurants = await Restaurant.find();
      res.status(200).json(restaurants);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }

})

//delete restaurant using id
route.delete('/:id', ownerAuthMiddleware, async (req, res) => {
   if (req.owner.role != 'owner') {
      return res.status(400).send({ msg: 'Operation not allowed' })
   }
   const restaurantId = req.params.id
   const ownerId = req.owner.id;
   const isOwnerofRestaurant = RestaurantOwners.findOne({ _id: ownerId, restaurantsOwned: restaurantId })
   if (!isOwnerofRestaurant) {
      return res.status(400).send({ msg: 'Operation Restricted' })
   }
   try {
      const deleted = await Restaurant.findByIdAndDelete(restaurantId)
      if (!deleted) {
         return res.status(404).json({ error: 'Restaurant not found' });
      }
      //also remove from owners list
      await RestaurantOwners.findByIdAndUpdate(ownerId, { $pull: { restaurantsOwned: restaurantId } })
      res.status(200).send({ msg: 'deleted successfully' })
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
})

//update restaurant

route.patch('/:id', ownerAuthMiddleware, async (req, res) => {
   const id = req.params.id
   try {
      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
         id, { $set: req.body }, { new: true }
      );

      if (!updatedRestaurant) {
         return res.status(404).json({ error: 'Restaurant not found' });
      }

      res.status(200).json(updatedRestaurant);
   } catch (err) {

   }
});



export default route;