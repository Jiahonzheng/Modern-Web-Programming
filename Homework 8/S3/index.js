$(document).ready(function() {
  let mutex = 0;

  $("#apb").click(function(e) {
    if ($("#sum").text()) return;

    const promises = $("#control-ring li")
      .toArray()
      .map(li => async($(li)));

    Promise.all(promises).then(() => onInfoBarClicked($("#info-bar")));
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

  function async(ele) {
    return new Promise(function(resolve, reject) {
      if (ele.attr("value")) return;

      ele.find(".unread").text("...");
      ele.attr("calculating", "calculating").attr("value", "...");
      $("#control-ring").attr("calculating", "calculating");

      let pre = mutex;

      // It might have some cors problem.
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
          .map(ele => parseInt($(ele).text()))
          .reduce((a, b) => a + b, 0)
      );
      ele.removeAttr("valid");
    });
  }
});
