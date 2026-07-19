"use client";

import {
    Image,
    Bookmark
} from "lucide-react";


export default function ProfileTabs({

    activeTab,

    setActiveTab,

    isOwner

}){


    return(

        <div className="profile-tabs">


            <button

                className={
                    activeTab === "posts"
                    ?
                    "active"
                    :
                    ""
                }

                onClick={()=>setActiveTab("posts")}

            >

                <Image size={18}/>

                Posts

            </button>



            {
                isOwner &&

                <button

                    className={
                        activeTab === "saved"
                        ?
                        "active"
                        :
                        ""
                    }

                    onClick={()=>setActiveTab("saved")}

                >

                    <Bookmark size={18}/>

                    Saved Posts

                </button>
            }



        </div>

    );


}