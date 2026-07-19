"use client";

import {

    useState

} from "react";

import {

    Send

} from "lucide-react";

import {

    supabase

} from "@/lib/supabase";

export default function ReplyInput({

    parentId,

    replyTo,

    postId,

    onReply

}){

    const username =

    replyTo?.profiles?.username

    ||

    "User";

    const [text,setText] = useState(

        `@${username} `

    );

    const [loading,setLoading] = useState(false);

    async function sendReply(){

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

            const {

                data,

                error

            } = await supabase

            .from("comments")

            .insert({

                post_id:postId,

                user_id:user.id,

                content:text.trim(),

                parent_id:parentId,

                reply_to:replyTo.id

            })

            .select()

            .single();

            if(error){

                throw error;

            }

            if(

                replyTo?.user_id

                &&

                replyTo.user_id !== user.id

            ){

                const {

                    error:notificationError

                } = await supabase

                .from("notifications")

                .insert({

                    user_id:replyTo.user_id,

                    actor_id:user.id,

                    type:"reply",

                    post_id:postId,

                    comment_id:data.id,

                    read:false

                });

                if(notificationError){

                    console.log(

                        "REPLY NOTIFICATION ERROR:",

                        notificationError

                    );

                }

            }

            setText(

                `@${username} `

            );
                        if(onReply){

                onReply(data);

            }

        }

        catch(err){

            console.log(

                "REPLY ERROR:",

                err

            );

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <div className="reply-input-wrapper">

            <textarea

                className="reply-input"

                value={text}

                onChange={e=>

                    setText(e.target.value)

                }

                placeholder="Write a reply..."

            />

            <button

                className="reply-send-button"

                onClick={sendReply}

                disabled={loading}

            >

                <Send size={18}/>

            </button>

        </div>

    );

}