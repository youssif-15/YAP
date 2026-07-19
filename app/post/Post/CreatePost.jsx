"use client";


import {
    useState
} from "react";


import CreateModal from "@/components/CreateMenu/CreateModal";



export default function CreatePost(){


    const [open,setOpen] = useState(false);



    return (

        <>


        <div className="create-post">


            <div className="create-avatar"></div>



            <button

            className="create-input"

            onClick={()=>setOpen(true)}

            >

                What's on your mind?

            </button>


        </div>



        {


            open &&

            <CreateModal

            close={()=>setOpen(false)}

            />

        }


        </>

    );

}