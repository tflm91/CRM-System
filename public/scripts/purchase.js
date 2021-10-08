//import axios from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var logout = document.getElementById("logout");
    var newButton = document.getElementById("new-button");
    var deleteError = document.getElementById("delete-error");
    var purchaseTable = document.getElementById("purchases");
    var error = document.getElementById("error");
    var newForm = document.getElementById("new-form");
    var newCancel = document.getElementById("new-cancel");
    var editSend = document.getElementById("edit-send");
    var editCancel = document.getElementById("edit-cancel");
    var editForm = document.getElementById("edit-form");
    var editId = "";
    logout.addEventListener("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        axios.post("logout").then(function () {
            window.location.href = "logout.html";
        }).catch(console.log);
    });
    function setOptionContent(resource, value) {
        switch (resource) {
            case "item": {
                return value.name;
            }
            case "customer": {
                return value.firstName + " " + value.lastName;
            }
        }
    }
    function initializeSelect(element, resource, defaultOption) {
        while (element.options.length > 0) {
            element.remove(0);
        }
        axios.get(resource).then(function (value) {
            value.data.forEach(function (it) {
                element.add(new Option(setOptionContent(resource, it), it.id, it.id === defaultOption, it.id === defaultOption));
            });
        });
    }
    newButton.addEventListener("click", function () {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
        initializeSelect(newForm.children[1].children[0].children[0], "customer", undefined);
        initializeSelect(newForm.children[2].children[0].children[0], "item", undefined);
    });
    function formatPrice(price) {
        var dot = price.indexOf(".");
        if (dot == -1)
            return price + "." + "0".repeat(2);
        else {
            var digits = price.length - dot - 1;
            return price + "0".repeat(2 - digits);
        }
    }
    function getPurchases() {
        while (purchaseTable.children.length > 2) {
            purchaseTable.removeChild(purchaseTable.children[2]);
        }
        axios.get("/purchase").then((function (value) {
            value.data.forEach(function (purchase) {
                var tableRow = document.createElement("tr");
                tableRow.setAttribute("id", "/purchase/" + purchase.id);
                var idCell = document.createElement("td");
                idCell.innerText = purchase.id;
                var customerCell = document.createElement("td");
                axios.get("/customer").then(function (value) {
                    var customer = value.data.find(function (it) { return it.id == purchase.customer; });
                    customerCell.innerText = customer.firstName + " " + customer.lastName;
                }).catch(console.log);
                var itemCell = document.createElement("td");
                axios.get("/item").then(function (value) {
                    var item = value.data.find(function (it) { return it.id == purchase.item; });
                    itemCell.innerText = item.name;
                }).catch(console.log);
                var quantityCell = document.createElement("td");
                quantityCell.innerText = purchase.quantity;
                var dateCell = document.createElement("td");
                var date = new Date(purchase.date).toISOString().slice(0, 10);
                dateCell.innerText = date;
                var priceCell = document.createElement("td");
                priceCell.innerText = formatPrice(purchase.price.toString());
                var optionCell = document.createElement("td");
                var editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/purchase/" + purchase.id;
                    editForm.children[1].innerHTML = "ID: " + purchase.id;
                    initializeSelect(editForm.children[2].children[0].children[0], "customer", purchase.customer);
                    initializeSelect(editForm.children[3].children[0].children[0], "item", purchase.item);
                    editForm.children[4].children[0].children[0].setAttribute("value", purchase.quantity);
                    editForm.children[5].children[0].children[0].setAttribute("value", date);
                });
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/purchase/" + purchase.id).then(function () {
                        getPurchases();
                    }).catch(console.log);
                });
                optionCell.appendChild(editButton);
                optionCell.appendChild(deleteButton);
                tableRow.appendChild(idCell);
                tableRow.appendChild(customerCell);
                tableRow.appendChild(itemCell);
                tableRow.appendChild(quantityCell);
                tableRow.appendChild(dateCell);
                tableRow.appendChild(priceCell);
                tableRow.appendChild(optionCell);
                purchaseTable.appendChild(tableRow);
            });
        })).catch(console.log);
    }
    getPurchases();
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
            if (new Date(data.get("date").toString()) > new Date()) {
                error.innerText = "Date is in future. ";
            }
            else {
                axios.post("/purchase", {
                    "customer": data.get("customer"),
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "date": data.get("date")
                }).then(function () {
                    newForm.hidden = true;
                    newForm.reset();
                    getPurchases();
                }).catch(function () {
                    error.innerText = "There are not enough pieces in stock. ";
                });
            }
        }
    });
    newCancel.addEventListener("click", function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
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
            if (new Date(data.get("date").toString()) > new Date()) {
                error.innerText = "Date is in future. ";
            }
            else {
                axios.put(editId, {
                    "customer": data.get("customer"),
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "date": data.get("date")
                }).then(function () {
                    editForm.hidden = true;
                    editForm.reset();
                    getPurchases();
                }).catch(function (err) {
                    console.log(err);
                });
            }
        }
    });
    editCancel.addEventListener("click", function (evt) {
        evt.preventDefault();
        error.innerText = "";
        editForm.hidden = true;
        editForm.reset();
    });
});
