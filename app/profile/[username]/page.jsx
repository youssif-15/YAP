import ProfilePage from "@/components/Profile/ProfilePage";

export default async function Page({

    params

}){

    const {

        username

    } = await params;

    return(

        <ProfilePage

            username={username}

        />

    );

}