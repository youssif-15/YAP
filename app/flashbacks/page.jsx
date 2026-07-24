"use client";


import ProtectedRoute from "@/components/Auth/ProtectedRoute";

import Sidebar from "@/components/Sidebar/Sidebar";

import FlashbackFeed from "@/components/Flashback/FlashbackFeed";





export default function Flashbacks(){



    return(



        <ProtectedRoute>



            <div className="app-layout">



                <Sidebar/>





                <main className="content">



                    <FlashbackFeed/>




                </main>





            </div>



        </ProtectedRoute>



    );


}