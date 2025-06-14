import { db } from './firebase-config.js';
import { collection, onSnapshot, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const jobsTableBody = document.getElementById('jobs-table-body');
    if (!jobsTableBody) {
        console.error("Error: Could not find 'jobs-table-body'.");
        return;
    }

    const q = query(collection(db, "jobs"));

    onSnapshot(q, (querySnapshot) => {
        jobsTableBody.innerHTML = ''; 

        if (querySnapshot.empty) {
            jobsTableBody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No jobs found.</td></tr>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const job = doc.data();
            const row = document.createElement('tr');
            
            // --- NEW: Calculate profit ---
            const jobPrice = job.jobPrice || 0;
            const driverCost = job.driverCost || 0;
            const profit = jobPrice - driverCost;

            // Format dates, handling null values
            const pickupDate = job.pickupDate ? job.pickupDate.toDate().toLocaleDateString() : 'N/A';

            // --- UPDATED: New table row structure ---
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${job.customerInfo.name || 'N/A'}</div>
                    <div class="text-sm text-gray-500">${job.customerInfo.contactNumber || ''}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="font-medium">P:</span> ${job.pickupLocation.address} (${pickupDate})<br>
                    <span class="font-medium">D:</span> ${job.deliveryLocation.address}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${job.driverName || 'N/A'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    £${jobPrice.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}">
                    £${profit.toFixed(2)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
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
