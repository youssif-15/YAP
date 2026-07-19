"use client";

import { useState } from "react";

import {
    Send
} from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function CommentInput({

    postId,

    onComment

}){

    const [text,setText] = useState("");

    const [loading,setLoading] = useState(false);

    async function addComment(){

        if(

            !text.trim()

            ||

            loading

        ){

            return;

        }

        try{

            setLoading(true);

            const {

                data:{

                    user

                }

            } = await supabase.auth.getUser();

            if(!user){

                return;

            }

            const content = text.trim();

            const optimisticComment = {

                id:

                "temp-" + Date.now(),

                post_id:postId,

                user_id:user.id,

                content,

                created_at:new Date(),

                edited:false,

                likes_count:0,

                profiles:{

                    username:

                    user.email?.split("@")[0]

                    ||

                    "User",

                    avatar:null

                }

            };

            if(onComment){

                onComment(

                    optimisticComment

                );

            }

            setText("");

            const {

                data,

                error

            } = await supabase

            .from("comments")

            .insert({

                post_id:postId,

                user_id:user.id,

                content

            })

            .select(`

                id,

                post_id,

                content,

                created_at,

                user_id,

                edited,

                likes_count,

                profiles(

                    username,

                    avatar

                )

            `)

            .single();

            console.log(

                "COMMENT RESULT:",

                data,

                error

            );

            if(error){

                return;

            }

            const {

                data:post,

                error:postError

            } = await supabase

            .from("posts")

            .select(

                "user_id"

            )

            .eq(

                "id",

                postId

            )

            .single();

            console.log(

                "POST OWNER:",

                post

            );

            console.log(

                "POST ERROR:",

                postError

            );
                        if(

                post &&

                post.user_id !== user.id

            ){

                const {

                    error:notificationError

                } = await supabase

                .from("notifications")

                .insert({

                    user_id:post.user_id,

                    actor_id:user.id,

                    type:"comment",

                    post_id:postId,

                    comment_id:data.id,

                    read:false

                });

                if(notificationError){

                    console.log(

                        "COMMENT NOTIFICATION ERROR:",

                        notificationError

                    );

                }

            }

            if(onComment){

                onComment(

                    data

                );

            }

        }

        catch(err){

            console.log(

                "COMMENT ERROR:",

                err

            );

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <div className="comment-input-wrapper">

            <textarea

                className="comment-input"

                placeholder="Write a comment..."

                value={text}

                onChange={(e)=>

                    setText(e.target.value)

                }

            />

            <button

                className="comment-send-button"

                disabled={loading}

                onClick={addComment}

            >

                <Send size={18}/>

            </button>

        </div>

    );

}