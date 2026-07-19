"use client";

import "./EditProfile.css";

import {
    useEffect,
    useState
} from "react";

import {
    useRouter
} from "next/navigation";

import {
    CircleCheck,
    CircleX
} from "lucide-react";

import {
    supabase
} from "@/lib/supabase";

export default function EditProfilePage(){

    const router = useRouter();

    const [loading,setLoading] = useState(true);

    const [saving,setSaving] = useState(false);

    const [userId,setUserId] = useState(null);

    const [avatar,setAvatar] = useState("");

    const [avatarFile,setAvatarFile] = useState(null);

    const [username,setUsername] = useState("");

    const [fullName,setFullName] = useState("");

    const [bio,setBio] = useState("");

    const [website,setWebsite] = useState("");

    const [error,setError] = useState("");

    const [usernameError,setUsernameError] = useState("");

    const [usernameValid,setUsernameValid] = useState(false);

    const [checkingUsername,setCheckingUsername] = useState(false);

    function getTextDirection(text){

        const arabic = /[\u0600-\u06FF]/;

        return arabic.test(text)

        ?

        "rtl"

        :

        "ltr";

    }

    async function uploadToCloudinary(file){

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response = await fetch(

            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,

            {

                method:"POST",

                body:formData

            }

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(

                data.error?.message ||

                "Upload failed"

            );

        }

        return data.secure_url;

    }

    async function checkUsername(value){

        if(!value){

            setUsernameError("");

            setUsernameValid(false);

            setCheckingUsername(false);

            return;

        }

        setCheckingUsername(true);

        const {

            data,

            error

        } = await supabase

        .from("profiles")

        .select("username")

        .eq(

            "username",

            value

        )

        .neq(

            "id",

            userId

        )

        .maybeSingle();

        if(error){

            console.log(

                "USERNAME CHECK ERROR:",

                error

            );

            setUsernameError(

                "Could not check username"

            );

            setUsernameValid(false);

            setCheckingUsername(false);

            return;

        }

        if(data){

            setUsernameError(

                "Username is already taken"

            );

            setUsernameValid(false);

        }

        else{

            setUsernameError("");

            setUsernameValid(true);

        }

        setCheckingUsername(false);

    }

    useEffect(()=>{

        loadProfile();

    },[]);

    async function loadProfile(){

        setLoading(true);

        const {

            data:{user}

        } = await supabase.auth.getUser();

        if(!user){

            router.push("/login");

            return;

        }

        setUserId(user.id);

        const {

            data,

            error

        } = await supabase

        .from("profiles")

        .select("*")

        .eq(

            "id",

            user.id

        )

        .single();

        if(error){

            console.log(

                "PROFILE ERROR:",

                error

            );

            setLoading(false);

            return;

        }

        setUsername(

            data.username || ""

        );

        setFullName(

            data.full_name || ""

        );

        setBio(

            data.bio || ""

        );

        setWebsite(

            data.website || ""

        );

        setAvatar(

            data.avatar_url || ""

        );

        setLoading(false);

    }

    function chooseImage(e){

        const file = e.target.files[0];

        if(!file){

            return;

        }

        setAvatarFile(file);

        setAvatar(

            URL.createObjectURL(file)

        );

    }
        async function saveProfile(){

        if(saving){

            return;

        }

        if(usernameError){

            setError(

                "Username is already taken"

            );

            return;

        }

        setSaving(true);

        setError("");

        let avatarUrl = avatar;

        try{

            if(avatarFile){

                avatarUrl = await uploadToCloudinary(

                    avatarFile

                );

            }

            const {

                error:updateError

            } = await supabase

            .from("profiles")

            .update({

                username:

                    username.trim(),

                full_name:

                    fullName.trim(),

                bio:

                    bio.trim(),

                website:

                    website.trim(),

                avatar_url:

                    avatarUrl

            })

            .eq(

                "id",

                userId

            );

            if(updateError){

                throw updateError;

            }

            router.push(

                `/profile/${username.trim()}`

            );

            router.refresh();

        }

        catch(error){

            console.log(error);

            setError(

                error.message

            );

        }

        finally{

            setSaving(false);

        }

    }

    if(loading){

        return(

            <div className="edit-profile-loading">

                Loading...

            </div>

        );

    }

    return(

        <div className="edit-profile-page">

            <div className="edit-profile-card">

                <h2>

                    Edit Profile

                </h2>

                <div className="edit-avatar-section">

                    {

                    avatar

                    ?

                    <img

                        src={avatar}

                        alt="Avatar"

                        className="edit-avatar"

                    />

                    :

                    <div className="edit-avatar-placeholder"/>

                    }

                    <label className="change-photo-button">

                        Change photo

                        <input

                            type="file"

                            accept="image/*"

                            hidden

                            onChange={chooseImage}

                        />

                    </label>

                </div>

                <div className="edit-profile-form">

                    <label>

                        Username

                    </label>

                    <div className="username-container">

                        <input

                            value={username}

                            dir="ltr"

                            onChange={(e)=>{

                                let value = e.target.value;

                                value = value

                                .replace(/\s+/g,"_")

                                .replace(/[^a-zA-Z0-9_.]/g,"");

                                setUsername(value);

                                checkUsername(value);

                            }}

                        />

                        {

                        usernameValid &&

                        <span

                            className="username-icon success"

                        >

                            <CircleCheck size={22}/>

                        </span>

                        }

                        {

                        usernameError &&

                        <span

                            className="username-icon error"

                        >

                            <CircleX size={22}/>

                        </span>

                        }

                    </div>

                    {

                    checkingUsername &&

                    <p className="username-checking">

                        Checking username...

                    </p>

                    }
                                        <label>

                        Full name

                    </label>

                    <input

                        value={fullName}

                        onChange={e=>

                            setFullName(

                                e.target.value

                            )

                        }

                    />

                    <label>

                        Bio

                    </label>

                    <textarea

                        rows={4}

                        value={bio}

                        style={{

                            textAlign:

                                getTextDirection(bio)==="rtl"

                                ?

                                "right"

                                :

                                "left",

                            direction:

                                getTextDirection(bio)

                        }}

                        onChange={e=>

                            setBio(

                                e.target.value

                            )

                        }

                    />

                    <label>

                        Website

                    </label>

                    <input

                        value={website}

                        onChange={e=>

                            setWebsite(

                                e.target.value

                            )

                        }

                    />

                    {

                    error &&

                    <p className="edit-error">

                        {error}

                    </p>

                    }

                    <div className="edit-buttons">

                        <button

                            className="cancel-button"

                            onClick={()=>{

                                router.back();

                            }}

                        >

                            Cancel

                        </button>

                        <button

                            className="save-button"

                            onClick={saveProfile}

                            disabled={saving}

                        >

                            {

                            saving

                            ?

                            "Saving..."

                            :

                            "Save"

                            }

                        </button>

                    </div>

                </div>
                            </div>

        </div>

    );

}