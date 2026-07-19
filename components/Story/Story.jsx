"use client";


import {

    useEffect,

    useState

} from "react";


import { supabase } from "@/lib/supabase";


import CreateStory from "./CreateStory";


import StoryViewer from "./StoryViewer";


import StoryRing from "./StoryRing";







export default function Story(){



    const [storyGroups,setStoryGroups] = useState([]);


    const [myProfile,setMyProfile] = useState(null);


    const [myStories,setMyStories] = useState([]);


    const [viewer,setViewer] = useState(false);


    const [viewerGroups,setViewerGroups] = useState([]);


    const [startIndex,setStartIndex] = useState(0);


    const [loading,setLoading] = useState(true);









    async function loadStories(){



        const {

            data:{

                user

            }

        } = await supabase.auth.getUser();








        const {

            data,

            error

        } = await supabase

        .from("stories")

        .select(`

            id,

            user_id,

            media_url,

            media_type,

            caption,

            created_at,

            expires_at,


            profiles(

                id,

                username,

                avatar_url,

                is_owner

            ),


            story_views(

                id,

                user_id

            )

        `)

        .gt(

            "expires_at",

            new Date().toISOString()

        )

        .order(

            "created_at",

            {

                ascending:true

            }

        );








        if(error){


            console.log(

                "STORY LOAD ERROR:",

                error

            );


            setLoading(false);


            return;


        }








        let groups=[];








        data.forEach(story=>{



            const existing = groups.find(

                item=>

                item.user_id === story.user_id

            );





            if(existing){



                existing.stories.push(story);



            }


            else{



                groups.push({


                    user_id:story.user_id,


                    profile:story.profiles,


                    stories:[story]


                });



            }



        });








        if(user){



            const mine = groups.find(

                item=>

                item.user_id === user.id

            );





            if(mine){



                setMyStories(

                    mine.stories

                );



                groups = groups.filter(

                    item=>

                    item.user_id !== user.id

                );



            }



        }








        setStoryGroups(groups);


        setLoading(false);



    }









    async function loadProfile(){



        const {

            data:{

                user

            }

        } = await supabase.auth.getUser();





        if(!user){

            return;

        }








        const {

            data

        } = await supabase

        .from("profiles")

        .select(`

            id,

            username,

            avatar_url,

            is_owner

        `)

        .eq(

            "id",

            user.id

        )

        .single();





        setMyProfile(data);



    }









    useEffect(()=>{


        loadStories();

        loadProfile();


    },[]);









    function openMyStory(){



        setViewerGroups([



            {

                user_id:myProfile.id,

                profile:myProfile,

                stories:myStories

            },


            ...storyGroups



        ]);



        setStartIndex(0);


        setViewer(true);



    }









    function openOtherStory(index){



        setViewerGroups(

            storyGroups

        );


        setStartIndex(index);


        setViewer(true);



    }












    return(



        <>

        <div className="stories">







            {


            myProfile &&



            <div className="story">



                <CreateStory


                    avatar={

                        myProfile.avatar_url

                    }


                    stories={myStories}


                    hasStory={

                        myStories.length > 0

                    }


                    onViewStory={openMyStory}


                    onCreated={loadStories}


                />



                <span>

                    Your Story

                </span>



            </div>



            }









            {


            !loading &&


            storyGroups.map((group,index)=>(



                <div

                    className="story"

                    key={group.user_id}

                    onClick={()=>openOtherStory(index)}

                >



                    <StoryRing


                        avatar={

                            group.profile?.avatar_url

                        }


                        stories={

                            group.stories

                        }


                    />





                    <span>

                    {

                    group.profile?.username

                    ||

                    "User"

                    }


                    </span>



                </div>



            ))



            }





        </div>









        {


        viewer &&



        <StoryViewer


            groups={viewerGroups}


            startIndex={startIndex}


            onClose={()=>setViewer(false)}


        />


        }




        </>


    );


}