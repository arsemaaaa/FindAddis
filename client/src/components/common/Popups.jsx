import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function PopupButton() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close the popup if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} style={{ display: "inline-block", position: "relative" }}>
            <a className="btn btn-link" href="#" onClick={(e) => { e.preventDefault(); setOpen(!open); }}>Sign up</a>

            {open && (
                <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', padding: '8px', borderRadius: 6, boxShadow: '0 4px 8px rgba(0,0,0,0.12)'}}>
                    <Link to="/signup" className="d-block mb-2">User</Link>
                    <Link to="/OwnerSignUp" className="d-block">Owner</Link>
                </div>
            )}
        </div>
    );
}

export default PopupButton;