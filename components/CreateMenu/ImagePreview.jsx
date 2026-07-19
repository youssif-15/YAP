"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";


export default function ImagePreview({ image }) {


    const images = Array.isArray(image)
        ? image
        : [image];



    const [current,setCurrent] = useState(0);



    const [ratio,setRatio] = useState("1 / 1");



    function handleLoad(e){


        const img = e.target;



        if(
            img.naturalWidth &&
            img.naturalHeight
        ){


            setRatio(
                `${img.naturalWidth} / ${img.naturalHeight}`
            );


        }


    }






    function nextImage(){


        if(current < images.length - 1){

            setCurrent(current + 1);

        }


    }






    function previousImage(){


        if(current > 0){

            setCurrent(current - 1);

        }


    }






    return (


        <div

        className="image-preview-wrapper"

        >



            <div

            className="image-preview"

            style={{
                "--image-ratio":ratio
            }}

            >




                {


                current > 0 &&


                <button

                className="image-arrow left"

                onClick={previousImage}

                >


                    <ChevronLeft size={28}/>


                </button>


                }







                <img


                src={images[current]}


                alt="Preview"


                className="preview-image"


                onLoad={handleLoad}


                />








                {


                current < images.length - 1 &&


                <button

                className="image-arrow right"

                onClick={nextImage}

                >


                    <ChevronRight size={28}/>


                </button>


                }





            </div>



        </div>


    );


}