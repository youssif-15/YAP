"use client";


import {

    useState,
    useRef

} from "react";


import {

    useRouter

} from "next/navigation";


import {

    MoreHorizontal,

    Send,

    Trash2

} from "lucide-react";


import {

    supabase

} from "@/lib/supabase";


import {

    useAuth

} from "@/components/Auth/AuthProvider";


import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";


import PostVideo from "@/app/post/Post/PostVideo";



import "./anyways.css";





export default function FlashbackPost({

    flashback,

    onDelete

}){



    const router = useRouter();


    const {user} = useAuth();


    const mediaRef = useRef(null);



    const [showMenu,setShowMenu] = useState(false);


    const [shared,setShared] = useState(false);









    function openProfile(){


        if(flashback.profile?.username){


            router.push(

                `/profile/${flashback.profile.username}`

            );


        }


    }









    async function deleteMemory(){



        const {

            error

        } = await supabase

        .from("flashbacks")

        .delete()

        .eq(

            "id",

            flashback.id

        );





        if(error){



            console.log(

                "DELETE MEMORY ERROR",

                error

            );


            return;


        }






        setShowMenu(false);





        if(onDelete){


            onDelete(

                flashback.id

            );


        }


    }









    async function shareMemory(){



        const url =

        `${window.location.origin}/flashbacks/${flashback.id}`;





        try{



            if(navigator.share){



                await navigator.share({

                    title:"YAP Memory",

                    url

                });



            }

            else{



                await navigator.clipboard.writeText(url);



                setShared(true);




                setTimeout(()=>{


                    setShared(false);


                },2000);



            }



        }

        catch(err){



            console.log(

                "SHARE ERROR",

                err

            );


        }



    }









    const time = new Intl.DateTimeFormat(

        undefined,

        {

            dateStyle:"medium",

            timeStyle:"short"

        }

    ).format(

        new Date(

            flashback.created_at

        )

    );









    const isOwner =

    user?.id === flashback.user_id;









    return(



        <div className="post flashback-post">
                        <div className="post-header">





                <div

                    className="post-user"

                    onClick={openProfile}

                >





                    {


                    flashback.profile?.avatar_url


                    ?


                    <img

                        src={flashback.profile.avatar_url}

                        className="avatar"

                        alt="avatar"

                    />


                    :


                    <div className="avatar avatar-empty"/>


                    }




                    <div>



                        <h4>


                            <span>


                                {

                                flashback.profile?.username

                                ||

                                "User"

                                }





                                {


                                flashback.profile?.is_owner &&


                                <OwnerBadge/>


                                }



                            </span>


                        </h4>





                        <small>

                            {time}

                        </small>



                    </div>





                </div>









                <div className="post-menu">



                    <button

                        onClick={()=>setShowMenu(!showMenu)}

                    >


                        <MoreHorizontal size={20}/>



                    </button>









                    {


                    showMenu && isOwner &&



                    <div className="post-dropdown">



                        <button

                            onClick={deleteMemory}

                        >



                            <Trash2 size={15}/>


                            Delete memory



                        </button>



                    </div>


                    }



                </div>





            </div>













            {


            flashback.caption &&



            <p

                className="post-caption"

            >


                {flashback.caption}



            </p>


            }














            <div className="flashback-media-wrapper">





                {


                flashback.media_type === "video"


                ?



                <PostVideo


                    video={flashback.media_url}


                />



                :



                <img



                    ref={mediaRef}



                    src={flashback.media_url}



                    className="flashback-image"



                    alt="memory"




                    onLoad={(e)=>{



                        const img = e.target;



                        const wrapper =

                        img.parentElement;






                        wrapper.style.width =


                        img.naturalWidth > 600


                        ?


                        "600px"


                        :


                        img.naturalWidth + "px";







                        wrapper.style.height =



                        img.naturalHeight > 700


                        ?


                        "700px"


                        :


                        img.naturalHeight + "px";





                    }}



                />



                }





            </div>
                        <div className="post-actions">





                <button

                    className="share-button"

                    onClick={shareMemory}

                >



                    <Send size={22}/>



                </button>









                {


                shared &&



                <span className="share-message">


                    Link copied


                </span>


                }





            </div>







        </div>



    );



}