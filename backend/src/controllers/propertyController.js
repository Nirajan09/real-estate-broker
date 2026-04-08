const db = require("../db/db");

exports.getProperties = (req, res) => {
  db.all("SELECT * FROM properties", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching properties" });
    }

    res.json({
      count: rows.length,
      properties: rows,
    });
  });
};

exports.getPropertyById = (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM properties WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching property" });
    }

    if (!row) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json(row);
  });
};