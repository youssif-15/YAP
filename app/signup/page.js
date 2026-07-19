"use client";


import { useState } from "react";

import {
    CircleCheck,
    CircleX
} from "lucide-react";


import AuthCard from "@/components/Auth/AuthCard";
import AuthInput from "@/components/Auth/AuthInput";
import PasswordInput from "@/components/Auth/PasswordInput";
import AuthButton from "@/components/Auth/AuthButton";
import PasswordStrength from "@/components/Auth/PasswordStrength";
import AuthNavbar from "@/components/Auth/AuthNavbar";
import PublicRoute from "@/components/Auth/PublicRoute";


import { supabase } from "@/lib/supabase";



export default function Signup() {



    const [username,setUsername] = useState("");

    const [fullname,setFullname] = useState("");

    const [email,setEmail] = useState("");

    const [password,setPassword] = useState("");

    const [confirmPassword,setConfirmPassword] = useState("");



    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");

    const [emailSent,setEmailSent] = useState(false);



    const [usernameError,setUsernameError] = useState("");

    const [usernameValid,setUsernameValid] = useState(false);

    const [checkingUsername,setCheckingUsername] = useState(false);



    const [emailError,setEmailError] = useState("");

    const [emailValid,setEmailValid] = useState(false);







    async function checkUsername(value){



        if(!value){


            setUsernameError("");

            setUsernameValid(false);

            setCheckingUsername(false);

            return;


        }




        setCheckingUsername(true);




        const {data,error} = await supabase

        .from("profiles")

        .select("username")

        .eq("username",value)

        .maybeSingle();






        if(error){


            console.log(
                "USERNAME CHECK ERROR:",
                error
            );


            setUsernameError(
                "Could not check username"
            );


            setUsernameValid(false);

            setCheckingUsername(false);

            return;


        }






        if(data){


            setUsernameError(
                "Username is already taken"
            );


            setUsernameValid(false);


        }


        else{


            setUsernameError("");

            setUsernameValid(true);


        }




        setCheckingUsername(false);


    }








    function checkEmail(value){



        value=value.toLowerCase();



        setEmail(value);




        if(!value){


            setEmailError("");

            setEmailValid(false);


            return;


        }







        const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;







        if(!regex.test(value)){



            setEmailError(
                "Enter a valid email address"
            );


            setEmailValid(false);


        }



        else{


            setEmailError("");

            setEmailValid(true);


        }



    }









    async function handleSignup(){



        if(password !== confirmPassword){


            setError(
                "Passwords do not match"
            );


            return;


        }







        if(usernameError){


            setError(
                "Username is already taken"
            );


            return;


        }







        if(emailError){


            setError(
                emailError
            );


            return;


        }








        try{



            setLoading(true);

            setError("");








            const {data,error} =

            await supabase.auth.signUp({



                email,

                password,



                options:{


                    data:{


                        username,

                        full_name:fullname


                    }


                }



            });







            if(error){



                if(
                    error.message.includes(
                        "already registered"
                    )
                ){


                    throw new Error(
                        "Email is already registered"
                    );


                }




                throw error;


            }







            console.log(
                "AUTH USER:",
                data.user
            );








            setEmailSent(true);







        }



        catch(err){



            console.log(
                "SIGNUP ERROR:",
                err
            );




            setError(

                err?.message ||

                JSON.stringify(err) ||

                "Something went wrong"

            );



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



                title={

                    emailSent

                    ?

                    "Check your email"

                    :

                    "Create your account"

                }



                subtitle={

                    emailSent

                    ?

                    "Verification required"

                    :

                    "Join YAP today"

                }



            >







            {

            emailSent ?





            <div className="verification-message">



                <h2>

                    We've sent you a verification email

                </h2>



                <p>

                    Check your inbox and click the verification link
                    to activate your account.

                </p>



            </div>







            :






            <>









            <div className="username-container">



                <AuthInput



                    label="Username"



                    placeholder="Username"



                    value={username}



                    onChange={(e)=>{


                        let value=e.target.value;



                        value=value

                        .replace(/\s+/g,"_")

                        .replace(/[^a-zA-Z0-9_.]/g,"");




                        setUsername(value);



                        checkUsername(value);



                    }}



                />







                {

                usernameValid &&



                <span

                className="username-icon success"

                title="Username is available"

                >



                    <CircleCheck size={22}/>



                </span>

                }







                {

                usernameError &&



                <span

                className="username-icon error"

                title={usernameError}

                >



                    <CircleX size={22}/>



                </span>

                }



            </div>







            {

            checkingUsername &&



            <p className="username-checking">

                Checking username...

            </p>


            }








            <AuthInput



                label="Full Name"



                placeholder="Your name"



                value={fullname}



                onChange={(e)=>setFullname(e.target.value)}



            />








            <div className="username-container">



                <AuthInput



                    label="Email"



                    type="email"



                    placeholder="example@gmail.com"



                    value={email}



                    onChange={(e)=>
                        checkEmail(e.target.value)
                    }



                />






                {

                emailValid &&



                <span

                className="username-icon success"

                title="Email format is valid"

                >



                    <CircleCheck size={22}/>



                </span>


                }








                {

                emailError &&



                <span

                className="username-icon error"

                title={emailError}

                >



                    <CircleX size={22}/>



                </span>


                }



            </div>








            <PasswordInput



                label="Password"



                placeholder="Password"



                value={password}



                onChange={(e)=>

                    setPassword(e.target.value)

                }



            />






            <PasswordStrength

                password={password}

            />








            <PasswordInput



                label="Confirm Password"



                placeholder="Confirm Password"



                value={confirmPassword}



                onChange={(e)=>

                    setConfirmPassword(e.target.value)

                }



            />









            {

            error &&



            <p className="auth-error">



                {error}



            </p>



            }









            <AuthButton



                text="Create Account"



                loading={loading}



                onClick={handleSignup}



            />









            <div className="auth-footer">



                Already have an account?



                <a href="/login">


                    Login


                </a>



            </div>








            </>






            }







            </AuthCard>






        </>



        </PublicRoute>



    );



}