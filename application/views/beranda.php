<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Warkop Abah</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
        }
        .navbar {
            background-color: #8B4513; /* warna coklat kopi */
        }
        .navbar-brand, .nav-link {
            color: white !important;
        }
        .menu-card {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 4px 6px rgba(0,0,0,0.1);
        }
        .menu-card img {
            height: 180px;
            object-fit: cover;
        }
        .menu-title {
            font-weight: bold;
            font-size: 1.1rem;
        }
        .menu-price {
            color: #8B4513;
            font-weight: bold;
        }
    </style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg">
    <div class="container">
        <a class="navbar-brand" href="#">☕ Warkop Abah</a>
        <div class="collapse navbar-collapse">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="#">Beranda</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Menu</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Pesanan</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Riwayat</a></li>
            </ul>
        </div>
    </div>
</nav>

<!-- Hero -->
<div class="text-center p-4 bg-light">
    <h2>Ngopi santai, harga bersahabat</h2>
    <p>Menu favorit pilihan pelanggan</p>
</div>

<!-- Menu -->
<div class="container mt-4">
    <div class="row g-4">
        <div class="col-md-4 col-lg-3">
            <div class="card menu-card">
                <img src="kopi_hitam.jpg" class="card-img-top" alt="Kopi Hitam">
                <div class="card-body text-center">
                    <div class="menu-title">Kopi Hitam</div>
                    <div class="menu-price">Rp 10.000</div>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-lg-3">
            <div class="card menu-card">
                <img src="roko.jpg" class="card-img-top" alt="Roko">
                <div class="card-body text-center">
                    <div class="menu-title">Roko</div>
                    <div class="menu-price">Rp 25.000</div>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-lg-3">
            <div class="card menu-card">
                <img src="teh_manis.jpg" class="card-img-top" alt="Teh Manis">
                <div class="card-body text-center">
                    <div class="menu-title">Teh Manis</div>
                    <div class="menu-price">Rp 8.000</div>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-lg-3">
            <div class="card menu-card">
                <img src="indomie_telur.jpg" class="card-img-top" alt="Indomie Telur">
                <div class="card-body text-center">
                    <div class="menu-title">Indomie Telur</div>
                    <div class="menu-price">Rp 15.000</div>
                </div>
            </div>
        </div>
        <div class="col-md-4 col-lg-3">
            <div class="card menu-card">
                <img src="gorengan.jpg" class="card-img-top" alt="Gorengan">
                <div class="card-body text-center">
                    <div class="menu-title">Gorengan</div>
                    <div class="menu-price">Rp 1.000</div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>