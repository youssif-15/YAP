"use client";

import {
    Heart,
    Maximize,
    Minimize,
    Pause,
    PauseCircle,
    Play,
    PlayCircle,
    Settings,
    Volume2,
    VolumeX
} from "lucide-react";
import {
    useEffect,
    useRef,
    useState
} from "react";

function getCloudinaryVideoPoster(video){
    try{
        const url = new URL(video);

        if(
            !url.hostname.endsWith("cloudinary.com")
            || !url.pathname.includes("/video/upload/")
        ){
            return null;
        }

        url.pathname = url.pathname
            .replace("/video/upload/", "/video/upload/so_0/")
            .replace(/\.[^/.]+$/, ".jpg");

        return url.toString();
    }
    catch{
        return null;
    }
}

export default function PostVideo({video,deferLoad=false}){
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const timer = useRef(null);
    const clickTimer = useRef(null);
    const lastTap = useRef(0);

    const [playing,setPlaying] = useState(false);
    const [loadRequested,setLoadRequested] = useState(!deferLoad);
    const [muted,setMuted] = useState(false);
    const [current,setCurrent] = useState(0);
    const [duration,setDuration] = useState(0);
    const [bufferedSegments,setBufferedSegments] = useState([]);
    const [fullscreen,setFullscreen] = useState(false);
    const [showControls,setShowControls] = useState(true);
    const [showSettings,setShowSettings] = useState(false);
    const [speed,setSpeed] = useState(1);
    const [showHeart,setShowHeart] = useState(false);
    const [showPlayAnimation,setShowPlayAnimation] = useState(null);

    useEffect(()=>{
        function fullscreenChange(){
            setFullscreen(
                document.fullscreenElement === containerRef.current
            );
        }

        document.addEventListener("fullscreenchange",fullscreenChange);

        return ()=>{
            document.removeEventListener("fullscreenchange",fullscreenChange);
            clearTimeout(timer.current);
            clearTimeout(clickTimer.current);
        };
    },[]);

    useEffect(()=>{
        function stopOtherVideos(event){
            if(videoRef.current && videoRef.current !== event.detail){
                videoRef.current.pause();
                setPlaying(false);
            }
        }

        window.addEventListener("video-play",stopOtherVideos);

        return ()=>window.removeEventListener("video-play",stopOtherVideos);
    },[]);

    function controls(){
        setShowControls(true);
        clearTimeout(timer.current);

        if(playing){
            timer.current = setTimeout(()=>setShowControls(false),2000);
        }
    }

    async function togglePlay(){
        const element = videoRef.current;

        if(!element){
            return;
        }

        if(element.paused){
            if(deferLoad && !loadRequested){
                element.src = video;
                setLoadRequested(true);
            }

            window.dispatchEvent(
                new CustomEvent("video-play",{detail:element})
            );

            try{
                await element.play();
                setPlaying(true);
            }
            catch{
                setPlaying(false);
            }
        }
        else{
            element.pause();
            setPlaying(false);
        }

        controls();
    }

    function toggleMute(){
        const element = videoRef.current;

        if(!element){
            return;
        }

        element.muted = !element.muted;
        setMuted(element.muted);
        controls();
    }

    function toggleFullscreen(){
        if(!containerRef.current){
            return;
        }

        if(!document.fullscreenElement){
            containerRef.current.requestFullscreen();
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
        if(!time || isNaN(time)){
            return "0:00";
        }

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
            .toString()
            .padStart(2,"0");

        return `${minutes}:${seconds}`;
    }

    function updateBuffered(){
        const element = videoRef.current;

        if(!element || !Number.isFinite(element.duration) || element.duration <= 0){
            setBufferedSegments([]);
            return;
        }

        const segments = [];

        for(let index=0;index<element.buffered.length;index++){
            segments.push({
                start:Math.max(0,(element.buffered.start(index) / element.duration) * 100),
                end:Math.min(100,(element.buffered.end(index) / element.duration) * 100)
            });
        }

        setBufferedSegments(segments);
    }

    function loaded(){
        const element = videoRef.current;

        if(!element){
            return;
        }

        setDuration(element.duration);

        if(containerRef.current && element.videoWidth && element.videoHeight){
            containerRef.current.style.aspectRatio =
                `${element.videoWidth} / ${element.videoHeight}`;
        }

        updateBuffered();
    }

    function showLikeAnimation(){
        setShowHeart(true);
        setTimeout(()=>setShowHeart(false),700);
    }

    function showPlayPauseAnimation(type){
        setShowPlayAnimation(type);
        setTimeout(()=>setShowPlayAnimation(null),700);
    }

    function handleVideoClick(){
        if(clickTimer.current){
            clearTimeout(clickTimer.current);
            clickTimer.current = null;
            showLikeAnimation();
            return;
        }

        clickTimer.current = setTimeout(()=>{
            const wasPaused = videoRef.current?.paused;
            togglePlay();
            showPlayPauseAnimation(wasPaused ? "play" : "pause");
            clickTimer.current = null;
        },250);
    }

    function handleTouch(){
        const now = Date.now();

        if(now - lastTap.current < 300){
            showLikeAnimation();
        }

        lastTap.current = now;
    }

    const playedPercent = duration
        ? Math.min(100,(current / duration) * 100)
        : 0;

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
                src={loadRequested ? video : undefined}
                poster={deferLoad ? getCloudinaryVideoPoster(video) : undefined}
                preload={deferLoad ? "none" : undefined}
                className="post-video-element"
                onClick={handleVideoClick}
                onTouchEnd={handleTouch}
                onLoadedMetadata={loaded}
                onDurationChange={loaded}
                onProgress={updateBuffered}
                onSeeking={updateBuffered}
                onSeeked={updateBuffered}
                onTimeUpdate={()=>{
                    setCurrent(videoRef.current.currentTime);
                    updateBuffered();
                }}
            />

            {showHeart && (
                <div className="double-heart">
                    <Heart size={110} fill="var(--white)" color="var(--white)"/>
                </div>
            )}

            {showPlayAnimation && (
                <div className="video-play-animation">
                    {showPlayAnimation === "play"
                        ? <PlayCircle size={120} color="var(--white)" fill="var(--white-overlay-20)"/>
                        : <PauseCircle size={120} color="var(--white)" fill="var(--white-overlay-20)"/>
                    }
                </div>
            )}

            <div className={`post-video-controls ${showControls ? "show" : "hide"}`}>
                <button onClick={togglePlay}>
                    {playing ? <Pause size={22}/> : <Play size={22}/>}
                </button>

                <button onClick={toggleMute}>
                    {muted ? <VolumeX size={22}/> : <Volume2 size={22}/>}
                </button>

                <div className="post-video-timeline">
                    <div className="post-video-timeline-track"/>
                    {bufferedSegments.map((segment,index)=>(
                        <div
                            key={index}
                            className="post-video-timeline-buffered"
                            style={{
                                left:`${segment.start}%`,
                                width:`${segment.end - segment.start}%`
                            }}
                        />
                    ))}
                    <div
                        className="post-video-timeline-played"
                        style={{width:`${playedPercent}%`}}
                    />
                    <input
                        className="time-bar"
                        type="range"
                        min="0"
                        max={duration}
                        value={current}
                        onChange={event=>{
                            if(videoRef.current){
                                videoRef.current.currentTime = Number(event.target.value);
                            }
                        }}
                        aria-label="Video timeline"
                    />
                </div>

                <span>
                    {formatTime(current)}/{formatTime(duration)}
                </span>

                <div className="video-settings">
                    <button onClick={()=>setShowSettings(!showSettings)}>
                        <Settings size={22}/>
                    </button>

                    {showSettings && (
                        <div className="settings-menu">
                            <p>Speed</p>
                            {[0.5,1,1.25,1.5,2].map(value=>(
                                <button
                                    key={value}
                                    className={speed === value ? "active-setting" : ""}
                                    onClick={()=>changeSpeed(value)}
                                >
                                    {value}x
                                </button>
                            ))}
                            <p>Quality</p>
                            <button className="active-setting">Original</button>
                        </div>
                    )}
                </div>

                <button onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize size={22}/> : <Maximize size={22}/>}
                </button>
            </div>
        </div>
    );
}