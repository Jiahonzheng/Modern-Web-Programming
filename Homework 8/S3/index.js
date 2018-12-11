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
      if (ele.attr("value")) return;
      ele.find(".unread").text("...");
      ele.attr("value", "...").attr("calculating", "calculating");
      $("#control-ring").attr("calculating", "calculating");

      let pre = mutex;

      // It might have some cors problem.
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
          .reduce((a, b) => a + b, 0)
      );
      ele.removeAttr("valid");
    });
  }

  $("#apb").click(function(e) {
    if ($("#sum").text()) return;
    
    const promises = $("#control-ring li")
      .toArray()
      .map(li => async($(li)));

    Promise.all(promises).then(() => onInfoBarClicked($("#info-bar")));
  });
});
