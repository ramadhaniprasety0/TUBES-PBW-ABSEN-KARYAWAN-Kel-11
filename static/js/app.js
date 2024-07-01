document.addEventListener('DOMContentLoaded', function() {
    const karyawanList = document.getElementById('karyawan-list');
    const editKaryawanForm = document.getElementById('editKaryawanForm');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const jumlahKaryawanElement = document.getElementById('jumlahkaryawan');
    const jumlahHadirElement = document.getElementById('jumlahHadir');
    const jumlahTidakHadir = document.getElementById('jumlahTidakHadir');


    // Menampilkan data karyawan
    function fetchKaryawans() {
        fetch('/api/karyawan')
            .then(response => response.json())
            .then(data => {
                console.log('Data fetched from API:', data); // Logging data yang diterima
                karyawanList.innerHTML = '';
                if (data.karyawan && data.karyawan.length > 0) {
                    data.karyawan.forEach(karyawan => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td class="">${karyawan.id}</td>
                            <td class="">${karyawan.nama_karyawan}</td>
                            <td class="">${karyawan.deskripsi}</td>
                            <td class="align-middle">
                                <button class="btn btn-primary btn-circle btn-sm" onclick="editKaryawan(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')"><i class="fa fa-pen-to-square"></i></button>
                                <button class="btn btn-danger btn-circle btn-sm" onclick="tampilHapusModal(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')"><i class="fa-regular fa-trash-can"></i></button>
                            </td>
                        `;
                        karyawanList.appendChild(row);
                    });
                } else {
                    console.log('No karyawan found');
                }
            })
            .catch(error => console.error('Error fetching karyawans:', error));
    }

    // Menampilkan jumlah karyawan
    console.log('jumlahKaryawanElement:', jumlahKaryawanElement);

    // Menampilkan jumlah karyawan
    function fetchJumlahKaryawan() {
        console.log('fetchJumlahKaryawan called');
        fetch('/api/totalkaryawan')
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Jumlah karyawan fetched from API:', data); // Logging jumlah karyawan
                if (data.count !== undefined) {
                    jumlahKaryawanElement.innerHTML = data.count;
                } else {
                    jumlahKaryawanElement.innerHTML = 'N/A';
                }
            })
            .catch(error => {
                console.error('Error fetching jumlah karyawan:', error);
                jumlahKaryawanElement.innerHTML = 'Error';
            });
    }

    // Menampilkan Jumlah Hadir
    function fetchJumlahHadir() {
        console.log('fetchJumlahKaryawan called');
        fetch('/api/total/hadir')
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Jumlah Hadir fetched from API:', data); // Logging jumlah karyawan
                if (data.count !== undefined) {
                    jumlahHadirElement.innerHTML = data.count;
                } else {
                    jumlahHadirElement.innerHTML = 'N/A';
                }
            })
            .catch(error => {
                console.error('Error fetching jumlah karyawan:', error);
                jumlahHadirElement.innerHTML = 'Error';
            });
    }

    // Menampilkan Tidak Hadir
    function fetchTidakHadir() {
        console.log('fetchJumlahKaryawan called');
        fetch('/api/total/tidak/hadir')
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Jumlah Tidak Hadir fetched from API:', data); // Logging jumlah karyawan
                if (data.count !== undefined) {
                    jumlahTidakHadir.innerHTML = data.count;
                } else {
                    jumlahTidakHadir.innerHTML = 'N/A';
                }
            })
            .catch(error => {
                console.error('Error fetching jumlah karyawan:', error);
                jumlahTidakHadir.innerHTML = 'Error';
            });
    }

    fetchKaryawans();
    fetchJumlahKaryawan();
    fetchJumlahHadir();
    fetchTidakHadir();

    // Edit data karyawan
    function editKaryawan(id, nama, deskripsi) {
        document.getElementById('editKaryawanId').value = id;
        document.getElementById('editNama').value = nama;
        document.getElementById('editDeskripsi').value = deskripsi;
        $('#editKaryawanModal').modal('show');
    }

    editKaryawanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.getElementById('editKaryawanId').value;
        const nama = document.getElementById('editNama').value;
        const deskripsi = document.getElementById('editDeskripsi').value;

        fetch(`/api/karyawan/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nama_karyawan: nama, deskripsi: deskripsi })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Data berhasil diperbarui') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data karyawan berhasil diperbarui!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchKaryawans();
                    fetchJumlahKaryawan(); // Perbarui jumlah karyawan setelah pembaruan
                    $('#editKaryawanModal').modal('hide');
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Terjadi kesalahan saat memperbarui data karyawan.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error updating karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat memperbarui data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    // Hapus data karyawan
    function tampilHapusModal(id, nama, deskripsi) {
        document.getElementById('hapusKaryawanId').value = id;
        document.getElementById('hapusNama').value = nama;
        document.getElementById('hapusDeskripsi').value = deskripsi;
        $('#hapusKaryawanModal').modal('show');
    }

    confirmDeleteButton.addEventListener('click', function() {
        const id = document.getElementById('hapusKaryawanId').value;

        fetch(`/api/karyawan/${id}`, {
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
                        text: 'Data karyawan berhasil dihapus!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchKaryawans();
                    fetchJumlahKaryawan(); // Perbarui jumlah karyawan setelah penghapusan
                    $('#hapusKaryawanModal').modal('hide');
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: data.message || 'Terjadi kesalahan saat menghapus data karyawan.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat menghapus data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    window.tampilHapusModal = tampilHapusModal;
    window.editKaryawan = editKaryawan;

    // Mencari karyawan berdasarkan ID
    function searchKaryawan() {
        const karyawanId = document.getElementById('searchKaryawanId').value;
        const resultDiv = document.getElementById('karyawanResult');
        const aksisearch = document.getElementById('aksisearch')

        if (karyawanId.trim() === '') {
            resultDiv.innerHTML = '<div class="alert alert-warning" role="alert">ID Karyawan tidak boleh kosong!</div>';
            return;
        }

        fetch(`/api/karyawan/${karyawanId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Karyawan tidak ditemukan');
                }
                return response.json();
            })
            .then(data => {
                const karyawan = data.karyawan;
                resultDiv.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">ID: ${karyawan.id}</h5>
                            <p class="card-text">Nama: ${karyawan.nama_karyawan}</p>
                            <p class="card-text">Deskripsi: ${karyawan.deskripsi}</p>
                        </div>
                    </div>
                    
                `;
                aksisearch.innerHTML =`
                    <button type="button" class="btn btn-primary" onclick="editKaryawan(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')">Edit</button>
                    <button type="button" class="btn btn-danger" onclick="tampilHapusModal(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')">Hapus</button>
                `;
            })
            .catch(error => {
                resultDiv.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div>`;
            });
    }

    window.searchKaryawan = searchKaryawan;
});
