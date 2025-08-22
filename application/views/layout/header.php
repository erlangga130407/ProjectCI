<!DOCTYPE html>
<html>
<head>
    <title><?php echo isset($title) ? $title : 'Warkop abah'; ?></title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
        }

        header {
            background-color: #4e73df; 
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
        }

        .navmenu(
            color: white;
        )
        #navmenu(
            color: white;
        )
        header .logo {
            display: flex;
            align-items: center;
            font-weight: bold;
        }

        header .logo img {
            width: 25px;
            height: 25px;
            margin-right: 8px;
        }

        header nav a {
            color: white;
            text-decoration: n7yhuuone;
            margin: 0 15px;
            font-size: 15px;
        }

        header nav a:hover {
            text-decoration: underline;
        }
        
    </style>
</head>
<body>

<header>
    <div class="logo">
    ☕ Warkop Abah
    </div>
    <nav>
        <a href="<?php echo base_url('home'); ?>" >Beranda</a>
        <a href="<?php echo base_url('menu'); ?>">Menu</a>
        <a href="<?php echo base_url('pesanan'); ?>">Pesanan</a>
        <a href="<?php echo base_url('riwayat'); ?>">Riwayat</a>
        <a href="<?php echo base_url('profil'); ?>">Profil</a>
    </nav>
</header>

