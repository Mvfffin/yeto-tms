// Import the database instance and Firestore functions
import { db } from './firebase-config.js';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- FIX ---
// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get a reference to the table body
    const jobsTableBody = document.getElementById('jobs-table-body');

    // If the table body isn't found, stop and log an error
    if (!jobsTableBody) {
        console.error("Error: Could not find the element with ID 'jobs-table-body'.");
        return;
    }

    // Create a query to get all documents from the "jobs" collection
    const q = query(collection(db, "jobs"));

    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Clear the existing table content
        jobsTableBody.innerHTML = '';

        if (querySnapshot.empty) {
            jobsTableBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No jobs found.</td></tr>';
            return;
        }

        // Loop through each document in the snapshot
        querySnapshot.forEach((doc) => {
            const job = doc.data();
            const row = document.createElement('tr');
            
            const pickupDate = job.pickupDate ? job.pickupDate.toDate().toLocaleDateString() : 'N/A';
            const deliveryDate = job.deliveryDate ? job.deliveryDate.toDate().toLocaleDateString() : 'N/A';

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${job.customerInfo.name || 'N/A'}</div>
                    <div class="text-sm text-gray-500">${job.customerInfo.contactNumber || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${job.pickupLocation.address}<br>
                    <span class="font-semibold">${pickupDate}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${job.deliveryLocation.address}<br>
                    <span class="font-semibold">${deliveryDate}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${job.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="/job-details.html?id=${doc.id}" class="text-indigo-600 hover:text-indigo-900">Details</a>
                </td>
            `;
            jobsTableBody.appendChild(row);
        });
    });
});
