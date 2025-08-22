<h2 class="mb-4">Tambah Menu</h2>
<div class="card shadow-sm p-4">
<form action="<?= base_url('menu/simpan') ?>" method="post" enctype="multipart/form-data">
    <div class="mb-3">
        <label>Nama Menu</label>
        <input type="text" name="nama" class="form-control" required>
    </div>
    <div class="mb-3">
        <label>Harga</label>
        <input type="number" name="harga" class="form-control" required>
    </div>
    <div class="mb-3">
        <label>Foto</label>
        <input type="file" name="foto" class="form-control" required>
    </div>
    <button type="submit" class="btn btn-primary">Simpan</button>
</form>
</div>
