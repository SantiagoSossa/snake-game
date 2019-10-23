import React from 'react';
import classes from './Buttons.module.css';

export default function Buttons(props) {
    return(
        <div>
            <div className={classes.UpButton}>
                <i onClick={props.pushed} id="up" class="fas fa-caret-square-up"></i>
            </div>
            <div className={classes.MiddleButtons}>
                <i onClick={props.pushed} id="left" class="fas fa-caret-square-left"></i>
                <i onClick={props.pushed} id="right" class="fas fa-caret-square-right"></i>
            </div>
            <div className={classes.DownButton}>
                <i onClick={props.pushed} id="down" class="fas fa-caret-square-down"></i>
            </div>
        </div>
    )
}