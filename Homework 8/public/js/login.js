function reset() {
  $("#register-form").removeClass("error");
  $("#username").removeClass("error");
  $("#errors").empty();
}

$(document).ready(function() {
  const DOMForm = document.getElementById("register-form");

  DOMForm.addEventListener("submit", function(e) {
    e.preventDefault();
    reset();

    const formdata = $(DOMForm).serializeArray();
    const username = formdata[0].value;

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username})
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          window.location.href = `/?username=${username}`;
          return;
        }

        const div = $(`<div class="list"></div>`);

        div.append(
          `<li>${username} doesn't exist. <a href="/register.html">Register</a></li>`
        );
        $("#errors").append(div);
        $(`#username`).addClass("error");
        $("#register-form").addClass("error");
      })
      .catch((err) => alert(err));
  });
});
