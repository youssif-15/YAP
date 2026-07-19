"use client";


import Link from "next/link";





export default function AuthNavbar(){


    return (



        <nav className="auth-navbar">





            <Link

                href="/"

                className="auth-logo"

            >



                <img

                    src="/icon.png"

                    alt="YAP"

                    className="auth-logo-image"

                />


            </Link>









            <div className="auth-links">



                <Link href="/login">

                    Login

                </Link>





                <Link href="/signup">

                    Sign up

                </Link>



            </div>





        </nav>



    );


}