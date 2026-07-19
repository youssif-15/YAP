"use client";


import {
    useEffect,
    useState
} from "react";


import {
    supabase
} from "@/lib/supabase";





export default function SettingsPage(){


    const [email,setEmail] = useState("");

    const [newEmail,setNewEmail] = useState("");

    const [showEmail,setShowEmail] = useState(false);


    const [popup,setPopup] = useState(null);


    const [password,setPassword] = useState("");


    const [message,setMessage] = useState("");


    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        loadUser();


    },[]);









    async function loadUser(){


        const {
            data:{
                user
            }
        } = await supabase.auth.getUser();




        if(user){


            setEmail(user.email);

            setNewEmail(user.email);


        }



        setLoading(false);


    }









    function showMessage(text){


        setMessage(text);



        setTimeout(()=>{


            setMessage("");


        },3000);


    }









    function openPopup(type){


        setPopup(type);

        setPassword("");

    }









    function closePopup(){


        setPopup(null);

        setPassword("");

    }









    async function confirmPassword(){



        const {
            data:{
                user
            }
        } = await supabase.auth.getUser();





        if(!user){

            return;

        }








        const {
            error
        } = await supabase.auth.signInWithPassword({


            email:user.email,


            password


        });








        if(error){


            showMessage(
                "Incorrect password"
            );


            return;


        }








        if(popup === "show-email"){



            setShowEmail(true);



            showMessage(
                "Email revealed"
            );



        }








        if(popup === "change-email"){



            const {
                error
            } = await supabase.auth.updateUser({


                email:newEmail.trim()


            });






            if(error){


                showMessage(
                    error.message
                );


                closePopup();

                return;


            }







            showMessage(
                "Check your email to confirm the change"
            );



        }






        closePopup();



    }









    async function sendPasswordReset(){



        const {
            error
        } = await supabase.auth.resetPasswordForEmail(


            email


        );







        if(error){


            showMessage(
                error.message
            );


            return;


        }






        showMessage(

            "Password reset link sent to your email"

        );


    }









    if(loading){


        return(

            <div className="settings-loading">

                Loading...

            </div>

        );


    }









    return(



        <main className="settings-page">







            {
                message &&

                <div className="settings-toast">

                    {message}

                </div>
            }








            <section className="settings-card">





                <h2>

                    Account Security

                </h2>








                <div className="settings-input">


                    <label>

                        Email

                    </label>





                    <input

                    readOnly

                    value={

                        showEmail

                        ?

                        email

                        :

                        "********@****.com"

                    }

                    />



                </div>







                {
                    !showEmail &&

                    <button

                    className="settings-button"

                    onClick={()=>openPopup("show-email")}

                    >

                        Reveal Email

                    </button>
                }







                <button

                className="settings-button"

                onClick={()=>openPopup("change-email")}

                >

                    Change Email

                </button>









                <div className="password-area">



                    <h3>

                        Password

                    </h3>



                    <p>

                        We will send you a secure link to change your password.

                    </p>





                    <button

                    className="settings-button"

                    onClick={sendPasswordReset}

                    >

                        Send Reset Link

                    </button>



                </div>






            </section>









            {
                popup &&


                <div className="settings-overlay">



                    <div className="settings-modal">



                        <h3>

                            Confirm Password

                        </h3>





                        {
                            popup === "change-email" &&


                            <div className="settings-input">


                                <label>

                                    New Email

                                </label>



                                <input

                                value={newEmail}

                                onChange={(e)=>

                                    setNewEmail(e.target.value)

                                }

                                />


                            </div>

                        }







                        <input

                        className="settings-modal-input"

                        type="password"

                        placeholder="Current password"

                        value={password}

                        onChange={(e)=>

                            setPassword(e.target.value)

                        }

                        />








                        <div className="modal-actions">



                            <button

                            className="settings-button"

                            onClick={confirmPassword}

                            >

                                Confirm

                            </button>





                            <button

                            className="cancel-button"

                            onClick={closePopup}

                            >

                                Cancel

                            </button>



                        </div>






                    </div>



                </div>

            }







        </main>


    );


}