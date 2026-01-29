import { Restaurant, reviewSchema } from '../models/Restaurant.js';
import { Router } from 'express'
import mongoose from 'mongoose';
import RestaurantOwners from '../models/RestaurantOwner.js';
import userAuthMiddleware from '../middleware/UserAuthMiddleware.js'
import ownerAuthMiddleware from '../middleware/ownerAuthMiddleware.js';
const route = Router();

route.post('/', ownerAuthMiddleware, async (req, res) => {
   if (req.owner.role != 'owner') {

      return res.status(400).send({ msg: 'Operation not allowed' })
   }
   try {
      const newRestaurant = new Restaurant(req.body);
      await newRestaurant.save();
      //register restaurant id for the owner
      const ownerId = req.owner.id;
      console.log(ownerId, newRestaurant._id)
      await RestaurantOwners.findByIdAndUpdate(ownerId, { $push: { restaurantsOwned: newRestaurant._id } })
      res.status(201).json({ id: newRestaurant._id });

   } catch (err) {
      res.status(400).json({ error: err.message });
   }
})

route.post('/:id/reviews', userAuthMiddleware, async (req, res) => {
   if (req.user.role != 'user') {
      return res.status(400).send({ msg: 'Operation not allowed' })
   }
   const restaurantId = req.params.id;
   try {
      const newReview = {
         userId: req.user.id,
         rating: req.body.rating,
         text: req.body.text,
         date: new Date()
      }
      //
      const review = new mongoose.Types.Subdocument(newReview, reviewSchema);

      const existingReview = await Restaurant.findOne({
         _id: restaurantId,
         'reviews.userId': newReview.userId
      })
      if (existingReview) {
         res.status(409).json({ msg: 'review already exist with this user account' })
         return;
      }

      await Restaurant.updateOne(
         { _id: restaurantId }, { $push: { reviews: review } }
      )
      res.send({ id: review._id })
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