const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const isAuthenticated = require("../middlewares/isAuthenticated");

const User = require("../models/User");
const Offer = require("../models/Offer");
const { route } = require("./user");

router.post("/offer/publish", isAuthenticated, async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files.picture.path);

    const {
      title,
      description,
      price,
      condition,
      city,
      brand,
      size,
      color,
    } = req.fields;

    // Créer une nouvelle annonce (sans image)
    const newOffer = new Offer({
      product_name: title,
      product_description: description,
      product_price: price,
      product_details: [
        { MARQUE: brand },
        { TAILLE: size },
        { ÉTAT: condition },
        { COULEUR: color },
        { EMPLACEMENT: city },
      ],
      owner: req.user,
    });

    // console.log(newOffer);

    // Envoi de l'image à cloudinary
    // const result = await cloudinary.uploader.upload(req.files.picture.path, {
    //   folder: `/vinted/offers/${newOffer._id}`,
    // });
    // console.log(result);
    // Ajoute result à product_image
    // newOffer.product_image = result;

    // Sauvegarder l'annonce
    await newOffer.save();
    res.json(newOffer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//router.get("/offers", async (req, res) => {
//try {
// const offers = await Offer.find({
//   product_name: new RegExp("Test", "i"),
// }).select("product_name product_price product_description");

// .sort()
// asc ou desc __ 1 ou -1

// const offers = await Offer.find()
//   .sort({ product_price: 1 })
//   .select("product_name product_price product_description");

// $gte = greater than or equal
// $lte
// $gt
// $lt
// const offers = await Offer.find({
//   product_price: {
//     $gte: 30,
//     $lte: 100,
//   },
// }).select("product_name product_price product_description");

// const offers = await Offer.find({
//   product_price: {
//     $gte: 20,
//   },
// })
//   .select("product_name product_price product_description")
//   .sort({ product_price: 1 });

// Pagination (skip et limit)
// Test
// Test 1 ===> page 1
// Test 2
// Nike Air Max 90 ===> page 2
//
//});

router.get("/offers", async (req, res) => {
  try {
    const offers = await Offer.find({
      product_name: new RegExp(req.query.title, "i"),
      product_price: {
        $gte: req.query.priceMin,
        $lte: req.query.priceMax,
      },
    })
      .sort({ product_price: 1 })
      .limit(2)
      .skip(2 * req.query.page - 1);

    res.json(offers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const id = await Offer.find({
      _id: req.params.id,
    });
    res.json(id);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
