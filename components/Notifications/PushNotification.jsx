"use client";


import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/Auth/AuthProvider";


import {
    PushNotifications
} from "@capacitor/push-notifications";



export default function PushNotification(){

    const {user,loading} = useAuth();

    const userId = user?.id;


    useEffect(()=>{

        if(!Capacitor.isNativePlatform()){

            return;

        }


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



    useEffect(()=>{

        if(

            Capacitor.isNativePlatform() ||

            loading ||

            !userId ||

            typeof window === "undefined" ||

            !("Notification" in window)

        ){

            return;

        }


        const channel = supabase

        .channel(`web-notifications-${userId}`)

        .on(

            "postgres_changes",

            {

                event:"INSERT",

                schema:"public",

                table:"notifications",

                filter:`user_id=eq.${userId}`

            },

            ({new:notification})=>{

                if(Notification.permission !== "granted"){

                    return;

                }


                const messages = {

                    follow:"Someone started following you.",

                    like:"Someone liked your post.",

                    comment:"Someone commented on your post.",

                    reply:"Someone replied to your comment."

                };


                const systemNotification = new Notification(

                    "YAP",

                    {

                        body:messages[notification.type] || "You have a new notification.",

                        icon:"/icon.png",

                        tag:`yap-notification-${notification.id}`

                    }

                );


                systemNotification.onclick = ()=>{

                    window.focus();

                };


            }

        )

        .subscribe();


        return()=>{

            supabase.removeChannel(channel);

        };


    },[loading,userId]);


    return null;


}