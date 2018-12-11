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

  $("#control-ring li").click(function(e) {
    if ($(this).attr("value") || $("#control-ring").attr("calculating")) return;

    let pre = mutex;

    $(this)
      .find(".unread")
      .text("...");
    $(this)
      .attr("value", "...")
      .attr("calculating", "calculating");
    $("#control-ring").attr("calculating", "calculating");

    // It might have some cors problem.
    fetch("http://localhost:3000/")
      .then(res => res.text())
      .then(data => {
        if (mutex !== pre) return;
        $(this)
          .find(".unread")
          .text(data);
        $(this)
          .attr("value", data)
          .attr("calculated", "calculated")
          .removeAttr("calculating");
        $("#control-ring").removeAttr("calculating");

        const left = $("#control-ring li")
          .toArray()
          .filter(x => $(x).attr("value") === "..." || !$(x).attr("value"));

        if (left.length == 0) $("#info-bar").attr("valid", "valid");
      })
      .catch(err => console.log(err));
  });

  $("#info-bar").click(function(e) {
    if (!$(this).attr("valid")) return;
    $("#sum").text(
      $("#control-ring li .unread")
        .toArray()
        .map(x => parseInt($(x).text()))
        .reduce((a, b) => a + b)
    );
    $(this).removeAttr("valid");
  });
});
