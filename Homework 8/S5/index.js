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

  $("#apb").click(function(e) {
    if ($("#sum").text()) return;

    const handlers = shuffle([
      handlerGenerator(1, "这是个天大的秘密", "这不是个天大的秘密"),
      handlerGenerator(2, "我不知道", "我知道"),
      handlerGenerator(3, "你不知道", "你知道"),
      handlerGenerator(4, "他不知道", "他知道"),
      handlerGenerator(5, "才怪", "就是这样")
    ]);

    handlers.push(bubbleHandler);
    automatic(handlers, 0, 0);
  });

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

  function display(x) {
    $("#sum").text(x);
  }

  function handlerGenerator(i, a, b) {
    return function(currentSum, resolve, reject) {
      display(a);
      async($(`#control-ring li:nth-child(${i})`))
        .then(res => {
          if (Math.random() >= 0.5) throw "";

          resolve(currentSum + parseInt(res));
        })
        .catch(err => reject({ message: b, currentSum }));
    };
  }

  function bubbleHandler(currentSum, resolve, reject) {
    if (Math.random() >= 0.5) {
      return reject({
        message: "楼主异步调用战斗力太强了，目测超过" + currentSum,
        currentSum
      });
    }

    display("楼主异步调用战斗力感人，目测不超过" + currentSum);
  }

  function async(ele) {
    return new Promise(function(resolve, reject) {
      if (ele.attr("value") || $("#control-ring").attr("calculating")) return;

      ele.find(".unread").text("...");
      ele.attr("calculating", "calculating").attr("value", "...");
      $("#control-ring").attr("calculating", "calculating");

      let pre = mutex;

      fetch("http://localhost:3000/api")
        .then(res => res.text())
        .then(data => {
          if (mutex !== pre) return;

          ele.find(".unread").text(data);
          ele
            .removeAttr("calculating")
            .attr("calculated", "calculated")
            .attr("value", data);
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
});
