"use client";


import {

    useState

} from "react";


import {

    supabase

} from "@/lib/supabase";


import {

    useAuth

} from "@/components/Auth/AuthProvider";









export default function MemoryUploader({

    close,

    refresh

}){



    const {

        user

    } = useAuth();






    const [file,setFile] = useState(null);


    const [caption,setCaption] = useState("");


    const [privacy,setPrivacy] = useState("public");


    const [uploading,setUploading] = useState(false);









    async function uploadMemory(){



        if(!file || !user){



            console.log(

                "NO FILE OR USER"

            );


            return;



        }







        setUploading(true);







        try{





            const extension =

            file.name.split(".").pop();







            const fileName =

            `${user.id}/${Date.now()}.${extension}`;








            const {

                error:uploadError

            } = await supabase



            .storage



            .from("flashbacks")



            .upload(



                fileName,

                file



            );








            if(uploadError){



                console.log(

                    "STORAGE ERROR",

                    uploadError

                );


                return;



            }









            const {

                data:urlData

            } = supabase



            .storage



            .from("flashbacks")



            .getPublicUrl(

                fileName

            );








            const mediaUrl =

            urlData.publicUrl;








            const mediaType =

            file.type.startsWith("video")

            ?

            "video"

            :

            "image";









            const {

                error

            } = await supabase



            .from("flashbacks")



            .insert({



                user_id:user.id,


                media_url:mediaUrl,


                media_type:mediaType,


                caption:caption.trim(),


                privacy



            });









            if(error){



                console.log(

                    "FLASHBACK INSERT ERROR",

                    error

                );


                return;



            }








            if(refresh){



                refresh();



            }








            close();






        }



        catch(error){



            console.log(

                "UPLOAD FAILED",

                error

            );



        }







        finally{



            setUploading(false);



        }



    }














    return(



        <div className="flashback-uploader">







            <label className="memory-file-box">



                <span>



                    {

                    file

                    ?

                    file.name

                    :

                    "Choose photo or video"

                    }



                </span>







                <input



                    type="file"



                    accept="image/*,video/*"



                    onChange={e=>{



                        setFile(

                            e.target.files[0]

                        );



                    }}



                />



            </label>












            <textarea



                placeholder="Write a memory..."



                value={caption}



                onChange={e=>

                    setCaption(

                        e.target.value

                    )

                }



            />













            <div className="privacy-select">



                <label>

                    Who can see this?

                </label>







                <select



                    value={privacy}



                    onChange={e=>

                        setPrivacy(

                            e.target.value

                        )

                    }



                >





                    <option value="public">

                        Public

                    </option>







                    <option value="private">

                        Only me

                    </option>







                </select>



            </div>













            <button



                disabled={uploading}



                onClick={uploadMemory}



                className="memory-create-button"



            >





                {

                uploading

                ?

                "Saving Memory..."

                :

                "Create Memory"

                }





            </button>







        </div>



    );



}