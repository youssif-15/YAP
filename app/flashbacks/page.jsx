"use client";


import ProtectedRoute from "@/components/Auth/ProtectedRoute";

import Sidebar from "@/components/Sidebar/Sidebar";

import FlashbackFeed from "@/components/Flashback/FlashbackFeed";

import "./Page.css";





export default function Flashbacks(){



    return(



        <ProtectedRoute>



            <div className="app-layout flashbacks-page-layout">





                <Sidebar/>







                <main className="content flashbacks-main">





                    <FlashbackFeed />







                </main>







            </div>



        </ProtectedRoute>



    );


}