<div style="max-width:600px; margin:20px auto;">
    <h2>Status Pesanan</h2>
    <?php foreach ($status as $s): ?>
        <div style="border:1px solid #ccc; padding:15px; margin-bottom:10px; border-radius:8px;">
            <h3 style="color: <?= $s['warna'] ?>; margin:0;"><?= $s['ikon'] ?> <?= $s['judul'] ?></h3>
            <p style="margin:5px 0 0;"><?= $s['deskripsi'] ?></p>
        </div>
    <?php endforeach; ?>
    
</div>