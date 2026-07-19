"use client";

import {

    useEffect,

    useState

} from "react";

import {

    useParams,

    useRouter

} from "next/navigation";

import { supabase } from "@/lib/supabase";

import Sidebar from "@/components/Sidebar/Sidebar";

import UserCard from "@/components/UserCard/UserCard";

import Post from "@/app/post/Post/Post";

export default function PostPage(){

    const params = useParams();

    const router = useRouter();

    const id = params.id;

    const [post,setPost] = useState(null);

    const [loading,setLoading] = useState(true);

    async function getPost(){

        const {

            data:postData,

            error

        } = await supabase

        .from("posts")

        .select("*")

        .eq(

            "id",

            id

        )

        .single();

        if(error){

            console.log(

                "POST PAGE ERROR:",

                error

            );

            setLoading(false);

            return;

        }

        const {

            data:profile,

            error:profileError

        } = await supabase

        .from("profiles")

        .select(

            "username, avatar"

        )

        .eq(

            "id",

            postData.user_id

        )

        .single();

        if(profileError){

            console.log(

                "PROFILE ERROR:",

                profileError

            );

        }

        setPost({

            ...postData,

            profile

        });

        setLoading(false);

    }

    useEffect(()=>{

        getPost();

    },[id]);

    if(loading){

        return <p>Loading...</p>;

    }

    if(!post){

        return <p>Post not found.</p>;

    }

    return(

        <div className="app-layout">

            <Sidebar/>

            <main className="content single-post-content">

                <div className="single-post-actions">

                    <button

                        className="back-button"

                        onClick={()=>router.back()}

                    >

                        <span>

                            ← Back

                        </span>

                    </button>

                </div>

                <Post

                    post={post}

                    openComments={true}

                />

            </main>

            <UserCard/>

        </div>

    );

}