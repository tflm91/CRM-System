//import axios from "axios";

document.addEventListener("DOMContentLoaded", () => {
    const newButton: HTMLButtonElement = document.getElementById("new-button") as HTMLButtonElement;
    const deleteError: HTMLElement = document.getElementById("delete-error");
    const purchaseTable: HTMLTableElement = document.getElementById("purchases") as HTMLTableElement;
    const error: HTMLElement = document.getElementById("error");
    const newForm: HTMLFormElement = document.getElementById("new-form") as HTMLFormElement;
    const newCancel: HTMLButtonElement = document.getElementById("new-cancel") as HTMLButtonElement;
    const editSend: HTMLButtonElement = document.getElementById("edit-send") as HTMLButtonElement;
    const editCancel: HTMLButtonElement = document.getElementById("edit-cancel") as HTMLButtonElement;
    const editForm: HTMLFormElement = document.getElementById("edit-form") as HTMLFormElement;
    let editId: string = "";

    function setOptionContent(resource: string, value: any): string {
        switch (resource) {
            case "item": {
                return value.name;
            }
            case "customer": {
                return value.firstName + " " + value.lastName;
            }
        }
    }

    function initializeSelect(element: HTMLSelectElement, resource: string, defaultOption: number | null) {
        while(element.options.length > 0) {
            element.remove(0);
        }

        axios.get(resource).then(value => {
            value.data.forEach(it => {
                element.add(new Option(setOptionContent(resource, it), it.id, it.id === defaultOption, it.id === defaultOption));
            })
        })
     }

    newButton.addEventListener("click", () => {
        deleteError.innerText = "";
        deleteError.innerText = "";
        error.innerText = "";
        editForm.hidden = true;
        newForm.hidden = false;
        newForm.reset();
        initializeSelect(newForm.children[1].children[0].children[0] as HTMLSelectElement, "customer", undefined);
        initializeSelect(newForm.children[2].children[0].children[0] as HTMLSelectElement, "item", undefined);
    });

    function formatPrice(price: string): string {
        const dot: number = price.indexOf(".");
        if(dot == -1)
            return price + "." + "0".repeat(2);
        else {
            const digits = price.length - dot - 1;
            return price + "0".repeat(2 - digits);
        }
    }

    function getPurchases() {
        while(purchaseTable.children.length > 2) {
            purchaseTable.removeChild(purchaseTable.children[2]);
        }

        axios.get("/purchase").then((value => {
            value.data.forEach(purchase => {
                const tableRow: HTMLElement = document.createElement("tr");
                tableRow.setAttribute("id", "/purchase/" + purchase.id)
                const idCell: HTMLElement = document.createElement("td");
                idCell.innerText = purchase.id;
                const customerCell: HTMLElement = document.createElement("td");
                axios.get("/customer").then(value => {
                    const customer = value.data.find(it => it.id == purchase.customer);
                    customerCell.innerText = customer.firstName + " " + customer.lastName;
                }).catch(console.log);
                const itemCell: HTMLElement = document.createElement("td");
                axios.get("/item").then((value) => {
                    const item = value.data.find((it) => it.id == purchase.item);
                    itemCell.innerText = item.name;
                }).catch(console.log);
                const quantityCell: HTMLElement = document.createElement("td");
                quantityCell.innerText = purchase.quantity;
                const dateCell: HTMLElement = document.createElement("td");
                const date = new Date(purchase.date).toISOString().slice(0, 10);
                dateCell.innerText = date;
                const priceCell: HTMLElement = document.createElement("td");
                priceCell.innerText = formatPrice(purchase.price.toString());
                const optionCell: HTMLElement = document.createElement("td");
                const editButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                editButton.innerText = "Edit";
                editButton.addEventListener("click", () => {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = false;
                    editForm.reset();
                    editId = "/purchase/" + purchase.id;
                    editForm.children[1].innerHTML = "ID: " + purchase.id;
                    initializeSelect(editForm.children[2].children[0].children[0] as HTMLSelectElement, "customer", purchase.customer);
                    initializeSelect(editForm.children[3].children[0].children[0] as HTMLSelectElement, "item", purchase.item);
                    editForm.children[4].children[0].children[0].setAttribute("value", purchase.quantity);
                    editForm.children[5].children[0].children[0].setAttribute("value", date);
                });
                const deleteButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
                deleteButton.innerText = "Delete";
                deleteButton.addEventListener("click", () => {
                    deleteError.innerText = "";
                    error.innerText = "";
                    newForm.hidden = true;
                    editForm.hidden = true;
                    axios.delete("/purchase/" + purchase.id).then(() => {
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
            if(new Date(data.get("date").toString()) > new Date()) {
                error.innerText = "Date is in future. ";
            } else {
                axios.post("/purchase", {
                    "customer": data.get("customer"),
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "date": data.get("date")
                }).then(() => {
                    newForm.hidden = true;
                    newForm.reset();
                    getPurchases();
                }).catch(() => {
                    error.innerText = "There are not enough pieces in stock. ";
                })
            }
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
            if(new Date(data.get("date").toString()) > new Date()) {
                error.innerText = "Date is in future. ";
            } else {
                axios.put(editId, {
                    "customer":data.get("customer"),
                    "item": data.get("item"),
                    "quantity": data.get("quantity"),
                    "date": data.get("date")
                }).then(() => {
                    editForm.hidden = true;
                    editForm.reset();
                    getPurchases();
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
