//import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const error: HTMLParagraphElement = document.getElementById("error") as HTMLParagraphElement;
    const loginForm: HTMLFormElement = document.getElementById("login") as HTMLFormElement;
    loginForm.addEventListener("submit", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        const data: FormData = new FormData(loginForm);
        let fInput: boolean = false;
        data.forEach(value => {
            if(value.toString().trim().length === 0) {
                fInput = true;
            }
        })
        if(fInput) {
            error.innerText = "Please fill in all fields. ";
        } else {
            axios.post("login", {
                "username":data.get("username"),
                "password":data.get("password")
            }).then(() => {
                window.location.href = "index.html"
            }).catch(() => {
                error.innerText = "Wrong username or password";
            })
        }
    })
})