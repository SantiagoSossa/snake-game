import React, { Component } from 'react';
import Board from '../Board/Board';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import classes from './Game.module.css';
import Buttons from '../Board/Buttons/Buttons';


export default class Game extends Component {

    constructor(props){
        super(props);
        this.titleref = React.createRef();
    }

    state = {
        grid: [],
        size:14,
        direction:'right',
        lastDirections: ['right','right'],
        start: false,
        points: 0,
        isMobile: false,
        finished: false
    };

    moveSnake = (key) => {
        
        const head = this.getSnakeHead();
        let directionATM = this.state.direction;
        if(key=='up' && directionATM != "down" && head[0]>0){
            directionATM = "up";
        }
        if(key=='down' && directionATM != "up" && head[0]<this.state.size-1){
            directionATM = "down";
        }
        if(key=='left' && directionATM != "right" && head[1]>0){
            directionATM = "left";
        }
        if(key=='right' && directionATM != "left" && head[1]<this.state.size-1){
            directionATM = "right";
        }
        this.setState({direction:directionATM});
    }

    getSnakeHead = () => {
        for(let i = 0; i < this.state.size; i++) {
            for(let j = 0; j < this.state.size; j++) {
                if(this.state.grid[i][j]==2){
                    return [i,j];
                }
            }
        }
    }

    getSnakeTail = () => {
        for(let i = 0; i < this.state.size; i++) {
            for(let j = 0; j < this.state.size; j++) {
                if(this.state.grid[i][j] == 3){
                    return [i,j];
                }
            }
        }
    }

    createFood = () => {
        let foodPlaced = true;
        while(foodPlaced){
            const i = Math.floor(Math.random() * Math.floor(this.state.size));
            const j = Math.floor(Math.random() * Math.floor(this.state.size));
            if(this.state.grid[i][j] == 0){
                this.state.grid[i][j] = 5;
                foodPlaced = false;
            }
        }
    }

