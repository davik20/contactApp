// Model
const ContactModel = (function () {

    let allContacts = [];


    // Helper Functions
    const addContact = ({name, phone, type}) => {
        const exists = allContacts.findIndex(contact => contact.name === contact.name && contact.phone === contact.phpne)
        if (allContacts.length == 0) {
            allContacts.push({id: 1, name: name, phone: phone, type: type})
            console.log(allContacts)
            return
        }

        const id = allContacts[allContacts.length - 1].id + 1
        allContacts.push({id: id, name: name, phone: phone, type: type})
        console.log(allContacts)
        return


    }

    const getContact = (id) => {
        return allContacts.find(contact => contact.id == id)
    }

    const updateContact = ({id, name, phone, type}) => {

        console.log(id)

        let index = allContacts.findIndex(contact =>contact.id == id )
        console.log(index)
        allContacts[index].name = name
        allContacts[index].phone = phone
        allContacts[index].type = type
        console.log(allContacts[index]);

        return allContacts


    }

    const deleteContact = (id) => {
            allContacts = allContacts.filter(contact =>contact.id != id)
            console.log(allContacts)
            return allContacts
    }

    return({addContact, getContact, allContacts, updateContact, deleteContact})


})


// UI CONTROLLER
const UIController = (function () { // getting all query selectors from the dom//
    const interface = {
        addContactSubmit: document.querySelector('#addContactSubmit'),
        addContactForm: document.querySelector('#addContactForm'),
        addContactModalShow: document.querySelector('#addContactModalShow'),
        addContactModalCancel: document.querySelector('#addContactModalCancel'),
        addContactModal: document.querySelector('.addContactModal'),
        addContactModalContainer: document.querySelector('#addContactModalContainer'),
        allContactsView: document.querySelector('#allContacts'),
        alert: document.querySelector('.alert'),
        editContact: document.querySelector('#editContact'),
        body: document.querySelector('body')

    }

    const renderContacts = (Contacts) => {

        let str;

        Contacts.forEach((contact) => {

             str +=  `<div class="contact">
            <i data-id="${contact.id}" id="deleteContact" class="fa fa-trash delete ">

            </i>
                <div class="contact__name">
                <div>
                    <i class="fa fa-user "></i>
                    <p>${
                contact.name
            }</p>
            </div>
                </div>

                <div class="contact__name">
                 <div>
                    <i class="fa fa-phone-square "></i>
                    <p >${
                contact.phone
            }</p>
            </div>
                </div>
                <div style="text-align: center; margin-top: 4rem">
                    <button data-id="${
                contact.id
            }" id="editContact">
                        Edit Contact
                    </button>
                </div>
                
        </div>  `;


            
        })
        if(str === undefined) {
            interface.allContactsView.innerHTML =  `   <div class="contact">
                   
            <p style="text-align: center;">You have no Contacts</p>
            


        </div>`
            return

        }else {
            str =  str.replace(/undefined/g, '');
           // console.log(str)
            interface.allContactsView.innerHTML =  str
        }

     

       


    }

    const renderEditModal = (contact) => {

        interface.addContactModalContainer.innerHTML = `<div id="editContactModal" class="addContactModal show">
        <form id="editContactForm">
            <div class="addContactModal__content">
                <div  class="alert"></div>
                <i id="editContactModalCancel">&Cross;</i>
                <h3>EDIT Contact</h3>
                <input value="${
            contact.name
        }" id="name" class="addContactModal__name" name="name" type="text" placeholder="Name"/>
                <input value="${
            contact.phone
        }" id="phone" class="addContactModal__email" name="phone" type="text" placeholder="Phone Number"/>
                <select id="type" name="type">
                    <option selected="${
            contact.type
        }" value="personal">
                        PERSONAL
                    </option>
                    <option value="professional">
                        PROFESSIONAL
                    </option>
                </select>
                <button data-id="${
            contact.id
        }" type="submit" id="updateContactSubmit">
                    UPDATE CONTACT
                </button>
            </div>

        </form>
    </div>`

    }

    const renderAlert = (message) => {
        document.querySelector('.alert').innerHTML = `<div style='color: red; text-align: center; margin-bottom: 1rem; font-size: 1.5rem;'> ${message} </div>`
        console.log(message)

    }


    return({interface, renderContacts: renderContacts, renderAlert, renderEditModal})


})


