document.addEventListener('DOMContentLoaded', function() {
    const adminList = document.getElementById('adminlist');
    const editAdminForm = document.getElementById('editAdminForm');

    function fetchAdmins() {
        fetch('/api/admin')
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched from API:', data);
                adminList.innerHTML = '';
                if (data.users && data.users.length > 0) {
                    data.users.forEach(user => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.id}</td>
                            <td>${user.namaadmin}</td>
                            <td class="align-middle">
                                <button class="btn btn-primary btn-circle btn-sm" onclick="editadmin(${user.id}, '${user.namaadmin}')"><i class="fa fa-pen-to-square"></i></button>
                                <button class="btn btn-danger btn-circle btn-sm" onclick="hapusadmin(${user.id},'${user.namaadmin}')"><i class="fa-regular fa-trash-can"></i></button>
                            </td>
                        `;
                        adminList.appendChild(row);
                    });
                } else {
                    console.log('Admin Tidak ada');
                }
            })
            .catch(error => console.error('Error fetching admins:', error));
    }

    fetchAdmins();

    function updateClock() {
        const now = new Date();
        const date = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = now.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        document.getElementById('date').value = date;
        document.getElementById('time').value = time;
    }

    setInterval(updateClock, 1000);
    updateClock();

    function hapusadmin(id, nama) {
        document.getElementById('hapusAdminId').value = id;
        document.getElementById('hapusNamaAdmin').value = nama;
        $('#hapusAdminModal').modal('show');
    }

    function editadmin(id, nama) {
        document.getElementById('editAdminId').value = id;
        document.getElementById('editNamaAdmin').value = nama;
        $('#editAdminModal').modal('show');
    }

    function tutupModal2() {
        $('#hapusAdminModal').modal('hide');
    }
    function tutupModal1() {
        $('#editAdminModal').modal('hide');
    }

    window.editadmin = editadmin;
    window.hapusadmin = hapusadmin;
    window.tutupModal1 = tutupModal1;
    window.tutupModal2 = tutupModal2;

    editAdminForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = parseInt(document.getElementById('editAdminId').value);
        const nama = document.getElementById('editNamaAdmin').value;

        const data = {
            namaadmin: nama
        };

        fetch(`/api/admin/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Data berhasil diperbarui') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Nama admin berhasil diperbarui!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    $('#editAdminModal').modal('hide');
                    // Optionally, you can refresh the admin list or update the UI as needed
                }
            })
            .catch(error => {
                console.error('Error updating admin data:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat memperbarui nama admin.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    document.getElementById('btnhapus').addEventListener('click', function() {
        const id = parseInt(document.getElementById('hapusAdminId').value);

        fetch(`/api/admin/hapus/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Data berhasil dihapus') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data user berhasil dihapus!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchAdmins();
                    $('#hapusAdminModal').modal('hide');
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Terjadi kesalahan saat menghapus data user.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat menghapus data user.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });
});
