"use client";


import {

    useRouter

} from "next/navigation";



import OwnerBadge from "@/components/OwnerBadge/OwnerBadge";









export default function FlashbackUserCard({

    user

}){



    const router = useRouter();









    function openFlashbacks(){



        router.push(

            `/flashbacks/${user.username}`

        );


    }









    return(



        <div

            className="flashback-user-card"

            onClick={openFlashbacks}

        >






            {

            user.avatar_url

            ?



            <img

                src={user.avatar_url}

                className="flashback-user-avatar"

                alt="avatar"

            />



            :



            <div className="flashback-user-avatar empty"/>



            }









            <div className="flashback-user-info">





                <h3>

                    <span>

                        {

                        user.username

                        ||

                        "User"

                        }



                        {


                        user.is_owner &&

                        <OwnerBadge/>

                        }


                    </span>

                </h3>








                <p>

                    {user.count}

                    {" "}

                    Memories

                </p>






            </div>








        </div>



    );



}