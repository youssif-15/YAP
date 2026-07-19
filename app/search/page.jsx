"use client";


import {

    useEffect,

    useState,

    useRef

} from "react";


import { supabase } from "@/lib/supabase";


import { Search } from "lucide-react";


import {

    useRouter,

    useSearchParams

} from "next/navigation";


import Post from "@/app/post/Post/Post";


import "./search.css";






export default function SearchPage(){



    const router = useRouter();


    const searchParams = useSearchParams();


    const loaded = useRef(false);







    const [currentUser,setCurrentUser] = useState(null);


    const [query,setQuery] = useState("");


    const [searchResults,setSearchResults] = useState([]);


    const [suggestedUsers,setSuggestedUsers] = useState([]);


    const [suggestedPosts,setSuggestedPosts] = useState([]);


    const [followingUsers,setFollowingUsers] = useState([]);









    useEffect(()=>{


        if(loaded.current){

            return;

        }



        loaded.current = true;



        loadPage();



    },[]);









    useEffect(()=>{


        const q = searchParams.get("q");



        if(q){


            setQuery(q);


            searchUsers(q);


        }



    },[searchParams]);









    async function loadPage(){



        const {


            data:{


                user


            }



        } = await supabase.auth.getUser();







        if(!user){


            return;


        }







        setCurrentUser(user);








        await Promise.all([



            loadSuggestedUsers(user.id),



            loadSuggestedPosts(user.id)



        ]);



    }









    async function searchUsers(value=query){



        if(value.trim()===""){



            setSearchResults([]);



            return;



        }







        const {


            data,

            error


        } = await supabase



        .from("profiles")



        .select(`

            id,

            username,

            full_name,

            avatar_url,

            is_owner

        `)



        .or(


            `username.ilike.%${value}%,full_name.ilike.%${value}%`


        )



        .limit(20);








        if(error){



            console.log(


                "SEARCH ERROR",


                error


            );



            return;



        }









        const filtered = (data || [])

        .filter(user =>


            user.id !== currentUser?.id


        );








        setSearchResults(filtered);



    }









    async function loadSuggestedUsers(userId){



        const {

            data:following

        } = await supabase

        .from("followers")

        .select(

            "following_id"

        )

        .eq(

            "follower_id",

            userId

        );








        const followingIds =

        following?.map(

            item=>item.following_id

        ) || [];







        setFollowingUsers(

            followingIds

        );











        const {

            data

        } = await supabase

        .from("profiles")

        .select(`

            id,

            username,

            full_name,

            avatar_url,

            is_owner

        `)

        .neq(

            "id",

            userId

        )

        .limit(30);









        const users = (data || [])

        .filter(user =>

            user.id !== userId

        )

        .slice(

            0,

            10

        );







        setSuggestedUsers(users);



    }









    async function followUser(id){



        if(!currentUser){


            return;


        }








        const alreadyFollow =

        followingUsers.includes(id);









        if(alreadyFollow){



            const {

                error

            } = await supabase

            .from("followers")

            .delete()

            .eq(

                "follower_id",

                currentUser.id

            )

            .eq(

                "following_id",

                id

            );









            if(error){



                console.log(


                    "UNFOLLOW ERROR",


                    error


                );



                return;



            }









            setFollowingUsers(prev=>

                prev.filter(

                    userId=>

                    userId !== id

                )

            );







            return;



        }









        const {

            error

        } = await supabase

        .from("followers")

        .insert({

            follower_id:

            currentUser.id,


            following_id:

            id

        });









        if(error){



            console.log(


                "FOLLOW ERROR",


                error


            );



            return;



        }









        setFollowingUsers(prev=>[

            ...prev,

            id

        ]);





    }
        async function loadSuggestedPosts(userId){



        const {

            data:following

        } = await supabase

        .from("followers")

        .select(

            "following_id"

        )

        .eq(

            "follower_id",

            userId

        );









        const ids =

        following?.map(

            item=>item.following_id

        ) || [];









        if(ids.length===0){



            setSuggestedPosts([]);



            return;



        }









        const {

            data:posts,

            error

        } = await supabase

        .from("posts")

        .select(`

            id,

            user_id,

            type,

            content,

            caption,

            media,

            images,

            video,

            created_at,

            edited,

            profiles(

                id,

                username,

                full_name,

                avatar_url,

                is_owner

            )

        `)

        .in(

            "user_id",

            ids

        )

        .limit(20);









        if(error){



            console.log(

                "POST LOAD ERROR",

                error

            );



            return;



        }









        const finalPosts =

        (posts || []).map(post=>({



            ...post,



            profile:

            post.profiles



        }));









        setSuggestedPosts(finalPosts);



    }









    return(



        <div className="search-page">







            <div className="search-input">



                <Search size={22}/>







                <input



                    placeholder="Search"



                    value={query}





                    onChange={(e)=>{



                        const value=e.target.value;



                        setQuery(value);



                        searchUsers(value);



                    }}



                />





            </div>
                        {


            searchResults.length > 0 &&



            <section>


                <h2>

                    Results

                </h2>





                {

                searchResults.map(user=>(



                    <div


                        className="user-card"


                        key={user.id}


                        onClick={()=>


                            router.push(

                                `/profile/${user.username}`

                            )


                        }


                    >






                        <img


                            src={user.avatar_url}


                            className="user-avatar"


                        />








                        <div>


                            <b>

                                {user.username}

                            </b>



                            <p>

                                {user.full_name}

                            </p>



                        </div>





                    </div>



                ))



                }



            </section>



            }









            <section>


                <h2>

                    People you may know

                </h2>








                {


                suggestedUsers.map(user=>(



                    <div


                        className="user-card"


                        key={user.id}


                    >







                        <div


                            className="user-main"


                            onClick={()=>


                                router.push(

                                    `/profile/${user.username}`

                                )


                            }


                        >







                            <img


                                src={user.avatar_url}


                                className="user-avatar"


                            />









                            <div>


                                <b>

                                    {user.username}

                                </b>




                                <p>

                                    {user.full_name}

                                </p>



                            </div>





                        </div>









                        <button



                            className={


                                followingUsers.includes(user.id)


                                ?


                                "follow-button following"


                                :


                                "follow-button"


                            }





                            onClick={()=>followUser(user.id)}



                        >



                            {


                            followingUsers.includes(user.id)


                            ?


                            "Following"


                            :


                            "Follow"


                            }



                        </button>







                    </div>



                ))



                }



            </section>
                        <section>


                <h2>

                    Suggested Posts

                </h2>







                <div className="suggested-posts-list">





                    {


                    suggestedPosts.map(post=>(





                        <Post


                            key={post.id}


                            post={post}



                        />





                    ))





                    }





                </div>





            </section>







        </div>



    );



}