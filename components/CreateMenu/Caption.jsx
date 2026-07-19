"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import {

    uploadMedia,

    cancelUpload

} from "@/lib/uploadMedia";

import ImagePreview from "./ImagePreview";

import VideoPreview from "./VideoPreview";





export default function Caption({

    type,

    media,

    files = [],

    close,

    setUploading

}){

    const [caption,setCaption] = useState("");

    const [loading,setLoading] = useState(false);

    const [uploadProgress,setUploadProgress] = useState(0);

    const [cancelled,setCancelled] = useState(false);







    function showToast(type,message){

        window.dispatchEvent(

            new CustomEvent(

                "toast",

                {

                    detail:{

                        type,

                        message

                    }

                }

            )

        );

    }







    function formatSize(bytes){

        if(bytes < 1024){

            return bytes + " B";

        }

        if(bytes < 1024 * 1024){

            return (

                (bytes / 1024).toFixed(1)

                +

                " KB"

            );

        }

        return (

            (bytes / (1024 * 1024)).toFixed(1)

            +

            " MB"

        );

    }








    function detectDirection(text){

        const arabic=/[\u0600-\u06FF]/;

        return arabic.test(text)

        ?

        "rtl"

        :

        "ltr";

    }








    function handleCancel(){

        setCancelled(true);

        cancelUpload();

        setUploading(false);

        showToast(

            "error",

            "Upload canceled."

        );

        close();

    }








    async function publish(){

        if(loading) return;

        try{

            setLoading(true);

            setUploading(true);

            setUploadProgress(0);







            const {

                data:{user}

            }=await supabase.auth.getUser();







            if(!user){

                throw new Error(

                    "User not found"

                );

            }








            let mediaUrls=[];








            if(

                type !== "text"

                &&

                files.length > 0

            ){

                mediaUrls = await uploadMedia(

                    files,

                    (data)=>{

                        setUploadProgress(

                            data.progress

                        );

                    }

                );

            }








            if(cancelled){

                return;

            }








            const {

                error

            } = await supabase

            .from("posts")

            .insert({

                user_id:user.id,

                type,

                content:caption,

                media:

                mediaUrls.length

                ?

                mediaUrls

                :

                []

            });








            if(error){

                throw error;

            }








            showToast(

                "success",

                "Post published successfully."

            );








            setTimeout(()=>{

                close();

            },1000);

        }

        catch(err){

            if(

                err.message !==

                "Upload cancelled"

            ){

                console.log(err);

                showToast(

                    "error",

                    err.message ||

                    "Failed to publish post."

                );

            }

        }

        finally{

            setLoading(false);

            setUploading(false);

        }

    }
        return(

        <div className="caption-screen">




            {

            !loading &&

            type !== "text" &&

            <div className="caption-media">

                {

                type === "image" &&

                <ImagePreview

                    image={media}

                />

                }



                {

                type === "video" &&

                <VideoPreview

                    video={media}

                />

                }

            </div>

            }







            {

            loading &&

            type !== "text" &&

            files.length > 0 &&

            <div className="upload-info">

                <p>

                    Uploading:

                    {" "}

                    {files[0].name}

                </p>



                <p>

                    {formatSize(files[0].size)}

                </p>



                <div className="upload-bar">

                    <div

                        className="upload-progress"

                        style={{

                            width:`${uploadProgress}%`

                        }}

                    >

                        {uploadProgress > 8 &&

                        `${uploadProgress}%`}

                    </div>

                </div>



                <button

                    className="cancel-upload-button"

                    onClick={handleCancel}

                >

                    Cancel Upload

                </button>

            </div>

            }








            <textarea

                className="caption-input"

                dir={detectDirection(caption)}

                placeholder={

                    type === "text"

                    ?

                    "What's on your mind?"

                    :

                    "Write a caption..."

                }

                value={caption}

                disabled={loading}

                onChange={(e)=>{

                    setCaption(

                        e.target.value

                    );

                }}

            />








            {

            !loading &&

            <button

                className="publish-button"

                onClick={publish}

            >

                Publish

            </button>

            }

        </div>

    );

}