const db = require("./db");

db.serialize(() => {
  // USERS TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  // PROPERTIES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      location TEXT,
      price INTEGER
    )
  `);

  // FAVOURITES TABLE
  db.run(`
    CREATE TABLE IF NOT EXISTS favourites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      property_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(property_id) REFERENCES properties(id)
    )
  `);

  // SEED DATA (only if empty)
  db.get("SELECT COUNT(*) as count FROM properties", (err, row) => {
    if (row.count === 0) {
      db.run(`
        INSERT INTO properties (title, location, price) VALUES
        ('Luxury Apartment', 'Kathmandu', 120000),
        ('Cozy House', 'Pokhara', 80000),
        ('Modern Flat', 'Lalitpur', 100000)
      `);
      console.log("Seeded properties data");
    }
  });
});