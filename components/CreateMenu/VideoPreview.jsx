"use client";

import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize
} from "lucide-react";

import {
    useRef,
    useState,
    useEffect
} from "react";


export default function VideoPreview({video}) {


    const videoRef = useRef(null);

    const containerRef = useRef(null);

    const timer = useRef(null);



    const [playing,setPlaying] = useState(false);

    const [muted,setMuted] = useState(false);

    const [current,setCurrent] = useState(0);

    const [duration,setDuration] = useState(0);

    const [fullscreen,setFullscreen] = useState(false);

    const [showControls,setShowControls] = useState(true);


    const [aspectRatio,setAspectRatio] = useState("16 / 9");




    useEffect(()=>{


        function fullscreenChange(){

            setFullscreen(
                document.fullscreenElement !== null
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






    function showPlayerControls(){


        setShowControls(true);


        clearTimeout(timer.current);



        if(playing){


            timer.current = setTimeout(()=>{

                setShowControls(false);

            },2000);


        }


    }







    function togglePlay(){


        if(videoRef.current.paused){


            videoRef.current.play();

            setPlaying(true);


        }

        else{


            videoRef.current.pause();

            setPlaying(false);


        }


        showPlayerControls();

    }






    function toggleMute(){


        videoRef.current.muted =
        !videoRef.current.muted;


        setMuted(
            videoRef.current.muted
        );


        showPlayerControls();

    }







    function toggleFullscreen(){


        if(!document.fullscreenElement){


            containerRef.current.requestFullscreen();


        }

        else{


            document.exitFullscreen();


        }


    }







    function formatTime(time){


        if(!time) return "0:00";


        const minutes =
        Math.floor(time / 60);


        const seconds =
        Math.floor(time % 60)
        .toString()
        .padStart(2,"0");


        return `${minutes}:${seconds}`;

    }








    function handleLoaded(){


        const videoElement =
        videoRef.current;



        setDuration(
            videoElement.duration
        );



        const width =
        videoElement.videoWidth;


        const height =
        videoElement.videoHeight;



        if(width && height){


            setAspectRatio(
                `${width} / ${height}`
            );


        }


    }







    return (


        <div


        ref={containerRef}


        className={`video-player

        ${fullscreen ? "fullscreen-video" : ""}

        `}


        style={{

            "--video-ratio": aspectRatio

        }}


        onMouseMove={showPlayerControls}


        onMouseLeave={()=>{


            if(playing){

                setShowControls(false);

            }


        }}


        >






            <video


            ref={videoRef}


            src={video}


            className="video-element"


            onLoadedMetadata={handleLoaded}



            onTimeUpdate={()=>{


                setCurrent(
                    videoRef.current.currentTime
                );


            }}



            />








            <div


            className={`video-controls

            ${
                showControls

                ?

                "show-controls"

                :

                "hide-controls"

            }

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







                <span className="time-text">


                    {formatTime(current)}

                    /

                    {formatTime(duration)}


                </span>







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