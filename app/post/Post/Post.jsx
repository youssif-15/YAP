"use client";


import {
    MessageCircle,
    Send,
    Bookmark,
    MoreHorizontal,
    Pencil,
    Trash2,
    ShieldCheck,
    Link as LinkIcon
} from "lucide-react";


import {
    useState,
    useEffect,
    useRef
} from "react";


import {
    useRouter
} from "next/navigation";


import {
    useAuth
} from "@/components/Auth/AuthProvider";


import { supabase } from "@/lib/supabase";


import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";


import PostMedia from "./PostMedia";

import PostLikes from "./PostLikes";

import Comments from "@/components/Comment/Comments";


import {
    getYoutubeEmbed,
    removeYoutubeLink
} from "@/lib/getYoutubeEmbed";








export default function Post({


    post,


    onDelete,


    onUnsave,


    openComments = false,


    refreshComments = 0



}){



    const router = useRouter();





    const {
        user
    } = useAuth();








    function getTextDirection(text){


        const arabic = /[\u0600-\u06FF]/;


        return arabic.test(text)

        ?

        "rtl"

        :

        "ltr";


    }









    const [showComments,setShowComments] = useState(

        openComments

    );



    const [commentsKey,setCommentsKey] = useState(0);



    const [commentsClosing,setCommentsClosing] = useState(false);



    const closeTimer = useRef(null);









    const [showMenu,setShowMenu] = useState(false);



    const [showDeletePopup,setShowDeletePopup] = useState(false);



    const [editing,setEditing] = useState(false);



    const [manageComments,setManageComments] = useState(false);



    const [shared,setShared] = useState(false);









    const [saved,setSaved] = useState(

        !!post.saved

    );



    const [saving,setSaving] = useState(false);









    useEffect(()=>{


        setSaved(

            !!post.saved

        );


    },[post.saved]);









    const [caption,setCaption] = useState(

        post.content || ""

    );



    const [currentCaption,setCurrentCaption] = useState(

        post.content || ""

    );



    const [hasEdited,setHasEdited] = useState(

        post.edited || false

    );





    const youtubeEmbed = getYoutubeEmbed(currentCaption);









    function openProfile(){



        const username =


            post.profile?.username


            ||


            post.username;







        if(username){



            router.push(


                `/profile/${username}`


            );


        }



    }
    useEffect(()=>{


        if(openComments){


            setShowComments(true);


        }


    },[openComments]);









    useEffect(()=>{


        if(refreshComments){


            setCommentsKey(prev=>


                prev+1


            );


            setShowComments(true);


        }


    },[refreshComments]);









    useEffect(()=>{


        return()=>{


            if(closeTimer.current){


                clearTimeout(


                    closeTimer.current


                );


            }


        };


    },[]);









    const time = new Intl.DateTimeFormat(


        undefined,


        {


            dateStyle:"medium",


            timeStyle:"short"


        }


    ).format(


        new Date(post.created_at)


    );









    const isOwner =


        user?.id === post.user_id;










    const canEditCaption =



        isOwner &&



        post.media &&



        post.content &&



        !hasEdited;













    async function toggleSave(){



        if(!user || saving){


            return;


        }






        setSaving(true);






        try{



            if(saved){



                const {


                    error


                } = await supabase



                .from("saved_posts")



                .delete()



                .eq(


                    "user_id",


                    user.id


                )



                .eq(


                    "post_id",


                    post.id


                );







                if(error){



                    console.log(


                        "UNSAVE ERROR:",


                        error


                    );



                    return;



                }






                setSaved(false);







                if(onUnsave){



                    onUnsave(post.id);



                }



            }









            else{



                const {


                    error


                } = await supabase



                .from("saved_posts")



                .insert({



                    user_id:user.id,



                    post_id:post.id



                });







                if(error){



                    console.log(


                        "SAVE ERROR:",


                        error


                    );



                    return;



                }






                setSaved(true);



            }






        }



        finally{



            setSaving(false);



        }



    }















    async function saveCaption(){



        if(!caption.trim()){


            return;


        }









        const {


            error


        } = await supabase



        .from("posts")



        .update({



            content:caption.trim(),



            edited:true



        })



        .eq(


            "id",


            post.id


        );









        if(error){



            console.log(


                "CAPTION UPDATE ERROR:",


                error


            );



            return;



        }








        setCurrentCaption(


            caption.trim()


        );







        setHasEdited(true);







        post.edited = true;








        setEditing(false);



    }













    async function deletePost(){



        const {


            error


        } = await supabase



        .from("posts")



        .delete()



        .eq(


            "id",


            post.id


        );







        if(error){



            console.log(


                "DELETE POST ERROR:",


                error


            );



            return;



        }






        setShowDeletePopup(false);







        if(onDelete){



            onDelete(post.id);



        }



    }
        async function copyLink(){


        await navigator.clipboard.writeText(


            `${window.location.origin}/post/${post.id}`


        );



        setShowMenu(false);



    }









    async function sharePost(){



        const url =


        `${window.location.origin}/post/${post.id}`;







        try{



            if(navigator.share){



                await navigator.share({



                    title:"YAP",



                    text:



                        post.content ||



                        "Check this post",



                    url



                });



            }







            else{



                await navigator.clipboard.writeText(



                    url



                );






                setShared(true);







                setTimeout(()=>{



                    setShared(false);



                },2000);





            }







        }



        catch(err){



            console.log(



                "SHARE ERROR:",



                err



            );



        }



    }















    function toggleComments(){



        if(showComments){



            setCommentsClosing(true);







            closeTimer.current = setTimeout(()=>{



                setShowComments(false);



                setCommentsClosing(false);



            },260);





        }







        else{



            if(closeTimer.current){



                clearTimeout(



                    closeTimer.current



                );



            }







            setCommentsClosing(false);







            setShowComments(true);



        }



    }















    return(



    <div className="post">







        <div className="post-header">







            <div



                className="post-user"



                onClick={openProfile}



                style={{



                    cursor:"pointer"



                }}



            >







                {



                post.profile?.avatar_url



                ?



                <img



                    src={post.profile.avatar_url}



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



                            post.profile?.username



                            ||



                            post.username



                            ||



                            "User"









                            }













                            {



                            post.profile?.is_owner &&







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



                showMenu &&







                <div className="post-dropdown">








                    {



                    isOwner







                    ?







                    <>











                        {



                        canEditCaption &&







                        <button



                            onClick={()=>{



                                setEditing(true);



                                setShowMenu(false);



                            }}



                        >






                            <Pencil size={15}/>






                            Edit caption








                        </button>






                        }













                        <button



                            onClick={()=>{



                                setShowDeletePopup(true);



                                setShowMenu(false);



                            }}



                        >



                            <Trash2 size={15}/>



                            Delete post





                        </button>













                        <button



                            onClick={()=>{



                                setManageComments(prev=>!prev);



                                setShowMenu(false);



                                setShowComments(true);



                            }}



                        >



                            <ShieldCheck size={15}/>








                            {



                            manageComments





                            ?





                            "Exit administration"







                            :







                            "Administrate"







                            }







                        </button>












                    </>







                    :







                    <button



                        onClick={copyLink}



                    >



                        <LinkIcon size={15}/>



                        Copy link





                    </button>







                    }







                </div>







                }








            </div>







        </div>
        






        {



        editing





        ?









        <div className="caption-edit-box">










            <textarea





                value={caption}





                dir={getTextDirection(caption)}






                onChange={e=>



                    setCaption(



                        e.target.value



                    )



                }







            />









            <div className="caption-edit-actions">







                <button



                    className="save-caption"



                    onClick={saveCaption}



                >





                    Save





                </button>









                <button



                    className="cancel-caption"



                    onClick={()=>{



                        setCaption(currentCaption);



                        setEditing(false);



                    }}



                >





                    Cancel





                </button>







            </div>







        </div>









        :









        currentCaption &&









        <p





            className="post-caption"





            dir={getTextDirection(currentCaption)}






        >








            {removeYoutubeLink(currentCaption)}









        </p>








        }












        <PostMedia

            media={post.media}

            postId={post.id}

        />









        {



        youtubeEmbed &&







        <div className="youtube-container">






            <iframe



                src={youtubeEmbed}



                title="YouTube video"



                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"



                allowFullScreen



            />







        </div>







        }












        <div className="post-actions">







            <div className="left-actions">







                <PostLikes

                    postId={post.id}

                />









                <button



                    className={



                        `comment-open-button ${

                            showComments

                            ? "active-comment"

                            : ""

                        }`



                    }







                    onClick={toggleComments}







                >







                    <MessageCircle size={21}/>







                </button>














                <button



                    className="share-button"



                    onClick={sharePost}







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















            <button



                className={



                    `save-post-button ${

                        saved

                        ? "saved"

                        : ""

                    }`







                }







                onClick={toggleSave}







                disabled={saving}







            >











                <Bookmark



                    size={22}



                    fill={



                        saved



                        ?



                        "currentColor"



                        :



                        "none"



                    }



                />











            </button>







        </div>
        











        {



        (showComments || commentsClosing) &&










        <div



            className={



                commentsClosing



                ?



                "comments-animation closing"



                :



                "comments-animation open"



            }







        >







            <Comments







                key={commentsKey}







                postId={post.id}







                canManage={manageComments}







            />











        </div>







        }















        {



        showDeletePopup &&











        <div className="delete-popup-overlay">







            <div className="delete-popup">









                <h3>







                    Delete post?







                </h3>












                <p>







                    Are you sure you want to delete this post?







                </p>















                <div className="delete-popup-actions">











                    <button







                        className="cancel-delete"







                        onClick={()=>{







                            setShowDeletePopup(false);







                        }}








                    >







                        Cancel







                    </button>















                    <button







                        className="confirm-delete"







                        onClick={deletePost}







                    >







                        Delete







                    </button>











                </div>















            </div>













        </div>







        }












    </div>







    );



}