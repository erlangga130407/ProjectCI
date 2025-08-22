<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pelanggan_model extends CI_Model {

    public function insert_pelanggan($data) {
        return $this->db->insert('pelanggan', $data);
    }

    public function get_by_email($email) {
        return $this->db->get_where('pelanggan', ['email' => $email])->row();
    }
}