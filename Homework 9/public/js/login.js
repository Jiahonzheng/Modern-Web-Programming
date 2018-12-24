function reset() {
  $("#register-form").removeClass("error");
  $("#username").removeClass("error");
  $("#password").removeClass("error");
  $("#errors").empty();
}

$(document).ready(function() {
  const DOMForm = document.getElementById("register-form");

  DOMForm.addEventListener("submit", function(e) {
    e.preventDefault();
    reset();

    const formdata = $(DOMForm).serializeArray();
    const [{ value: username }, { value: password }] = formdata;

    fetch("/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) {
          window.location.href = `/?username=${username}`;
          return;
        }

        const div = $(`<div class="list"></div>`);

        switch (res.msg) {
          case "User Not Found":
            div.append(
              `<li>${username} doesn't exist. <a href="/register.html">Register</a></li>`
            );
            $(`#username`).addClass("error");
            break;
          case "Wrong Password":
            div.append(`<li>Password is incorrect.</li>`);
            $(`#password`).addClass("error");
            break;
          default:
            div.append(`<li>Server Internal Error</li>`);
        }

        $("#errors").append(div);
        $("#register-form").addClass("error");
      })
      .catch(err => alert(err));
  });
});
