"use client";


import {

    useEffect,

    useState

} from "react";


import { supabase } from "@/lib/supabase";


import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";







export default function StoryViewers({

    storyId,

    onClose

}){



    const [viewers,setViewers] = useState([]);


    const [loading,setLoading] = useState(true);


    const [storyOwner,setStoryOwner] = useState(null);









    useEffect(()=>{


        loadViewers();


    },[]);









    async function loadViewers(){



        // نجيب صاحب الستوري

        const {

            data:storyData

        } = await supabase

        .from("stories")

        .select("user_id")

        .eq(

            "id",

            storyId

        )

        .single();







        setStoryOwner(

            storyData?.user_id

        );









        const {

            data,

            error

        } = await supabase

        .from("story_views")

        .select(`

            user_id,

            created_at,


            profiles(

                username,

                avatar_url,

                is_owner

            )

        `)

        .eq(

            "story_id",

            storyId

        )

        .order(

            "created_at",

            {

                ascending:false

            }

        );







        if(error){


            console.log(

                "VIEWERS ERROR:",

                error

            );


            setLoading(false);

            return;

        }









        // حذف صاحب الستوري من القائمة

        const filtered = data.filter(

            item =>

            item.user_id !== storyData?.user_id

        );








        setViewers(filtered);


        setLoading(false);



    }









    return(



        <div className="story-viewers-overlay">



            <div className="story-viewers-box">





                <div className="story-viewers-header">



                    <h3>

                        Viewers

                    </h3>



                    <button

                        onClick={onClose}

                    >

                        ×

                    </button>



                </div>








                {


                loading

                ?


                <p>

                    Loading...

                </p>


                :



                viewers.length === 0


                ?


                <p>

                    No views yet

                </p>


                :



                viewers.map((item,index)=>(



                    <div

                        className="story-viewer-user"

                        key={index}

                    >




                        {

                        item.profiles?.avatar_url

                        ?


                        <img

                            src={item.profiles.avatar_url}

                            className="story-viewer-avatar"

                            alt="avatar"

                        />


                        :


                        <div

                            className="story-viewer-avatar-empty"

                        />

                        }





                        <div>



                            <div

                                className="story-viewer-name"

                            >



                                {

                                item.profiles?.username

                                ||

                                "User"

                                }





                                {


                                item.profiles?.is_owner &&

                                <OwnerBadge/>

                                }



                            </div>





                            <small>



                                {

                                new Date(

                                    item.created_at

                                ).toLocaleString()

                                }



                            </small>



                        </div>





                    </div>



                ))



                }



            </div>



        </div>



    );


}