<?php $this->load->view('layout/header'); ?>

<div class="profile-container">
    <h2><?= $profil->nama; ?></h2>
    <span class="username"><?= $profil->email; ?></span>

    <div class="profile-info">
        <p><b>Email:</b> <?= $profil->email; ?></p>
        <p><b>Telepon:</b> <?= $profil->telepon; ?></p>
        <p><b>Alamat:</b> <?= $profil->alamat; ?></p>
    </div>

    <div class="about">
        <b>Tentang Saya:</b><br>
        <?= $profil->bio; ?>
    </div>

    <div class="profile-actions">
        <a href="<?= site_url('profil/edit/'.$profil->id) ?>">✏️ Edit Profil</a>
        <a href="<?= site_url('auth') ?>">🚪 Logout</a>
    </div>
</div>
