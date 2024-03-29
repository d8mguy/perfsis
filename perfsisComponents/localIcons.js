
import React from "react";

// Accepts props `width:integer` (optional), `height:integer` (optional), `color:string` (optional).
function ThinLine(props) {
    let width = "24"
    let height = "12"
    if (props.width !== undefined) width = props.width;
    if (props.height !== undefined) height = props.height;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="1" strokeLinecap="butt">
            <line x1="1" y1="10" x2="23" y2="10" stroke="black"/>
        </svg>
    )
}

// Accepts props `width:integer` (optional), `height:integer` (optional), `color:string` (optional).
function ThickerLine(props) {
    let width = "24"
    let height = "12"
    if (props.width !== undefined) width = props.width;
    if (props.height !== undefined) height = props.height;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="butt">
            <line x1="1" y1="10" x2="23" y2="10" stroke="black"/>
        </svg>
    )
}

// Accepts props `width:integer` (optional), `height:integer` (optional), `color:string` (optional).
function ThickLine(props) {
    let width = "24"
    let height = "12"
    if (props.width !== undefined) width = props.width;
    if (props.height !== undefined) height = props.height;
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="3" strokeLinecap="butt">
            <line x1="1" y1="10" x2="23" y2="10" stroke="black"/>
        </svg>
    )
}


export { ThinLine, ThickerLine, ThickLine };
