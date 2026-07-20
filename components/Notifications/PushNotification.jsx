"use client";


import { useEffect } from "react";


import {
    PushNotifications
} from "@capacitor/push-notifications";



export default function PushNotification(){


    useEffect(()=>{


        console.log(
            "🔥 YAP PUSH COMPONENT LOADED"
        );



        async function init(){


            console.log(
                "🔥 PUSH INIT START"
            );



            const permission =
            await PushNotifications.requestPermissions();



            console.log(
                "🔥 PERMISSION RESULT:",
                permission
            );



            if(
                permission.receive === "granted"
            ){


                await PushNotifications.register();



                console.log(
                    "🔥 PUSH REGISTER DONE"
                );


            }else{


                console.log(
                    "❌ PUSH PERMISSION DENIED"
                );


            }




            PushNotifications.addListener(

                "registration",

                token=>{


                    console.log(
                        "🔥 FCM TOKEN:",
                        token.value
                    );


                }

            );




            PushNotifications.addListener(

                "registrationError",

                error=>{


                    console.log(
                        "❌ REGISTRATION ERROR:",
                        error
                    );


                }

            );




            PushNotifications.addListener(

                "pushNotificationReceived",

                notification=>{


                    console.log(
                        "🔥 NOTIFICATION RECEIVED:",
                        notification
                    );


                }

            );



        }




        init();



    },[]);



    return null;


}