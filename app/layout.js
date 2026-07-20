import "./globals.css";


import NavbarWrapper from "@/components/Navbar/NavbarWrapper";


import {
    AuthProvider
} from "@/components/Auth/AuthProvider";


import Toast from "@/components/Toast/Toast";


import Offline from "@/components/Offline/Offline";


import BackButton from "@/components/Capacitor/BackButton";


import PushNotification from "@/components/Notifications/PushNotification";



export const metadata = {

    title:"YAP",

    description:"Social media platform",

};




export default function RootLayout({children}){


    return(


        <html lang="en">


            <body>


                <AuthProvider>


                    <BackButton/>


                    <PushNotification/>


                    <NavbarWrapper/>


                    <Toast/>


                    {children}


                    <Offline/>


                </AuthProvider>


            </body>


        </html>


    );


}