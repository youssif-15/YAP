import { supabase } from "./supabase";

export async function isSaved(postId){

    const {

        data:{
            user
        }

    } = await supabase.auth.getUser();

    if(!user){

        return false;

    }

    const {

        data,

        error

    } = await supabase

    .from("saved_posts")

    .select("id")

    .eq(

        "user_id",

        user.id

    )

    .eq(

        "post_id",

        postId

    )

    .maybeSingle();

    if(error){

        throw error;

    }

    return !!data;

}



export async function savePost(postId){

    const {

        data:{
            user
        }

    } = await supabase.auth.getUser();

    if(!user){

        throw new Error("Not logged in");

    }

    const {

        error

    } = await supabase

    .from("saved_posts")

    .insert({

        user_id:user.id,

        post_id:postId

    });

    if(error){

        throw error;

    }

}



export async function unsavePost(postId){

    const {

        data:{
            user
        }

    } = await supabase.auth.getUser();

    if(!user){

        throw new Error("Not logged in");

    }

    const {

        error

    } = await supabase

    .from("saved_posts")

    .delete()

    .eq(

        "user_id",

        user.id

    )

    .eq(

        "post_id",

        postId

    );

    if(error){

        throw error;

    }

}



export async function toggleSave(postId){

    const saved = await isSaved(postId);

    if(saved){

        await unsavePost(postId);

        return false;

    }

    await savePost(postId);

    return true;

}



export async function getSavedPosts(){

    const {

        data:{
            user
        }

    } = await supabase.auth.getUser();

    if(!user){

        return [];

    }

    const {

        data,

        error

    } = await supabase

    .from("saved_posts")

    .select(`

        post_id,

        posts(*)

    `)

    .eq(

        "user_id",

        user.id

    )

    .order(

        "created_at",

        {

            ascending:false

        }

    );

    if(error){

        throw error;

    }

    return data || [];

}