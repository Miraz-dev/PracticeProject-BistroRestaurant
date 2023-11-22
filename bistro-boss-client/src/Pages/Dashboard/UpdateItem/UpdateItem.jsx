// import React from 'react';

import { useLoaderData } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const UpdateItem = () => {
    const {name, category, recipe, price, _id} = useLoaderData();
    // console.log(item);

    const { register, handleSubmit } = useForm();

    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();

    const onSubmit = async (data) => {
        console.log(data);

        // Upload image to imgbb and then get an url
        const imageFile = { image: data.image[0] };
        const res = await axiosPublic.post(image_hosting_api, imageFile, {
            headers: {
                "content-type": "multipart/form-data"
            }
        });
        if (res.data.success) {
            // Now send the menu item data to the server with the image url
            const menuItem = {
                name: data.name,
                category: data.category,
                price: parseFloat(data.price),
                recipe: data.recipe,
                image: res.data.data.display_url
            }

            const menuRes = await axiosSecure.patch(`/menu/${_id}`, menuItem);
            console.log("menuRes: ", menuRes.data);
            if (menuRes.data.modifiedCount > 0) {
                // show success popup
                console.log("Added successfully");
                // reset();
                Swal.fire({
                    // position: "top-end",
                    icon: "success",
                    title: "Your work has been Updated",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }

        // console.log("with image url",res.data);
    }


    return (
        <div>
            <SectionTitle heading={'Update Item'} subHeading={'Refresh Info'}></SectionTitle>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Recipe name?</span>
                        </label>
                        <input defaultValue={name} {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full" />

                    </div>

                    <div className="flex">
                        {/* Category */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Category</span>
                            </label>
                            <select defaultValue={category} {...register("category")} className="select select-bordered w-full">
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
                            <input defaultValue={price} {...register("price")} type="number" placeholder="Price..." className="input input-bordered w-full" />

                        </div>


                        {/* Recipe details(textArea) */}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Your bio</span>
                        </label>
                        <textarea defaultValue={recipe} {...register("recipe")} className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>

                    </div>

                    {/* File input */}
                    <div>
                        <input {...register("image")} type="file" className="file-input w-full max-w-xs mt-6" />
                    </div>


                    <input type="submit" value={'Update Item'} className="btn my-6" />
                </form>
            </div>
        </div>
    );
};

export default UpdateItem;