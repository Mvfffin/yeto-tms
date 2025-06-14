import { db } from './firebase-config.js'; // Assuming firebase-config.js exports 'db'
import { collection, query, where, getDocs, addDoc, Timestamp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    const customerNameInput = document.getElementById('customer-name');
    const selectedCustomerIdInput = document.getElementById('selected-customer-id');
    const autocompleteResultsDiv = document.getElementById('autocomplete-results');
    const createJobForm = document.getElementById('create-job-form');

    // --- Autocomplete for Customer Name ---
    let customerTimeout;
    customerNameInput.addEventListener('input', () => {
        clearTimeout(customerTimeout);
        const searchTerm = customerNameInput.value.trim();

        if (searchTerm.length < 2) { // Start search after 2 characters
            autocompleteResultsDiv.innerHTML = '';
            autocompleteResultsDiv.classList.add('hidden');
            selectedCustomerIdInput.value = ''; // Clear selected ID if search term is too short
            return;
        }

        customerTimeout = setTimeout(async () => {
            try {
                // This is a mock example. In a real app, you'd query your 'customers' collection.
                // Replace with actual Firebase Firestore query if fetching from DB.
                const mockCustomers = [
                    { id: 'cust001', name: 'Alpha Logistics' },
                    { id: 'cust002', name: 'Beta Shipping Co.' },
                    { id: 'cust003', name: 'Gamma Transport' },
                    { id: 'cust004', name: 'Delta Deliveries' },
                    { id: 'cust005', name: 'Evergreen Freight' },
                ];

                const filteredCustomers = mockCustomers.filter(customer =>
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                // If fetching from Firestore, uncomment and modify this block:
                /*
                const customersRef = collection(db, "customers");
                const q = query(customersRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + '\uf8ff'));
                const querySnapshot = await getDocs(q);
                const filteredCustomers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                */

                displayAutocompleteResults(filteredCustomers);

            } catch (error) {
                console.error("Error fetching customers for autocomplete:", error);
                autocompleteResultsDiv.innerHTML = '<div class="px-4 py-2 text-red-500">Error loading customers.</div>';
                autocompleteResultsDiv.classList.remove('hidden');
            }
        }, 300); // Debounce time
    });

    function displayAutocompleteResults(results) {
        autocompleteResultsDiv.innerHTML = '';
        if (results.length === 0) {
            autocompleteResultsDiv.classList.add('hidden');
            return;
        }

        results.forEach(customer => {
            const item = document.createElement('div');
            item.classList.add('autocomplete-item', 'px-4', 'py-3', 'text-sm', 'border-b', 'border-gray-100', 'last:border-b-0'); // Add Tailwind classes for styling
            item.textContent = customer.name;
            item.dataset.customerId = customer.id;
            item.dataset.customerName = customer.name; // Store name for display

            item.addEventListener('click', () => {
                customerNameInput.value = customer.name;
                selectedCustomerIdInput.value = customer.id;
                autocompleteResultsDiv.classList.add('hidden');
            });
            autocompleteResultsDiv.appendChild(item);
        });
        autocompleteResultsDiv.classList.remove('hidden');
    }

    // Hide autocomplete results when clicking outside
    document.addEventListener('click', (event) => {
        if (!autocompleteResultsDiv.contains(event.target) && event.target !== customerNameInput) {
            autocompleteResultsDiv.classList.add('hidden');
        }
    });

    // --- Form Submission Handler ---
    createJobForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Gather all form data
        const jobData = {
            // Pickup Details
            pickup: {
                companyName: document.getElementById('company-name').value,
                addressLine1: document.getElementById('address-line-1').value,
                addressLine2: document.getElementById('address-line-2').value,
                cityTown: document.getElementById('City/Town').value, // Note: HTML ID is 'City/Town'
                postcode: document.getElementById('postcode').value,
                date: document.getElementById('pickup-date').value,
                time: `${document.getElementById('pickup-hour').value}:${document.getElementById('pickup-minute').value}`,
            },
            // Delivery Details - Now using unique IDs as per your update!
            delivery: {
                companyName: document.getElementById('delivery-company-name').value,
                addressLine1: document.getElementById('delivery-address-line-1').value,
                addressLine2: document.getElementById('delivery-address-line-2').value,
                cityTown: document.getElementById('delivery-city-town').value,
                postcode: document.getElementById('delivery-postcode').value,
                date: document.getElementById('delivery-date').value,
                time: `${document.getElementById('delivery-hour').value}:${document.getElementById('delivery-minute').value}`,
            },
            // Customer Details
            customer: {
                id: selectedCustomerIdInput.value,
                name: customerNameInput.value,
                contact: document.getElementById('customer-contact').value,
                cargoDetails: document.getElementById('cargo-details').value,
            },
            // Assignment & Pricing
            assignment: {
                driverName: document.getElementById('driver-name').value,
                vehicleReg: document.getElementById('vehicle-reg').value,
                jobPrice: parseFloat(document.getElementById('job-price').value) || 0,
                driverCost: parseFloat(document.getElementById('driver-cost').value) || 0,
            },
            createdAt: Timestamp.now(), // Firebase Timestamp
            status: 'Pending', // Initial status
        };

        // Calculate profit at submission time as well
        jobData.assignment.profit = jobData.assignment.jobPrice - jobData.assignment.driverCost;

        console.log("Job Data to be submitted:", jobData);

        // Firebase Firestore Submission
        try {
            const docRef = await addDoc(collection(db, "jobs"), jobData);
            console.log("Document written with ID: ", docRef.id);
            alert('Job created successfully!');
            createJobForm.reset(); // Clear the form
            // Reset time pickers to default
            document.getElementById('pickup-hour').value = '09';
            document.getElementById('pickup-minute').value = '00';
            document.getElementById('delivery-hour').value = '17';
            document.getElementById('delivery-minute').value = '00';
            document.getElementById('profit-display').textContent = '£0.00';
            document.getElementById('profit-display').className = 'text-lg font-bold text-green-600 mt-1';
            // Go back to the first tab
            document.querySelector('.tab-button[data-tab="pickup"]').click();

        } catch (e) {
            console.error("Error adding document: ", e);
            alert('Error creating job. Please try again.');
        }
    });
});