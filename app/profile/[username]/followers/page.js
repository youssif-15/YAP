"use client";

import {

    use

} from "react";

import FollowList from "@/components/Profile/FollowList";

export default function FollowersPage({

    params

}){

    const {

        username

    } = use(params);

    return(

        <FollowList

            username={username}

            type="followers"

        />

    );

}