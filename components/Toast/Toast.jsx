"use client";

import { useEffect, useState } from "react";


export default function Toast(){

    const [message,setMessage] = useState("");

    const [type,setType] = useState("success");



    useEffect(()=>{


        function showToast(e){


            setMessage(
                e.detail.message
            );


            setType(
                e.detail.type || "success"
            );



            setTimeout(()=>{

                setMessage("");

            },2500);


        }



        window.addEventListener(
            "toast",
            showToast
        );



        return ()=>{


            window.removeEventListener(
                "toast",
                showToast
            );


        };


    },[]);




    if(!message){

        return null;

    }




    return (

        <div

        className={

            type === "success"

            ?

            "toast success-toast"

            :

            "toast error-toast"

        }

        >

            {message}

        </div>

    );


}