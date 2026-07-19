"use client";


export default function PasswordStrength({password}) {



    function getStrength(){


        let score = 0;



        if(password.length >= 8)
            score++;


        if(/[A-Z]/.test(password))
            score++;


        if(/[a-z]/.test(password))
            score++;


        if(/[0-9]/.test(password))
            score++;


        if(/[^A-Za-z0-9]/.test(password))
            score++;





        if(score <= 2){

            return {
                text:"Weak",
                width:"33%",
                class:"weak"
            };

        }




        if(score <= 4){

            return {
                text:"Medium",
                width:"66%",
                class:"medium"
            };

        }




        return {

            text:"Strong",
            width:"100%",
            class:"strong"

        };


    }






    if(!password)
        return null;





    const strength=getStrength();






    return (



        <div className="password-strength">



            <div className="strength-bar">



                <div

                className={`strength-fill ${strength.class}`}

                style={{

                    width:strength.width

                }}

                />


            </div>




            <p className={`strength-text ${strength.class}`}>

                {strength.text}

            </p>



        </div>


    );

}