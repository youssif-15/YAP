"use client";

import "./Profile.css";

import {
    useEffect,
    useState
} from "react";

import { supabase } from "@/lib/supabase";

import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfilePosts from "./ProfilePosts";
import SavedPosts from "./SavedPosts";



export default function ProfilePage({

    username

}){


    const [loading,setLoading] = useState(true);

    const [profile,setProfile] = useState(null);

    const [savedPosts,setSavedPosts] = useState([]);

    const [tab,setTab] = useState("posts");

    const [tabKey,setTabKey] = useState(0);

    const [isOwner,setIsOwner] = useState(false);





    useEffect(()=>{

        loadProfile();

    },[username]);









    async function loadProfile(){


        setLoading(true);





        const {

            data:{
                user

            }

        } = await supabase.auth.getUser();








        const {

            data:profileData,

            error

        } = await supabase


        .from("profiles")


        .select("*")


        .eq(

            "username",

            username

        )


        .single();








        if(error){


            console.log(

                "PROFILE ERROR:",

                error

            );


            setProfile(null);

            setLoading(false);


            return;


        }









        setProfile(profileData);








        const owner =


            user?.id === profileData.id;





        setIsOwner(owner);









        if(owner){



            const {

                data:savedRows,

                error:savedError


            } = await supabase



            .from("saved_posts")



            .select("post_id")



            .eq(


                "user_id",

                user.id

            );








            if(savedError){



                console.log(


                    "SAVED POSTS ERROR:",

                    savedError


                );



            }








            else{



                const ids = savedRows.map(


                    item=>item.post_id


                );









                if(ids.length){



                    const {


                        data:posts,


                        error:postsError



                    } = await supabase



                    .from("posts")



                    .select("*")



                    .in(


                        "id",

                        ids

                    )



                    .order(


                        "created_at",

                        {

                            ascending:false

                        }

                    );








                    if(postsError){



                        console.log(


                            "POSTS ERROR:",

                            postsError


                        );



                    }







                    else{



                        const postsWithProfiles =

                        await Promise.all(



                            posts.map(async(post)=>{



                                const {


                                    data:profile



                                } = await supabase



                                .from("profiles")



                                .select(

                                    "username, avatar"

                                )



                                .eq(


                                    "id",

                                    post.user_id

                                )



                                .single();





                                return{


                                    ...post,


                                    profile,


                                    saved:true


                                };



                            })



                        );





                        setSavedPosts(


                            postsWithProfiles


                        );



                    }



                }








                else{



                    setSavedPosts([]);



                }



            }





        }



        else{



            setSavedPosts([]);



        }






        setLoading(false);



    }
        if(loading){

        return(

            <div className="profile-page">


                <div className="profile-skeleton">



                    <div className="profile-header-skeleton">



                        <div className="skeleton-avatar"/>




                        <div className="skeleton-info">



                            <div className="skeleton-line name"/>



                            <div className="skeleton-line username"/>




                            <div className="skeleton-buttons">



                                <div className="skeleton-button"/>


                                <div className="skeleton-button"/>



                            </div>





                            <div className="skeleton-stats">



                                <div/>


                                <div/>


                                <div/>



                            </div>







                            <div className="skeleton-line bio"/>




                        </div>



                    </div>









                    <div className="skeleton-tabs">



                        <div/>


                        <div/>


                        <div/>



                    </div>









                    <div className="skeleton-posts">



                        <div/>


                        <div/>


                        <div/>



                    </div>






                </div>



            </div>


        );


    }








    if(!profile){


        return(



            <div className="profile-loading">


                User not found.



            </div>



        );


    }









    return(



        <div className="profile-page">





            <ProfileHeader



                profile={profile}



                isOwner={isOwner}



                postsCount={0}



                onRefresh={loadProfile}



            />









            <ProfileTabs



                activeTab={tab}



                setActiveTab={async(newTab)=>{



                    setTab(newTab);






                    if(newTab==="saved"){



                        await loadProfile();



                    }






                    setTabKey(prev=>

                        prev+1

                    );



                }}



                isOwner={isOwner}



            />












            <div key={tabKey}>




                {


                    tab==="posts"



                    ?



                    <ProfilePosts



                        userId={profile.id}



                    />





                    :





                    <SavedPosts



                        posts={savedPosts}



                        onUnsave={(id)=>{



                            setSavedPosts(prev=>



                                prev.filter(



                                    post=>post.id!==id



                                )



                            );



                        }}



                    />



                }




            </div>








        </div>






    );



}