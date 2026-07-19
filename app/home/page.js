"use client";


import ProtectedRoute from "@/components/Auth/ProtectedRoute";


import { 
    useEffect,
    useState
} from "react";


import { supabase } from "@/lib/supabase";


import { testSupabase } from "@/lib/testSupabase";



import Sidebar from "@/components/Sidebar/Sidebar";


import Story from "@/components/Story/Story";


import Post from "@/app/post/Post/Post";


import UserCard from "@/components/UserCard/UserCard";


import CreatePost from "@/app/post/Post/CreatePost";


import HomeSkeleton from "@/components/Skeleton/HomeSkeleton";








export default function Home(){



    const [posts,setPosts] = useState([]);



    const [loading,setLoading] = useState(true);









    async function getPosts(){



        const {

            data:postsData,

            error

        } = await supabase



        .from("posts")



        .select("*")



        .order(


            "created_at",


            {

                ascending:false

            }

        );







        if(error){



            console.log(

                "POST ERROR:",

                error

            );



            setLoading(false);


            return;


        }










        const {


            data:{


                user


            }


        } = await supabase.auth.getUser();









        const postsWithProfiles = await Promise.all(




            postsData.map(async(post)=>{





                const [



                    profileResult,

                    savedResult



                ] = await Promise.all([






                    supabase



                    .from("profiles")



                    .select(


                        "username, avatar_url, is_owner"


                    )



                    .eq(


                        "id",


                        post.user_id


                    )



                    .single(),







                    user



                    ?



                    supabase



                    .from("saved_posts")



                    .select("id")



                    .eq(


                        "user_id",


                        user.id


                    )



                    .eq(


                        "post_id",


                        post.id


                    )



                    .maybeSingle()






                    :



                    Promise.resolve({



                        data:null



                    })





                ]);









                return {



                    ...post,



                    profile:profileResult.data,



                    saved:!!savedResult.data



                };




            })



        );








        setPosts(


            postsWithProfiles


        );



        setLoading(false);



    }












    useEffect(()=>{



        testSupabase();



        getPosts();



    },[]);












    useEffect(()=>{





        const channel = supabase





        .channel("posts-feed")





        .on(





            "postgres_changes",





            {

                event:"INSERT",

                schema:"public",

                table:"posts"


            },





            async(payload)=>{





                const newPost = payload.new;









                const [



                    profileResult,

                    userResult



                ] = await Promise.all([







                    supabase



                    .from("profiles")



                    .select(


                        "username, avatar_url, is_owner"


                    )



                    .eq(


                        "id",


                        newPost.user_id


                    )



                    .single(),







                    supabase.auth.getUser()






                ]);









                const currentUser = userResult.data.user;






                let saved = false;








                if(currentUser){





                    const {


                        data



                    } = await supabase




                    .from("saved_posts")




                    .select("id")




                    .eq(


                        "user_id",


                        currentUser.id


                    )




                    .eq(


                        "post_id",


                        newPost.id


                    )




                    .maybeSingle();







                    saved = !!data;



                }









                setPosts(prev=>{





                    const exists = prev.some(



                        post=>post.id === newPost.id



                    );







                    if(exists){



                        return prev;



                    }







                    return [





                        {


                            ...newPost,



                            profile:profileResult.data,



                            saved



                        },



                        ...prev





                    ];





                });







            }



        )



        .subscribe();









        return()=>{



            supabase.removeChannel(channel);



        };






    },[]);












    return(





        <ProtectedRoute>







            <div className="app-layout">





                <Sidebar/>









                <main className="content">





                    <Story/>






                    <CreatePost/>









                    {

                        loading &&


                        <HomeSkeleton/>


                    }









                    {

                        !loading && posts.length === 0 &&


                        <p>

                            No posts yet.

                        </p>


                    }









                    {

                        !loading && posts.map(post=>(





                            <Post



                                key={post.id}



                                post={post}





                                onDelete={(id)=>{






                                    setPosts(prev=>



                                        prev.filter(



                                            item=>item.id !== id



                                        )



                                    );





                                }}






                            />





                        ))



                    }









                </main>









                <UserCard/>









            </div>







        </ProtectedRoute>




    );



}