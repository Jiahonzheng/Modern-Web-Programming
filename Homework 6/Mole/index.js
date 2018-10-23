window.onload = function() {
  const map = document.getElementById("map");
  const controller = document.getElementById("controller");
  const time = document.getElementById("time");
  const result = document.getElementById("result");
  const score = document.getElementById("score");

  const MSG_PLAYING = "Playing";
  const MSG_LOSE = "Game Over";

  let isStarting = false;
  let count = 0;
  let timer = null;
  let remainTime;

  setHole();

  controller.addEventListener("click", onControllerPressed);

  function setHole() {
    for (let i = 0; i < 60; i++) {
      const element = document.createElement("input");

      element.setAttribute("type", "radio");
      element.setAttribute("name", "hole");
      element.className = "hole";
      element.addEventListener("click", onHoleWhacked);

      map.appendChild(element);
    }
  }

  function setTime() {
    if (!timer) {
      remainTime = 3;
    } else {
      remainTime--;
    }

    time.value = remainTime;

    if (remainTime === 0) {
      resetTime();
      setResult(MSG_LOSE);
    }
  }

  function resetTime() {
    isStarting = false;
    time.value = 3;
    clearInterval(timer);
    timer = null;
  }

  function setResult(data) {
    result.value = data;
  }

  function resetResult() {
    result.value = "";
  }

  function setScore(data) {
    score.value = data;
  }

  function resetScore() {
    score.value = 0;
  }

  function onControllerPressed() {
    if (isStarting) {
      isStarting = false;
      resetTime();
      resetResult();
      resetScore();
      return;
    }

    isStarting = true;

    setTime();
    timer = setInterval(setTime, 1000);
  }

  function onHoleWhacked() {
    if (!isStarting) {
      return;
    }

    setScore(++count);
  }
};
