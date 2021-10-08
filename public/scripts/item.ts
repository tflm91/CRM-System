//import axios, {AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const logout: HTMLAnchorElement = document.getElementById("logout") as HTMLAnchorElement;
    const newButton: HTMLButtonElement = document.getElementById("new-button") as HTMLButtonElement;
    const deleteError: HTMLElement = document.getElementById("delete-error");
    const itemTable: HTMLTableElement = document.getElementById("items") as HTMLTableElement;
    const error: HTMLElement = document.getElementById("error");
    const newForm: HTMLFormElement = document.getElementById("new-form") as HTMLFormElement;
    const newCancel: HTMLButtonElement = document.getElementById("new-cancel") as HTMLButtonElement;
    const editSend: HTMLButtonElement = document.getElementById("edit-send") as HTMLButtonElement;
    const editCancel: HTMLButtonElement = document.getElementById("edit-cancel") as HTMLButtonElement;
    const editForm: HTMLFormElement = document.getElementById("edit-form") as HTMLFormElement;
    let editId: string = "";

    logout.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        axios.post("logout").then(() => {
            window.location.href = "logout.html";
        }).catch(console.log);
    })

    newButton.addEventListener("click", () => {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
    });

    function getItems() {
        while(itemTable.children.length > 2) {
            itemTable.removeChild(itemTable.children[2]);
        }

        axios.get("/item").then((value => {
            value.data.forEach(item => {
                const tableRow: HTMLElement = document.createElement("tr");
                tableRow.setAttribute("id", "/customer/" + item.id)
                itemTable.appendChild(tableRow);
                const idCell: HTMLElement = document.createElement("td");
                idCell.innerText = item.id;
                const nameCell: HTMLElement = document.createElement("td");
                nameCell.innerText = item.name;
                const quantityCell: HTMLElement = document.createElement("td");
                quantityCell.innerText = item.quantity;
                const basePriceCell: HTMLElement = document.createElement("td");
                basePriceCell.innerText = item.basePrice;
                const optionCell: HTMLElement = document.createElement("td");
                const editButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                editButton.innerText = "Edit";
                editButton.addEventListener("click", () => {
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
                const deleteButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", () => {
                    getItems();
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/item/" + item.id).then((evt) => {
                        getItems();
                    }).catch((err) => {
                        console.log(err);
                        deleteError.innerText = "This item still has special offers or purchases";
                    });
                });
                const addPiecesButton: HTMLButtonElement = document.createElement("button");
                addPiecesButton.innerText = "Add pieces";
                addPiecesButton.addEventListener("click", () => {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    editButton.hidden = true;
                    deleteButton.hidden = true;
                    addPiecesButton.hidden = true;

                    const addPiecesForm: HTMLFormElement = document.createElement("form");
                    const addPiecesInput: HTMLInputElement = document.createElement("input");
                    const addPiecesSubmit: HTMLInputElement = document.createElement("input");

                    addPiecesInput.setAttribute("type", "number");
                    addPiecesInput.setAttribute("name", "addedQuantity")
                    addPiecesInput.setAttribute("min", "0");
                    addPiecesInput.setAttribute("value", "0");
                    addPiecesSubmit.setAttribute("type", "submit");


                    addPiecesForm.appendChild(addPiecesInput);
                    addPiecesForm.appendChild(addPiecesSubmit);

                    addPiecesForm.addEventListener("submit", (evt: Event) => {
                        evt.preventDefault();
                        evt.stopPropagation();

                        const data: FormData = new FormData(addPiecesForm);
                        const newValue: number = Number(data.get("addedQuantity")) + Number(item.quantity);

                        axios.put("/item/" + item.id, {
                            "name":item.name,
                            "quantity":newValue,
                            "basePrice":item.basePrice
                        }).then(() => {
                            getItems();
                        }).catch((err) => {
                            console.log(err);
                        })
                    })

                    optionCell.appendChild(addPiecesForm);
                })

                optionCell.appendChild(editButton);
                optionCell.appendChild(addPiecesButton);
                optionCell.appendChild(deleteButton);
                tableRow.appendChild(idCell);
                tableRow.appendChild(nameCell);
                tableRow.appendChild(quantityCell);
                tableRow.appendChild(basePriceCell);
                tableRow.appendChild(optionCell);
            });
        })).catch((err) => {
            console.log(err);
        });
    }

    getItems();

    newForm.addEventListener("submit", (evt:Event) => {
        evt.preventDefault();
        evt.stopPropagation();
        error.innerText = "";
        const data: FormData = new FormData(newForm);
        let fInput = false;
        data.forEach(value => {
            if(value.toString().trim().length == 0) {
                fInput = true;
            }
        });
        if(fInput) {
            error.innerText = "Please fill in all fields. ";
        } else {
            axios.post("/item", {
                "name":data.get("name"),
                "quantity":data.get("quantity"),
                "basePrice":data.get("basePrice")
            }).then(() => {
                newForm.hidden = true;
                newForm.reset();
                getItems();
            }).catch((err) => {
                console.log(err);
            })
        }
    })

    newCancel.addEventListener("click", (evt: Event) => {
        evt.preventDefault();
        error.innerText = "";
        newForm.hidden = true;
        newForm.reset();
    })

    editForm.addEventListener("submit", (evt: Event) => {
        evt.preventDefault();
        evt.stopPropagation();
        error.innerText = ""
        const data: FormData = new FormData(editForm);
        let fInput = false;
        data.forEach(value => {
            if(value.toString().trim().length === 0) {
                fInput = true;
            }
        })
        if(fInput) {
            error.innerText = "Please fill in all fields. ";
        } else {
            axios.put(editId, {
                "name":data.get("name"),
                "quantity":data.get("quantity"),
                "basePrice":data.get("basePrice"),
            }).then(() => {
                editForm.hidden = true;
                editForm.reset();
                getItems();
            }).catch((err) => {
                console.log(err);
            })
        }
    })
});
