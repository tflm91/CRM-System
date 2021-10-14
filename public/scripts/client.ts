//import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const logout: HTMLAnchorElement = document.getElementById("logout") as HTMLAnchorElement;
    logout.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        axios.post("logout").then(() => {
            window.location.href = "logout.html";
        }).catch(console.log);
    })
})