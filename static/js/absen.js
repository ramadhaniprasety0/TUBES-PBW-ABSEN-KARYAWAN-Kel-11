document.addEventListener('DOMContentLoaded', function() {
    const karyawanList = document.getElementById('karyawan-data');
    const hadirKaryawanForm = document.getElementById('hadirKaryawanForm');
    const tidakhadirKaryawanForm = document.getElementById('tidakHadirKaryawanForm');

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
                            <td>${karyawan.id}</td>
                            <td>${karyawan.nama_karyawan}</td>
                            <td class="align-middle">
                                <button class="btn btn-success btn-circle btn-sm" onclick="hadirkaryawan(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')">
                                    <i class="fa-solid fa-user-check"></i>
                                </button>
                                <button class="btn btn-danger btn-circle btn-sm" onclick="tidakhadirkaryawan(${karyawan.id}, '${karyawan.nama_karyawan}', '${karyawan.deskripsi}')">
                                    <i class="fa-solid fa-user-xmark"></i>
                                </button>
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

    fetchKaryawans();

    // Hadir Karyawan
    function hadirkaryawan(id, nama, deskripsi) {
        document.getElementById('hadirKaryawanId').value = id;
        document.getElementById('hadirNama').value = nama;
        document.getElementById('hadirDeskripsi').value = deskripsi;
        $('#hadirKaryawanModal').modal('show');
    }
    function tidakhadirkaryawan(id, nama, deskripsi) {
        document.getElementById('tidakHadirKaryawanId').value = id;
        document.getElementById('tidakHadirNama').value = nama;
        document.getElementById('tidakHadirDeskripsi').value = deskripsi;
        $('#tidakHadirKaryawanModal').modal('show');
    }
    function tutupModal1() {
        $('#hadirKaryawanModal').modal('hide');
    }
    function tutupModal2() {
        $('#tidakHadirKaryawanModal').modal('hide');
    }

    window.hadirkaryawan = hadirkaryawan;
    window.tidakhadirkaryawan = tidakhadirkaryawan;
    window.tutupModal1 = tutupModal1;
    window.tutupModal2 = tutupModal2;



    hadirKaryawanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = parseInt(document.getElementById('hadirKaryawanId').value);
        const status = document.getElementById('hadirStatus').value;
        const keterangan = document.getElementById('HadirKeterangan').value;



        fetch(`/api/hadir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ karyawan_id: id, status: status, keterangan: keterangan })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Absen Hadir berhasil') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data absen karyawan berhasil dikirim!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    $('#hadirKaryawanModal').modal('hide');
                }
            })
            .catch(error => {
                console.error('Error kirim data karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat mengirim absen data karyawan.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });

    tidakhadirKaryawanForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = parseInt(document.getElementById('tidakHadirKaryawanId').value);
        const status = document.getElementById('tidakHadirStatus').value;
        const keterangan = document.getElementById('tidakHadirKeterangan').value;


        fetch(`/api/hadir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ karyawan_id: id, status: status, keterangan: keterangan})
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Absen Hadir berhasil') {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Data absen karyawan berhasil dikirim!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });

                    $('#tidakHadirKaryawanModal').modal('hide');
                }
            })
            .catch(error => {
                console.error('Error kirim data karyawan:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Terjadi kesalahan saat mengirim data absen.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    });




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

        document.getElementById('date1').value = date;
        document.getElementById('time1').value = time;
        document.getElementById('date2').value = date;
        document.getElementById('time2').value = time;
    }

    setInterval(updateClock, 1000);
    updateClock();
});
