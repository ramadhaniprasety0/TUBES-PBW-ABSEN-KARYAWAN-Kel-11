document.addEventListener('DOMContentLoaded', function() {
    const karyawanForm = document.getElementById('karyawan-form');

    karyawanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nama = document.getElementById('nama').value;
        const deskripsi = document.getElementById('deskripsi').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/api/tambahkaryawan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nama_karyawan: nama,
                deskripsi: deskripsi,
                username: username,
                password: password
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal menambahkan data karyawan. Status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data added:', data);
                karyawanForm.reset();
                Swal.fire({
                    title: 'Success!',
                    text: 'Data karyawan berhasil ditambahkan!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error('Error adding karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Gagal menambahkan data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });
});
