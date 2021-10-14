//import axios from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var logout = document.getElementById("logout");
    logout.addEventListener("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        axios.post("logout").then(function () {
            window.location.href = "logout.html";
        }).catch(console.log);
    });
});
