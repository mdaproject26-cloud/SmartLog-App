export const locationUI = {
    async renderLocationList() {
        const contentArea = document.getElementById('content-area');
        contentArea.innerHTML = `
            <div class="module-header">
                <h2>Master Lokasi</h2>
                <button id="btn-add-location" class="btn-primary"><i class="fas fa-plus"></i> Tambah Lokasi</button>
            </div>
            <div class="table-container">
                <table id="location-table">
                    <thead>
                        <tr>
                            <th>Location Code</th>
                            <th>Rack</th>
                            <th>Row</th>
                            <th>Level</th>
                            <th>Side</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="location-list">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.loadLocations();
    },

    async loadLocations() {
        const locationList = document.getElementById('location-list');
        locationList.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/locations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const locations = await response.json();

            if (locations.length === 0) {
                locationList.innerHTML = '<tr><td colspan="7">No locations found.</td></tr>';
                return;
            }

            locationList.innerHTML = locations.map(l => `
                <tr>
                    <td><strong>${l.location_code}</strong></td>
                    <td>${l.rack}</td>
                    <td>${l.row}</td>
                    <td>${l.level}</td>
                    <td>${l.side}</td>
                    <td><span class="status-badge status-${l.status.toLowerCase()}">${l.status}</span></td>
                    <td>
                        <button class="btn-edit" data-id="${l.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${l.id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            locationList.innerHTML = `<tr><td colspan="7">Error: ${error.message}</td></tr>`;
        }
    }
};
