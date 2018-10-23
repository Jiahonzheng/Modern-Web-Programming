window.onload = function() {
  const map = document.getElementById("map");
  const controller = document.getElementById("controller");
  const time = document.getElementById("time");
  const result = document.getElementById("result");
  const score = document.getElementById("score");

  const MSG_READY = "Ready to Play";
  const MSG_PLAYING = "Playing";
  const MSG_LOSE = "Game Over";

  let isStarting = false;
  let count = 0;
  let timer = null;
  let remainTime = 30;
  let mole = null;

  setHole();

  const holes = document.getElementsByClassName("hole");

  controller.addEventListener("click", onControllerPressed);

  function setHole() {
    for (let i = 0; i < 60; i++) {
      const element = document.createElement("div");

      element.setAttribute("data-id", i);
      element.className = "hole";
      element.addEventListener("click", onHoleWhacked);

      map.appendChild(element);
    }
  }

  function setTime() {
    if (!timer) {
      remainTime = 30;
    } else {
      remainTime--;
    }

    time.value = remainTime;

    if (remainTime === 0) {
      isStarting = false;
      mole.className = "hole";
      clearInterval(timer);
      timer = null;
      setResult(MSG_LOSE);
      count = 0;
    }
  }

  function setResult(data) {
    result.value = data;
  }

  function setScore(data) {
    score.value = data;
  }

  function onControllerPressed() {
    if (isStarting) {
      isStarting = false;
      mole.className = "hole";
      clearInterval(timer);
      timer = null;
      setResult(MSG_READY);
      count = 0;
      return;
    }

    isStarting = true;
    mole = holes[Math.ceil((holes.length - 1) * Math.random())];
    mole.className = "mole";
    setResult(MSG_PLAYING);
    setScore(0);
    setTime();
    timer = setInterval(setTime, 1000);
  }

  function onHoleWhacked(event) {
    if (!isStarting) {
      return;
    }

    const { id } = event.target.dataset;

    if (id !== mole.dataset.id) {
      setScore(--count);
      return;
    }

    let index;

    do {
      index = Math.ceil((holes.length - 1) * Math.random());
    } while (index === parseInt(mole.dataset.id));

    mole.className = "hole";
    mole = holes[index];
    mole.className = "mole";

    setScore(++count);
  }
};
