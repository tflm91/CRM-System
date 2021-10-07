//import axios, {AxiosResponse} from "axios";
document.addEventListener("DOMContentLoaded", function () {
    var newButton = document.getElementById("new-button");
    var deleteError = document.getElementById("delete-error");
    var specialOfferTable = document.getElementById("special-offers");
    var error = document.getElementById("error");
    var newForm = document.getElementById("new-form");
    var newCancel = document.getElementById("new-cancel");
    var editSend = document.getElementById("edit-send");
    var editCancel = document.getElementById("edit-cancel");
    var editForm = document.getElementById("edit-form");
    var editId = "";
    function initializeSelect(element, defaultOption) {
        while (element.children.length > 0) {
            element.removeChild(element.children[0]);
        }
        axios.get("/item").then(function (value) {
            if (defaultOption !== undefined) {
                var defaultItem = value.data.find(function (it) { return it.id === defaultOption; });
                var option = document.createElement("option");
                option.setAttribute("value", defaultItem.id);
                option.innerText = defaultItem.name;
                element.appendChild(option);
                value.data = value.data.filter(function (it) { return it.id !== defaultOption; });
            }
            value.data.forEach(function (item) {
                var option = document.createElement("option");
                option.setAttribute("value", item.id);
                option.innerText = item.name;
                element.appendChild(option);
            });
        }).catch(function (err) {
            console.log(err);
        });
    }
    newButton.addEventListener("click", function () {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
        initializeSelect(newForm.children[1].children[0].children[0], undefined);
    });
    function getSpecialOffers() {
        while (specialOfferTable.children.length > 2) {
            specialOfferTable.removeChild(specialOfferTable.children[2]);
        }
        axios.get("/special-offer").then((function (value) {
            value.data.forEach(function (specialOffer) {
                var tableRow = document.createElement("tr");
                tableRow.setAttribute("id", "/special-offer/" + specialOffer.id);
                var idCell = document.createElement("td");
                idCell.innerText = specialOffer.id;
                var itemCell = document.createElement("td");
                axios.get("/item/").then(function (value) {
                    var item = value.data.find(function (it) { return it.id == specialOffer.item; });
                    itemCell.innerText = item.name;
                }).catch(function (err) {
                    console.log(err);
                });
                var quantityCell = document.createElement("td");
                quantityCell.innerText = specialOffer.quantity;
                var priceCell = document.createElement("td");
                priceCell.innerText = specialOffer.price;
                var beginCell = document.createElement("td");
                var begin = new Date(specialOffer.begin).toISOString().slice(0, 10);
                beginCell.innerText = begin;
                var expirationCell = document.createElement("td");
                var expiration = new Date(specialOffer.expiration).toISOString().slice(0, 10);
                expirationCell.innerText = expiration;
                var optionCell = document.createElement("td");
                var editButton = document.createElement("button");
                editButton.innerText = "Edit";
                editButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/special-offer/" + specialOffer.id;
                    editForm.children[1].innerHTML = "ID: " + specialOffer.id;
                    initializeSelect(editForm.children[2].children[0].children[0], specialOffer.item);
                    editForm.children[3].children[0].children[0].setAttribute("value", specialOffer.quantity);
                    editForm.children[4].children[0].children[0].setAttribute("value", specialOffer.price);
                    editForm.children[5].children[0].children[0].setAttribute("value", begin);
                    editForm.children[6].children[0].children[0].setAttribute("value", expiration);
                });
                var deleteButton = document.createElement("button");
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", function () {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/special-offer/" + specialOffer.id).then(function () {
                        getSpecialOffers();
                    }).catch(function () {
                        deleteError.innerText = "Special offer not expired yet";
                    });
                });
                optionCell.appendChild(editButton);
                optionCell.appendChild(deleteButton);
                tableRow.appendChild(idCell);
                tableRow.appendChild(itemCell);
                tableRow.appendChild(quantityCell);
                tableRow.appendChild(priceCell);
                tableRow.appendChild(beginCell);
                tableRow.appendChild(expirationCell);
                tableRow.appendChild(optionCell);
                specialOfferTable.appendChild(tableRow);
            });
        })).catch(function (err) {
            console.log(err);
        });
    }
    getSpecialOffers();
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
            if (data.get("expiration") < data.get("begin")) {
                error.innerText = "Special offer expires before it begins. ";
            }
            console.log(data.get("begin"));
            console.log(data.get("expiration"));
            axios.post("/special-offer", {
                "item": data.get("item"),
                "quantity": data.get("quantity"),
                "price": data.get("price"),
                "begin": data.get("begin"),
                "expiration": data.get("expiration")
            }).then(function () {
                newForm.hidden = true;
                newForm.reset();
                getSpecialOffers();
            }).catch(function () {
                error.innerText = "Special offer is too expensive.";
            });
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
            if (data.get("expiration") < data.get("begin")) {
                error.innerText = "Special offer expires before it begins. ";
            }
            else {
                axios.put(editId, {
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "price": data.get("price"),
                    "begin": data.get("begin"),
                    "expiration": data.get("expiration")
                }).then(function () {
                    editForm.hidden = true;
                    editForm.reset();
                    getSpecialOffers();
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
