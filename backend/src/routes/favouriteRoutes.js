const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getFavourites,
  addFavourite,
  removeFavourite,
} = require("../controllers/favouriteController");

// Protect all routes
router.use(authMiddleware);

router.get("/", getFavourites);
router.post("/:propertyId", addFavourite);
router.delete("/:propertyId", removeFavourite);

module.exports = router;