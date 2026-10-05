import "./globals.css";

import { cookies } from "next/headers";

import ThemeProvider from "@/components/Theme/ThemeProvider";

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




export default async function RootLayout({children}){

    const cookieStore = await cookies();

    const theme = cookieStore.get("theme")?.value === "dark"
        ? "dark"
        : "light";


    return(


        <html lang="en" data-theme={theme}>


            <body>


                <ThemeProvider initialTheme={theme}>

                    <AuthProvider>


                    <BackButton/>


                    <PushNotification/>


                    <NavbarWrapper/>


                    <Toast/>


                    {children}


                    <Offline/>


                    </AuthProvider>

                </ThemeProvider>


            </body>


        </html>


    );


}