// CENTRAL CONTROLLER
const CentralController = (function (CTModel, UICTRL) { // Getting the UI functions  and destructuring
    const {
        addContactModalShow,
        addContactModalCancel,
        addContactModal,
        addContactForm,
        addContactSubmit,
        allContactsView,
        editContact,
        body

    } = UICTRL().interface;
    const {renderContacts, renderAlert, renderEditModal} = UICTRL();

    // Getting Model functions and destructuring

    const {addContact, getContact, allContacts, updateContact, deleteContact} = CTModel()

    // ------ State -----------//

    const state = {
        message: null
    }


    // endOf State -----------//





    // ----- helper functions------//
    const checkErrors = ({name, phone}) => {
        if (name == "" || phone == "") {
            return {message: 'All Fields are required'}

        } else {
            return {message: null}
        }
    }
    const submit = function (e) {
        e.preventDefault()

        const name = addContactForm.name.value;
        const phone = addContactForm.phone.value;
        const type = addContactForm.type.value;

        // hide modal

        // Check for errors
        const {message} = checkErrors({name, phone})
        if (message) {
            state.message = message
            console.log(state.message)
            renderAlert(state.message)
            return;
        } else {
            state.message = null
            addContactModal.className = 'addContactModal'
            addContact({name, phone, type})

            // Render Contact
            renderContacts(allContacts)
            return {name, phone, type};
        }
        // Add contact to the model

        // delete 

       


    }
    const deleteContactController = function (e) {
        let id;
        
        if(e.target.id =='deleteContact') {
            
                id = e.target.dataset.id
               
        }

        let newAllContacts= deleteContact(id)
        
        renderContacts(newAllContacts)
        console.log(newAllContacts)
    }

    const updateContactController = function(e) {
        let form;
        if (e.target.id == "updateContactSubmit") {
            let id = e.target.dataset.id
            console.log(id)
            e.preventDefault()
            form = document.querySelector('#editContactForm')

            contact = {
                id: id,
                name: form.name.value,
                phone: form.phone.value,
                type: form.type.value
            }
            const {name, phone} = contact

            // error handling
            const {message} = checkErrors({name, phone})
            if (message) {
                state.message = message
                console.log(state.message)
                renderAlert(state.message)
                return;
            } else {
                state.message = null
                // Clear modal

                document.querySelector('#editContactModal').className = 'addContactModal';

                let newAllContacts = updateContact(contact)
                // rerender page
                renderContacts(newAllContacts)
                return
            }




            return false;
        }
    }
    
    // endOf ----- helper functions------//





    // ------ ------- all about adding contacts -----------------//
    addContactModalShow.addEventListener('click', function (e) { // 1: show the modal
        addContactModal.classList += ' show'


        // 2: Get the details from the modal  and add to model and render

        addContactSubmit.addEventListener('click', submit)


        // on cancelling modal
        body.addEventListener('click', (e) => {
            if (e.target.id == 'addContactModalCancel') {

                addContactModal.className = 'addContactModal'

                console.log(e.target)
            }
        })


        // Rendering errors
        if (state.message != null) {}

        return false

    })
    // ------- ----endOf all about adding contacts -----------------//



    //-------------------- all about editing contacts--------------------------- //

    allContactsView.addEventListener('click', (e) => {
        let id = null
        // get id
        if (e.target.id == "editContact") {
            id = e.target.dataset.id

             // 1 Get contact
        contact = getContact(id)


        // 2 show edit contact modal //
        renderEditModal(contact)

        }
       
     

        // 3 on Updating the contact
        body.addEventListener('click', updateContactController)
       
      
         
                   // on Cancelling edit Modal
                   body.addEventListener('click', (e) => {
                    if (e.target.id == 'editContactModalCancel') {
                        document.querySelector('#editContactModal').className = 'addContactModal';
        
                        console.log(e.target)
                    }
                })

        //-------------------- endOf all about editing contacts--------------------------- //


        // ----------------------------on Deleting Contacts  ----------------------------//
                document.querySelector('body').addEventListener('click', deleteContactController)

    })


})(ContactModel, UIController)
