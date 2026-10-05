"use client";


import ProtectedRoute from "@/components/Auth/ProtectedRoute";


import { 
    useEffect,
    useRef,
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
    const POSTS_PAGE_SIZE = 6;



    const [posts,setPosts] = useState([]);



    const [loading,setLoading] = useState(true);

    const [loadingMore,setLoadingMore] = useState(false);

    const [hasMore,setHasMore] = useState(true);

    const cursorRef = useRef(null);

    const hasMoreRef = useRef(true);

    const loadingMoreRef = useRef(false);

    const loadMoreTriggerRef = useRef(null);









    async function getPosts(initial=false){

        if(initial){

            setLoading(true);

            cursorRef.current = null;

            hasMoreRef.current = true;

            setHasMore(true);

        }
        else if(loadingMoreRef.current || !hasMoreRef.current){

            return;

        }
        else{

            loadingMoreRef.current = true;

            setLoadingMore(true);

        }

        const cursor = initial ? null : cursorRef.current;



        const {

            data:postsData,

            error

        } = await supabase



        .from("posts")



        .select("*")

        .or(
            cursor
                ? `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
                : "id.not.is.null"
        )

        .limit(POSTS_PAGE_SIZE)



        .order(


            "created_at",


            {

                ascending:false

            }

        )

        .order("id",{ascending:false});








        if(error){



            console.log(

                "POST ERROR:",

                error

            );

            hasMoreRef.current = false;

            setHasMore(false);

            loadingMoreRef.current = false;

            setLoadingMore(false);



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








        const lastPost = postsData[postsData.length - 1];

        if(lastPost){

            cursorRef.current = {
                created_at:lastPost.created_at,
                id:lastPost.id
            };

        }

        const moreAvailable = postsData.length === POSTS_PAGE_SIZE;

        hasMoreRef.current = moreAvailable;

        setHasMore(moreAvailable);

        setPosts(previousPosts=>{

            const existingIds = new Set(
                previousPosts.map(post=>post.id)
            );

            const newPosts = postsWithProfiles.filter(
                post=>!existingIds.has(post.id)
            );

            const combinedPosts = initial
                ? [...newPosts,...previousPosts]
                : [...previousPosts,...newPosts];

            return combinedPosts.sort((left,right)=>{

                const dateDifference =
                    new Date(right.created_at) - new Date(left.created_at);

                if(dateDifference !== 0){

                    return dateDifference;

                }

                return String(right.id).localeCompare(String(left.id));

            });

        });

        setLoading(false);

        loadingMoreRef.current = false;

        setLoadingMore(false);

    }












    useEffect(()=>{



        testSupabase();



        getPosts(true);

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
                        .select("username, avatar_url, is_owner")
                        .eq("id",newPost.user_id)
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












    useEffect(()=>{

        const target = loadMoreTriggerRef.current;

        if(!target || loading || loadingMore || !hasMore){

            return;

        }

        const observer = new IntersectionObserver(

            entries=>{

                if(entries.some(entry=>entry.isIntersecting)){

                    getPosts();

                }

            },

            {

                rootMargin:"400px"

            }

        );

        observer.observe(target);

        return ()=>observer.disconnect();

    },[loading,loadingMore,hasMore,posts.length]);

    return(





        <ProtectedRoute>







            <div className="app-layout">





                <Sidebar/>









                <main className="content">





                    <Story/>






                    <CreatePost/>









                    {

                        loading &&


                        <HomeSkeleton showStories={false}/>


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

                                deferVideo





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









                    {!loading && posts.length > 0 && hasMore && (
                        <div ref={loadMoreTriggerRef}/>
                    )}

                    {loadingMore && <HomeSkeleton showStories={false}/>}

                </main>









                <UserCard/>









            </div>







        </ProtectedRoute>




    );



}