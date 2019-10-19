import React, { Component } from 'react';
import Board from '../Board/Board';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import classes from './Game.module.css';

export default class Game extends Component {

    state = {
        grid: [],
        size:14,
        gameStarted: false,
        direction:'right'
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
        if(updateBoard[tail[0]][tail[1]+1] == 1){
            updateBoard[tail[0]][tail[1]+1] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        if(updateBoard[tail[0]+1][tail[1]] == 1){
            updateBoard[tail[0]+1][tail[1]] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        if(updateBoard[tail[0]][tail[1]-1] == 1){
            updateBoard[tail[0]][tail[1]-1] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
        if(updateBoard[tail[0]-1][tail[1]] == 1){
            updateBoard[tail[0]-1][tail[1]] = 3;
            updateBoard[tail[0]][tail[1]] = 0;
        }
    }

    snakeEats = (updateBoard,tail) => {
        if(updateBoard[tail[0]][tail[1]+1] == 1){
            updateBoard[tail[0]][tail[1]] = 3;
        }
        if(updateBoard[tail[0]+1][tail[1]] == 1){
            updateBoard[tail[0]][tail[1]] = 3;
        }
        if(updateBoard[tail[0]][tail[1]-1] == 1){
            updateBoard[tail[0]][tail[1]] = 3;
        }
        if(updateBoard[tail[0]-1][tail[1]] == 1){
            updateBoard[tail[0]][tail[1]] = 3;
        }
        this.createFood();
    }

    startGame = () => {
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
        arr[5][5] = 3;
        arr[5][(5)+1] = 1;
        arr[5][(5)+2] = 2;
        this.setState({grid:arr}, () => {
          this.timerStart();
          });
        this.setState({gameStarted:true});
    }

    timerStart () {
        this.createFood();
        this.intervalTimer = setInterval(() => {
            const head = this.getSnakeHead();
            const tail = this.getSnakeTail();
            const updateBoard = [...this.state.grid];
            let direction=this.state.direction;
            if(direction=='up'){
                if(updateBoard[head[0]-1][head[1]]==1||
                    updateBoard[head[0]-1][head[1]]==3){
                    clearInterval(this.intervalTimer);
                }
                else if(updateBoard[head[0]-1][head[1]]!=4){
                    if(updateBoard[head[0]-1][head[1]]==5){
                        this.snakeEats(updateBoard,tail);
                    }
                    else{
                    this.adaptBody(updateBoard,tail);
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
                }
                else if(updateBoard[head[0]+1][head[1]]!=4){
                    if(updateBoard[head[0]+1][head[1]]==5){
                        this.snakeEats(updateBoard,tail);
                    }
                    else{
                    this.adaptBody(updateBoard,tail);
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
                }
                else if(updateBoard[head[0]][head[1]-1]!=4){
                    if(updateBoard[head[0]][head[1]-1]==5){
                        this.snakeEats(updateBoard,tail);
                    }
                    else{
                    this.adaptBody(updateBoard,tail);
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
                }
                else if(updateBoard[head[0]][head[1]+1]!=4){
                    
                    if(updateBoard[head[0]][head[1]+1]==5){
                        this.snakeEats(updateBoard,tail);
                    }
                    else{
                    this.adaptBody(updateBoard,tail);
                    }
                    updateBoard[head[0]][head[1]+1] = 2;
                    updateBoard[head[0]][head[1]] = 1;
                    direction = "right";
                }
            }
            
            this.setState({grid:updateBoard, direction:direction});
        }, 200);
    }
    
    render() {
        let board = [];
        if(this.state.gameStarted){
            board = <Board grid={this.state.grid}/>;
            }
        return(
            <div className={classes.Game} onKeyPress={this.moveSnake}>
                <h1>Snake Game</h1>
                {board}
                <KeyboardEventHandler
                handleKeys={['up', 'left', 'right', 'down','space']}
                onKeyEvent={(key, e) => this.moveSnake(key)}/>
                <button onClick={this.startGame}>start</button>
                <button onClick={this.timerStart}>Go</button>
            </div>
        )
    }
}