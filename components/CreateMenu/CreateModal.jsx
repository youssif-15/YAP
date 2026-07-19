"use client";


import { useState } from "react";

import { X } from "lucide-react";

import TextUploader from "./TextUploader";

import ChooseType from "./ChooseType";

import PhotoUploader from "./PhotoUploader";

import ReelUploader from "./ReelUploader";




export default function CreateModal({

    close,

    initialType = null

}) {



    const [type,setType] = useState(initialType);

    const [uploading,setUploading] = useState(false);





    return(



        <div className="modal-overlay">





            <div className="create-modal">







                <div className="modal-header">



                    <h2>

                        {

                        type === null

                        ?

                        "Create"

                        :

                        type === "photo"

                        ?

                        "Create Photo Post"

                        :

                        type === "reel"

                        ?

                        "Create Reel"

                        :

                        "Create Text Post"

                        }

                    </h2>





                    {

                    !uploading &&

                    <button

                        onClick={close}

                    >

                        <X size={22}/>

                    </button>

                    }



                </div>








                {

                type === null &&

                <ChooseType

                    setType={setType}

                />

                }









                {

                type === "photo" &&

                <PhotoUploader

                    close={close}

                    setUploading={setUploading}

                />

                }










                {

                type === "reel" &&

                <ReelUploader

                    close={close}

                    setUploading={setUploading}

                />

                }










                {

                type === "text" &&

                <TextUploader

                    close={close}

                />

                }






            </div>




        </div>



    );


}