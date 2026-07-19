"use client";


import {
    useEffect
} from "react";


import {
    useRouter
} from "next/navigation";


import {
    useAuth
} from "./AuthProvider";




export default function PublicRoute({children}){


    const router = useRouter();


    const {
        user,
        loading
    } = useAuth();





    useEffect(()=>{


        if(!loading && user){


            router.push("/home");


        }


    },[loading,user,router]);








    if(loading){


        return (

            <div
                style={{
                    minHeight:"100vh",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    color:"#2563eb"
                }}
            >

                Loading...

            </div>

        );


    }





    if(user){


        return null;


    }





    return children;



}