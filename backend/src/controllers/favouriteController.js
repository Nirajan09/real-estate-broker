const db = require("../db/db");

// GET ALL FAVOURITES
exports.getFavourites = (req, res) => {
  const userId = req.user.id;

  db.all(
    `
    SELECT properties.* FROM favourites
    JOIN properties ON favourites.property_id = properties.id
    WHERE favourites.user_id = ?
    `,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "Error fetching favourites" });

      res.json({
        count: rows.length,
        favourites: rows,
      });
    }
  );
};

// ADD FAVOURITE
exports.addFavourite = (req, res) => {
  const userId = req.user.id;
  const propertyId = parseInt(req.params.propertyId, 10);

  // Validate propertyId
  if (!propertyId || isNaN(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  // Check if property exists
  db.get("SELECT * FROM properties WHERE id = ?", [propertyId], (err, property) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check if already favourited
    db.get(
      "SELECT * FROM favourites WHERE user_id = ? AND property_id = ?",
      [userId, propertyId],
      (err, row) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (row) return res.status(400).json({ message: "Already in favourites" });

        // Insert favourite
        db.run(
          "INSERT INTO favourites (user_id, property_id) VALUES (?, ?)",
          [userId, propertyId],
          function (err) {
            if (err) return res.status(500).json({ message: "Error adding favourite" });

            res.json({ message: "Added to favourites", favouriteId: this.lastID });
          }
        );
      }
    );
  });
};

// REMOVE FAVOURITE
exports.removeFavourite = (req, res) => {
  const userId = req.user.id;
  const propertyId = parseInt(req.params.propertyId, 10);

  // Validate propertyId
  if (!propertyId || isNaN(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  db.run(
    "DELETE FROM favourites WHERE user_id = ? AND property_id = ?",
    [userId, propertyId],
    function (err) {
      if (err) return res.status(500).json({ message: "Error removing favourite" });
      if (this.changes === 0) return res.status(404).json({ message: "Favourite not found" });

      res.json({ message: "Removed from favourites" });
    }
  );
};