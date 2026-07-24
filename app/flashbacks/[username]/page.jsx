"use client";


import {

    use

} from "react";


import {

    useRouter

} from "next/navigation";


import FlashbackFeed from "@/components/Flashback/FlashbackFeed";


import Sidebar from "@/components/Sidebar/Sidebar";


import "./Page.css";








export default function UserFlashbacksPage({

    params

}){


    const router = useRouter();




    const {

        username

    } = use(params);






    return(


        <div className="app-layout">






            <Sidebar/>







            <main className="content flashback-user-page">





                <button

                    className="back-button"

                    onClick={()=>router.back()}

                >


                    ← Back


                </button>









                <FlashbackFeed


                    flashbackId={username}


                    mode="single"


                />






            </main>








            <div className="fake-user-card"/>






        </div>


    );


}