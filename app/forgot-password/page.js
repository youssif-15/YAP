"use client";


import { useState } from "react";


import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";
import AuthNavbar from "@/components/Auth/AuthNavbar";


import { supabase } from "@/lib/supabase";



export default function ForgotPassword(){



    const [email,setEmail] = useState("");

    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");

    const [sent,setSent] = useState(false);







    async function handleReset(){



        try{


            setLoading(true);

            setError("");





            const {error} = await supabase.auth.resetPasswordForEmail(

                email,

                {

                    redirectTo:
                    `${window.location.origin}/reset-password`

                }

            );






            if(error){


                throw error;


            }





            setSent(true);






        }



        catch(err){


            console.log(
                "RESET PASSWORD ERROR:",
                err
            );


            setError(
                err.message ||
                "Something went wrong"
            );


        }



        finally{


            setLoading(false);


        }



    }








    return (



        <>



            <AuthNavbar />






            <AuthCard



                title={

                    sent

                    ?

                    "Check your email"

                    :

                    "Reset password"

                }



                subtitle={

                    sent

                    ?

                    "Password reset link sent"

                    :

                    "Enter your email to reset your password"

                }



            >






            {

            sent ?





                <div className="verification-message">



                    <h2>

                        We've sent you a password reset email

                    </h2>



                    <p>

                        Check your inbox and follow the link
                        to create a new password.

                    </p>



                </div>







            :





                <>





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









                {


                error &&


                <p className="auth-error">


                    {error}


                </p>


                }









                <AuthButton



                    text="Send reset link"



                    loading={loading}



                    onClick={handleReset}



                />








                <div className="auth-footer">



                    Remember your password?



                    <a href="/login">

                        Login

                    </a>



                </div>






                </>





            }







            </AuthCard>





        </>


    );


}