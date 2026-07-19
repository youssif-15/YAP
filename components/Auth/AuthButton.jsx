"use client";


export default function AuthButton({

    text,

    loading=false,

    onClick

}) {


    return (

        <button

            className="auth-button"

            onClick={onClick}

            disabled={loading}

        >

            {

                loading

                ?

                "Loading..."

                :

                text

            }


        </button>

    );

}