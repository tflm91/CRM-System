//import axios, {AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const newButton: HTMLButtonElement = document.getElementById("new-button") as HTMLButtonElement;
    const deleteError: HTMLElement = document.getElementById("delete-error");
    const specialOfferTable: HTMLTableElement = document.getElementById("special-offers") as HTMLTableElement;
    const error: HTMLElement = document.getElementById("error");
    const newForm: HTMLFormElement = document.getElementById("new-form") as HTMLFormElement;
    const newCancel: HTMLButtonElement = document.getElementById("new-cancel") as HTMLButtonElement;
    const editSend: HTMLButtonElement = document.getElementById("edit-send") as HTMLButtonElement;
    const editCancel: HTMLButtonElement = document.getElementById("edit-cancel") as HTMLButtonElement;
    const editForm: HTMLFormElement = document.getElementById("edit-form") as HTMLFormElement;
    let editId: string = "";

    function initializeSelect(element: HTMLSelectElement, defaultOption: number | null) {
        while(element.children.length > 0) {
            element.removeChild(element.children[0]);
        }
        axios.get("/item").then(value => {
            if(defaultOption !== undefined) {
                const defaultItem = value.data.find(it => it.id === defaultOption)
                const option: HTMLOptionElement = document.createElement("option");
                option.setAttribute("value", defaultItem.id);
                option.innerText = defaultItem.name;
                element.appendChild(option);
                value.data = value.data.filter(it => it.id !== defaultOption);
            }
            value.data.forEach(item => {
                const option: HTMLOptionElement = document.createElement("option");
                option.setAttribute("value", item.id);
                option.innerText = item.name;
                element.appendChild(option);
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    newButton.addEventListener("click", () => {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
        initializeSelect(newForm.children[1].children[0].children[0] as HTMLSelectElement, undefined);
    });

    function getSpecialOffers() {
        while(specialOfferTable.children.length > 2) {
            specialOfferTable.removeChild(specialOfferTable.children[2]);
        }

        axios.get("/special-offer").then((value => {
            value.data.forEach(specialOffer => {
                const tableRow: HTMLElement = document.createElement("tr");
                tableRow.setAttribute("id", "/special-offer/" + specialOffer.id)
                const idCell: HTMLElement = document.createElement("td");
                idCell.innerText = specialOffer.id;
                const itemCell: HTMLElement = document.createElement("td");
                axios.get("/item/").then((value) => {
                    const item = value.data.find((it) => it.id == specialOffer.item);
                    itemCell.innerText = item.name;
                }).catch((err) => {
                    console.log(err);
                })
                const quantityCell: HTMLElement = document.createElement("td");
                quantityCell.innerText = specialOffer.quantity;
                const priceCell: HTMLElement = document.createElement("td");
                priceCell.innerText = specialOffer.price;
                const beginCell: HTMLElement = document.createElement("td");
                const begin = new Date(specialOffer.begin).toISOString().slice(0, 10);
                beginCell.innerText = begin;
                const expirationCell: HTMLElement = document.createElement("td");
                const expiration = new Date(specialOffer.expiration).toISOString().slice(0, 10);
                expirationCell.innerText = expiration;
                const optionCell: HTMLElement = document.createElement("td");
                const editButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                editButton.innerText = "Edit";
                editButton.addEventListener("click", () => {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/special-offer/" + specialOffer.id;
                    editForm.children[1].innerHTML = "ID: " + specialOffer.id;
                    initializeSelect(editForm.children[2].children[0].children[0] as HTMLSelectElement, specialOffer.item);
                    editForm.children[3].children[0].children[0].setAttribute("value", specialOffer.quantity);
                    editForm.children[4].children[0].children[0].setAttribute("value", specialOffer.price);
                    editForm.children[5].children[0].children[0].setAttribute("value", begin);
                    editForm.children[6].children[0].children[0].setAttribute("value", expiration);
                });
                const deleteButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", () => {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/special-offer/" + specialOffer.id).then(() => {
                        getSpecialOffers();
                    }).catch(() => {
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
        })).catch((err) => {
            console.log(err);
        });
    }

    getSpecialOffers();

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
            if(data.get("expiration") < data.get("begin")) {
                error.innerText = "Special offer expires before it begins. "
            }
            console.log(data.get("begin"));
            console.log(data.get("expiration"));
            axios.post("/special-offer", {
                "item":data.get("item"),
                "quantity":data.get("quantity"),
                "price":data.get("price"),
                "begin":data.get("begin"),
                "expiration":data.get("expiration")
            }).then(() => {
                newForm.hidden = true;
                newForm.reset();
                getSpecialOffers();
            }).catch(() => {
                error.innerText = "Special offer is too expensive."
            })
        }
    })

    newCancel.addEventListener("click", (evt: Event) => {
        evt.preventDefault();
        evt.stopPropagation();
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
            if(data.get("expiration") < data.get("begin")) {
                error.innerText = "Special offer expires before it begins. ";
            } else {
                axios.put(editId, {
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "price": data.get("price"),
                    "begin": data.get("begin"),
                    "expiration": data.get("expiration")
                }).then(() => {
                    editForm.hidden = true;
                    editForm.reset();
                    getSpecialOffers();
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    })

    editCancel.addEventListener("click", evt => {
        evt.preventDefault();
        error.innerText = "";
        editForm.hidden = true;
        editForm.reset();
    })
});
