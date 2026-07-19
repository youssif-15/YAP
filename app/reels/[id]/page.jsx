"use client";


import {

    useEffect,

    useRef,

    useState

} from "react";


import {

    useParams,

    useRouter

} from "next/navigation";


import {

    ChevronDown,
    ChevronUp,
    MessageCircle,
    Send,
    Bookmark,
    Volume2,
    VolumeX,
    Play,
    Pause,
    X,
    ArrowLeft

} from "lucide-react";


import {supabase} from "@/lib/supabase";


import PostLikes from "@/app/post/Post/PostLikes";


import Comments from "@/components/Comment/Comments";


import "../reels.css";









export default function ReelPage(){



    const router = useRouter();


    const params = useParams();


    const id = params.id;







    const [video,setVideo] = useState(null);


    const [allVideos,setAllVideos] = useState([]);


    const [loading,setLoading] = useState(true);


    const [user,setUser] = useState(null);





    const [muted,setMuted] = useState(false);


    const [playing,setPlaying] = useState(true);


    const [saved,setSaved] = useState(false);


    const [comments,setComments] = useState(false);







    const [progress,setProgress] = useState(0);


    const [duration,setDuration] = useState(0);







    const videoRef = useRef(null);


    const progressRef = useRef(null);


    const seekingRef = useRef(false);



    // swipe

    const touchStartY = useRef(0);


    const touchEndY = useRef(0);









    useEffect(()=>{


        loadVideo();


    },[id]);









    function handleTouchStart(e){


        touchStartY.current =

        e.changedTouches[0].clientY;


    }








    function handleTouchEnd(e){


        touchEndY.current =

        e.changedTouches[0].clientY;





        const distance =

        touchStartY.current -

        touchEndY.current;





        if(Math.abs(distance) < 60){

            return;

        }





        if(distance < 0){

            next();

        }

        else{

            previous();

        }



    }
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



                    const found = media.find(item=>



                        typeof item === "string"

                        &&

                        (

                            item.includes(".mp4")

                            ||

                            item.includes(".webm")

                            ||

                            item.includes(".mov")

                            ||

                            item.includes(".m4v")

                        )



                    );




                    return found;



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












    async function loadVideo(){



        try{



            const {

                data:{

                    user

                }

            } = await supabase.auth.getUser();





            setUser(user);









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

                content,

                created_at,

                profiles(

                    id,

                    username,

                    avatar_url

                )

            `)



            .eq(

                "type",

                "video"

            )



            .limit(200);








            if(error){


                console.log(

                    "POST ERROR",

                    error

                );


                return;


            }









            const formatted =



            (posts || [])



            .map(post=>({



                ...post,



                caption:

                post.content || "",



                videoUrl:

                extractVideo(post),



                score:

                Math.random()*100



            }))



            .filter(


                item=>

                item.videoUrl


            )



            .sort(


                (a,b)=>

                b.score-a.score


            );









            setAllVideos(formatted);









            const current =

            formatted.find(

                item=>

                item.id===id

            );









            if(current){



                setVideo(current);



            }









            if(user){



                const {

                    data:savedPost

                } = await supabase



                .from("saved_posts")



                .select("id")



                .eq(

                    "user_id",

                    user.id

                )



                .eq(

                    "post_id",

                    id

                )



                .maybeSingle();







                setSaved(

                    !!savedPost

                );



            }






        }

        catch(err){



            console.log(

                "REELS ERROR",

                err

            );


        }

        finally{



            setLoading(false);



        }



    }
        useEffect(()=>{



        const videoElement = videoRef.current;


        if(!videoElement){

            return;

        }







        function updateProgress(){



            setProgress(

                videoElement.currentTime

            );


        }







        function updateDuration(){



            setDuration(

                videoElement.duration

            );


        }







        videoElement.addEventListener(

            "timeupdate",

            updateProgress

        );







        videoElement.addEventListener(

            "loadedmetadata",

            updateDuration

        );









        return()=>{



            videoElement.removeEventListener(

                "timeupdate",

                updateProgress

            );







            videoElement.removeEventListener(

                "loadedmetadata",

                updateDuration

            );



        };




    },[video]);












    useEffect(()=>{



        const element = videoRef.current;



        if(element){



            element.play()

            .then(()=>{


                setPlaying(true);


            })

            .catch(()=>{});



        }



    },[video]);












    function seekVideo(e){



        const bar = progressRef.current;


        const element = videoRef.current;






        if(

            !bar ||

            !element ||

            !duration

        ){

            return;

        }






        const rect =

        bar.getBoundingClientRect();






        let percent =

        (

            e.clientX -

            rect.left

        )

        /

        rect.width;






        percent = Math.max(

            0,

            Math.min(

                1,

                percent

            )

        );







        element.currentTime =

        percent * duration;






        setProgress(

            element.currentTime

        );



    }












    function startSeek(e){



        e.preventDefault();


        seekingRef.current = true;



        seekVideo(e);



    }












    useEffect(()=>{



        function move(e){



            if(seekingRef.current){



                seekVideo(e);



            }



        }








        function stop(){



            seekingRef.current = false;



        }








        window.addEventListener(

            "mousemove",

            move

        );





        window.addEventListener(

            "mouseup",

            stop

        );









        return()=>{



            window.removeEventListener(

                "mousemove",

                move

            );





            window.removeEventListener(

                "mouseup",

                stop

            );



        };




    },[duration]);












    function next(){



        const index =

        allVideos.findIndex(

            item=>

            item.id===id

        );








        if(index < allVideos.length - 1){



            router.push(

                `/reels/${

                    allVideos[index+1].id

                }`

            );



        }



    }












    function previous(){



        const index =

        allVideos.findIndex(

            item=>

            item.id===id

        );








        if(index > 0){



            router.push(

                `/reels/${

                    allVideos[index-1].id

                }`

            );



        }



    }
        function togglePlay(){



        const element = videoRef.current;







        if(!element){

            return;

        }







        if(element.paused){



            element.play();


            setPlaying(true);



        }

        else{



            element.pause();


            setPlaying(false);



        }



    }












    async function toggleSave(){



        if(!user){

            return;

        }








        if(saved){



            await supabase

            .from("saved_posts")

            .delete()

            .eq(

                "user_id",

                user.id

            )

            .eq(

                "post_id",

                id

            );







            setSaved(false);



        }

        else{



            await supabase

            .from("saved_posts")

            .insert({

                user_id:user.id,

                post_id:id

            });








            setSaved(true);



        }



    }












    if(loading){



        return(


            <div className="reels-skeleton">


                <div className="skeleton-video"/>


            </div>


        );


    }









    if(!video){



        return(


            <div className="reels-empty">


                No Reel Found


            </div>


        );


    }












    return(


        <div

        className="reels-page"

        onTouchStart={handleTouchStart}

        onTouchEnd={handleTouchEnd}

        >







            <button

            className="reels-back"

            onClick={()=>router.push("/home")}

            >

                <ArrowLeft/>

            </button>









            <video


            ref={videoRef}


            src={video.videoUrl}


            className="reel-video"


            muted={muted}


            playsInline


            autoPlay


            loop



            onTimeUpdate={(e)=>{


                setProgress(

                    e.currentTarget.currentTime

                );


            }}



            onLoadedMetadata={(e)=>{


                setDuration(

                    e.currentTarget.duration

                );


            }}



            onClick={togglePlay}


            />









            <div


            ref={progressRef}


            className="video-progress"


            onMouseDown={startSeek}


            onClick={seekVideo}


            >



                <div


                className="video-progress-fill"


                style={{


                    width:

                    duration

                    ?

                    `${

                        (

                            progress /

                            duration

                        )

                        *

                        100

                    }%`


                    :

                    "0%"


                }}



                />



            </div>
                        <div className="reel-overlay">







                <div className="reel-info">







                    <div


                    className="reel-user"


                    onClick={()=>{


                        if(video.profiles?.username){


                            router.push(

                                `/profile/${

                                    video.profiles.username

                                }`

                            );


                        }


                    }}



                    >




                        <img


                        src={

                            video.profiles?.avatar_url

                            ||

                            "/default-avatar.png"

                        }


                        />






                        <span>


                        {

                            video.profiles?.username

                            ||

                            "User"

                        }


                        </span>





                    </div>









                    {

                    video.caption &&



                    <p

                    className="reel-caption"

                    dir="rtl"

                    >


                        {video.caption}



                    </p>


                    }









                    <span className="reel-date">


                        {

                        new Date(

                            video.created_at

                        ).toLocaleDateString(

                            "en-EG",

                            {

                                day:"numeric",

                                month:"long",

                                year:"numeric"

                            }

                        )

                        }


                    </span>





                </div>














                <div className="reel-actions">







                    <div className="reel-like-box post-like-container">


                        <PostLikes

                            postId={video.id}

                        />


                    </div>









                    <button

                    onClick={()=>setComments(true)}

                    >

                        <MessageCircle/>

                    </button>









                    <button

                    onClick={()=>{


                        navigator.share?.({

                            title:"YAP",

                            url:

                            window.location.href

                        });


                    }}

                    >

                        <Send/>

                    </button>









                    <button

                    onClick={toggleSave}

                    >

                        <Bookmark


                        fill={

                            saved

                            ?

                            "white"

                            :

                            "none"

                        }


                        />

                    </button>









                    <button

                    onClick={()=>setMuted(!muted)}

                    >

                        {

                        muted

                        ?

                        <VolumeX/>

                        :

                        <Volume2/>

                        }

                    </button>









                    <button

                    onClick={togglePlay}

                    >

                        {

                        playing

                        ?

                        <Pause/>

                        :

                        <Play/>

                        }

                    </button>





                </div>







            </div>









            <button


            className="reel-prev"


            onClick={previous}


            >

                <ChevronUp/>

            </button>









            <button


            className="reel-next"


            onClick={next}


            >

                <ChevronDown/>

            </button>









            {


            comments &&




            <div className="reels-comments-panel">





                <button


                className="close-comments"


                onClick={()=>setComments(false)}


                >

                    <X/>

                </button>







                <Comments


                postId={video.id}


                />






            </div>



            }





        </div>


    );


}