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
            <Link className="nav-link auth-login" onClick={() => setOpen(!open)}>Sign up</Link>

            {open && (
                <div

                >
                    <Link style={{ display: "block", margin: "5px 0" }}>User</Link>
                    <Link style={{ display: "block", margin: "5px 0" }}>Owner</Link>
                </div>
            )}
        </div>
    );
}

export default PopupButton;