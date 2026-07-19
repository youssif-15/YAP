"use client";


import { useState } from "react";
import {
    X,
    Image
} from "lucide-react";


export default function CreatePostModal({close}) {


    const [image,setImage]=useState(null);



    function handleFile(file){

        if(file){

            setImage(URL.createObjectURL(file));

        }

    }



    return (

        <div className="modal-overlay">


            <div className="post-modal">


                <div className="modal-header">


                    <h2>
                        Create Post
                    </h2>


                    <button onClick={close}>

                        <X/>

                    </button>


                </div>



                <label

                className="upload-box"

                onDragOver={(e)=>e.preventDefault()}

                onDrop={(e)=>{

                    e.preventDefault();

                    handleFile(e.dataTransfer.files[0]);

                }}

                >


                    {
                        image ?

                        <img
                        src={image}
                        className="preview-image"
                        />

                        :

                        <>

                        <Image size={40}/>

                        <p>
                            Drag image here
                        </p>

                        <span>
                            or click to upload
                        </span>

                        </>

                    }


                    <input

                    type="file"

                    accept="image/*"

                    hidden

                    onChange={(e)=>
                        handleFile(e.target.files[0])
                    }

                    />


                </label>




                <textarea

                placeholder="Write a caption..."

                />



                <button className="publish-button">

                    Publish

                </button>



            </div>


        </div>

    );
}