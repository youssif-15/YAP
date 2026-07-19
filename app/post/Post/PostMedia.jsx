"use client";


import { useRef, useState } from "react";


import {
    ChevronLeft,
    ChevronRight,
    Heart
} from "lucide-react";


import {
    toggleLike,
    isLiked
} from "@/lib/likes";


import PostVideo from "./PostVideo";



export default function PostMedia({

    media,

    postId,

    onLike,

    type

}){


    const [index,setIndex] = useState(0);

    const [showHeart,setShowHeart] = useState(false);



    const sliderRef = useRef(null);

    const startX = useRef(0);

    const dragging = useRef(false);

    const currentTranslate = useRef(0);

    const lastTap = useRef(0);

    const clickTimeout = useRef(null);





    let images = media;



    if(typeof images === "string"){


        try{


            images = JSON.parse(images);


        }

        catch{


            images = [images];


        }


    }






    if(!Array.isArray(images) || images.length === 0){


        return null;


    }







    function isVideo(url){


        if(!url) return false;


        return (

            url.includes(".mp4")

            ||

            url.includes(".webm")

            ||

            url.includes(".mov")

            ||

            url.includes("video")

        );


    }







    function nextImage(){


        setIndex(prev =>

            prev < images.length - 1

            ?

            prev + 1

            :

            prev

        );


    }








    function previousImage(){


        setIndex(prev =>

            prev > 0

            ?

            prev - 1

            :

            prev

        );


    }








    function pointerDown(clientX){


        dragging.current = true;


        startX.current = clientX;


    }







    function pointerMove(clientX){


        if(!dragging.current){

            return;

        }



        const diff = clientX - startX.current;



        currentTranslate.current = diff;




        if(sliderRef.current){


            sliderRef.current.style.transition = "none";


            sliderRef.current.style.transform =

            `translateX(calc(-${index * 100}% + ${diff}px))`;


        }


    }








    function pointerUp(){


        if(!dragging.current){

            return;

        }



        dragging.current = false;




        if(sliderRef.current){


            sliderRef.current.style.transition =

            "transform .35s ease";


        }






        if(

            currentTranslate.current < -80

            &&

            index < images.length - 1

        ){


            setIndex(prev=>prev+1);


        }

        else if(

            currentTranslate.current > 80

            &&

            index > 0

        ){


            setIndex(prev=>prev-1);


        }






        currentTranslate.current = 0;


    }








    function playHeart(){


        setShowHeart(true);



        setTimeout(()=>{


            setShowHeart(false);


        },700);



    }








    async function handleDoubleLike(){


        playHeart();



        const liked = await isLiked(postId);



        if(!liked){


            await toggleLike(postId);



            if(onLike){


                onLike();


            }


        }


    }








    function handleClick(){


        if(dragging.current){

            return;

        }




        if(clickTimeout.current){


            clearTimeout(clickTimeout.current);



            clickTimeout.current = null;



            handleDoubleLike();


        }

        else{


            clickTimeout.current = setTimeout(()=>{


                clickTimeout.current = null;


            },250);


        }


    }








    function handleTouch(){


        if(dragging.current){

            return;

        }




        const now = Date.now();


        const diff = now - lastTap.current;


        lastTap.current = now;




        if(diff < 300){


            handleDoubleLike();


        }


    }







    /*
        الفيديو يخرج من نظام الصور
        ويستخدم البلاير الخاص به
    */


    if(

        type === "video"

        ||

        isVideo(images[0])

    ){


        return(


            <div className="post-media">


                <PostVideo

                    video={images[0]}

                    postId={postId}

                    onLike={onLike}

                />


            </div>


        );


    }










    return(


        <div className="post-media">



            <div


                ref={sliderRef}


                className="post-slider"


                style={{


                    transform:`translateX(-${index * 100}%)`


                }}



                onMouseDown={(e)=>pointerDown(e.clientX)}



                onMouseMove={(e)=>pointerMove(e.clientX)}



                onMouseUp={pointerUp}



                onMouseLeave={pointerUp}





                onTouchStart={(e)=>

                    pointerDown(

                        e.touches[0].clientX

                    )

                }





                onTouchMove={(e)=>

                    pointerMove(

                        e.touches[0].clientX

                    )

                }





                onTouchEnd={()=>{


                    pointerUp();


                    handleTouch();


                }}



            >






                {

                    images.map((image,i)=>(


                        <img


                            key={i}


                            src={image}


                            alt={`post-${i}`}


                            className="post-image"


                            draggable={false}


                            onClick={handleClick}



                        />


                    ))

                }




            </div>









            {


                showHeart &&



                <div className="double-heart">


                    <Heart


                        size={110}


                        fill="white"


                        color="white"


                        strokeWidth={1.5}


                    />


                </div>


            }









            {


                images.length > 1 &&



                <>


                    {

                        index > 0 &&



                        <button

                            className="media-arrow left"

                            onClick={previousImage}

                        >


                            <ChevronLeft size={24}/>


                        </button>


                    }





                    {

                        index < images.length - 1 &&



                        <button

                            className="media-arrow right"

                            onClick={nextImage}

                        >


                            <ChevronRight size={24}/>


                        </button>


                    }





                    <div className="media-counter">


                        {index + 1}/{images.length}


                    </div>


                </>


            }





        </div>


    );


}