export const outboundUI = {
    async renderOutboundList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Outbound Transactions (SO)</h2>
                <button id="btn-create-so" class="btn-primary"><i class="fas fa-plus"></i> Create SO</button>
            </div>
            <div class="table-container">
                <table id="outbound-table">
                    <thead>
                        <tr>
                            <th>Reference No</th>
                            <th>Customer</th>
                            <th>Warehouse</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="outbound-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.loadOutboundList();
    },

    async loadOutboundList() {
        const outboundList = document.getElementById('outbound-list');
        outboundList.innerHTML = '<tr><td colspan="6">Loading outbound list...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/outbound', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.length === 0) {
                outboundList.innerHTML = '<tr><td colspan="6">No outbound transactions found.</td></tr>';
                return;
            }

            outboundList.innerHTML = data.map(item => `
                <tr>
                    <td><strong>${item.reference_no}</strong></td>
                    <td>${item.customers.customer_name}</td>
                    <td>${item.warehouses.name}</td>
                    <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-edit" title="View Details" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                        ${item.status === 'Draft' ? `<button class="btn-primary btn-sm" onclick="alert('Proceed to Picking')">Pick</button>` : ''}
                        ${item.status === 'Picked' ? `<button class="btn-primary btn-sm" onclick="alert('Proceed to Dispatch')">Dispatch</button>` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            outboundList.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        }
    }
};
