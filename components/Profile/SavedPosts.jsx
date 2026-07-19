"use client";

import {
    useEffect,
    useState
} from "react";

import Post from "@/app/post/Post/Post";

export default function SavedPosts({

    posts=[],

    onUnsave

}){

    const [localPosts,setLocalPosts] = useState(posts);

    useEffect(()=>{

        setLocalPosts(posts);

    },[posts]);

    function handleUnsave(id){

        setLocalPosts(prev=>

            prev.filter(

                post=>post.id!==id

            )

        );

        if(onUnsave){

            onUnsave(id);

        }

    }

    if(localPosts.length===0){

        return(

            <div className="profile-empty">

                No saved posts yet.

            </div>

        );

    }

    return(

        <div className="profile-posts">

            {

                localPosts.map(post=>(

                    <Post

                        key={post.id}

                        post={post}

                        onUnsave={handleUnsave}

                    />

                ))

            }

        </div>

    );

}