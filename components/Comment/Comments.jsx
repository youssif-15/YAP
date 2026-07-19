"use client";


import {

    useEffect,

    useState

} from "react";


import { supabase } from "@/lib/supabase";

import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";

import CommentItem from "./CommentItem";


import CommentInput from "./CommentInput";









export default function Comments({

    postId,

    canManage = false

}){





    const [comments,setComments] = useState([]);


    const [loading,setLoading] = useState(true);









    async function getComments(){



        const {

            data,

            error

        } = await supabase

        .from("comments")

        .select(`

            id,

            post_id,

            content,

            created_at,

            user_id,

            parent_id,

            reply_to,

            edited,

            profiles(

                username,

                avatar_url,

                is_owner

            ),

            comment_likes(

                id

            )

        `)
        .eq(

            "post_id",

            postId

        );









        if(error){



            console.log(

                "COMMENTS ERROR:",

                error

            );



            setLoading(false);


            return;


        }









        const formatted =

        (data || []).map(comment=>({



            ...comment,



            likes_count:

            comment.comment_likes?.length || 0



        }));









        const mainComments =

        formatted.filter(comment=>

            !comment.parent_id

        );









        const withReplies =

        mainComments.map(comment=>({



            ...comment,



            replies:



            formatted

            .filter(reply=>

                reply.parent_id === comment.id

            )

            .sort((a,b)=>{



                return(

                    new Date(a.created_at)

                    -

                    new Date(b.created_at)

                );



            })



        }));









        withReplies.sort((a,b)=>{





            function score(comment){



                const likes =

                comment.likes_count || 0;







                const age =

                (

                    Date.now()

                    -

                    new Date(

                        comment.created_at

                    )

                )

                /

                1000;







                return(

                    likes * 100

                    +

                    Math.max(

                        0,

                        50000-age

                    )

                );



            }







            return score(b)-score(a);



        });









        setComments(withReplies);


        setLoading(false);



    }












    useEffect(()=>{



        getComments();



    },[postId]);












    function addComment(comment){



        setComments(prev=>[



            ...prev,

            comment



        ]);



    }












    return(



        <div className="comments">







            <CommentInput



                postId={postId}



                onComment={addComment}



            />









            {


            loading &&



            <p>



                Loading comments...



            </p>



            }









            {


            !loading && comments.length===0 &&



            <p className="no-comments">



                No comments yet.



            </p>



            }









            {


            comments.map(comment=>(



                <div

                    key={comment.id}

                    className="comment-enter"

                >



                    <CommentItem



                        comment={comment}



                        onDelete={getComments}



                        canManage={canManage}



                    />



                </div>



            ))



            }







        </div>



    );



}