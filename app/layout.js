import "./globals.css";

import NavbarWrapper from "@/components/Navbar/NavbarWrapper";

import {
    AuthProvider
} from "@/components/Auth/AuthProvider";

import Toast from "@/components/Toast/Toast";

import Offline from "@/components/Offline/Offline";

export const metadata = {

    title:"YAP",

    description:"Social media platform",

};

export default function RootLayout({children}){

    return(

        <html lang="en">

            <body>

                <AuthProvider>

                    <NavbarWrapper/>

                    <Toast/>

                    {children}

                    <Offline/>

                </AuthProvider>

            </body>

        </html>

    );

}