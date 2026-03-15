export const reportUI = {
    async renderReportDashboard() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Warehouse Reports</h2>
            </div>
            <div class="report-grid">
                <div class="report-card" onclick="reportUI.renderStockReport()">
                    <i class="fas fa-boxes-stacked"></i>
                    <h3>Stock Report</h3>
                    <p>Current inventory snapshot per location.</p>
                </div>
                <div class="report-card" onclick="reportUI.renderMovementReport()">
                    <i class="fas fa-exchange-alt"></i>
                    <h3>Stock Movement</h3>
                    <p>History of all inbound and outbound logs.</p>
                </div>
                <div class="report-card" onclick="alert('Location Report Coming Soon')">
                    <i class="fas fa-map-marked-alt"></i>
                    <h3>Location Utilization</h3>
                    <p>Analysis of empty vs occupied locations.</p>
                </div>
            </div>
        `;
    },

    async renderStockReport() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <button class="btn-secondary" onclick="reportUI.renderReportDashboard()"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>Current Stock Report</h2>
                <button class="btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Export PDF</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Location</th>
                            <th>Batch No</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody id="stock-report-list">
                        <tr><td colspan="5">Loading report...</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/reports/stock', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            const list = document.getElementById('stock-report-list');
            list.innerHTML = data.map(item => `
                <tr>
                    <td><strong>${item.products.product_code}</strong> - ${item.products.product_name}</td>
                    <td>${item.locations.location_code}</td>
                    <td>${item.batch_no || '-'}</td>
                    <td>${item.quantity}</td>
                    <td>${item.products.unit}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Report error:', error);
        }
    },

    async renderMovementReport() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <button class="btn-secondary" onclick="reportUI.renderReportDashboard()"><i class="fas fa-arrow-left"></i> Back</button>
                <h2>Stock Movement Report</h2>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Product</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Ref No</th>
                        </tr>
                    </thead>
                    <tbody id="movement-report-list">
                        <tr><td colspan="7">Loading logs...</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/reports/movement', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            const list = document.getElementById('movement-report-list');
            list.innerHTML = data.map(item => `
                <tr>
                    <td>${new Date(item.created_at).toLocaleString()}</td>
                    <td>${item.products.product_code}</td>
                    <td><span class="status-badge status-${item.transaction_type.toLowerCase()}">${item.transaction_type}</span></td>
                    <td>${item.quantity}</td>
                    <td>${item.from_location?.location_code || '-'}</td>
                    <td>${item.to_location?.location_code || '-'}</td>
                    <td>${item.reference_no}</td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Report error:', error);
        }
    }
};
