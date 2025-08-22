<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pesanan extends CI_Controller {

    public function index()
    {
        // Ambil data dari tabel pesanan urutkan terbaru
        $query = $this->db->order_by('tanggal', 'DESC')->get('pesanan');
        $pesanan = $query->result_array();

        // Siapkan data untuk view
        $data['status'] = [];
        foreach ($pesanan as $p) {
            $data['status'][] = [
                'judul'     => $p['nama_menu'],
                'deskripsi' => "Jumlah: {$p['qty']} | Total: Rp" . number_format($p['total'], 0, ',', '.'),
                'ikon'      => '☕', // Default ikon
                'warna'     => '#004085' // Default warna
            ];
        }

        // Load view
        $this->load->view('layout/header');
        $this->load->view('pesanan', $data);
        $this->load->view('layout/footer');
    }

    // Method untuk menerima data pesanan dari menu.php
    public function simpan()
    {
        // Ambil data JSON dari request
        $input = json_decode($this->input->raw_input_stream, true);

        if (!isset($input['pesanan']) || empty($input['pesanan'])) {
            echo json_encode(['status' => 'error', 'message' => 'Tidak ada pesanan.']);
            return;
        }

        // Simpan ke database
        foreach ($input['pesanan'] as $item) {
            $data = [
                'nama_menu' => $item['nama'],
                'harga'     => $item['harga'],
                'qty'       => $item['qty'],
                'total'     => $item['harga'] * $item['qty'],
                'tanggal'   => date('Y-m-d H:i:s')
            ];
            $this->db->insert('pesanan', $data);
        }

        echo json_encode(['status' => 'success', 'message' => 'Pesanan berhasil disimpan!']);
    }
}
