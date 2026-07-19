import { supabase } from "./supabase";



export async function getComments(postId){


    const {data,error}=await supabase

    .from("comments")

    .select(`

        *,

        profile:profiles(

            username,

            avatar

        )

    `)

    .eq(

        "post_id",

        postId

    )

    .order(

        "created_at",

        {

            ascending:true

        }

    );



    if(error){

        throw error;

    }


    return data;


}







export async function addComment(postId,content){


    const {

        data:{user}

    } = await supabase.auth.getUser();



    if(!user){

        throw new Error(
            "User not found"
        );

    }




    const {data,error}=await supabase

    .from("comments")

    .insert({


        post_id:postId,


        user_id:user.id,


        content


    })

    .select(`

        *,

        profile:profiles(

            username,

            avatar

        )

    `)

    .single();




    if(error){

        throw error;

    }



    return data;


}






export async function deleteComment(id){


    const {error}=await supabase

    .from("comments")

    .delete()

    .eq(

        "id",

        id

    );



    if(error){

        throw error;

    }


}