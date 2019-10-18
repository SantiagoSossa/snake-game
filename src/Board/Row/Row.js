import React from 'react'
import classes from './Row.module.css';

export default function Row(props) {
    return(
        <div className={classes.Row}>
            {props.children}
        </div>
    )
}