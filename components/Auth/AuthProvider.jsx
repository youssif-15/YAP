"use client";


import {

    createContext,

    useContext,

    useEffect,

    useState

} from "react";


import { supabase } from "@/lib/supabase";


const AuthContext = createContext();



let authUser = null;



export function getAuthUser(){

    return authUser;

}






export function AuthProvider({children}){


    const [user,setUser] = useState(null);

    const [loading,setLoading] = useState(true);








    useEffect(()=>{


        let mounted = true;





        async function loadSession(){



            try{


                const {

                    data

                } = await supabase.auth.getSession();





                if(!mounted){

                    return;

                }



                const currentUser = data.session?.user ?? null;



                authUser = currentUser;



                setUser(currentUser);



            }

            catch(error){


                console.log(

                    "SESSION ERROR:",

                    error

                );


                authUser = null;



                setUser(null);



            }

            finally{


                if(mounted){

                    setLoading(false);

                }


            }



        }







        loadSession();







        const {

            data

        } = supabase.auth.onAuthStateChange(


            (_event,session)=>{


                const currentUser = session?.user ?? null;



                authUser = currentUser;



                setUser(currentUser);



            }


        );







        return()=>{


            mounted = false;


            data.subscription.unsubscribe();


        };



    },[]);









    async function logout(){



        try{


            await supabase.auth.signOut();



            authUser = null;



            setUser(null);



        }

        catch(error){


            console.log(

                "LOGOUT ERROR:",

                error

            );


        }



    }









    return(


        <AuthContext.Provider


            value={{

                user,

                loading,

                logout

            }}


        >


            {children}


        </AuthContext.Provider>


    );



}







export function useAuth(){


    return useContext(AuthContext);


}