export const inventoryUI = {
    async renderInventoryList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Inventory Status</h2>
                <div class="header-actions">
                    <button id="btn-refresh-stock" class="btn-primary"><i class="fas fa-sync"></i> Refresh Stock</button>
                </div>
            </div>
            <div class="table-container">
                <table id="inventory-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Location</th>
                            <th>Batch No</th>
                            <th>Expiry</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody id="inventory-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.loadInventory();
        document.getElementById('btn-refresh-stock').addEventListener('click', () => this.loadInventory());
    },

    async loadInventory() {
        const inventoryList = document.getElementById('inventory-list');
        inventoryList.innerHTML = '<tr><td colspan="6">Loading current stock...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/inventory', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.length === 0) {
                inventoryList.innerHTML = '<tr><td colspan="6">Inventory is currently empty.</td></tr>';
                return;
            }

            inventoryList.innerHTML = data.map(item => `
                <tr>
                    <td><strong>${item.products.product_code}</strong><br><small>${item.products.product_name}</small></td>
                    <td><span class="wh-label">${item.locations.location_code}</span></td>
                    <td>${item.batch_no || '-'}</td>
                    <td>${item.expiry_date || '-'}</td>
                    <td><strong style="color: var(--accent-color)">${item.quantity}</strong></td>
                    <td>${item.products.unit}</td>
                </tr>
            `).join('');
        } catch (error) {
            inventoryList.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        }
    }
};
