"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function BackButton(){

    useEffect(()=>{

        const setup = async()=>{

            const listener = await App.addListener(
                "backButton",
                ()=>{

                    if(window.history.length > 1){

                        window.history.back();

                    }else{

                        App.exitApp();

                    }

                }
            );


            return listener;

        };


        let listener;


        setup().then(result=>{

            listener = result;

        });


        return ()=>{

            if(listener){

                listener.remove();

            }

        };


    },[]);


    return null;

}