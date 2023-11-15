import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const FoodCard = ({ item }) => {
    const { name, image, price, recipe, _id } = item;
    const {user} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleAddToCart = food => {
        // console.log(food, user?.email);
        if(user && user.email){
            // TODO: Send cart item to the database.
            const cartItem = {
                menuId: _id,
                email: user.email,
                name,
                image,
                price
            }

            axios.post("http://localhost:5000/carts", cartItem)
                .then(res => {
                    console.log("FoodCard success POST /carts: ", res.data);
                    if(res.data.insertedId){
                        Swal.fire({
                            // position: "center",
                            icon: "success",
                            title: "Your work has been saved",
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                })
                .catch(err => {
                    console.log("FoodCard error POST /carts: ", err);

                })
        }
        else{
            Swal.fire({
                title: "You are not logged in!",
                text: "Please Login to add to the cart.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Log In!"
              }).then((result) => {
                if (result.isConfirmed) {
                //   Swal.fire({
                //     title: "Deleted!",
                //     text: "Your file has been deleted.",
                //     icon: "success"
                //   });
                    navigate("/login", {state: {from: location}});
                }
              });
        }
    }

    return (
        <div className="flex justify-center">
            <div className="card w-96 bg-base-100 shadow-xl">
                <figure><img src={image} alt="Shoes" className="relative" /></figure>
                <p className="bg-slate-900 text-white p-2 max-w-fit rounded absolute right-6 top-6">${price}</p>
                <div className="card-body">
                    <h2 className="card-title">{name}</h2>
                    <p>{recipe}</p>
                    
                    <div className="card-actions justify-end">
                        <button onClick={() => handleAddToCart(item)} className="btn btn-primary">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;