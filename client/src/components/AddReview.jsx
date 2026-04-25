import React, { useState, useContext } from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantContext";

const AddReview = () => {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } =
    useContext(RestaurantsContext);
  const [name, setName] = useState("");
  const [rating, setRating] = useState("Rating");
  const [reviewText, setReviewText] = useState("");
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post(`/${id}/addReview`, {
        name,
        review: reviewText,
        rating,
      });
      // 1. Destructure the review and restaurant from the response
      const { review, restaurant } = response.data.data;
      // 2. Update the selected restaurant's details with the new review and updated stats
      setSelectedRestaurant({
        // We replace the old restaurant object with the new one (updated average/count)
        restaurant: restaurant,
        // We keep old reviews and add the one we just made
        reviews: [...selectedRestaurant.reviews, review],
      });
      setName("");
      setRating("Rating");
      setReviewText("");
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="mb-2">
      <h2>Add a Review</h2>
      <form action="">
        <div className="row g-3">
          <div className="col-8">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="col-4">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-select"
              id="rating"
            >
              <option disabled>Rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="comment" className="form-label">
              Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="form-control"
              id="Review"
              rows={3}
              placeholder="Enter your comment"
            />
          </div>
          <div className="col-12">
            <button
              onClick={handleSubmitReview}
              type="submit"
              className="btn btn-primary"
            >
              Submit Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddReview;
