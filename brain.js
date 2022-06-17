const data = [
  { x1: 0, y1: 1, x2: 0, y2: 0, move: "up" },
  { x1: 1, y1: 1, x2: 1, y2: 0, move: "up" },

  { x1: 0, y1: 0, x2: 0, y2: 1, move: "down" },
  { x1: 1, y1: 0, x2: 1, y2: 1, move: "down" },

  { x1: 1, y1: 0, x2: 0, y2: 0, move: "left" },
  { x1: 1, y1: 1, x2: 0, y2: 1, move: "left" },

  { x1: 0, y1: 0, x2: 1, y2: 0, move: "right" },
  { x1: 0, y1: 1, x2: 1, y2: 1, move: "right" },

  { x1: 0, y1: 0, x2: 0, y2: 0, move: "" },

  { x1: 0, y1: 1, x2: 0, y2: 1, move: "" },

  { x1: 1, y1: 0, x2: 1, y2: 0, move: "" },

  { x1: 1, y1: 1, x2: 1, y2: 1, move: "" },
];

class Brain {
  constructor() {
    this.net = ml5.neuralNetwork({
      task: "classification",
    });
    data.forEach((item) => {
      const inputs = {
        x1: item.x1,
        y1: item.y1,
        x2: item.x2,
        y2: item.y2,
      };
      const output = {
        move: item.move,
      };
      this.net.addData(inputs, output);
    });
  }
}
