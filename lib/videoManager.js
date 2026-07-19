const videos = new Set();


export function registerVideo(video){

    videos.add(video);

}



export function unregisterVideo(video){

    videos.delete(video);

}



export function pauseOtherVideos(current){

    videos.forEach(video=>{

        if(video !== current){

            video.pause();

        }

    });

}