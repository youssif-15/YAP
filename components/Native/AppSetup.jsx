"use client";

import { useEffect } from "react";
import { StatusBar } from "@capacitor/status-bar";

export default function AppSetup(){

    useEffect(()=>{

        async function syncStatusBar(){

            try{

                await StatusBar.setBackgroundColor({
                    color:getComputedStyle(document.documentElement)
                        .getPropertyValue("--primary")
                        .trim()
                });

                await StatusBar.show();

            }
            catch(err){

                console.log(err);

            }

        }


        function handleThemeChange(){
            syncStatusBar();
        }

        syncStatusBar();

        window.addEventListener("theme-change",handleThemeChange);

        return ()=>{
            window.removeEventListener("theme-change",handleThemeChange);
        };

    },[]);


    return null;

}