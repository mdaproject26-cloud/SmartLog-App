export const userUI = {
    async renderUserList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>User Management</h2>
                <button id="btn-add-user" class="btn-primary"><i class="fas fa-user-plus"></i> Add New User</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Division</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="user-list">
                        <tr><td colspan="6">Loading users...</td></tr>
                    </tbody>
                </table>
            </div>
        `;
        this.loadUsers();
    },

    async loadUsers() {
        const userList = document.getElementById('user-list');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const users = await response.json();

            if (users.length === 0) {
                userList.innerHTML = '<tr><td colspan="6">No users found.</td></tr>';
                return;
            }

            userList.innerHTML = users.map(u => `
                <tr>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.username}</td>
                    <td><span class="wh-label">${u.role}</span></td>
                    <td>${u.division || '-'}</td>
                    <td><span class="status-badge ${u.status === 'Active' ? 'status-empty' : 'status-outbound'}">${u.status}</span></td>
                    <td>
                        <button class="btn-edit" data-id="${u.id}"><i class="fas fa-user-edit"></i></button>
                        <button class="btn-delete" data-id="${u.id}"><i class="fas fa-user-slash"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            userList.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
        }
    }
};
