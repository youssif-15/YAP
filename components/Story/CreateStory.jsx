"use client";

import {

    useRef,

    useState

} from "react";

import { supabase } from "@/lib/supabase";

import StoryRing from "./StoryRing";

export default function CreateStory({

    avatar,

    stories=[],

    hasStory,

    onViewStory,

    onCreated

}){

    const inputRef = useRef(null);

    const [menu,setMenu]=useState(false);

    const [file,setFile]=useState(null);

    const [preview,setPreview]=useState(null);

    const [caption,setCaption]=useState("");

    const [uploading,setUploading]=useState(false);

    function open(){

        if(hasStory){

            setMenu(true);

        }

        else{

            inputRef.current.click();

        }

    }

    function selectFile(e){

        const selected=e.target.files[0];

        if(!selected){

            return;

        }

        setFile(selected);

        setPreview(

            URL.createObjectURL(selected)

        );

    }

    function cancel(){

        setFile(null);

        setPreview(null);

        setCaption("");

        inputRef.current.value="";

    }

    async function upload(){

        if(!file){

            return;

        }

        setUploading(true);

        try{

            const {

                data:{

                    user

                }

            } = await supabase.auth.getUser();

            const formData = new FormData();

            formData.append(

                "file",

                file

            );

            formData.append(

                "upload_preset",

                "yap_upload"

            );

            const response = await fetch(

                "https://api.cloudinary.com/v1_1/ax6ilhsa/auto/upload",

                {

                    method:"POST",

                    body:formData

                }

            );

            const data = await response.json();

            if(!response.ok){

                throw new Error(

                    data.error?.message ||

                    "Upload failed"

                );

            }
                        const {

                error

            } = await supabase

            .from("stories")

            .insert({

                user_id:user.id,

                media_url:data.secure_url,

                media_type:

                file.type.startsWith("video")

                ?

                "video"

                :

                "image",

                caption:

                caption.trim()

                ||

                null,

                expires_at:

                new Date(

                    Date.now()+86400000

                )

            });

            if(error){

                throw error;

            }

            cancel();

            onCreated();

        }

        catch(error){

            console.log(error);

            alert(

                error.message ||

                "Upload failed."

            );

        }

        finally{

            setUploading(false);

        }

    }

    return(

        <>

        <div

            onClick={open}

        >

            <StoryRing

                avatar={avatar}

                stories={stories}

                add={!hasStory}

            />

        </div>

        {

        menu &&

        <div className="story-menu">

            <button

                onClick={()=>{

                    setMenu(false);

                    onViewStory();

                }}

            >

                View Story

            </button>

            <button

                onClick={()=>{

                    setMenu(false);

                    inputRef.current.click();

                }}

            >

                Add New Story

            </button>

        </div>

        }

        {

        file &&

        <div className="story-create-overlay">

            <div className="story-create-box">
                                {

                file.type.startsWith("video")

                ?

                <video

                    src={preview}

                    className="story-preview"

                    controls

                />

                :

                <img

                    src={preview}

                    className="story-preview"

                />

                }

                <textarea

                    placeholder="Add caption..."

                    value={caption}

                    onChange={e=>

                        setCaption(

                            e.target.value

                        )

                    }

                />

                <button

                    onClick={upload}

                    disabled={uploading}

                >

                    {

                    uploading

                    ?

                    "Uploading..."

                    :

                    "Post Story"

                    }

                </button>

                <button

                    className="cancel-story"

                    onClick={cancel}

                >

                    Cancel

                </button>

            </div>

        </div>

        }

        <input

            ref={inputRef}

            hidden

            type="file"

            accept="image/*,video/*"

            onChange={selectFile}

        />

        </>

    );

}