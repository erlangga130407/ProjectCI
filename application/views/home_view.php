<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Warkop Abah</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background-color: #f8f1e7;
            color: #333;
        }
        header {
            background-color: #8B4513;
            padding: 20px;
            text-align: center;
            color: white;
        }
        nav {
            display: flex;
            justify-content: center;
            background-color: #A0522D;
        }
        nav a {
            color: white;
            padding: 14px 20px;
            text-decoration: none;
            transition: background 0.3s;
        }
        nav a:hover {
            background-color: #8B4513;
        }
        .container {
            padding: 20px;
        }
        .menu-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .menu-item {
            background: white;
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .menu-item img {
            width: 100%;
            border-radius: 10px;
        }
        .menu-item h3 {
            margin: 10px 0;
        }
        footer {
            text-align: center;
            background-color: #8B4513;
            color: white;
            padding: 10px;
            margin-top: 30px;
        }
    </style>
</head>
<body>

<header>
    <h1>☕ Warkop Abah</h1>
    <p>Ngopi santai, harga bersahabat</p>
</header>

<nav>
    <a href="#">Beranda</a>
    <a href="#">Menu</a>
    <a href="#">Pesanan</a>
    <a href="#">Riwayat</a>
</nav>

<div class="container">
    <h1>Menu</h1>
    <div class="menu-list">
        <div class="menu-item">
            <img src="<?= base_url('assets/images/kopi hitam.jpg') ?>" alt="Kopi Hitam">
            <h3>Kopi Hitam</h3>
            <p>Rp 10.000</p>
        </div>
        <div class="menu-item">
            <img src="<?= base_url('assets/images/roko 1.jpg') ?>" alt="Roko">
            <h3>Roko</h3>
            <p>Rp 25.000</p>
        </div>
        <div class="menu-item">
            <img src="<?= base_url('assets/images/teh.jpg') ?>" alt="Teh Manis">
            <h3>Teh Manis</h3>
            <p>Rp 8.000</p>
        </div>
        <div class="menu-item">
            <img src="<?= base_url('assets/images/indomie.jpg') ?>" alt="Indomie">
            <h3>Indomie Telur</h3>
            <p>Rp 15.000</p>
        </div>
        <div class="menu-item">
            <img src="<?= base_url('assets/images/gorengan 2.jpg') ?>" alt="Gorengan">
            <h3>Gorengan</h3>
            <p>Rp 1.000</p>
        </div>
    </div>
</div>





</body>
</html>
