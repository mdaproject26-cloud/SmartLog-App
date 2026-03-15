export const inboundUI = {
    async renderInboundList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Inbound Transactions (PO)</h2>
                <button id="btn-create-po" class="btn-primary"><i class="fas fa-plus"></i> Create PO</button>
            </div>
            <div class="table-container">
                <table id="inbound-table">
                    <thead>
                        <tr>
                            <th>Reference No</th>
                            <th>Supplier</th>
                            <th>Warehouse</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="inbound-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.loadInboundList();
    },

    async loadInboundList() {
        const inboundList = document.getElementById('inbound-list');
        inboundList.innerHTML = '<tr><td colspan="6">Loading inbound list...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/inbound', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.length === 0) {
                inboundList.innerHTML = '<tr><td colspan="6">No inbound transactions found.</td></tr>';
                return;
            }

            inboundList.innerHTML = data.map(item => `
                <tr>
                    <td><strong>${item.reference_no}</strong></td>
                    <td>${item.suppliers.supplier_name}</td>
                    <td>${item.warehouses.name}</td>
                    <td><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></td>
                    <td>${new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-edit" title="View Details" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                        ${item.status === 'Draft' ? `<button class="btn-primary btn-sm" onclick="alert('Proceed to Receiving')">Receive</button>` : ''}
                        ${item.status === 'Received' ? `<button class="btn-primary btn-sm" onclick="alert('Proceed to Putaway')">Putaway</button>` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            inboundList.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        }
    }
};
