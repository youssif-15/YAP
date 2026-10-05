"use client";


import { usePathname } from "next/navigation";


import Navbar from "./Navbar";


import MobileNavbar from "@/components/MobileNavbar/MobileNavbar";

import ThemeToggle from "@/components/Theme/ThemeToggle";






export default function NavbarWrapper(){



    const pathname = usePathname();








    const hiddenPages = [


        "/login",

        "/signup",

        "/forgot-password",

        "/reset-password"


    ];








    const isReelsPage =

        pathname === "/reels"

        ||

        pathname.startsWith("/reels/");









    if(

        hiddenPages.includes(pathname)

        ||

        isReelsPage

    ){


        return <ThemeToggle floating/>;


    }









    const isSettingsPage =

        pathname === "/settings";









    return(



        <>


            <MobileNavbar />



            <Navbar


                settingsMode={isSettingsPage}


            />



        </>



    );



}