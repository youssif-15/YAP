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




export default function ProtectedRoute({children}){



    const router = useRouter();


    const {
        user,
        loading
    } = useAuth();






    useEffect(()=>{



        if(!loading && !user){


            router.push("/login");


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
                    color:"#2563eb",
                    fontSize:"18px"
                }}
            >

                Loading...

            </div>


        );


    }








    if(!user){


        return null;


    }








    return children;



}