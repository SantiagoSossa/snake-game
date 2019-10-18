import React from 'react'
import classes from './Board.module.css';
import SnakePiece from '../Snake/SnakePiece/SnakePiece';
import WhiteSpace from './WhiteSpace/WhiteSpace';
import Row from './Row/Row';
import Wall from './Wall/Wall';
import Food from './Food/Food';

export default function Board(props) {

    const board = props.grid.map( (row,i) => (
        <Row key={i}>
            {row.map((cell,j) => {
                if(cell==0){
                    return <WhiteSpace/>;
                }
                if(cell==1||cell==2||cell==3){
                    return <SnakePiece/>;
                }
                if(cell==4){
                    return <Wall/>;
                }
                if(cell==5){
                    return <Food/>;
                }
            })}
        </Row>
    ));
    return(
        <div className={classes.Board}>
            {board}
        </div>
    )
}
