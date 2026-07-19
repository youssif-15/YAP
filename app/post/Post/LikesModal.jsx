"use client";

import { useRouter } from "next/navigation";


export default function LikesModal({

    open,

    users,

    onClose

}){


    const router = useRouter();



    if(!open){

        return null;

    }





    return(


        <div

            className="likes-modal-overlay"

            onClick={onClose}

        >



            <div

                className="likes-modal"

                onClick={(e)=>e.stopPropagation()}

            >



                <div className="likes-modal-header">


                    <h3>

                        Likes

                    </h3>


                </div>







                <div className="likes-modal-body">



                    {


                    users.length === 0


                    ?


                    <p>

                        No likes yet.

                    </p>


                    :


                    users.map((user)=>(


                        <div


                            key={user.id}


                            className="likes-user"


                            onClick={()=>{


                                onClose();


                                router.push(

                                    `/profile/${user.username}`

                                );


                            }}


                        >




                            {


                            user.avatar_url


                            ?


                            <img

                                src={user.avatar_url}

                                className="likes-avatar-image"

                                alt=""

                            />


                            :


                            <div className="likes-avatar"/>


                            }





                            <span>


                                {user.username}


                            </span>



                        </div>


                    ))


                    }



                </div>




            </div>



        </div>


    );


}