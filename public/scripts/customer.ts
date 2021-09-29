import axios, {AxiosResponse} from "axios";

document.addEventListener("DOMContentLoaded", () => {
   const newButton: HTMLButtonElement = document.getElementById("new-button") as HTMLButtonElement;
   const deleteError: HTMLElement = document.getElementById("delete-error");
   const customerTable: HTMLTableElement = document.getElementById("customers") as HTMLTableElement;
   const error: HTMLElement = document.getElementById("error");
   const newForm: HTMLFormElement = document.getElementById("new-form") as HTMLFormElement;
   const newCancel: HTMLButtonElement = document.getElementById("new-cancel") as HTMLButtonElement;
   const editSend: HTMLButtonElement = document.getElementById("edit-send") as HTMLButtonElement;
   const editCancel: HTMLButtonElement = document.getElementById("edit-cancel") as HTMLButtonElement;
   const editForm: HTMLFormElement = document.getElementById("edit-form") as HTMLFormElement;
   let editId: string = "";

   newButton.addEventListener("click", () => {
      deleteError.innerText = "";
      deleteError.innerText = "";
      error.innerText = "";
      editForm.hidden = true;
      newForm.hidden = false;
      newForm.reset();
   });

   function getCustomers() {
      while(customerTable.children.length > 2) {
         customerTable.removeChild(customerTable.children[2]);
      }

      axios.get("/customer").then((value => {
         value.data.forEach(customer => {
            const tableRow: HTMLElement = document.createElement("tr");
            tableRow.setAttribute("id", "/customer/" + customer.id)
            const idCell: HTMLElement = document.createElement("td");
            idCell.innerText = customer.id;
            const lastNameCell: HTMLElement = document.createElement("td");
            lastNameCell.innerText = customer.lastName;
            const firstNameCell: HTMLElement = document.createElement("td");
            firstNameCell.innerText = customer.firstName;
            const streetCell: HTMLElement = document.createElement("td");
            streetCell.innerText = customer.street;
            const houseNumberCell: HTMLElement = document.createElement("td");
            houseNumberCell.innerText = customer.houseNumber;
            const postalCodeCell: HTMLElement = document.createElement("td");
            postalCodeCell.innerText = customer.postalCode;
            const cityCell: HTMLElement = document.createElement("td");
            cityCell.innerText = customer.city;
            const emailCell: HTMLElement = document.createElement("td");
            emailCell.innerText = customer.emailAddress;
            const phoneCell: HTMLElement = document.createElement("td");
            phoneCell.innerText = customer.phoneNumber;
            const optionCell: HTMLElement = document.createElement("td");
            const editButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
            editButton.innerText = "Edit";
            editButton.addEventListener("click", () => {
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
            const deleteButton: HTMLButtonElement = document.createElement("button") as HTMLButtonElement;
            deleteButton.innerText = "Delete";
            deleteButton.addEventListener("click", () => {
               deleteError.innerText = "";
               error.innerText = "";
               newForm.hidden = true;
               editForm.hidden = true;
               axios.delete("/customer/" + customer.id).then(() => {
                  customerTable.removeChild(tableRow);
               }).catch((err) => {0
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
      })).catch((err) => {
         console.log(err);
      });
   }

   getCustomers();

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
         axios.post("/customer", {
            "lastName":data.get("lastName"),
            "firstName":data.get("firstName"),
            "street":data.get("street"),
            "houseNumber":data.get("houseNumber"),
            "postalCode":data.get("postalCode"),
            "city":data.get("city"),
            "emailAddress":data.get("emailAddress"),
            "phoneNumber":data.get("phoneNumber")
         }).then(() => {
            newForm.hidden = true;
            newForm.reset();
            getCustomers();
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
            "lastName":data.get("lastName"),
            "firstName":data.get("firstName"),
            "street":data.get("street"),
            "houseNumber":data.get("houseNumber"),
            "postalCode":data.get("postalCode"),
            "city":data.get("city"),
            "emailAddress":data.get("emailAddress"),
            "phoneNumber":data.get("phoneNumber")
         }).then(() => {
            editForm.hidden = true;
            editForm.reset();
            getCustomers();
         }).catch((err) => {
            console.log(err);
         })
      }
   })
});
