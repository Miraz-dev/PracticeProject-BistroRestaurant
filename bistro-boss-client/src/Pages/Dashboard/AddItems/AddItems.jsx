// import React from 'react';

import { useForm } from "react-hook-form";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const AddItems = () => {
    const { register, handleSubmit, reset } = useForm();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const onSubmit = async(data) => {
        console.log(data);

        // Upload image to imgbb and then get an url
        const imageFile = { image: data.image[0]};
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if(res.data.success){
            // Now send the menu item data to the server with the image url
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                image: res.data.data.display_url
            }

            const menuRes = await axiosSecure.post("/menu", menuItem);
            console.log("menuRes: ",menuRes.data);
            if(menuRes.data.insertedId){
                // show success popup
                console.log("Added successfully");
                reset();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                  });
            }
        }

        // console.log("with image url",res.data);
    }


    return (
        <div>
            <h2>Add Item Page</h2>
            <SectionTitle heading={'Add an item'} subHeading={'What is new'}></SectionTitle>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe name?</span>
                        </label>
                        <input {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full" />

                    </div>

                    <div className="flex">
                        {/* Category */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select defaultValue="default" {...register("category")} className="select select-bordered w-full">
                                <option disabled value={'default'}>Select Category</option>
                                <option value="salad">Salad</option>
                                <option value="pizza">Pizza</option>
                                <option value="soup">soup</option>
                                <option value="dessert">dessert</option>
                                <option value="drinks">drinks</option>
                            </select>
                        </div>

                        {/* Price */}

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Price</span>
                            </label>
                            <input {...register("price")} type="number" placeholder="Price..." className="input input-bordered w-full" />

                        </div>


                        {/* Recipe details(textArea) */}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Your bio</span>
                        </label>
                        <textarea {...register("recipe")} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>

                    </div>

                    {/* File input */}
                    <div>
                        <input {...register("image")} type="file" className="file-input w-full max-w-xs mt-6" />
                    </div>


                    <input type="submit" value={'Add Item'} className="btn my-6" />
                </form>
            </div>
        </div>
    );
};

export default AddItems;