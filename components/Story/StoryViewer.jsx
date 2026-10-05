"use client";


import {

    useEffect,

    useRef,

    useState

} from "react";


import {

    Trash2

} from "lucide-react";


import { supabase } from "@/lib/supabase";


import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";


import StoryViewers from "./StoryViewers";





export default function StoryViewer({

    groups,

    startIndex = 0,

    onClose,

    onDelete

}){



    const [groupIndex,setGroupIndex] = useState(

        startIndex

    );


    const [storyIndex,setStoryIndex] = useState(0);


    const [progress,setProgress] = useState(0);


    const [animation,setAnimation] = useState("");


    const [holding,setHolding] = useState(false);


    const [views,setViews] = useState(0);


    const [currentUser,setCurrentUser] = useState(null);


    const [showViewers,setShowViewers] = useState(false);


    // منع تكرار إرسال المشاهدة

    const [viewAdded,setViewAdded] = useState(false);


    const videoRef = useRef(null);

    const activePointerId = useRef(null);

    const holdStartedAt = useRef(0);

    const holdOnNavigationArea = useRef(false);

    const holdActive = useRef(false);

    const pendingHoldTimer = useRef(null);

    const suppressNavigationClick = useRef(false);

    const resumeVideoAfterHold = useRef(false);




    const group = groups[groupIndex];


    const story = group?.stories?.[storyIndex];









    useEffect(()=>{


        async function getUser(){


            const {

                data:{

                    user

                }

            } = await supabase.auth.getUser();



            setCurrentUser(user);



        }



        getUser();



    },[]);





    useEffect(()=>{


        return()=>{

            if(pendingHoldTimer.current){

                clearTimeout(pendingHoldTimer.current);

            }

        };


    },[]);









    async function addView(){



        if(

            viewAdded ||

            !currentUser ||

            !story?.id

        ){

            return;

        }







        if(

            currentUser.id === group.user_id

        ){

            return;

        }







        setViewAdded(true);







        const {

            error

        } = await supabase

        .from("story_views")

        .upsert({

            story_id:story.id,

            user_id:currentUser.id

        },

        {

            onConflict:

            "story_id,user_id"

        });







        if(error){



            console.log(

                "VIEW INSERT ERROR:",

                error

            );


            setViewAdded(false);


        }



    }









    async function getViews(){



        if(!story?.id){

            return;

        }







        const {

            count,

            error

        } = await supabase

        .from("story_views")

        .select(

            "*",

            {

                count:"exact",

                head:true

            }

        )

        .eq(

            "story_id",

            story.id

        );







        if(error){



            console.log(

                "VIEW COUNT ERROR:",

                error

            );


            return;


        }







        setViews(

            count || 0

        );



    }
        useEffect(()=>{


        if(

            !currentUser ||

            !story?.id

        ){

            return;

        }




        setViewAdded(false);


        setProgress(0);



        addView();


        getViews();



    },[

        story?.id,

        currentUser?.id

    ]);









    useEffect(()=>{



        if(

            holding ||

            story?.media_type === "video"

        ){

            return;

        }






        const timer = setInterval(()=>{



            setProgress(prev=>{



                if(prev >= 100){



                    next();


                    return 0;



                }




                return prev + 1;



            });



        },100);







        return()=>clearInterval(timer);




    },[

        groupIndex,

        storyIndex,

        holding,

        story?.media_type

    ]);









    function syncVideoProgress(event){


        const video = event.currentTarget;

        if(

            !Number.isFinite(video.duration) ||

            video.duration <= 0 ||

            !Number.isFinite(video.currentTime)

        ){

            return;

        }


        setProgress(

            Math.min(

                video.currentTime / video.duration * 100,

                100

            )

        );


    }





    function handleVideoPlay(event){


        if(holdActive.current){

            event.currentTarget.pause();

        }


    }





    function handleVideoEnded(){


        setProgress(100);

        next();


    }





    function handleViewerClickCapture(event){


        if(

            suppressNavigationClick.current &&

            event.target instanceof Element &&

            event.target.closest(

                ".story-left, .story-right"

            )

        ){

            event.preventDefault();

            event.stopPropagation();

            suppressNavigationClick.current = false;

        }


    }





    function activateHold(){


        holdActive.current = true;

        setHolding(true);


        const video = videoRef.current;

        resumeVideoAfterHold.current = !!video && (

            !video.paused ||

            video.autoplay

        );

        if(video){

            video.pause();

        }


    }





    function startHold(event){


        const target = event.target;

        if(

            !(target instanceof Element) ||

            target.closest(

                "button, a, input, select, textarea, [role='button'], .story-bars, .story-header"

            ) ||

            activePointerId.current !== null

        ){

            return;

        }


        activePointerId.current = event.pointerId;

        holdStartedAt.current = Date.now();

        holdOnNavigationArea.current = !!target.closest(

            ".story-left, .story-right"

        );

        suppressNavigationClick.current = false;

        holdActive.current = false;

        if(holdOnNavigationArea.current){

            pendingHoldTimer.current = setTimeout(()=>{

                pendingHoldTimer.current = null;

                if(activePointerId.current === event.pointerId){

                    activateHold();

                }

            },250);

        }

        else{

            activateHold();

        }


    }







    function endHold(event){


        if(

            activePointerId.current === null ||

            event.pointerId !== activePointerId.current

        ){

            return;

        }


        if(pendingHoldTimer.current !== null){

            clearTimeout(pendingHoldTimer.current);

            pendingHoldTimer.current = null;

        }


        if(!holdActive.current){

            activePointerId.current = null;

            holdOnNavigationArea.current = false;

            return;

        }


        if(

            holdOnNavigationArea.current &&

            Date.now() - holdStartedAt.current >= 250

        ){

            suppressNavigationClick.current = true;

        }


        activePointerId.current = null;

        holdOnNavigationArea.current = false;

        holdActive.current = false;

        setHolding(false);


        const shouldResumeVideo = resumeVideoAfterHold.current;

        resumeVideoAfterHold.current = false;


        if(shouldResumeVideo && videoRef.current){

            videoRef.current.play().catch(()=>{});

        }


    }







    function animate(type){


        setAnimation(type);



        setTimeout(()=>{


            setAnimation("");



        },300);


    }









    function next(){



        animate(

            "slide-next"

        );







        if(

            storyIndex <

            group.stories.length - 1

        ){



            setStoryIndex(

                prev=>prev+1

            );



        }







        else if(

            groupIndex <

            groups.length - 1

        ){



            setGroupIndex(

                prev=>prev+1

            );



            setStoryIndex(0);



        }







        else{


            onClose();



        }



    }









    function previous(){



        animate(

            "slide-prev"

        );







        if(storyIndex > 0){



            setStoryIndex(

                prev=>prev-1

            );



        }







        else if(groupIndex > 0){



            const previousGroup =

            groups[groupIndex-1];







            setGroupIndex(

                prev=>prev-1

            );



            setStoryIndex(

                previousGroup.stories.length-1

            );



        }



    }









    async function deleteStory(){



        if(!story?.id){


            return;


        }







        const {

            error

        } = await supabase

        .from("stories")

        .delete()

        .eq(

            "id",

            story.id

        );







        if(error){



            console.log(

                "DELETE STORY ERROR:",

                error

            );



            return;


        }







        if(onDelete){



            onDelete(

                story.id

            );


        }







        onClose();



    }









    if(!story){


        return null;


    }









    const isOwner =

    currentUser?.id === group.user_id;








    return(



        <div

            className={

                `story-viewer ${animation}`

            }

            onPointerDownCapture={startHold}

            onPointerUpCapture={endHold}

            onPointerCancelCapture={endHold}

            onPointerLeave={(event)=>{

                if(event.pointerType === "mouse"){

                    endHold(event);

                }

            }}

            onClickCapture={handleViewerClickCapture}

        >
                        <div className="story-bars">


                {

                group.stories.map((item,index)=>(


                    <div

                        className="story-bar"

                        key={item.id}

                    >



                        <div

                            className="story-bar-fill"

                            style={{


                                width:


                                index < storyIndex


                                ?


                                "100%"



                                :



                                index === storyIndex


                                ?


                                `${progress}%`



                                :



                                "0%"


                            }}


                        />


                    </div>


                ))


                }


            </div>









            <div className="story-header">



                <img

                    src={

                        group.profile?.avatar_url

                    }

                    className="story-view-avatar"

                    alt="avatar"

                />






                <div className="story-user-info">


                    <h4 className="story-username">


                        <span>

                            {

                            group.profile?.username

                            ||

                            "User"

                            }

                        </span>




                        {


                        group.profile?.is_owner &&

                        <OwnerBadge/>

                        }


                    </h4>






                    <small>

                        {

                        new Date(

                            story.created_at

                        ).toLocaleTimeString([],{

                            hour:"2-digit",

                            minute:"2-digit"

                        })

                        }

                    </small>


                </div>







                {


                isOwner &&



                <button

                    className="story-delete-button"

                    onClick={deleteStory}

                >

                    <Trash2 size={21}/>

                </button>


                }






                <button

                    className="story-close-button"

                    onClick={onClose}

                >

                    ×

                </button>



            </div>












            <div

                className="story-media-area"

            >




                {


                story.media_type === "video"


                ?



                <video

                    ref={videoRef}

                    src={story.media_url}

                    className="story-content"

                    autoPlay

                    playsInline

                    onLoadedMetadata={syncVideoProgress}

                    onDurationChange={syncVideoProgress}

                    onTimeUpdate={syncVideoProgress}

                    onPlay={handleVideoPlay}

                    onEnded={handleVideoEnded}

                />




                :





                <img

                    src={story.media_url}

                    className="story-content"

                    alt="story"

                />

                }







                {


                story.caption &&



                <div className="story-caption">


                    {story.caption}


                </div>


                }







                {


                isOwner &&



                <button

                    className="story-views-count"

                    onClick={()=>setShowViewers(true)}

                >

                    👁 {views}

                </button>


                }





            </div>









            <div

                className="story-left"

                onClick={previous}

            />







            <div

                className="story-right"

                onClick={next}

            />









            {


            showViewers &&



            <StoryViewers

                storyId={story.id}

                onClose={()=>setShowViewers(false)}

            />


            }





        </div>



    );



}