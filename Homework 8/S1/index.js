$(document).ready(function() {
  let mutex = 0;

  $("#info-bar").click(function(e) {
    const self = $(this);

    if (!self.attr("valid")) return;

    $("#sum").text(
      $("#control-ring li .unread")
        .toArray()
        .map(x => parseInt($(x).text()))
        .reduce((a, b) => a + b)
    );
    self.removeAttr("valid");
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

  $("#control-ring li").click(function(e) {
    const self = $(this);
    let pre = mutex;

    if (self.attr("value") || $("#control-ring").attr("calculating")) return;

    self.find(".unread").text("...");
    self.attr("calculating", "calculating").attr("value", "...");
    $("#control-ring").attr("calculating", "calculating");

    fetch("http://localhost:3000/api")
      .then(res => res.text())
      .then(data => {
        if (mutex !== pre) return;

        self.find(".unread").text(data);
        self
          .removeAttr("calculating")
          .attr("calculated", "calculated")
          .attr("value", data);
        $("#control-ring").removeAttr("calculating");

        const left = $("#control-ring li")
          .toArray()
          .filter(x => $(x).attr("value") === "..." || !$(x).attr("value"));

        if (left.length == 0) $("#info-bar").attr("valid", "valid");
      })
      .catch(err => console.log(err));
  });
});
