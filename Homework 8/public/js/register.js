function reset() {
  $("#register-form").removeClass("error");
  $("#username").removeClass("error");
  $("#stuId").removeClass("error");
  $("#phone").removeClass("error");
  $("#email").removeClass("error");
  $("#errors").empty();
}

$(document).ready(function() {
  const DOMForm = document.getElementById("register-form");
  const regexUsername = /^[a-zA-Z]\w{5,17}$/;
  const regexStuId = /^[1-9]\d{7}$/;
  const regexPhone = /^[1-9]\d{10}$/;
  const regexEmail = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

  DOMForm.addEventListener("reset", function(e) {
    reset();
  });

  DOMForm.addEventListener("submit", function(e) {
    e.preventDefault();
    reset();

    const formdata = $(DOMForm).serializeArray();
    const errors = ["", "", "", ""];

    if (!regexUsername.test(formdata[0].value)) errors[0] = "Username";
    if (!regexStuId.test(formdata[1].value)) errors[1] = "Student ID";
    if (!regexPhone.test(formdata[2].value)) errors[2] = "Phone";
    if (!regexEmail.test(formdata[3].value)) errors[3] = "Email";

    if (errors.filter((i) => i !== "").length) {
      const div = $(`<div class="list"></div>`);

      for (let i = 0; i < errors.length; i++) {
        if (errors[i] === "") continue;
        $(`#${formdata[i].name}`).addClass("error");
        div.append(`<li>${errors[i]} is invalid</li>`);
      }

      $("#errors").append(div);
      $("#register-form").addClass("error");
      return;
    }

    let requestData = {};
    for (let data of formdata) requestData[data.name] = data.value;

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          window.location.href = "/userinfo?username=" + requestData.username;
          return;
        }

        const div = $(`<div class="list"></div>`);

        div.append(`<li>Field ${res.field} conflicts</li>`);
        $("#errors").append(div);
        $(`#${res.field}`).addClass("error");
        $("#register-form").addClass("error");
      })
      .catch((err) => alert(err));
  });
});
