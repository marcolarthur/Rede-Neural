let boards = [];
let numOfBoards = 40;
let fullWidth = window.innerWidth;
let fullHeight = window.innerHeight;
let width = 500;
let height = 500;
let pixelSize = 20;
let breakLineSize = 10;
let row = 0;

let brain = new Brain();
const trainingOptions = {
  epochs: 100,
};
brain.net.train(trainingOptions, start);

function start() {
  for (let i = 0; i < numOfBoards; i++) {
    let board = (sketch) => {
      if (i > 0 && i % breakLineSize == 0) {
        row++;
      }
      let snake,
        food,
        posx = i * width - row * width * breakLineSize,
        posy = 0 + row * height;
      sketch.setup = () => {
        sketch.createCanvas(width, height).position(posx, posy);
        sketch.background(0);
        let randx = sketch.floor(sketch.random(0, width - pixelSize));
        let randy = sketch.floor(sketch.random(0, height - pixelSize));
        snake = new Snake(sketch, randx, randy, brain);
        while (
          Math.abs(snake.x - randx) < pixelSize &&
          Math.abs(snake.y - randy) < pixelSize
        ) {
          randx = sketch.floor(sketch.random(0, width - pixelSize));
          randy = sketch.floor(sketch.random(0, height - pixelSize));
        }
        food = new Food(sketch, randx, randy);
      };
      sketch.draw = () => {
        if (snake.checkDeath(height, width)) {
          sketch.background(0);
          sketch.fill(255);
          sketch.textSize(64);
          sketch.text(snake.total, width / 2, height / 2);
          setTimeout(() => {
            sketch.background(255);
            let randx = sketch.floor(sketch.random(0, width - pixelSize));
            let randy = sketch.floor(sketch.random(0, height - pixelSize));
            snake = new Snake(sketch, randx, randy, brain);
            randx = sketch.floor(sketch.random(0, width - pixelSize));
            randy = sketch.floor(sketch.random(0, height - pixelSize));

            food = new Food(sketch, randx, randy);
          }, 500);
        } else {
          sketch.background(255);
          sketch.fill(0);
          sketch.textSize(20);
          sketch.text(snake.total, width - 20, height);
          snake.update();
          if (snake.checkEat(food, pixelSize)) {
            food.update();
          }
          const [x1, y1, x2, y2] = norm(snake.x, snake.y, food.x, food.y);
          snake.predict(x1, y1, x2, y2);
          sketch.stroke(0);
          sketch.strokeWeight(2);
          sketch.line(width, 0, width, fullHeight);
          sketch.line(width, 0, 1, 0);
          sketch.noStroke();
          sketch.fill(snake.color);
          sketch.rect(snake.x, snake.y, pixelSize, pixelSize);
          for (const bodyPart of snake.tail) {
            sketch.fill(snake.color);
            sketch.rect(bodyPart[0], bodyPart[1], pixelSize, pixelSize);
          }

          sketch.fill(food.color);
          sketch.rect(food.x, food.y, pixelSize, pixelSize);
        }
      };
    };
    new p5(board);
  }
}

function norm(x1, y1, x2, y2) {
  const maxX = width - pixelSize;
  const maxY = height - pixelSize;
  return [x1 / maxX, y1 / maxY, x2 / maxX, y2 / maxY];
}
