import { db } from './firebase-config.js';
import { collection, addDoc, onSnapshot, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- FORM LOGIC: For adding new customers ---
    const addCustomerForm = document.getElementById('add-customer-form');
    addCustomerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent page reload

        const newCustomer = {
            companyName: document.getElementById('company-name').value,
            contactPerson: document.getElementById('contact-person').value,
            phoneNumber: document.getElementById('phone-number').value,
            email: document.getElementById('email-address').value,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(collection(db, "customers"), newCustomer);
            alert('Customer added successfully!');
            addCustomerForm.reset();
        } catch (error) {
            console.error("Error adding customer: ", error);
            alert('Failed to add customer. Check console for details.');
        }
    });


    // --- TABLE LOGIC: For displaying the customer list ---
    const customersTableBody = document.getElementById('customers-table-body');
    const q = query(collection(db, "customers"));

    onSnapshot(q, (querySnapshot) => {
        customersTableBody.innerHTML = ''; // Clear existing table rows

        if (querySnapshot.empty) {
            customersTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500">No customers found. Add one using the form.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const customer = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${customer.companyName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.contactPerson}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.email}</td>
            `;
            customersTableBody.appendChild(row);
        });
    });

});
