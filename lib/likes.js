import { supabase } from "./supabase";

let likeRequests = {};

let lastLikeAction = {};

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

export async function getLikes(postId){

    const {

        count,

        error

    } = await supabase

        .from("likes")

        .select("*",{

            count:"exact",

            head:true

        })

        .eq(

            "post_id",

            postId

        );

    if(error){

        throw error;

    }

    return count || 0;

}

export async function isLiked(postId){

    const user = await getCurrentUser();

    if(!user){

        return false;

    }

    const {

        data,

        error

    } = await supabase

        .from("likes")

        .select("id")

        .eq(

            "post_id",

            postId

        )

        .eq(

            "user_id",

            user.id

        )

        .maybeSingle();

    if(error){

        throw error;

    }

    return !!data;

}

export async function toggleLike(postId){

    const now = Date.now();

    if(

        lastLikeAction[postId] &&

        now - lastLikeAction[postId] < 800

    ){

        return null;

    }

    if(likeRequests[postId]){

        return likeRequests[postId];

    }

    lastLikeAction[postId] = now;

    likeRequests[postId] = (async()=>{

        const user = await getCurrentUser();

        if(!user){

            return false;

        }

        const {

            data:existing,

            error:checkError

        } = await supabase

            .from("likes")

            .select("id")

            .eq(

                "post_id",

                postId

            )

            .eq(

                "user_id",

                user.id

            )

            .maybeSingle();

        if(checkError){

            throw checkError;

        }

        // Unlike
        if(existing){

            const {

                error

            } = await supabase

                .from("likes")

                .delete()

                .eq(

                    "id",

                    existing.id

                );

            if(error){

                throw error;

            }

            await supabase

                .from("notifications")

                .delete()

                .eq(

                    "type",

                    "like"

                )

                .eq(

                    "actor_id",

                    user.id

                )

                .eq(

                    "post_id",

                    postId

                );

            return false;

        }

        // Like
        const {

            error

        } = await supabase

            .from("likes")

            .insert({

                post_id:postId,

                user_id:user.id

            });

        if(error){

            throw error;

        }

        const {

            data:post,

            error:postError

        } = await supabase

            .from("posts")

            .select("user_id")

            .eq(

                "id",

                postId

            )

            .single();

        if(postError){

            throw postError;

        }

        if(

            post &&

            post.user_id !== user.id

        ){

            const {

                data:exists

            } = await supabase

                .from("notifications")

                .select("id")

                .eq(

                    "type",

                    "like"

                )

                .eq(

                    "actor_id",

                    user.id

                )

                .eq(

                    "post_id",

                    postId

                )

                .maybeSingle();

            if(!exists){

                await supabase

                    .from("notifications")

                    .insert({

                        user_id:post.user_id,

                        actor_id:user.id,

                        type:"like",

                        post_id:postId,

                        read:false

                    });

            }

        }

        return true;

    })();

    try{

        return await likeRequests[postId];

    }

    finally{

        delete likeRequests[postId];

    }

}

export async function getLikesUsers(postId){

    const {

        data:likes,

        error

    } = await supabase

        .from("likes")

        .select("user_id")

        .eq(

            "post_id",

            postId

        );

    if(error){

        throw error;

    }

    const users = await Promise.all(

        likes.map(async(like)=>{

            const {

                data:profile,

                error:profileError

            } = await supabase

                .from("profiles")

                .select(

                    "id, username, avatar_url"
                )

                .eq(

                    "id",

                    like.user_id

                )

                .single();

            if(profileError){

                return null;

            }

            return profile;

        })

    );

    return users.filter(Boolean);

}