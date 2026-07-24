"use client";


import {

    useEffect,

    useState

} from "react";


import {

    supabase

} from "@/lib/supabase";


import FlashbackPost from "./FlashbackPost";


import FlashbackModal from "./FlashbackModal";









export default function FlashbackFeed({

    username,

    flashbackId,

    mode

}){



    const isSingleMode = mode === "single";


    const isUserMode = mode === "user";





    const [users,setUsers] = useState([]);


    const [selectedUser,setSelectedUser] = useState(null);


    const [memories,setMemories] = useState([]);


    const [loading,setLoading] = useState(true);


    const [showCreate,setShowCreate] = useState(false);


    const [activeTab,setActiveTab] = useState("all");


    const [currentUser,setCurrentUser] = useState(null);


    const [followingIds,setFollowingIds] = useState([]);












    function canSeeMemory(

        memory,

        user,

        following=[]

    ){



        if(memory.privacy === "public"){


            return true;


        }







        if(!user){


            return false;


        }







        if(memory.user_id === user.id){


            return true;


        }







        if(memory.privacy === "private"){


            return false;


        }







        if(memory.privacy === "followers"){



            return following.includes(

                memory.user_id

            );


        }







        return false;


    }













    async function getFollowing(user){



        if(!user){


            setFollowingIds([]);


            return [];


        }








        const {

            data,

            error

        } = await supabase



        .from("followers")


        .select(

            "following_id"

        )


        .eq(

            "follower_id",

            user.id

        );








        if(error){



            console.log(

                "FOLLOWING ERROR:",

                error

            );


            return [];


        }








        const ids = data?.map(

            item => item.following_id

        ) || [];








        setFollowingIds(ids);



        return ids;


    }













    async function getUserIdByUsername(){



        if(!username){


            return null;


        }








        const {

            data,

            error

        } = await supabase



        .from("profiles")


        .select(

            "id"

        )


        .eq(

            "username",

            username

        )


        .single();








        if(error){



            console.log(

                "PROFILE USER ERROR:",

                error

            );


            return null;


        }








        return data.id;


    }












    async function getSingleMemory(){



        if(!flashbackId){


            setMemories([]);


            return;


        }








        const {

            data,

            error

        } = await supabase



        .from("flashbacks")


        .select(`

            *,

            profile:profiles(

                username,

                avatar_url,

                is_owner

            )

        `)


        .eq(

            "id",

            flashbackId

        )


        .single();








        if(error){



            console.log(

                "SINGLE FLASHBACK ERROR:",

                error

            );


            setMemories([]);


            return;


        }








        setMemories([data]);


    }
    async function getFlashbackUsers(

        user = currentUser,

        following = followingIds

    ){



        const {

            data,

            error

        } = await supabase



        .from("flashbacks")


        .select(`

            *,

            profile:profiles(

                username,

                avatar_url,

                is_owner

            )

        `)


        .order(

            "created_at",

            {

                ascending:false

            }

        );








        if(error){



            console.log(

                "FLASHBACK USERS ERROR:",

                error

            );


            return;


        }








        const visible = data.filter(memory =>



            canSeeMemory(

                memory,

                user,

                following

            )



        );









        const grouped = {};








        visible.forEach(memory=>{



            if(!grouped[memory.user_id]){



                grouped[memory.user_id] = {



                    user_id: memory.user_id,


                    profile: memory.profile,


                    count: 1



                };



            }

            else{



                grouped[memory.user_id].count++;



            }



        });









        setUsers(

            Object.values(grouped)

        );



    }














    async function getMemories(

        userId = null,

        user = currentUser,

        following = followingIds

    ){



        const {

            data,

            error

        } = await supabase



        .from("flashbacks")


        .select(`

            *,

            profile:profiles(

                username,

                avatar_url,

                is_owner

            )

        `)


        .order(

            "created_at",

            {

                ascending:false

            }

        );









        if(error){



            console.log(

                "FLASHBACK MEMORY ERROR:",

                error

            );


            setMemories([]);


            return;


        }









        const visible = data.filter(memory=>{



            if(

                userId &&

                memory.user_id !== userId

            ){


                return false;


            }








            return canSeeMemory(

                memory,

                user,

                following

            );



        });








        setMemories(

            visible

        );



    }













    async function selectUser(id){

        if(selectedUser === id){

            setSelectedUser(null);

            setActiveTab("all");

            await getMemories(
                null,
                currentUser,
                followingIds
            );

            return;

        }

        setSelectedUser(id);

        setActiveTab(null);

        await getMemories(
            id,
            currentUser,
            followingIds
        );

    }













    function changeTab(tab){



        setActiveTab(tab);


        setSelectedUser(null);








        if(tab === "all"){



            getMemories(

                null,

                currentUser,

                followingIds

            );


        }








        if(tab === "mine" && currentUser){



            getMemories(

                currentUser.id,

                currentUser,

                followingIds

            );


        }



    }
        useEffect(()=>{



        let mounted = true;



        async function start(){



            try{



                const {

                    data:{

                        session

                    }

                } = await supabase.auth.getSession();








                const user = session?.user || null;








                if(!mounted){

                    return;

                }








                setCurrentUser(user);








                let following = [];








                if(!isSingleMode){



                    following = await getFollowing(

                        user

                    );



                }








                if(isSingleMode){



                    await getSingleMemory();



                }



                else if(isUserMode){



                    const userId = await getUserIdByUsername();







                    if(userId){



                        await getMemories(

                            userId,

                            user,

                            following

                        );



                    }

                    else{



                        setMemories([]);



                    }



                }



                else{



                    await getFlashbackUsers(

                        user,

                        following

                    );







                    await getMemories(

                        null,

                        user,

                        following

                    );



                }






            }

            catch(error){



                console.log(

                    "FLASHBACK START ERROR:",

                    error

                );



            }

            finally{



                if(mounted){



                    setLoading(false);



                }



            }



        }







        start();







        return ()=>{



            mounted = false;



        };







    },[flashbackId,username,mode]);













    if(loading){



        return(



            <p>

                Loading memories...

            </p>



        );



    }









    if(memories.length === 0){



        return(



            <p>

                No memories found.

            </p>



        );



    }









    return(



        <div className="flashback-container">







            {

            !isSingleMode && !isUserMode &&



            <button

                className="create-flashback-button"

                onClick={()=>setShowCreate(true)}

            >


                + Create Memory


            </button>



            }













            {

            !isSingleMode && !isUserMode &&



            <div className="flashback-tabs">



                <button



                    className={

                        activeTab === "all"

                        ?

                        "active"

                        :

                        ""

                    }



                    onClick={()=>changeTab("all")}

                >


                    ALL


                </button>







                <button



                    className={

                        activeTab === "mine"

                        ?

                        "active"

                        :

                        ""

                    }



                    onClick={()=>changeTab("mine")}

                >


                    MINE


                </button>



            </div>



            }









            {

            !isSingleMode && !isUserMode &&



            <div className="flashback-users">



                {

                users.map(user=>(



                    <button



                        key={user.user_id}



                        className={

                            selectedUser === user.user_id

                            ?

                            "flashback-user-card active"

                            :

                            "flashback-user-card"

                        }



                        onClick={()=>selectUser(user.user_id)}

                    >







                        {

                        user.profile?.avatar_url

                        ?



                        <img

                            src={user.profile.avatar_url}

                            alt="avatar"

                        />



                        :



                        <div className="avatar avatar-empty"/>



                        }









                        <div className="flashback-user-text">



                            <span>



                                {

                                user.profile?.username ||

                                "User"

                                }



                            </span>







                            <small>



                                {user.count} Memories



                            </small>



                        </div>





                    </button>



                ))



                }



            </div>



            }













            <div className="flashback-posts">



                {

                memories.map(memory=>(



                    <FlashbackPost



                        key={memory.id}



                        flashback={memory}



                        onDelete={(id)=>{



                            setMemories(prev=>



                                prev.filter(

                                    item =>

                                    item.id !== id

                                )



                            );



                        }}



                    />



                ))



                }



            </div>













            {

            !isSingleMode &&

            !isUserMode &&

            showCreate &&



            <FlashbackModal



                close={()=>setShowCreate(false)}



                refresh={()=>{



                    getFlashbackUsers(

                        currentUser,

                        followingIds

                    );





                    getMemories(

                        null,

                        currentUser,

                        followingIds

                    );



                }}



            />



            }









        </div>



    );



}