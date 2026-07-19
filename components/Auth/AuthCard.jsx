"use client";

export default function AuthCard({

    title,
    subtitle,
    children

}) {

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1 className="auth-logo">

                    YAP

                </h1>

                <h2>

                    {title}

                </h2>

                <p>

                    {subtitle}

                </p>

                {children}

            </div>

        </div>

    );

}