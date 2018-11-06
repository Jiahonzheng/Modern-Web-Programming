function shuffle(arr) {
  let i = arr.length;
  let j;

  while (i) {
    j = Math.floor(Math.random() * i);
    i -= 1;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice();
}

class Game {
  constructor() {
    this.container = $("#map");
    this.images = [
      "images/1.jpg",
      "images/2.jpg",
      "images/3.jpg",
      "images/4.jpg"
    ];
    this.image = this.images[0];
    this.start(false);
  }

  randomImage() {
    const arr = this.images.slice();

    // remove the current image
    arr.splice(arr.indexOf(this.image), 1);
    this.image = shuffle(arr)[0];
    this.start(false);
  }

  start(isRandom) {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const now = isRandom ? shuffle(arr) : arr;

    this.container.empty();
    this.empty = { x: 3, y: 3 };

    for (let i = 0; i < 4; ++i) {
      for (let j = 0; j < 4; ++j) {
        const tempX = Math.floor(now[i * 4 + j] / 4);
        const tempY = now[i * 4 + j] % 4;

        if (i + j < 6) {
          this.buildGrid(tempX, tempY, i, j);
        } else {
          this.empty = { x: tempX, y: tempY };
        }
      }
    }
  }

  buildGrid(x, y, ansX, ansY) {
    const img = $("<img/>");
    const div = $("<div></div>");

    // use relative coordinates to choose which part of image to show
    img
      .css({ left: `${-ansY * 100}px`, top: `${-ansX * 100}px` })
      .attr("src", this.image);

    div
      .addClass("grid")
      .attr({ x, y, "ans-x": ansX, "ans-y": ansY })
      .css({ left: `${y * 100}px`, top: `${x * 100}px` })
      .append(img);

    // add listener to grid
    div.click(() => {
      const [locationX, locationY] = [div.attr("x"), div.attr("y")].map(i =>
        parseInt(i)
      );
      const { x: emptyX, y: emptyY } = this.empty;

      // only allow adjacent grid to move
      if (Math.abs(emptyX - locationX) + Math.abs(emptyY - locationY) !== 1)
        return;

      div
        .attr({ x: emptyX, y: emptyY })
        .css({ left: `${emptyY * 100}px`, top: `${emptyX * 100}px` });

      this.empty = { x: locationX, y: locationY };

      // check if user has won the game
      const isDisorder = !!$(".grid").filter(function() {
        return (
          $(this).attr("x") !== $(this).attr("ans-x") ||
          $(this).attr("y") !== $(this).attr("ans-y")
        );
      }).length;

      if (!isDisorder) {
        setTimeout(alert, 350, "游戏胜利，祝贺你");
      }
    });

    this.container.append(div);
  }
}
