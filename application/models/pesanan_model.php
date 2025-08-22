<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pesanan_model extends CI_Model {

    public function insert_pesanan($data) {
        $this->db->insert('pesanan', $data);
    }
}