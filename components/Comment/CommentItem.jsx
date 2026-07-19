"use client";


import {

    Heart,

    MoreHorizontal,

    Trash2,

    Pencil,

    Reply

} from "lucide-react";


import {

    useEffect,

    useState

} from "react";


import {

    useRouter

} from "next/navigation";


import { supabase } from "@/lib/supabase";


import ReplyInput from "./ReplyInput";


import CommentText from "./CommentText";


import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";





export default function CommentItem({

    comment,

    onDelete,

    canManage = false

}){



    const router = useRouter();



    function openProfile(){


        const username =

            comment.profiles?.username;



        if(username){


            router.push(

                `/profile/${username}`

            );


        }


    }






    const [user,setUser] = useState(null);


    const [menu,setMenu] = useState(false);


    const [editing,setEditing] = useState(false);


    const [text,setText] = useState(

        comment.content || ""

    );


    const [likes,setLikes] = useState(

        comment.likes_count || 0

    );


    const [liked,setLiked] = useState(false);


    const [showReply,setShowReply] = useState(false);


    const [showReplies,setShowReplies] = useState(false);


    const [confirmDelete,setConfirmDelete] = useState(false);





    useEffect(()=>{


        loadUser();


    },[]);





    async function loadUser(){



        if(

            comment.id?.startsWith("temp-")

        ){

            return;

        }





        const {

            data:{

                user

            }

        } = await supabase.auth.getUser();





        setUser(user);





        if(user){



            const {

                data

            } = await supabase

            .from("comment_likes")

            .select("id")

            .eq(

                "comment_id",

                comment.id

            )

            .eq(

                "user_id",

                user.id

            )

            .maybeSingle();





            setLiked(!!data);



        }



    }
        async function toggleLike(){



        if(!user){

            return;

        }





        if(liked){



            const {

                error

            } = await supabase

            .from("comment_likes")

            .delete()

            .eq(

                "comment_id",

                comment.id

            )

            .eq(

                "user_id",

                user.id

            );



            if(error){

                console.log(

                    "LIKE DELETE ERROR:",

                    error

                );

                return;

            }


            setLikes(prev=>

                Math.max(prev-1,0)

            );


            setLiked(false);



        }

        else{


            const {

                error

            } = await supabase

            .from("comment_likes")

            .insert({

                comment_id:comment.id,

                user_id:user.id

            });


            if(error){

                console.log(

                    "LIKE INSERT ERROR:",

                    error

                );

                return;

            }


            setLikes(prev=>

                prev+1

            );


            setLiked(true);



        }



    }








    async function saveEdit(){


        if(!text.trim()){

            return;

        }


        const {

            error

        } = await supabase

        .from("comments")

        .update({

            content:text.trim(),

            edited:true

        })

        .eq(

            "id",

            comment.id

        );


        if(error){

            console.log(

                "EDIT ERROR:",

                error

            );

            return;

        }


        comment.content = text.trim();

        comment.edited = true;


        setText(text.trim());

        setEditing(false);

    }





    async function deleteComment(){

        setConfirmDelete(true);

    }





    async function confirmDeleteComment(){


        setConfirmDelete(false);


        if(

            comment.parent_id &&

            comment.replies?.length

        ){


            const {

                error:updateError

            } = await supabase

            .from("comments")

            .update({

                parent_id:comment.parent_id,

                reply_to:comment.reply_to

            })

            .eq(

                "parent_id",

                comment.id

            );


            if(updateError){

                console.log(

                    "MOVE REPLIES ERROR:",

                    updateError

                );

                return;

            }

        }


        const {

            error

        } = await supabase

        .from("comments")

        .delete()

        .eq(

            "id",

            comment.id

        );


        if(error){

            console.log(

                "DELETE ERROR:",

                error

            );

            return;

        }


        if(onDelete){

            onDelete();

        }

    }





    const isOwner =

    user?.id === comment.user_id;



    const canDeleteComment =

    isOwner || canManage;
    return(


    <div className="comment-wrapper">


        <div className="comment-card">


            <div className="comment-header">


                {


                comment.profiles?.avatar_url

                ?

                <img

                    src={comment.profiles.avatar_url}

                    className="comment-avatar"

                    onClick={openProfile}

                    style={{

                        cursor:"pointer"

                    }}

                />

                :

                <div

                    className="comment-avatar-default"

                    onClick={openProfile}

                    style={{

                        cursor:"pointer"

                    }}

                />

                }



                <div className="comment-info">


                    <strong

                        onClick={openProfile}

                        style={{

                            cursor:"pointer"

                        }}

                    >


                        {

                        comment.profiles?.username

                        ||

                        "User"

                        }



                        {


                        comment.profiles?.is_owner &&

                        <OwnerBadge/>

                        }


                    </strong>



                    <small>


                        {


                        new Date(

                            comment.created_at

                        ).toLocaleString()


                        }


                    </small>


                </div>
                                    {

                    canDeleteComment &&


                    <div className="comment-menu">


                        <button


                            type="button"


                            onClick={()=>setMenu(!menu)}


                        >


                            <MoreHorizontal size={18}/>


                        </button>


                        {


                        menu &&


                        <div className="comment-dropdown">


                            {


                            isOwner &&


                            <button


                                onClick={()=>{


                                    setEditing(true);


                                    setMenu(false);


                                }}


                            >


                                <Pencil size={15}/>


                                Edit


                            </button>


                            }


                            <button


                                onClick={deleteComment}


                            >


                                <Trash2 size={15}/>


                                Delete


                            </button>


                        </div>


                        }


                    </div>


                    }


                </div>





                {


                editing


                ?


                <>


                    <textarea


                        className="comment-edit"


                        value={text}


                        onChange={e=>

                            setText(e.target.value)

                        }


                    />



                    <button


                        className="save-comment"


                        onClick={saveEdit}


                    >


                        Save


                    </button>


                </>


                :


                <p className="comment-text">


                    <CommentText

                        text={comment.content}

                    />


                    {


                    comment.edited &&


                    <span className="edited">


                        {" "}edited


                    </span>


                    }


                </p>


                }




                <div className="comment-actions">


                    <button

                        type="button"

                        className={

                            liked

                            ?

                            "liked-comment"

                            :

                            ""

                        }

                        onClick={toggleLike}

                    >

                        <Heart

                            size={16}

                            fill={

                                liked

                                ?

                                "currentColor"

                                :

                                "none"

                            }

                        />

                        {likes}

                    </button>



                    <button

                        type="button"

                        className="reply-action-button"

                        onClick={()=>setShowReply(!showReply)}

                    >

                        <Reply size={15}/>

                        Reply

                    </button>



                    {


                    comment.replies?.length>0 &&


                    <button

                        type="button"

                        className="toggle-replies"

                        onClick={()=>setShowReplies(!showReplies)}

                    >

                        {

                        showReplies

                        ?

                        "Hide replies"

                        :

                        `View ${comment.replies.length} ${

                            comment.replies.length===1

                            ?

                            "reply"

                            :

                            "replies"

                        }`

                        }

                    </button>


                    }


                </div>


            </div>






            {


            showReply &&


            <ReplyInput

                parentId={

                    comment.parent_id

                    ||

                    comment.id

                }

                replyTo={comment}

                postId={comment.post_id}

                onReply={()=>setShowReply(false)}

            />


            }







            {


            showReplies && comment.replies?.length>0 &&


            <div className="comment-replies">


                {


                comment.replies.map(reply=>(


                    <div

                        key={reply.id}

                        className="comment-enter"

                    >


                        <CommentItem

                            comment={reply}

                            onDelete={onDelete}

                            canManage={canManage}

                        />


                    </div>


                ))


                }


            </div>


            }







            {


            confirmDelete &&


            <div className="confirm-overlay">


                <div className="confirm-box">


                    <h3>

                        Delete comment?

                    </h3>



                    {


                    !comment.parent_id && comment.replies?.length>0


                    ?


                    <p>


                        This comment has <b>

                            {comment.replies.length}

                        </b>{" "}

                        replies.


                        <br/>


                        They will all be permanently deleted.


                    </p>


                    :


                    <p>


                        This action cannot be undone.


                    </p>


                    }



                    <div className="confirm-actions">


                        <button

                            className="cancel-delete"

                            onClick={()=>setConfirmDelete(false)}

                        >

                            Cancel

                        </button>



                        <button

                            className="delete-confirm"

                            onClick={confirmDeleteComment}

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