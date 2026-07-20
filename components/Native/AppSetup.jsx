"use client";

import { useEffect } from "react";
import { StatusBar } from "@capacitor/status-bar";

export default function AppSetup(){

    useEffect(()=>{

        async function setup(){

            try{

                await StatusBar.setBackgroundColor({
                    color:"#0A84FF"
                });

                await StatusBar.show();

            }
            catch(err){

                console.log(err);

            }

        }


        setup();

    },[]);


    return null;

}