import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('create-job-form');
    const customerNameInput = document.getElementById('customer-name');
    const customerContactInput = document.getElementById('customer-contact');
    const selectedCustomerIdInput = document.getElementById('selected-customer-id');
    const autocompleteResults = document.getElementById('autocomplete-results');
    
    // Autocomplete Logic (no changes here)
    customerNameInput.addEventListener('keyup', async (e) => {
        const searchTerm = customerNameInput.value.trim();
        if (searchTerm === '') {
            autocompleteResults.innerHTML = '';
            autocompleteResults.classList.add('hidden');
            selectedCustomerIdInput.value = '';
            return;
        }
        const customersRef = collection(db, "customers");
        const q = query(customersRef, 
            where("companyName", ">=", searchTerm),
            where("companyName", "<=", searchTerm + '\uf8ff')
        );
        const querySnapshot = await getDocs(q);
        autocompleteResults.innerHTML = '';
        if (querySnapshot.empty) {
            autocompleteResults.classList.add('hidden');
        } else {
            autocompleteResults.classList.remove('hidden');
            querySnapshot.forEach((doc) => {
                const customer = doc.data();
                const resultItem = document.createElement('div');
                resultItem.classList.add('p-2', 'hover:bg-gray-100', 'cursor-pointer');
                resultItem.textContent = customer.companyName;
                resultItem.addEventListener('click', () => {
                    customerNameInput.value = customer.companyName;
                    customerContactInput.value = customer.phoneNumber;
                    selectedCustomerIdInput.value = doc.id;
                    autocompleteResults.classList.add('hidden');
                });
                autocompleteResults.appendChild(resultItem);
            });
        }
    });

    // Form Submission Logic (Updated)
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!confirm('Are you sure you want to create this job?')) {
            return;
        }

        // --- FIX FOR DATES ---
        // Get the date values from the form
        const pickupDateValue = document.getElementById('pickup-date').value;
        const deliveryDateValue = document.getElementById('delivery-date').value;

        const jobPrice = parseFloat(document.getElementById('job-price').value) || 0;
        const driverCost = parseFloat(document.getElementById('driver-cost').value) || 0;

        const newJob = {
            pickupLocation: {
                address: document.getElementById('pickup-address').value,
            },
            deliveryLocation: {
                address: document.getElementById('delivery-address').value,
            },
            // Only create a Date object if a date was actually entered
            pickupDate: pickupDateValue ? new Date(pickupDateValue) : null,
            deliveryDate: deliveryDateValue ? new Date(deliveryDateValue) : null,
            cargoDetails: document.getElementById('cargo-details').value,
            customerInfo: {
                name: customerNameInput.value,
                contactNumber: customerContactInput.value,
                customerId: selectedCustomerIdInput.value || null 
            },
            driverName: document.getElementById('driver-name').value,
            vehicleReg: document.getElementById('vehicle-reg').value,
            jobPrice: jobPrice,
            driverCost: driverCost,
            status: 'Pending',
            createdAt: serverTimestamp()
        };

        try {
            const docRef = await addDoc(collection(db, "jobs"), newJob);
            console.log("Document written with ID: ", docRef.id);
            alert('Job created successfully!');
            form.reset();
            selectedCustomerIdInput.value = '';
        } catch (e) {
            console.error("Error adding document: ", e);
            alert('Error creating job. Please check the console for details.');
        }
    });
});
