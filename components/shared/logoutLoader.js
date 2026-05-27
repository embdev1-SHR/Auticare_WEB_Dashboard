import React from "react";
import { Col, Container, Row, Spinner } from "reactstrap";

const Loader = () => {
    return (
        <div
            className="page-content"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "white",
                zIndex: 9999, // Ensure the loader is on top of other content
            }}
        >
            <div
                className="my-5 pt-5"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Spinner
                    className="me-2"
                    color="primary"
                    style={{
                        display: "block",
                        height: "3rem",
                        width: "3rem",
                    }}
                />
            </div>
        </div>
    );
};

export default Loader;
