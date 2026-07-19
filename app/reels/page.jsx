"use client";


import {

    useEffect,

    useRef,

    useState

} from "react";


import {

    useRouter

} from "next/navigation";


import {

    supabase

} from "@/lib/supabase";








export default function Reels(){



    const router = useRouter();


    const loaded = useRef(false);



    const [status,setStatus] = useState(

        "Loading reels..."

    );











    useEffect(()=>{


        if(loaded.current){

            return;

        }


        loaded.current=true;


        loadReels();



    },[]);









    function extractVideo(post){



        if(post.video){

            return post.video;

        }







        if(post.media){



            try{



                const media =

                typeof post.media === "string"

                ?

                JSON.parse(post.media)

                :

                post.media;







                if(Array.isArray(media)){



                    return media.find(item=>


                        typeof item==="string"

                        &&

                        (

                            item.includes(".mp4")

                            ||

                            item.includes(".webm")

                            ||

                            item.includes(".mov")

                        )


                    );


                }






                if(media?.url){

                    return media.url;

                }




            }

            catch(e){


                console.log(

                    "MEDIA ERROR",

                    e

                );


            }


        }





        return null;


    }












    async function loadReels(){



        try{





            const {

                data:{user}

            } = await supabase.auth.getUser();






            let followingIds=[];







            if(user){



                const {

                    data:following

                } = await supabase

                .from("followers")

                .select(

                    "following_id"

                )

                .eq(

                    "follower_id",

                    user.id

                );






                followingIds =

                (following || [])

                .map(

                    item=>

                    item.following_id

                );


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

                video,

                media,

                created_at

            `)

            .eq(

                "type",

                "video"

            )

            .limit(300);









            if(error){



                console.log(

                    "REELS ERROR",

                    error

                );


                setStatus(

                    "Database error"

                );


                return;


            }









            let videos =

            (posts || [])

            .map(post=>({



                ...post,


                videoUrl:

                extractVideo(post)


            }))


            .filter(

                post=>

                post.videoUrl

            );









            if(videos.length===0){



                setStatus(

                    "No videos found"

                );


                return;


            }









            videos = videos.map(post=>{



                let score=0;







                if(

                    followingIds.includes(

                        post.user_id

                    )

                ){


                    score+=100;


                }








                score +=


                new Date(

                    post.created_at

                ).getTime()

                /

                100000000000;








                score += Math.random()*50;









                return{


                    ...post,


                    score


                };



            });









            videos.sort(

                (a,b)=>

                b.score-a.score

            );









            // ناخد أعلى 10 ونختار واحد عشوائي

            const top =

            videos.slice(

                0,

                Math.min(

                    10,

                    videos.length

                )

            );







            const random =

            top[

                Math.floor(

                    Math.random()*top.length

                )

            ];









            router.replace(

                `/reels/${random.id}`

            );







        }

        catch(err){



            console.log(

                "REELS REDIRECT ERROR",

                err

            );


            setStatus(

                "Error loading reels"

            );



        }



    }









    return(


        <div className="reels-loading">


            <div className="reels-skeleton"/>



            <p>

            {status}

            </p>



        </div>


    );



}