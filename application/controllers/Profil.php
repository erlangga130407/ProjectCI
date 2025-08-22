<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Profil extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->model('Profil_model');
    }


    public function index()
    {
        // sementara ambil id = 1
        $profil = $this->Profil_model->get_profil(1);

        $data['profil'] = $profil;
        $this->load->view('profil', $data);
    }

    public function edit($id)
    {
        $profil = $this->Profil_model->get_profil($id);
        $data['profil'] = $profil;

        $this->load->view('profil_edit', $data);
    }

    public function update($id)
    {
        $data = [
            'nama'    => $this->input->post('nama'),
            'email'   => $this->input->post('email'),
            'telepon' => $this->input->post('telepon'),
            'alamat'  => $this->input->post('alamat'),
            'bio'     => $this->input->post('bio'),
        ];

        $this->Profil_model->update_profil($id, $data);
        redirect('profil');
    }
}
