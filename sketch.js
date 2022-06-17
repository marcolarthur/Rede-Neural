let boards = [];
let numOfBoards = 10;
let fullWidth = window.innerWidth;
let fullHeight = 200;
let width = fullWidth / numOfBoards;
let height = fullHeight / numOfBoards;
let boardSize = 50;

function setup() {
  createCanvas(fullWidth, fullHeight);
  for (let i = 0; i < numOfBoards; i++) {
    boards[i] = new Board(i * width, fullHeight, boardSize);
  }
}

function draw() {
  background(0);
  for (let i = 0; i < numOfBoards; i++) {
    boards[i].update();
    boards[i].draw();
  }  
}




