// In public/js/job-details.js

import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!jobId) {
        document.getElementById('job-details-container').innerHTML = '<p class="text-red-500">No job ID specified.</p>';
        return;
    }

    // Get references to all HTML elements
    const customerNameHeader = document.getElementById('customer-name-header');
    const pickupAddress = document.getElementById('pickup-address');
    const pickupDateEl = document.getElementById('pickup-date');
    const deliveryAddress = document.getElementById('delivery-address');
    const deliveryDateEl = document.getElementById('delivery-date');
    const cargoDetails = document.getElementById('cargo-details');
    const customerContact = document.getElementById('customer-contact');
    
    // New references for driver and vehicle fields
    const driverNameInput = document.getElementById('driver-name');
    const vehicleRegInput = document.getElementById('vehicle-reg');
    const jobStatusSelect = document.getElementById('job-status');
    const updateJobBtn = document.getElementById('update-job-btn');

    // Reference to the specific job document in Firestore
    const jobDocRef = doc(db, "jobs", jobId);

    // --- THIS IS THE SECTION TO REPLACE ---
    // Fetch the document data to populate the page
    getDoc(jobDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const job = docSnap.data();
            
            // FIX: Populate using the correct data structure (e.g., job.customer.name)
            customerNameHeader.textContent = job.customer.name || 'N/A';
            pickupAddress.textContent = `${job.pickup.addressLine1 || ''}, ${job.pickup.cityTown || ''}`;
            pickupDateEl.textContent = job.pickup.date ? new Date(job.pickup.date).toLocaleDateString() : 'N/A';
            deliveryAddress.textContent = `${job.delivery.addressLine1 || ''}, ${job.delivery.cityTown || ''}`;
            deliveryDateEl.textContent = job.delivery.date ? new Date(job.delivery.date).toLocaleDateString() : 'N/A';
            cargoDetails.textContent = job.customer.cargoDetails || 'N/A';
            customerContact.textContent = job.customer.contact || 'N/A';
            
            // FIX: Populate the assignment and status fields from the 'assignment' object
            driverNameInput.value = job.assignment.driverName || '';
            vehicleRegInput.value = job.assignment.vehicleReg || '';
            jobStatusSelect.value = job.status;

        } else {
            document.getElementById('job-details-container').innerHTML = '<p class="text-red-500">Job not found.</p>';
        }
    });

    // --- AND REPLACE THIS SECTION TOO ---
    // Add click listener for the "Save Changes" button
    updateJobBtn.addEventListener('click', async () => {
        // FIX: Update the fields inside the 'assignment' object in Firestore
        const updates = {
            'assignment.driverName': driverNameInput.value,
            'assignment.vehicleReg': vehicleRegInput.value,
            'status': jobStatusSelect.value
        };

        try {
            await updateDoc(jobDocRef, updates);
            alert('Job details updated successfully!');
        } catch (error) {
            console.error("Error updating job: ", error);
            alert('Failed to update job. Check console for details.');
        }
    });
});