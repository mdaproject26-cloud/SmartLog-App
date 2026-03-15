export const customerUI = {
  async renderCustomerList() {
    const contentArea = document.getElementById("content-area");
    contentArea.innerHTML = `
            <div class="module-header">
                <h2>Master Customer</h2>
                <button id="btn-add-customer" class="btn-primary"><i class="fas fa-plus"></i> Tambah Customer</button>
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
                    <tbody id="customer-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;
    this.loadCustomers();
  },

  async loadCustomers() {
    const customerList = document.getElementById("customer-list");
    customerList.innerHTML = '<tr><td colspan="5">Loading...</td></tr>';

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const customers = await response.json();

      if (customers.length === 0) {
        customerList.innerHTML =
          '<tr><td colspan="5">No customers found.</td></tr>';
        return;
      }

      customerList.innerHTML = customers
        .map(
          (c) => `
                <tr>
                    <td>${c.customer_code}</td>
                    <td>${c.customer_name}</td>
                    <td>${c.destination}</td>
                    <td>${c.contact}</td>
                    <td>
                        <button class="btn-edit" data-id="${c.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${c.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `,
        )
        .join("");
    } catch (error) {
      customerList.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
    }
  },
};
