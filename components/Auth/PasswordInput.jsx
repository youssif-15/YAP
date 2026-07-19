"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({

    label,
    placeholder,
    value,
    onChange

}) {

    const [show, setShow] = useState(false);

    return (

        <div className="auth-input-group">

            <label>

                {label}

            </label>

            <div className="password-input">

                <input

                    type={show ? "text" : "password"}

                    placeholder={placeholder}

                    value={value}

                    onChange={onChange}

                />

                <button

                    type="button"

                    onClick={() => setShow(!show)}

                >

                    {

                        show ?

                            <EyeOff size={20} />

                            :

                            <Eye size={20} />

                    }

                </button>

            </div>

        </div>

    );

}