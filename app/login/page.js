"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";


import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import PasswordInput from "@/components/Auth/PasswordInput";
import AuthButton from "@/components/Auth/AuthButton";
import AuthNavbar from "@/components/Auth/AuthNavbar";
import PublicRoute from "@/components/Auth/PublicRoute";


import { supabase } from "@/lib/supabase";



export default function Login(){



    const router = useRouter();




    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");




    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");









    async function handleLogin(){



        try{



            setLoading(true);

            setError("");






            const {data,error} =

            await supabase.auth.signInWithPassword({



                email,

                password



            });







            if(error){


                throw error;


            }








            console.log(

                "LOGGED USER:",

                data.user

            );








            router.push("/home");







        }



        catch(err){





            console.log(

                "LOGIN ERROR:",

                err

            );







            if(

                err.message.includes(

                    "Email not confirmed"

                )

            ){



                setError(

                    "Please verify your email first"

                );



            }





            else if(

                err.message.includes(

                    "Invalid login credentials"

                )

            ){



                setError(

                    "Incorrect email or password"

                );



            }





            else{



                setError(

                    err.message

                );



            }






        }




        finally{



            setLoading(false);



        }






    }









    return (



        <PublicRoute>



            <>


                <AuthNavbar />





                <AuthCard





                    title="Welcome back"





                    subtitle="Login to YAP"





                >








                    <AuthInput





                        label="Email"





                        type="email"





                        placeholder="example@gmail.com"





                        value={email}





                        onChange={(e)=>{





                            setEmail(

                                e.target.value.toLowerCase()

                            );





                        }}






                    />












                    <PasswordInput





                        label="Password"





                        placeholder="Password"





                        value={password}





                        onChange={(e)=>{





                            setPassword(

                                e.target.value

                            );





                        }}






                    />












                <div className="forgot-password">

                    




                        <a



                            href="/forgot-password"



                            style={{


                                color:"#2563eb",

                                fontSize:"14px",

                                fontWeight:"600"


                            }}



                        >



                            Forgot password?



                        </a>




                    </div>









                    {



                    error &&




                    <p className="auth-error">





                        {error}





                    </p>





                    }









                    <AuthButton





                        text="Login"





                        loading={loading}





                        onClick={handleLogin}






                    />












                    <div className="auth-footer">





                        Don't have an account?






                        <a href="/signup">





                            Create account





                        </a>






                    </div>









                </AuthCard>





            </>



        </PublicRoute>




    );



}