<?php
defined('BASEPATH') OR exit ('No direct script access allowed');

class menu_model extends CI_Model {

    public function __construct() {
        parent::__construct();
    }

    public function get_all_menu() {
        return
    $this->db->get('menu')->result();
    }

    public function tambah_menu($data) {
        return
    $this->db->insert('menu', $data);
    }


}

?>