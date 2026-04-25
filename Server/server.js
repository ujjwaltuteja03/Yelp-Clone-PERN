import "dotenv/config";
import express from "express";
import db from "./db/index.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.join(__dirname, "build");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    // const result = await db.query("Select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select  * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;",
    );
    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurant: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await db.query(
      "select  * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id],
    );
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [req.params.id],
    );
    res.status(200).json({
      status: "success",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
  try {
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) values ($1, $2, $3) RETURNING *",
      [req.body.name, req.body.location, req.body.price_range],
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Update restaurant
app.put("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range= $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id],
    );
    res.status(201).json({
      status: "success",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
  try {
    const results = await db.query("DELETE FROM restaurants where id = $1 ", [
      req.params.id,
    ]);
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

//Add a review
app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
  try {
    //Inserting review
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) RETURNING *",
      [req.params.id, req.body.name, req.body.review, req.body.rating],
    );
    //Fetching updated restaurant details with reviews
    const updatedStats = await db.query(
      "SELECT * FROM restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id],
    );
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
        restaurant: updatedStats.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Serve the static files
app.use(express.static(buildPath));

// The Catch-all
app.use((req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server live on port ${port}`);
  console.log("Hardcoded Build Path:", buildPath);
});
