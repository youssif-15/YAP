"use client";



import { useEffect, useState } from "react";
import { ShieldBan } from "lucide-react";
import {
    isBlocked,
    toggleBlock
} from "@/lib/block";

import "./BlockButton.css";

export default function BlockButton({

    profile,

    onRefresh

}){

    const [blocked,setBlocked] = useState(false);

    const [loading,setLoading] = useState(false);

    const [showModal,setShowModal] = useState(false);

    useEffect(()=>{

        if(profile){

            loadBlockStatus();

        }

    },[profile]);

    async function loadBlockStatus(){

        try{

            setBlocked(

                await isBlocked(

                    profile.id

                )

            );

        }

        catch(error){

            console.error(error);

        }

    }

    async function confirmBlock(){

        if(

            loading ||

            !profile

        ){

            return;

        }

        setLoading(true);

        try{

            const result = await toggleBlock(

                profile.id

            );

            setBlocked(result);

            setShowModal(false);

            if(onRefresh){

                onRefresh();

            }

        }

        catch(error){

            console.error(error);

            alert("Something went wrong.");

        }

        finally{

            setLoading(false);

        }

    }

    return(

        <>

            <button

                className={

                    blocked

                    ?

                    "unblock-button"

                    :

                    "block-button"

                }

                onClick={()=>setShowModal(true)}

                disabled={loading}

            >

                <ShieldBan size={17}/>

                {

                    blocked

                    ?

                    "Unblock"

                    :

                    "Block"

                }

            </button>

            {

                showModal && (

                    <div
                        className="block-modal-overlay"
                        onClick={()=>setShowModal(false)}
                    >

                        <div
                            className="block-modal"
                            onClick={(e)=>e.stopPropagation()}
                        >

                            <div className="block-modal-icon">

                                <ShieldBan size={34}/>

                            </div>

                            <h3>

                                {

                                    blocked

                                    ?

                                    "Unblock User"

                                    :

                                    "Block User"

                                }

                            </h3>

                            <p>

                                {

                                    blocked

                                    ?

                                    <>Are you sure you want to unblock <strong>@{profile.username}</strong>?</>

                                    :

                                    <>Are you sure you want to block <strong>@{profile.username}</strong>? They won't be able to interact with you until you unblock them.</>

                                }

                            </p>

                            <div className="block-modal-actions">

                                <button

                                    className="block-modal-cancel"

                                    onClick={()=>setShowModal(false)}

                                >

                                    Cancel

                                </button>

                                <button

                                    className="block-modal-confirm"

                                    onClick={confirmBlock}

                                    disabled={loading}

                                >

                                    {

                                        loading

                                        ?

                                        "Please wait..."

                                        :

                                        blocked

                                        ?

                                        "Unblock"

                                        :

                                        "Block"

                                    }

                                </button>

                            </div>

                        </div>

                    </div>

                )

            }

        </>

    );

}