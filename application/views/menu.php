<link rel="stylesheet" href="<?= base_url('assets/css/style.css'); ?>">

<div class="menu-container">
    <h2 class="judul-menu">Menu Warkop</h2>

    <div class="menu-grid">
        <?php
        $menu = [
            ['nama' => 'Kopi',     'harga' => 5000,  'gambar' => 'kopi.jpg'],
            ['nama' => 'Rokok',    'harga' => 25000, 'gambar' => 'roko.jpg'],
            ['nama' => 'Indomie',  'harga' => 12000, 'gambar' => 'indomie.jpg'],
            ['nama' => 'Gorengan', 'harga' => 1000,  'gambar' => 'gorengan2.jpg'],
            ['nama' => 'Es Teh',   'harga' => 3000,  'gambar' => 'teh.jpg'],
        ];
        foreach ($menu as $i => $item): ?>
            <div class="menu-card">
                <img src="<?= base_url('assets/images/'.$item['gambar']); ?>" alt="<?= $item['nama']; ?>">
                <h4><?= $item['nama']; ?></h4>
                <p class="harga">Rp <?= number_format($item['harga'],0,',','.'); ?></p>

                <div class="qty-control">
                    <button type="button" class="btn-qty btn-minus" data-index="<?= $i ?>">−</button>
                    <span id="qty-<?= $i ?>">0</span>
                    <button type="button" class="btn-qty btn-plus"  data-index="<?= $i ?>">+</button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Total bar + tombol beli -->
<div class="total-bar">
    <span>Total: Rp <span id="total">0</span></span>
    <button class="btn-beli">Beli</button>
</div>

<script>
(() => {
    const harga = <?= json_encode(array_column($menu, 'harga')); ?>;
    const nama  = <?= json_encode(array_column($menu, 'nama')); ?>;
    const qty   = Array(harga.length).fill(0);

    const renderQty = (i) => {
        const el = document.getElementById('qty-'+i);
        if (el) el.textContent = qty[i];
    };

    const updateTotal = () => {
        const total = qty.reduce((sum, q, i) => sum + q * harga[i], 0);
        document.getElementById('total').textContent = total.toLocaleString('id-ID');
    };

    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-qty')) return;
        e.preventDefault();
        const i = parseInt(e.target.dataset.index, 10);
        const delta = e.target.classList.contains('btn-plus') ? 1 : -1;
        qty[i] = Math.max(0, qty[i] + delta);
        renderQty(i);
        updateTotal();
    });

    document.querySelector('.btn-beli').addEventListener('click', () => {
        const pesanan = [];
        qty.forEach((q, i) => {
            if (q > 0) {
                pesanan.push({
                    nama: nama[i],
                    harga: harga[i],
                    qty: q
                });
            }
        });

        if (pesanan.length === 0) {
            alert("Pilih minimal 1 menu dulu!");
            return;
        }

        fetch("<?= site_url('pesanan/simpan') ?>", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pesanan })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            location.reload();
        })
        .catch(err => {
            console.error(err);
            alert("Terjadi kesalahan.");
        });
    });
})();
</script>