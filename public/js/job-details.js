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

    // Fetch the document data to populate the page
    getDoc(jobDocRef).then((docSnap) => {
        if (docSnap.exists()) {
            const job = docSnap.data();
            
            // Populate customer and job info
            customerNameHeader.textContent = job.customerInfo.name || 'N/A';
            pickupAddress.textContent = job.pickupLocation.address || 'N/A';
            pickupDateEl.textContent = job.pickupDate ? job.pickupDate.toDate().toLocaleDateString() : 'N/A';
            deliveryAddress.textContent = job.deliveryLocation.address || 'N/A';
            deliveryDateEl.textContent = job.deliveryDate ? job.deliveryDate.toDate().toLocaleDateString() : 'N/A';
            cargoDetails.textContent = job.cargoDetails || 'N/A';
            customerContact.textContent = job.customerInfo.contactNumber || 'N/A';
            
            // Populate the assignment and status fields
            driverNameInput.value = job.driverName || ''; // Use job.driverName
            vehicleRegInput.value = job.vehicleReg || ''; // Use job.vehicleReg
            jobStatusSelect.value = job.status;

        } else {
            document.getElementById('job-details-container').innerHTML = '<p class="text-red-500">Job not found.</p>';
        }
    });

    // Add click listener for the "Save Changes" button
    updateJobBtn.addEventListener('click', async () => {
        const updates = {
            driverName: driverNameInput.value,
            vehicleReg: vehicleRegInput.value,
            status: jobStatusSelect.value
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
