"use client";


import {

    useEffect,

    useState

} from "react";


import { supabase } from "@/lib/supabase";


import Post from "@/app/post/Post/Post";




export default function ProfilePosts({

    userId

}){


    const [posts,setPosts] = useState([]);

    const [loading,setLoading] = useState(true);







    useEffect(()=>{


        if(userId){

            loadPosts();

        }


    },[userId]);









    async function loadPosts(){



        setLoading(true);




        const {

            data,

            error

        } = await supabase



        .from("posts")



        .select(`

            *,

            profile:profiles(

                username,

                avatar_url,

                full_name

            )

        `)



        .eq(

            "user_id",

            userId

        )



        .order(

            "created_at",

            {

                ascending:false

            }

        );







        if(error){


            console.log(

                "PROFILE POSTS ERROR:",

                error

            );


            setPosts([]);

            setLoading(false);

            return;


        }






        setPosts(

            data || []

        );


        setLoading(false);



    }









    if(loading){


        return(

            <div className="profile-loading">

                Loading posts...

            </div>

        );


    }








    if(posts.length === 0){


        return(

            <div className="profile-empty">

                No posts yet.

            </div>

        );


    }









    return(


        <div className="profile-posts">


            {

                posts.map(post=>(


                    <Post

                        key={post.id}

                        post={post}

                    />


                ))

            }


        </div>


    );


}