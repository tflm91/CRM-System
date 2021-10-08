//import axios from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var error = document.getElementById("error");
    var loginForm = document.getElementById("login");
    loginForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        var data = new FormData(loginForm);
        var fInput = false;
        data.forEach(function (value) {
            if (value.toString().trim().length === 0) {
                fInput = true;
            }
        });
        if (fInput) {
            error.innerText = "Please fill in all fields. ";
        }
        else {
            axios.post("login", {
                "username": data.get("username"),
                "password": data.get("password")
            }).then(function () {
                window.location.href = "index.html";
            }).catch(function () {
                error.innerText = "Wrong username or password";
            });
        }
    });
});
