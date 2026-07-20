"use client";

import { useEffect, useState } from "react";


export default function Offline(){

    const [online,setOnline] = useState(true);


    useEffect(()=>{

        function update(){

            setOnline(navigator.onLine);

        }


        window.addEventListener(
            "online",
            update
        );


        window.addEventListener(
            "offline",
            update
        );


        update();


        return ()=>{

            window.removeEventListener(
                "online",
                update
            );


            window.removeEventListener(
                "offline",
                update
            );

        };


    },[]);



    if(online){

        return null;

    }



    return (

        <div className="offline-screen">


            <img
                src="/logo.png"
                width="100"
            />


            <h1>
                No Internet Connection
            </h1>


            <p>
                Check your connection and try again
            </p>


            <button
                onClick={()=>location.reload()}
            >
                Retry
            </button>


        </div>

    );


}