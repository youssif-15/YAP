"use client";


import { X } from "lucide-react";

import MemoryUploader from "./MemoryUploader";

import "./FlashbackModal.css";




export default function FlashbackModal({

    close,

    refresh

}){


    return(


        <div className="flashback-modal-overlay">


            <div className="flashback-create-modal">


                <div className="flashback-modal-header">


                    <h2>

                        Create Flashback

                    </h2>



                    <button

                        onClick={close}

                    >

                        <X size={22}/>

                    </button>


                </div>





                <MemoryUploader

                    close={close}

                    refresh={refresh}

                />



            </div>


        </div>


    );


}