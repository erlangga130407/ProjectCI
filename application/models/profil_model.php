<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Profil_model extends CI_Model {

    public function get_profil($id) {
        return $this->db->get_where('user', ['id' => $id])->row();
    }

    public function update_profil($id, $data) {
        $this->db->where('id', $id);
        return $this->db->update('user', $data);
    }
}
