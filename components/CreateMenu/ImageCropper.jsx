"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";

export default function ImageCropper({
    image,
    onCropComplete
}) {

    const [crop, setCrop] = useState({
        x: 0,
        y: 0
    });

    const [zoom, setZoom] = useState(1);

    return (

        <div
            style={{
                position: "relative",
                width: "100%",
                height: "420px",
                background: "#111",
                borderRadius: "20px",
                overflow: "hidden"
            }}
        >

            <Cropper

                image={image}

                crop={crop}

                zoom={zoom}

                aspect={1}

                cropShape="rect"

                showGrid={false}

                objectFit="contain"

                onCropChange={setCrop}

                onZoomChange={setZoom}

                onCropComplete={(_, croppedAreaPixels)=>{

                    if(onCropComplete){

                        onCropComplete(croppedAreaPixels);

                    }

                }}

            />



            <div

                style={{

                    position:"absolute",

                    left:20,

                    right:20,

                    bottom:20,

                    zIndex:10

                }}

            >

                <input

                    type="range"

                    min={1}

                    max={3}

                    step={0.01}

                    value={zoom}

                    onChange={(e)=>{

                        setZoom(Number(e.target.value));

                    }}

                    style={{

                        width:"100%",

                        cursor:"pointer"

                    }}

                />

            </div>

        </div>

    );

}