import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('create-job-form');
    const customerNameInput = document.getElementById('customer-name');
    const customerContactInput = document.getElementById('customer-contact');
    const selectedCustomerIdInput = document.getElementById('selected-customer-id');
    const autocompleteResults = document.getElementById('autocomplete-results');
    
    // --- Autocomplete Logic ---
    customerNameInput.addEventListener('keyup', async (e) => {
        const searchTerm = customerNameInput.value.trim();

        // Clear results if the search term is empty
        if (searchTerm === '') {
            autocompleteResults.innerHTML = '';
            autocompleteResults.classList.add('hidden');
            selectedCustomerIdInput.value = ''; // Clear selected ID
            return;
        }

        // Query Firestore for customers whose companyName starts with the search term
        const customersRef = collection(db, "customers");
        const q = query(customersRef, 
            where("companyName", ">=", searchTerm),
            where("companyName", "<=", searchTerm + '\uf8ff') // '\uf8ff' is a magic character that helps with "starts with" queries
        );

        const querySnapshot = await getDocs(q);
        
        autocompleteResults.innerHTML = ''; // Clear previous results
        if (querySnapshot.empty) {
            autocompleteResults.classList.add('hidden');
        } else {
            autocompleteResults.classList.remove('hidden');
            querySnapshot.forEach((doc) => {
                const customer = doc.data();
                const resultItem = document.createElement('div');
                resultItem.classList.add('p-2', 'hover:bg-gray-100', 'cursor-pointer');
                resultItem.textContent = customer.companyName;
                
                // Add click listener to each result item
                resultItem.addEventListener('click', () => {
                    customerNameInput.value = customer.companyName; // Set the input value
                    customerContactInput.value = customer.phoneNumber; // Auto-fill the contact number
                    selectedCustomerIdInput.value = doc.id; // Store the customer's ID
                    autocompleteResults.classList.add('hidden'); // Hide the results box
                });

                autocompleteResults.appendChild(resultItem);
            });
        }
    });

    // --- Form Submission Logic (Updated) ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!confirm('Are you sure you want to create this job?')) {
            return;
        }

        const newJob = {
            pickupLocation: {
                address: document.getElementById('pickup-address').value,
            },
            deliveryLocation: {
                address: document.getElementById('delivery-address').value,
            },
            pickupDate: new Date(document.getElementById('pickup-date').value),
            deliveryDate: new Date(document.getElementById('delivery-date').value),
            cargoDetails: document.getElementById('cargo-details').value,
            customerInfo: {
                name: customerNameInput.value,
                contactNumber: customerContactInput.value,
                // Now we store the customer's database ID with the job
                customerId: selectedCustomerIdInput.value || null 
            },
            assignedDriverId: document.getElementById('assign-driver').value,
            assignedVehicleId: document.getElementById('assign-vehicle').value,
            status: 'Pending',
            createdAt: serverTimestamp()
        };

        try {
            const docRef = await addDoc(collection(db, "jobs"), newJob);
            console.log("Document written with ID: ", docRef.id);
            alert('Job created successfully!');
            form.reset();
        } catch (e) {
            console.error("Error adding document: ", e);
            alert('Error creating job. Please check the console for details.');
        }
    });
});
