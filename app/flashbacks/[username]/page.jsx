"use client";


import {

    use

} from "react";


import FlashbackFeed from "@/components/Flashback/FlashbackFeed";








export default function UserFlashbacksPage({

    params

}){


    const {

        username

    } = use(params);







    return(



        <div className="flashbacks-page">





            <FlashbackFeed

                username={username}

                mode="user"

            />






        </div>



    );



}