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

          if (left.length == 0) $("#info-bar").attr("valid", "valid");
          resolve();
        })
        .catch(err => reject(err));
    });
  }

  function onInfoBarClicked(ele) {
    return new Promise(function(resolve, reject) {
      if (!ele.attr("valid")) return;
      $("#sum").text(
        $("#control-ring li .unread")
          .toArray()
          .map(x => parseInt($(x).text()))
          .reduce((a, b) => a + b)
      );
      ele.removeAttr("valid");
    });
  }

  $("#apb").click(function(e) {
    if ($("#sum").text()) return;

    let rings = $("#control-ring li").toArray();
    let promise = Promise.resolve();

    rings = shuffle(rings);

    for (let i = 0; i < rings.length; ++i)
      promise = promise.then(() => async($(rings[i])));

    promise.then(() => onInfoBarClicked($("#info-bar")));
  });
});
