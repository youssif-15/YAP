"use client";


import { useState } from "react";

import { Video } from "lucide-react";

import VideoPreview from "./VideoPreview";

import Caption from "./Caption";




export default function ReelUploader({

    close,

    setUploading

}) {



    const [videoPreview,setVideoPreview] = useState(null);

    const [videoFile,setVideoFile] = useState(null);

    const [next,setNext] = useState(false);






    function handleFile(file){


        if(!file) return;



        if(file.type.startsWith("video/")){


            setVideoFile(file);

            setVideoPreview(

                URL.createObjectURL(file)

            );


        }


    }







    if(next){


        return(

            <Caption

                type="video"

                media={videoPreview}

                files={[videoFile]}

                close={close}

                setUploading={setUploading}

            />

        );


    }








    return(


        <div className="reel-uploader">







            {

                !videoPreview &&

                <label

                    className="upload-box"

                    onDragOver={(e)=>{

                        e.preventDefault();

                    }}

                    onDrop={(e)=>{

                        e.preventDefault();

                        handleFile(

                            e.dataTransfer.files[0]

                        );

                    }}

                >



                    <Video size={45}/>

                    <h3>

                        Upload Video

                    </h3>

                    <p>

                        Drag & Drop or Click

                    </p>



                    <input

                        type="file"

                        accept="video/*"

                        hidden

                        onChange={(e)=>{

                            handleFile(

                                e.target.files[0]

                            );

                        }}

                    />



                </label>

            }








            {

                videoPreview &&

                <>

                    <VideoPreview

                        video={videoPreview}

                    />



                    <div className="video-actions">



                        <button

                            className="video-cancel"

                            onClick={()=>{

                                setVideoPreview(null);

                                setVideoFile(null);

                            }}

                        >

                            Cancel

                        </button>





                        <button

                            className="video-next"

                            onClick={()=>{

                                setNext(true);

                            }}

                        >

                            Next

                        </button>



                    </div>

                </>

            }






        </div>

    );


}