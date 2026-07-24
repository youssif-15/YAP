"use client";


import {

    Play,
    Pause,
    PlayCircle,
    PauseCircle,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    Heart

} from "lucide-react";


import {

    useEffect,
    useRef,
    useState

} from "react";








export default function PostVideo({

    video

}){



    const videoRef = useRef(null);

    const containerRef = useRef(null);

    const timer = useRef(null);

    const clickTimer = useRef(null);

    const lastTap = useRef(0);









    const [playing,setPlaying] = useState(false);

    const [muted,setMuted] = useState(false);

    const [current,setCurrent] = useState(0);

    const [duration,setDuration] = useState(0);

    const [fullscreen,setFullscreen] = useState(false);

    const [showControls,setShowControls] = useState(true);

    const [showSettings,setShowSettings] = useState(false);

    const [speed,setSpeed] = useState(1);

    const [showHeart,setShowHeart] = useState(false);

    const [showPlayAnimation,setShowPlayAnimation] = useState(null);









    useEffect(()=>{


        function fullscreenChange(){


            setFullscreen(

                document.fullscreenElement === videoRef.current

            );


        }





        document.addEventListener(

            "fullscreenchange",

            fullscreenChange

        );





        return ()=>{


            document.removeEventListener(

                "fullscreenchange",

                fullscreenChange

            );


        };


    },[]);









    useEffect(()=>{


        function stopOtherVideos(e){


            if(

                videoRef.current !== e.detail

            ){


                videoRef.current.pause();


                setPlaying(false);


            }


        }





        window.addEventListener(

            "video-play",

            stopOtherVideos

        );





        return ()=>{


            window.removeEventListener(

                "video-play",

                stopOtherVideos

            );


        };


    },[]);
        function controls(){


        setShowControls(true);


        clearTimeout(timer.current);



        if(playing){


            timer.current=setTimeout(()=>{


                setShowControls(false);


            },2000);


        }


    }









    function togglePlay(){


        if(!videoRef.current)

            return;





        if(videoRef.current.paused){


            videoRef.current.play();


            setPlaying(true);





            window.dispatchEvent(

                new CustomEvent(

                    "video-play",

                    {

                        detail:videoRef.current

                    }

                )

            );


        }

        else{


            videoRef.current.pause();


            setPlaying(false);


        }





        controls();


    }












    function toggleMute(){



        if(!videoRef.current)

            return;





        videoRef.current.muted =

        !videoRef.current.muted;





        setMuted(

            videoRef.current.muted

        );





        controls();


    }













    function toggleFullscreen(){



        if(!videoRef.current)

            return;





        if(!document.fullscreenElement){



            videoRef.current.requestFullscreen();



        }

        else{


            document.exitFullscreen();



        }



    }












    function changeSpeed(value){



        if(videoRef.current){


            videoRef.current.playbackRate = value;


        }



        setSpeed(value);


        setShowSettings(false);



    }













    function formatTime(time){



        if(!time || isNaN(time))

            return "0:00";





        const min = Math.floor(time / 60);



        const sec = Math.floor(time % 60)

        .toString()

        .padStart(2,"0");





        return `${min}:${sec}`;



    }













    function loaded(){



        const el = videoRef.current;



        if(!el)

            return;





        setDuration(

            el.duration

        );



        // مهم: نخلي الكونتينر ياخد أبعاد الفيديو الحقيقية

        const ratio =

        el.videoHeight /

        el.videoWidth;





        if(containerRef.current){



            containerRef.current.style.aspectRatio =

            `${el.videoWidth} / ${el.videoHeight}`;



        }




    }













    function showLikeAnimation(){



        setShowHeart(true);





        setTimeout(()=>{



            setShowHeart(false);



        },700);



    }












    function showPlayPauseAnimation(type){



        setShowPlayAnimation(type);





        setTimeout(()=>{



            setShowPlayAnimation(null);



        },700);



    }












    function handleVideoClick(){





        if(clickTimer.current){



            clearTimeout(clickTimer.current);



            clickTimer.current=null;




            showLikeAnimation();



            return;



        }








        clickTimer.current=setTimeout(()=>{



            togglePlay();



            showPlayPauseAnimation(

                videoRef.current.paused

                ?

                "pause"

                :

                "play"

            );





            clickTimer.current=null;



        },250);



    }
        function handleTouch(){


        const now = Date.now();




        if(

            now - lastTap.current < 300

        ){


            showLikeAnimation();


        }




        lastTap.current = now;



    }













    return(


        <div


        ref={containerRef}


        className="post-video-player"



        onMouseMove={controls}



        onMouseLeave={()=>{


            if(playing){


                setShowControls(false);


            }


        }}



        >








            <video


            ref={videoRef}


            src={video}


            className="post-video-element"



            onClick={handleVideoClick}



            onTouchEnd={handleTouch}



            onLoadedMetadata={loaded}



            onTimeUpdate={()=>{


                setCurrent(

                    videoRef.current.currentTime

                );


            }}



            />









            {


            showHeart &&



            <div className="double-heart">


                <Heart

                size={110}

                fill="white"

                color="white"

                />


            </div>


            }









            {


            showPlayAnimation &&



            <div className="video-play-animation">



                {


                showPlayAnimation === "play"

                ?


                <PlayCircle

                size={120}

                color="white"

                fill="rgba(255,255,255,.2)"

                />


                :



                <PauseCircle

                size={120}

                color="white"

                fill="rgba(255,255,255,.2)"

                />



                }



            </div>


            }












            <div


            className={`post-video-controls

            ${showControls ? "show" : "hide"}

            `}


            >





                <button onClick={togglePlay}>


                    {


                    playing

                    ?


                    <Pause size={22}/>


                    :


                    <Play size={22}/>


                    }



                </button>









                <button onClick={toggleMute}>


                    {


                    muted

                    ?


                    <VolumeX size={22}/>


                    :


                    <Volume2 size={22}/>


                    }



                </button>









                <input


                className="time-bar"


                type="range"


                min="0"


                max={duration}


                value={current}



                onChange={(e)=>{


                    videoRef.current.currentTime =

                    Number(e.target.value);



                }}



                />









                <span>


                    {formatTime(current)}

                    /

                    {formatTime(duration)}


                </span>









                <div className="video-settings">



                    <button

                    onClick={()=>setShowSettings(!showSettings)}

                    >


                        <Settings size={22}/>


                    </button>









                    {


                    showSettings &&



                    <div className="settings-menu">


                        <p>Speed</p>





                        {


                        [0.5,1,1.25,1.5,2]

                        .map(x=>(



                            <button


                            key={x}


                            className={

                                speed === x

                                ?

                                "active-setting"

                                :

                                ""

                            }



                            onClick={()=>changeSpeed(x)}


                            >


                                {x}x



                            </button>



                        ))



                        }






                        <p>Quality</p>


                        <button className="active-setting">


                            Original


                        </button>



                    </div>


                    }



                </div>









                <button onClick={toggleFullscreen}>


                    {


                    fullscreen

                    ?


                    <Minimize size={22}/>


                    :


                    <Maximize size={22}/>


                    }



                </button>







            </div>







        </div>


    );


}