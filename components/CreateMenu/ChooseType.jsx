"use client";


import {
    ImageIcon,
    Clapperboard,
    FileText
} from "lucide-react";



export default function ChooseType({ setType }) {


    return (


        <div className="choose-type">



            <button

            className="choose-card"

            onClick={()=>setType("text")}

            >


                <FileText size={42}/>



                <h3>
                    Text Post
                </h3>



                <p>
                    Share your thoughts.
                </p>


            </button>







            <button

            className="choose-card"

            onClick={()=>setType("photo")}

            >


                <ImageIcon size={42}/>



                <h3>
                    Photo Post
                </h3>



                <p>
                    Share one or more photos.
                </p>


            </button>








            <button

            className="choose-card"

            onClick={()=>setType("reel")}

            >


                <Clapperboard size={42}/>



                <h3>
                    Video
                </h3>



                <p>
                    Upload a video.
                </p>


            </button>





        </div>


    );


}