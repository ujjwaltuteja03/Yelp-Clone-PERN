import React, {useEffect, useState} from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';

const UpdateRestaurant = (props) => {
  const { id } = useParams();
  let navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RestaurantFinder.get(`/${id}`);
                setName(response.data.data.restaurant.name);
                setLocation(response.data.data.restaurant.location);
                setPriceRange(response.data.data.restaurant.price_range);
            } catch (error) {
                console.error("Error fetching restaurant data:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await RestaurantFinder.put(`/${id}`, { name, location, price_range: priceRange });
            navigate("/");
        } catch (error) {
            console.error("Error updating restaurant:", error);
        }
    };

  return (
    <div>
        <form action="">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='form-control' id='name' placeholder='name'/>
            </div>
            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" className='form-control' id='location' placeholder='location'/>
            </div>
            <div className="form-group">
                <label htmlFor="price_range">Price Range</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className='custom-select my-1 mr-sm-2' id='price_range'>
                    <option value="1">$</option>
                    <option value="2">$$</option>
                    <option value="3">$$$</option>
                    <option value="4">$$$$</option>
                    <option value="5">$$$$$</option>
                </select>
            </div>
            <button onClick={handleSubmit} type='submit' className='btn btn-primary'>Submit</button>
        </form>
    </div>
  );
}   

export default UpdateRestaurant;