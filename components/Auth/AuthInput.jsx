"use client";

export default function AuthInput({
    label,
    type = "text",
    placeholder,
    value,
    onChange
}) {

    return (

        <div className="auth-input-group">

            <label>

                {label}

            </label>

            <input

                type={type}

                placeholder={placeholder}

                value={value}

                onChange={onChange}

            />

        </div>

    );

}