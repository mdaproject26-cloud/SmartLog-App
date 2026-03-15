export const supplierUI = {
    async renderSupplierList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Master Supplier</h2>
                <button id="btn-add-supplier" class="btn-primary"><i class="fas fa-plus"></i> Tambah Supplier</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Destination</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="supplier-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;
        this.loadSuppliers();
    },

    async loadSuppliers() {
        const supplierList = document.getElementById('supplier-list');
        supplierList.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/suppliers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const suppliers = await response.json();

            if (suppliers.length === 0) {
                supplierList.innerHTML = '<tr><td colspan="5">No suppliers found.</td></tr>';
                return;
            }

            supplierList.innerHTML = suppliers.map(s => `
                <tr>
                    <td>${s.supplier_code}</td>
                    <td>${s.supplier_name}</td>
                    <td>${s.destination}</td>
                    <td>${s.contact}</td>
                    <td>
                        <button class="btn-edit" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            supplierList.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
        }
    }
};
