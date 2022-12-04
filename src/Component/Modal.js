import React from "react";
import ReactDOM from "react-dom";
import classes from './Modal.module.css'

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.showHideFunc}></div>
}

const Overlay = (props) => {
    return <div className={classes.modal}>
        {props.children}
    </div>
}

const Modal = (props) => {
    return <React.Fragment>
        { ReactDOM.createPortal(<Backdrop showHideFunc={props.showHideFunc}></Backdrop>, document.getElementById("backdrop")) }
        { ReactDOM.createPortal(<Overlay>{props.children}</Overlay>, document.getElementById("overlay")) }
    </React.Fragment>
}

export default Modal