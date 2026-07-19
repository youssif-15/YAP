import { supabase } from "./supabase";

let cachedUser = null;

async function getCurrentUser(){

    if(cachedUser){

        return cachedUser;

    }

    const {

        data:{

            session

        }

    } = await supabase.auth.getSession();

    const user = session?.user || null;

    cachedUser = user;

    return user;

}

export async function isBlocked(userId){

    const user = await getCurrentUser();

    if(!user){

        return false;

    }

    const {

        data,

        error

    } = await supabase

        .from("blocked_users")

        .select("id")

        .eq(

            "blocker_id",

            user.id

        )

        .eq(

            "blocked_id",

            userId

        )

        .maybeSingle();

    if(error){

        throw error;

    }

    return !!data;

}

export async function toggleBlock(userId){

    const user = await getCurrentUser();

    if(!user){

        return false;

    }

    const {

        data:existing,

        error:checkError

    } = await supabase

        .from("blocked_users")

        .select("id")

        .eq(

            "blocker_id",

            user.id

        )

        .eq(

            "blocked_id",

            userId

        )

        .maybeSingle();

    if(checkError){

        throw checkError;

    }

    if(existing){

        const {

            error

        } = await supabase

            .from("blocked_users")

            .delete()

            .eq(

                "id",

                existing.id

            );

        if(error){

            throw error;

        }

        return false;

    }

    await supabase

        .from("followers")

        .delete()

        .or(

            `and(follower_id.eq.${user.id},following_id.eq.${userId}),and(follower_id.eq.${userId},following_id.eq.${user.id})`

        );

    await supabase

        .from("notifications")

        .delete()

        .or(

            `actor_id.eq.${user.id},user_id.eq.${user.id}`

        );

    const {

        error

    } = await supabase

        .from("blocked_users")

        .insert({

            blocker_id:user.id,

            blocked_id:userId

        });

    if(error){

        throw error;

    }

    return true;

}