    adaptBody = (updateBoard,tail) => {
        const lastDirectionsArray = [...this.state.lastDirections];
        const lastDirection = lastDirectionsArray.pop();
        if(updateBoard[tail[0]][tail[1]+1] == 1 && lastDirection == 'right'){
            updateBoard[tail[0]][tail[1]+1] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        } 
        if(updateBoard[tail[0]+1][tail[1]] == 1 && lastDirection == 'down'){
            updateBoard[tail[0]+1][tail[1]] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        if(updateBoard[tail[0]][tail[1]-1] == 1  && lastDirection == 'left'){
            updateBoard[tail[0]][tail[1]-1] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        if(updateBoard[tail[0]-1][tail[1]] == 1  && lastDirection == 'up'){
            updateBoard[tail[0]-1][tail[1]] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        return lastDirectionsArray;
    }

    snakeEats = (updateBoard,tail,direction) => {
        
        const lastDirectionsArray = [...this.state.lastDirections];
        if(updateBoard[tail[0]][tail[1]+1] == 1 && direction == 'right'){
            updateBoard[tail[0]][tail[1]] = 3;
            lastDirectionsArray.unshift(direction);
        }
        if(updateBoard[tail[0]+1][tail[1]] == 1 && direction == 'down'){
            updateBoard[tail[0]][tail[1]] = 3;
            lastDirectionsArray.unshift(direction);
        }
        if(updateBoard[tail[0]][tail[1]-1] == 1 && direction == 'left'){
            updateBoard[tail[0]][tail[1]] = 3;
            lastDirectionsArray.unshift(direction);
        }
        if(updateBoard[tail[0]-1][tail[1]] == 1 && direction == 'up'){
            updateBoard[tail[0]][tail[1]] = 3;
            lastDirectionsArray.unshift(direction);
        }
        let points = this.state.points;
        points = points+5;
        this.setState({points: points});
        this.createFood();
        return lastDirectionsArray;
    }

    handleButtons = (e) => {
        const head = this.getSnakeHead();
        let directionATM = this.state.direction;
        if(e.target.id=='up' && directionATM != "down" && head[0]>0){
            directionATM = "up";
        }
        if(e.target.id=='down' && directionATM != "up" && head[0]<this.state.size-1){
            directionATM = "down";
        }
        if(e.target.id=='left' && directionATM != "right" && head[1]>0){
            directionATM = "left";
        }
        if(e.target.id=='right' && directionATM != "left" && head[1]<this.state.size-1){
            directionATM = "right";
        }
        this.setState({direction:directionATM});
    }

    startGame = () => {
        //Animations
        const game = document.getElementById("game");
        const title = this.titleref.current;
        // eslint-disable-next-line no-restricted-globals
        const width = screen.width;
        game.style.paddingTop = '0%';
        if (width > 992) {
            title.style.fontSize = '4rem';
            this.setState({isMobile: false});
        } else if (width > 320) {
            title.style.fontSize = '2rem';
            this.setState({isMobile: true});
        }
        var arr = [];
        for(let i = 0; i < this.state.size; i++) {
            arr[i] = [];
            for(let j = 0; j < this.state.size; j++) {
                if(i==0 || j==0 || i==this.state.size-1 || j==this.state.size-1){
                    arr[i][j] = 4;
                }
                else{
                arr[i][j] = 0;
                }
            }
        }
        arr[5][1] = 3;
        arr[5][(1)+1] = 1;
        arr[5][(1)+2] = 2;
        this.setState({grid:arr}, () => {
          this.timerStart();
          });
        this.setState({start:true});
    }

    timerStart () {
        this.createFood();
        this.intervalTimer = setInterval(() => {
            const head = this.getSnakeHead();
            const tail = this.getSnakeTail();
            const updateBoard = [...this.state.grid];
            let lastDirections = null;
            let direction=this.state.direction;
            let isDead = false;
            if(direction=='up'){
                if(updateBoard[head[0]-1][head[1]]==1||
                    updateBoard[head[0]-1][head[1]]==3){
                    clearInterval(this.intervalTimer);
                    isDead = true;
                }
                else if(updateBoard[head[0]-1][head[1]]!=4){
                    if(updateBoard[head[0]-1][head[1]]==5){
                        lastDirections = this.snakeEats(updateBoard,tail,direction);
                    }
                    else{
                        lastDirections = this.adaptBody(updateBoard,tail);
                    }
                    updateBoard[head[0]-1][head[1]] = 2;
                    updateBoard[head[0]][head[1]] = 1;
                    direction = "up";
                }
                
            }
            if(direction=='down'){
                if(updateBoard[head[0]+1][head[1]]==1||
                    updateBoard[head[0]+1][head[1]]==3){
                    clearInterval(this.intervalTimer);
                    isDead = true;
                }
                else if(updateBoard[head[0]+1][head[1]]!=4){
                    if(updateBoard[head[0]+1][head[1]]==5){
                        lastDirections = this.snakeEats(updateBoard,tail,direction);
                    }
                    else{
                        lastDirections = this.adaptBody(updateBoard,tail);
                    }
                    updateBoard[head[0]+1][head[1]] = 2;
                    updateBoard[head[0]][head[1]] = 1;
                    direction = "down";
                }
            }
            if(direction=='left'){
                if(updateBoard[head[0]][head[1]-1]==1||
                    updateBoard[head[0]][head[1]-1]==3){
                    clearInterval(this.intervalTimer);
                    isDead = true;
                }
                else if(updateBoard[head[0]][head[1]-1]!=4){
                    if(updateBoard[head[0]][head[1]-1]==5){
                        lastDirections = this.snakeEats(updateBoard,tail,direction);
                    }
                    else{
                        lastDirections = this.adaptBody(updateBoard,tail);
                    }
                    updateBoard[head[0]][head[1]-1] = 2;
                    updateBoard[head[0]][head[1]] = 1;
                    direction = "left";
                }
            }
            if(direction=='right'){
                if(updateBoard[head[0]][head[1]+1]==1||
                    updateBoard[head[0]][head[1]+1]==3){
                    clearInterval(this.intervalTimer);
                    isDead = true;
                }
                else if(updateBoard[head[0]][head[1]+1]!=4){
                    if(updateBoard[head[0]][head[1]+1]==5){
                        lastDirections = this.snakeEats(updateBoard,tail,direction);
                    }
                    else{
                        lastDirections = this.adaptBody(updateBoard,tail);
                    }
                    updateBoard[head[0]][head[1]+1] = 2;
                    updateBoard[head[0]][head[1]] = 1;
                    direction = "right";
                }
            }
            if(!lastDirections){
                clearInterval(this.intervalTimer);
                isDead = true;
            }
            else{
                lastDirections.unshift(direction);
            }
            this.setState({grid:updateBoard, direction:direction, lastDirections:lastDirections, finished:isDead});
        }, 200);
    }

    handlerRestart = async () => {
        clearInterval(this.timer)
        await this.setState({
            grid: [],
            size:14,
            direction:'right',
            lastDirections: ['right','right'],
            start: false,
            points: 0
        })
        this.startGame()
    }
    
    render() {
        let board = [];
        if(this.state.start){
            board = <Board grid={this.state.grid}/>;
            }
        let buttons = [];
        if(this.state.start && this.state.isMobile){
            buttons = <Buttons pushed={this.handleButtons}/>;
        }
        const isFinished = this.state.finished ? <div className={classes.success}><h3>Game Over</h3></div> : null;
        return(
            <div className={[classes.unselectable,classes.game].join(" ")} id="game">
                <div className={classes.mainTitle}>
                    <h1 ref={this.titleref}>Snake Game</h1> <br />
                </div>
                <div className={classes.displayContainer}>
                    {this.state.start ?
                        <div className={classes.side}>
                            <div className={classes.statContainer}>
                                <div className={classes.header}>
                                    Stats
                                </div>
                                <div className={classes.statTitle}>
                                    Points &emsp; <span className={classes.stat}><span className={classes.points}>{this.state.points}</span></span>
                                </div>
                            </div>
                            <div className={classes.restartContainer}>
                                <button onClick={this.handlerRestart} className={classes.restartBtn}>Restart</button>
                            </div>
                            {isFinished}
                        </div> :
                        null
                    }
                    {this.state.start ?
                        <div className={classes.Game} onKeyPress={this.moveSnake}>
                            {board}
                            <KeyboardEventHandler
                            handleKeys={['up', 'left', 'right', 'down']}
                            onKeyEvent={(key, e) => this.moveSnake(key)}/>
                        </div>
                        :
                        null
                    }
                    {buttons}
                    {this.state.start ? null :
                        <div className={classes.cellControllers}>
                            <button className={classes.startBtn} onClick={this.startGame}>Start</button>
                        </div>
                    }
                </div>
            </div>
        )
    }
}