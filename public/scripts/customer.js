"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
document.addEventListener("DOMContentLoaded", function () {
    var newButton = document.getElementById("new-button");
    var deleteError = document.getElementById("delete-error");
    var customerTable = document.getElementById("customers");
    var error = document.getElementById("error");
    var newForm = document.getElementById("new-form");
    var newCancel = document.getElementById("new-cancel");
    var editSend = document.getElementById("edit-send");
    var editCancel = document.getElementById("edit-cancel");
    var editForm = document.getElementById("edit-form");
    var editId = "";
    newButton.addEventListener("click", function () {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
    });
    function getCustomers() {
        while (customerTable.children.length > 2) {
            customerTable.removeChild(customerTable.children[2]);
        }
        axios_1.default.get("/customer").then((function (value) {
            value.data.forEach(function (customer) {
                var tableRow = document.createElement("tr");
                tableRow.setAttribute("id", "/customer/" + customer.id);
                var idCell = document.createElement("td");
                idCell.innerText = customer.id;
                var lastNameCell = document.createElement("td");
                lastNameCell.innerText = customer.lastName;
                var firstNameCell = document.createElement("td");
                firstNameCell.innerText = customer.firstName;
                var streetCell = document.createElement("td");
                streetCell.innerText = customer.street;
                var houseNumberCell = document.createElement("td");
                houseNumberCell.innerText = customer.houseNumber;
                var postalCodeCell = document.createElement("td");
                postalCodeCell.innerText = customer.postalCode;
                var cityCell = document.createElement("td");
                cityCell.innerText = customer.city;
                var emailCell = document.createElement("td");
                emailCell.innerText = customer.emailAddress;
                var phoneCell = document.createElement("td");
                phoneCell.innerText = customer.phoneNumber;
                var optionCell = document.createElement("td");
                var editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/customer/" + customer.id;
                    editForm.children[1].innerHTML = "ID: " + customer.id;
                    editForm.children[2].children[0].children[0].setAttribute("value", customer.lastName);
                    editForm.children[3].children[0].children[0].setAttribute("value", customer.firstName);
                    editForm.children[4].children[0].children[0].setAttribute("value", customer.street);
                    editForm.children[5].children[0].children[0].setAttribute("value", customer.houseNumber);
                    editForm.children[6].children[0].children[0].setAttribute("value", customer.postalCode);
                    editForm.children[7].children[0].children[0].setAttribute("value", customer.city);
                    editForm.children[8].children[0].children[0].setAttribute("value", customer.emailAddress);
                    editForm.children[9].children[0].children[0].setAttribute("value", customer.phoneNumber);
                });
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios_1.default.delete("/customer/" + customer.id).then(function () {
                        getCustomers();
                    }).catch(function (err) {
                        deleteError.innerText = "Error: This customer still has purchases";
                    });
                });
                optionCell.appendChild(editButton);
                optionCell.appendChild(deleteButton);
                tableRow.appendChild(idCell);
                tableRow.appendChild(lastNameCell);
                tableRow.appendChild(firstNameCell);
                tableRow.appendChild(streetCell);
                tableRow.appendChild(houseNumberCell);
                tableRow.appendChild(postalCodeCell);
                tableRow.appendChild(cityCell);
                tableRow.appendChild(emailCell);
                tableRow.appendChild(phoneCell);
                tableRow.appendChild(optionCell);
                customerTable.appendChild(tableRow);
            });
        })).catch(function (err) {
            console.log(err);
        });
    }
    getCustomers();
    newForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        error.innerText = "";
        var data = new FormData(newForm);
        var fInput = false;
        data.forEach(function (value) {
            if (value.toString().trim().length == 0) {
                fInput = true;
            }
        });
        if (fInput) {
            error.innerText = "Please fill in all fields. ";
        }
        else {
            axios_1.default.post("/customer", {
                "lastName": data.get("lastName"),
                "firstName": data.get("firstName"),
                "street": data.get("street"),
                "houseNumber": data.get("houseNumber"),
                "postalCode": data.get("postalCode"),
                "city": data.get("city"),
                "emailAddress": data.get("emailAddress"),
                "phoneNumber": data.get("phoneNumber")
            }).then(function () {
                newForm.hidden = true;
                newForm.reset();
                getCustomers();
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
    newCancel.addEventListener("click", function (evt) {
        evt.preventDefault();
        error.innerText = "";
        newForm.hidden = true;
        newForm.reset();
    });
    editForm.addEventListener("submit", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        error.innerText = "";
        var data = new FormData(editForm);
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
            axios_1.default.put(editId, {
                "lastName": data.get("lastName"),
                "firstName": data.get("firstName"),
                "street": data.get("street"),
                "houseNumber": data.get("houseNumber"),
                "postalCode": data.get("postalCode"),
                "city": data.get("city"),
                "emailAddress": data.get("emailAddress"),
                "phoneNumber": data.get("phoneNumber")
            }).then(function () {
                editForm.hidden = true;
                editForm.reset();
                getCustomers();
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
});
