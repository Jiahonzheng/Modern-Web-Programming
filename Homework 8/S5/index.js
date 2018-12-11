// Shuffle an array
function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = arr[randomIndex];

    arr[randomIndex] = arr[i];
    arr[i] = itemAtIndex;
  }

  return arr;
}

$(document).ready(function() {
  let mutex = 0;

  // Reset
  $("#bottom-positioner").mouseenter(function(e) {
    mutex++;
    $("#sum").text("");
    $("#info-bar").removeAttr("valid");
    $("#control-ring").removeAttr("calculating");
    $("#control-ring li")
      .removeAttr("value")
      .removeAttr("calculating")
      .removeAttr("calculated");
    $("#control-ring li .unread").text("...");
  });

  // Reset
  $("#bottom-positioner").mouseleave(function(e) {
    mutex++;
  });

  function display(x) {
    $("#sum").text(x);
  }

  function async(ele) {
    return new Promise(function(resolve, reject) {
      if (ele.attr("value") || $("#control-ring").attr("calculating")) return;
      ele.find(".unread").text("...");
      ele.attr("value", "...").attr("calculating", "calculating");
      $("#control-ring").attr("calculating", "calculating");

      let pre = mutex;

      fetch("http://localhost:3000/")
        .then(res => res.text())
        .then(data => {
          if (mutex !== pre) return;
          ele.find(".unread").text(data);
          ele
            .attr("value", data)
            .attr("calculated", "calculated")
            .removeAttr("calculating");
          $("#control-ring").removeAttr("calculating");

          const left = $("#control-ring li")
            .toArray()
            .filter(x => $(x).attr("value") === "..." || !$(x).attr("value"));

          if (left.length === 0) $("#info-bar").attr("valid", "valid");
          resolve(data);
        })
        .catch(err => reject(err));
    });
  }

  function aHandler(currentSum, resolve, reject) {
    display("这是个天大的秘密");
    async($("#control-ring li:nth-child(1)"))
      .then(res => {
        if (Math.random() >= 0.5) throw "";
        resolve(currentSum + parseInt(res));
      })
      .catch(err => reject({ message: "这不是个天大的秘密", currentSum }));
  }

  function bHandler(currentSum, resolve, reject) {
    display("我不知道");
    async($("#control-ring li:nth-child(2)"))
      .then(res => {
        if (Math.random() >= 0.5) throw "";
        resolve(currentSum + parseInt(res));
      })
      .catch(err => reject({ message: "我知道", currentSum }));
  }

  function cHandler(currentSum, resolve, reject) {
    display("你不知道");
    async($("#control-ring li:nth-child(3)"))
      .then(res => {
        if (Math.random() >= 0.5) throw "";
        resolve(currentSum + parseInt(res));
      })
      .catch(err => reject({ message: "你知道", currentSum }));
  }

  function dHandler(currentSum, resolve, reject) {
    display("他不知道");
    async($("#control-ring li:nth-child(4)"))
      .then(res => {
        if (Math.random() >= 0.5) throw "";
        resolve(currentSum + parseInt(res));
      })
      .catch(err => reject({ message: "他知道", currentSum }));
  }

  function eHandler(currentSum, resolve, reject) {
    display("才怪");
    async($("#control-ring li:nth-child(5)"))
      .then(res => {
        if (Math.random() >= 0.5) throw "";
        resolve(currentSum + parseInt(res));
      })
      .catch(err => reject({ message: "就是这样", currentSum }));
  }

  function bubbleHandler(currentSum, resolve, reject) {
    if (Math.random() >= 0.5)
      return reject({
        message: "楼主异步调用战斗力太强了，目测超过" + currentSum,
        currentSum
      });

    display("楼主异步调用战斗力感人，目测不超过" + currentSum);
  }

  function automatic(handlers, index, currentSum) {
    if (index >= handlers.length) return;

    let pre = mutex;

    handlers[index](
      currentSum,
      function(nextSum) {
        if (mutex !== pre) return;
        automatic(handlers, index + 1, nextSum);
      },
      function(err) {
        if (mutex !== pre) return;
        display(err.message);
      }
    );
  }

  $("#apb").click(function(e) {
    if ($("#sum").text()) return;

    const handlers = shuffle([
      aHandler,
      bHandler,
      cHandler,
      dHandler,
      eHandler
    ]);

    handlers.push(bubbleHandler);
    automatic(handlers, 0, 0);
  });
});
