import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantContext";
import RestaurantFinder from "../apis/RestaurantFinder";
import Reviews from "../components/Reviews";
import AddReview from "../components/AddReview";
import StarRating from "../components/StarRating";
const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { selectedRestaurant, setSelectedRestaurant } =
    useContext(RestaurantsContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${id}`);
        setSelectedRestaurant(response.data.data);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      }
    };
    fetchData();
  }, [id, setSelectedRestaurant]);


  if (!selectedRestaurant) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status" style={{width: "3rem", height: "3rem"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {selectedRestaurant && (
        <>
          <h1 className="text-center display-1">
            {selectedRestaurant.restaurant.name}
          </h1>
          <div className="text-center">
            <StarRating rating={selectedRestaurant.restaurant.average_rating} />
            <span className="text-warning ml-1">
              (
              {selectedRestaurant.restaurant.count
                ? `${selectedRestaurant.restaurant.count} reviews`
                : "0 reviews"}
              )
            </span>
          </div>
          <div className="mt-3">
            <Reviews reviews={selectedRestaurant.reviews} />
          </div>
          <AddReview />
        </>
      )}
    </div>
  );
};

export default RestaurantDetailPage;
