"use client";


import { useEffect, useState } from "react";


import { supabase } from "@/lib/supabase";


import Link from "next/link";







export default function CommentText({

    text

}){



    const [users,setUsers] = useState([]);








    useEffect(()=>{



        if(!text){

            return;

        }







        async function checkUsers(){



            const mentions = text.match(

                /@[a-zA-Z0-9_.]+/g

            );







            if(!mentions){

                return;

            }








            const usernames = mentions.map(

                mention =>

                mention.substring(1)

            );








            const {

                data,

                error

            } = await supabase

            .from("profiles")

            .select(

                "username"

            )

            .in(

                "username",

                usernames

            );








            if(error){



                console.log(

                    "MENTION CHECK ERROR:",

                    error

                );



                return;



            }








            setUsers(



                data?.map(

                    user => user.username

                )



                ||



                []



            );





        }








        checkUsers();





    },[text]);













    const parts = text.split(



        /(@[a-zA-Z0-9_.]+)/g



    );









    return(



        <>



        {

        parts.map((part,index)=>{






            if(

                part.startsWith("@")

            ){





                const username =

                part.substring(1);







                const exists =

                users.includes(username);








                if(exists){



                    return(



                        <Link



                        key={index}



                        href={

                            `/profile/${username}`

                        }



                        className="comment-mention"



                        >



                            {part}



                        </Link>



                    );



                }





            }









            return part;



        })

        }

        </>



    );



}