window.onload = function() {
  const map = document.getElementById("map");
  const walls = document.getElementsByClassName("wall");
  const start = document.getElementById("start");
  const end = document.getElementById("end");
  const result = document.getElementById("result");

  const MSG_WIN = "You Win!";
  const MSG_LOSE = "You Lose!";
  const MSG_CHEAT =
    "Don't cheat, you should start from the 'S' and move to the 'E' inmap the maze!";

  let isStarting = false;
  let isCheating = false;

  // show red when wall is collided
  function setWall(wall) {
    wall.setAttribute("stay", "");
  }

  // reset the wall
  function resetWall(wall) {
    wall.removeAttribute("stay");
  }

  // show message on Result Board
  function setResult(message) {
    result.textContent = message;
    result.setAttribute("enable", "");
  }

  // reset Result Board
  function resetResult() {
    result.removeAttribute("enable");
  }

  // add cheat detection
  map.addEventListener("mouseleave", function() {
    if (!isStarting) {
      return;
    }

    isCheating = true;
  });

  // add wall collision detection
  for (let wall of walls) {
    wall.addEventListener("mouseover", function() {
      if (!isStarting) {
        return;
      }

      setWall(this);
      setResult(MSG_LOSE);
      isStarting = false;
    });
  }

  start.addEventListener("mouseover", function() {
    for (let wall of walls) {
      resetWall(wall);
    }

    resetResult();
    isStarting = true;
    isCheating = false;
  });

  end.addEventListener("mouseover", function() {
    if (!isStarting) {
      return;
    }

    setResult(isCheating ? MSG_CHEAT : MSG_WIN);
    isStarting = false;
  });
};
