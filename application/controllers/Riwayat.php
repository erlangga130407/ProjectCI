<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Riwayat extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        // jika belum di-autoload, load helper url untuk base_url() / site_url()
        $this->load->helper('url');
    }

    public function index()
    {
        // Jika kamu pakai header/footer terpisah:
        $this->load->view('layout/header');
        $this->load->view('riwayat');      // application/views/riwayat.php
        $this->load->view('layout/footer');
    }

    // method lain bisa ditambah di sini
}