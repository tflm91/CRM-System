//import axios, {AxiosResponse} from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var logout = document.getElementById("logout");
    var newButton = document.getElementById("new-button");
    var deleteError = document.getElementById("delete-error");
    var itemTable = document.getElementById("items");
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
    newButton.addEventListener("click", function () {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
    });
    function getItems() {
        while (itemTable.children.length > 2) {
            itemTable.removeChild(itemTable.children[2]);
        }
        axios.get("/item").then((function (value) {
            value.data.forEach(function (item) {
                var tableRow = document.createElement("tr");
                tableRow.setAttribute("id", "/customer/" + item.id);
                itemTable.appendChild(tableRow);
                var idCell = document.createElement("td");
                idCell.innerText = item.id;
                var nameCell = document.createElement("td");
                nameCell.innerText = item.name;
                var quantityCell = document.createElement("td");
                quantityCell.innerText = item.quantity;
                var basePriceCell = document.createElement("td");
                basePriceCell.innerText = item.basePrice;
                var optionCell = document.createElement("td");
                var editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.addEventListener("click", function () {
                    getItems();
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/item/" + item.id;
                    editForm.children[1].innerHTML = "ID: " + item.id;
                    editForm.children[2].children[0].children[0].setAttribute("value", item.name);
                    editForm.children[3].children[0].children[0].setAttribute("value", item.quantity);
                    editForm.children[4].children[0].children[0].setAttribute("value", item.basePrice);
                });
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", function () {
                    getItems();
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/item/" + item.id).then(function (evt) {
                        getItems();
                    }).catch(function (err) {
                        console.log(err);
                        deleteError.innerText = "This item still has special offers or purchases";
                    });
                });
                var addPiecesButton = document.createElement("button");
                addPiecesButton.innerText = "Add pieces";
                addPiecesButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    editButton.hidden = true;
                    deleteButton.hidden = true;
                    addPiecesButton.hidden = true;
                    var addPiecesForm = document.createElement("form");
                    var addPiecesInput = document.createElement("input");
                    var addPiecesSubmit = document.createElement("button");
                    addPiecesInput.setAttribute("type", "number");
                    addPiecesInput.setAttribute("name", "addedQuantity");
                    addPiecesInput.setAttribute("min", "0");
                    addPiecesInput.setAttribute("value", "0");
                    addPiecesSubmit.setAttribute("type", "submit");
                    addPiecesSubmit.innerText = "Save";
                    addPiecesForm.appendChild(addPiecesInput);
                    addPiecesForm.appendChild(addPiecesSubmit);
                    addPiecesForm.addEventListener("submit", function (evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        var data = new FormData(addPiecesForm);
                        var newValue = Number(data.get("addedQuantity")) + Number(item.quantity);
                        axios.put("/item/" + item.id, {
                            "name": item.name,
                            "quantity": newValue,
                            "basePrice": item.basePrice
                        }).then(function () {
                            getItems();
                        }).catch(function (err) {
                            console.log(err);
                        });
                    });
                    optionCell.appendChild(addPiecesForm);
                });
                optionCell.appendChild(editButton);
                optionCell.appendChild(addPiecesButton);
                optionCell.appendChild(deleteButton);
                tableRow.appendChild(idCell);
                tableRow.appendChild(nameCell);
                tableRow.appendChild(quantityCell);
                tableRow.appendChild(basePriceCell);
                tableRow.appendChild(optionCell);
            });
        })).catch(function (err) {
            console.log(err);
        });
    }
    getItems();
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
            axios.post("/item", {
                "name": data.get("name"),
                "quantity": data.get("quantity"),
                "basePrice": data.get("basePrice")
            }).then(function () {
                newForm.hidden = true;
                newForm.reset();
                getItems();
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
            axios.put(editId, {
                "name": data.get("name"),
                "quantity": data.get("quantity"),
                "basePrice": data.get("basePrice"),
            }).then(function () {
                editForm.hidden = true;
                editForm.reset();
                getItems();
            }).catch(function (err) {
                console.log(err);
            });
        }
    });
});
