"use client";


import {useState} from "react";
import {useRouter} from "next/navigation";


import AuthCard from "@/components/Auth/AuthCard";
import PasswordInput from "@/components/Auth/PasswordInput";
import AuthButton from "@/components/Auth/AuthButton";
import AuthNavbar from "@/components/Auth/AuthNavbar";


import {supabase} from "@/lib/supabase";



export default function ResetPassword(){


    const router = useRouter();


    const [password,setPassword] = useState("");

    const [confirmPassword,setConfirmPassword] = useState("");

    const [loading,setLoading] = useState(false);

    const [error,setError] = useState("");

    const [done,setDone] = useState(false);




    async function handleUpdate(){


        if(password !== confirmPassword){

            setError("Passwords do not match");

            return;

        }



        try{


            setLoading(true);

            setError("");



            const {error} = await supabase.auth.updateUser({

                password

            });



            if(error){

                throw error;

            }



            setDone(true);



            setTimeout(()=>{

                router.push("/login");

            },2000);



        }



        catch(err){


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
done
?
"Password changed"
:
"Create new password"
}


subtitle={
done
?
"Redirecting to login..."
:
"Choose a new password"
}


>


{

done ?


<div className="verification-message">

<h2>

Password updated successfully

</h2>


<p>

You can login with your new password now.

</p>


</div>



:

<>


<PasswordInput

label="New password"

placeholder="New password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<PasswordInput

label="Confirm password"

placeholder="Confirm password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

/>



{
error &&

<p className="auth-error">

{error}

</p>

}



<AuthButton

text="Change password"

loading={loading}

onClick={handleUpdate}

/>


</>

}


</AuthCard>


</>

);


}