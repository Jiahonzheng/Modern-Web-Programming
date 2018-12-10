class Game {
  constructor() {
    this.container = $("#map");
    this.images = [
      "images/1.jpg",
      "images/2.jpg",
      "images/3.jpg",
      "images/4.jpg"
    ];
    this.imageIndex = 0;
    this.map = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i + j < 6) {
          this.buildGrid(i, j, i, j);
        } else {
          this.empty = { x: i, y: j };
        }
      }
    }
  }

  start() {
    const map = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    this.isRunning = true;
    this.empty = { x: 3, y: 3 };

    // shuffle grids
    for (let t = 0; t < 100; ++t) {
      const { x: emptyX, y: emptyY } = this.empty;
      const dimension = Math.floor(Math.random() * 4);
      let adjacent = this.adjacentGrid(emptyX, emptyY, dimension);

      // check if shuffled grid is valid
      if (
        adjacent.x < 0 ||
        adjacent.x >= 4 ||
        adjacent.y < 0 ||
        adjacent.y >= 4
      ) {
        adjacent = this.adjacentGrid(emptyX, emptyY, dimension ^ 2);
      }

      // update map and empty status
      const emptyIndex = emptyX * 4 + emptyY;
      const adjacentIndex = adjacent.x * 4 + adjacent.y;

      [map[emptyIndex], map[adjacentIndex]] = [
        map[adjacentIndex],
        map[emptyIndex]
      ];
      this.empty = adjacent;
    }

    this.map = map;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i != this.empty.x || j != this.empty.y) {
          const index = i * 4 + j;

          this.resetGrid(i, j, Math.floor(map[index] / 4), map[index] % 4);
        }
      }
    }
  }

  reset() {
    if (!this.isRunning) return;

    this.isRunning = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.resetGrid(i, j, i, j);
      }
    }
  }

  switchImage() {
    this.reset();
    this.imageIndex = (this.imageIndex + 1) % this.images.length;
    this.container
      .find(".img")
      .css({ "background-image": `url("${this.images[this.imageIndex]}")` });
  }

  buildGrid(x, y, ansX, ansY) {
    const img = $(`<div class="img"></div>`);
    const div = $(`<div></div>`);

    // use relative coordinates to choose which part of image to show
    img.css({
      left: `${-ansY * 100}px`,
      top: `${-ansX * 100}px`,
      "background-image": `url("${this.images[this.imageIndex]}")`
    });

    div
      .addClass("grid")
      .attr({ x, y, "ans-x": ansX, "ans-y": ansY })
      .css({ left: `${y * 100}px`, top: `${x * 100}px` })
      .append(img);

    // add listener to grid
    div.click(() => {
      if (!this.isRunning) return;

      const [locationX, locationY] = [div.attr("x"), div.attr("y")].map(i =>
        parseInt(i)
      );
      const { x: emptyX, y: emptyY } = this.empty;

      // only allow adjacent grid to move
      if (Math.abs(emptyX - locationX) + Math.abs(emptyY - locationY) !== 1) {
        return;
      }

      // move grid
      div
        .attr({ x: emptyX, y: emptyY })
        .css({ left: `${emptyY * 100}px`, top: `${emptyX * 100}px` });

      // update map and empty status
      const locationIndex = locationX * 4 + locationY;
      const emptyIndex = emptyX * 4 + emptyY;

      [this.map[locationIndex], this.map[emptyIndex]] = [
        this.map[emptyIndex],
        this.map[locationIndex]
      ];
      this.empty = { x: locationX, y: locationY };

      // check if user has won the game
      let isDisorder = false;

      for (let i = 0; i < this.map.length; i++) {
        if (this.map[i] !== i) {
          isDisorder = true;
          break;
        }
      }

      if (!isDisorder) {
        this.isRunning = false;
        setTimeout(alert, 350, "游戏胜利，祝贺你！");
      }
    });

    this.container.append(div);
  }

  adjacentGrid(x, y, dimension) {
    switch (dimension) {
      case 0:
        return { x: x - 1, y };
      case 1:
        return { x, y: y + 1 };
      case 2:
        return { x: x + 1, y };
      case 3:
        return { x, y: y - 1 };
    }
  }

  resetGrid(x, y, ansX, ansY) {
    this.container
      .find(`.grid[ans-x="${ansX}"][ans-y="${ansY}"]`)
      .attr({ x, y })
      .css({ left: `${y * 100}px`, top: `${x * 100}px` });
  }
}
