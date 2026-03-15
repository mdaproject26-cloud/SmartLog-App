export const productUI = {
    async renderProductList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Master Produk</h2>
                <button id="btn-add-product" class="btn-primary"><i class="fas fa-plus"></i> Tambah Produk</button>
            </div>
            <div class="table-container">
                <table id="product-table">
                    <thead>
                        <tr>
                            <th>Product Code</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="product-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.loadProducts();
    },

    async loadProducts() {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const products = await response.json();

            if (products.length === 0) {
                productList.innerHTML = '<tr><td colspan="5">No products found.</td></tr>';
                return;
            }

            productList.innerHTML = products.map(p => `
                <tr>
                    <td>${p.product_code}</td>
                    <td>${p.product_name}</td>
                    <td>${p.category || '-'}</td>
                    <td>${p.unit}</td>
                    <td>
                        <button class="btn-edit" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            productList.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
        }
    }
};
