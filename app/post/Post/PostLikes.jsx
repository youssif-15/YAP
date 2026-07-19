"use client";


import {

    useEffect,

    useRef,

    useState

} from "react";


import { Heart } from "lucide-react";


import {

    getLikes,

    getLikesUsers,

    isLiked,

    toggleLike

} from "@/lib/likes";


import LikesModal from "./LikesModal";








export default function PostLikes({

    postId,

    disableLikesPreview = false

}){


    const [liked,setLiked] = useState(false);

    const [likes,setLikes] = useState(0);

    const [loading,setLoading] = useState(true);

    const [processing,setProcessing] = useState(false);

    const [animate,setAnimate] = useState(false);

    const [openModal,setOpenModal] = useState(false);

    const [users,setUsers] = useState([]);


    const holdTimer = useRef(null);









    async function load(){


        try{


            const [

                likesCount,

                likedByMe

            ] = await Promise.all([


                getLikes(postId),


                isLiked(postId)


            ]);



            setLikes(likesCount);

            setLiked(likedByMe);



        }

        catch(error){


            console.log(

                "LOAD LIKES ERROR:",

                error

            );


        }

        finally{


            setLoading(false);


        }


    }









    useEffect(()=>{


        load();



        return()=>{


            if(holdTimer.current){


                clearTimeout(

                    holdTimer.current

                );


            }


        };


    },[postId]);









    async function handleLike(){


        if(

            loading ||

            processing

        ){

            return;

        }







        setProcessing(true);





        const previousLiked = liked;

        const previousLikes = likes;



        const newLiked = !previousLiked;



        const newLikes = newLiked

        ?

        previousLikes + 1

        :

        Math.max(

            previousLikes - 1,

            0

        );







        setLiked(newLiked);

        setLikes(newLikes);







        setAnimate(true);



        setTimeout(()=>{


            setAnimate(false);


        },250);









        try{



            const result = await toggleLike(postId);



            setLiked(result);



            setLikes(prev=>{



                if(result === newLiked){


                    return prev;


                }





                return result

                ?

                prev + 1

                :

                Math.max(

                    prev - 1,

                    0

                );



            });



        }

        catch(error){



            console.log(

                "LIKE ERROR:",

                error

            );



            setLiked(previousLiked);

            setLikes(previousLikes);



        }

        finally{


            setProcessing(false);


        }



    }











    async function openLikes(){


        if(disableLikesPreview){


            return;


        }




        const data = await getLikesUsers(postId);



        setUsers(data);



        setOpenModal(true);



    }











    function startHold(){



        if(disableLikesPreview){


            return;


        }




        if(holdTimer.current){


            clearTimeout(

                holdTimer.current

            );


        }






        holdTimer.current = setTimeout(()=>{


            openLikes();



        },400);



    }









    function cancelHold(){



        if(holdTimer.current){


            clearTimeout(

                holdTimer.current

            );


            holdTimer.current=null;


        }



    }











    return(


        <>


            <Heart



                size={24}



                strokeWidth={2}



                className={`

                    like-button

                    ${liked ? "liked" : ""}

                    ${animate ? "like-pop" : ""}

                `}



                fill={

                    liked

                    ?

                    "currentColor"

                    :

                    "none"

                }





                onClick={(e)=>{


                    e.stopPropagation();


                    handleLike();



                }}





                style={{



                    pointerEvents: processing

                    ?

                    "none"

                    :

                    "auto",



                    touchAction:"manipulation"



                }}







                onMouseDown={(e)=>{


                    e.stopPropagation();


                    startHold();



                }}



                onMouseUp={(e)=>{


                    e.stopPropagation();


                    cancelHold();



                }}



                onMouseLeave={cancelHold}







                onTouchStart={(e)=>{


                    e.stopPropagation();


                    startHold();



                }}






                onTouchEnd={(e)=>{


                    e.stopPropagation();


                    cancelHold();



                }}



            />









            {

            !disableLikesPreview &&



            <LikesModal



                open={openModal}



                users={users}



                onClose={()=>{


                    setOpenModal(false);



                }}



            />

            }



        </>


    );


}