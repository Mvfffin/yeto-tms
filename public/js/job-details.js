// Import the database instance and Firestore functions
import { db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- FIX ---
// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get the job ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!jobId) {
        document.getElementById('job-details-container').innerHTML = '<p class="text-red-500">No job ID specified.</p>';
        return; // Stop the script if no ID
    }

    // Get references to all the HTML elements
    const customerNameHeader = document.getElementById('customer-name-header');
    const pickupAddress = document.getElementById('pickup-address');
    const pickupDateEl = document.getElementById('pickup-date');
    const deliveryAddress = document.getElementById('delivery-address');
    const deliveryDateEl = document.getElementById('delivery-date');
    const cargoDetails = document.getElementById('cargo-details');
    const customerContact = document.getElementById('customer-contact');
    const jobStatusSelect = document.getElementById('job-status');
    const updateStatusBtn = document.getElementById('update-status-btn');

    // Create a reference to the specific job document in Firestore
    const jobDocRef = doc(db, "jobs", jobId);

    // Fetch the document data to populate the page
    getDoc(jobDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const job = docSnap.data();
            customerNameHeader.textContent = job.customerInfo.name || 'N/A';
            pickupAddress.textContent = job.pickupLocation.address || 'N/A';
            pickupDateEl.textContent = job.pickupDate ? job.pickupDate.toDate().toLocaleDateString() : 'N/A';
            deliveryAddress.textContent = job.deliveryLocation.address || 'N/A';
            deliveryDateEl.textContent = job.deliveryDate ? job.deliveryDate.toDate().toLocaleDateString() : 'N/A';
            cargoDetails.textContent = job.cargoDetails || 'N/A';
            customerContact.textContent = job.customerInfo.contactNumber || 'N/A';
            jobStatusSelect.value = job.status;
        } else {
            document.getElementById('job-details-container').innerHTML = '<p class="text-red-500">Job not found.</p>';
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });

    // Add the click listener for the update button
    updateStatusBtn.addEventListener('click', async () => {
        const newStatus = jobStatusSelect.value;
        try {
            // Update the 'status' field in the Firestore document
            await updateDoc(jobDocRef, {
                status: newStatus
            });
            alert(`Job status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Error updating status: ", error);
            alert('Failed to update status. Check console for details.');
        }
    });
});
