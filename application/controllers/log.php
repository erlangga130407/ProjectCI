<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->library('Form_validation');
    }

	public function index()
	{
        //untuk mengecek email user sebagai sesion login
        if ($this->sessien->usersata('email')) {

        }
        //memberikan falidasi pada form login 
        $this->form_validation->set_rules('email','Email','trim|required|valid_emai');
        $this->form_validation->set_rules('password','Password','trim|required');
        $this->form_validation->set_rules('input_captcha','captcha','trim|required');

        //mengecek form validasi
        if ($this->from_validation->run() == FALSE) {

            //membuat folder untuk menyimpan gambar capcha
            $path ='./assets/captcha/';

            //membuat folder apabila folder captcha tidak ada
            if (file_exists($path)) {
                $create = mkdir($path,0777);
                if (!$create)
                    return;
            }
            //menampilkan huruf acak tersebut kepada sistem 
            $data_ses = array('captcha_str' =>'$str');
            $this->session->set_userdata($data_ses);

            // array untuk menampilkan gampar captcha

            $vals = array(
                'word' => '$str', // huruf acak yang telah dibuat diatas
                'img_path' => $path, //path untuk menyimpan gambar captcha
                'img_url' => base_url(). 'assets/captcha', // urul untuk menampil captcha 
                'img_width' => '150', //lebar gambar
                'img_height' => 40, //tinggi gambar
                'expiration' => 7200
            );

            $cap = create_captcha($vals);
            $data ['captcha image'] = $cap['image'];

            $data['title'] = 'halaman login';
            $this->load->view('auth/login', $data);
        }else{
            //validasi login sukses
            $this->login();
        }
	}
    private function login()
    {
        $email = $this->input->post('email');
        $password = $this->input->post('password');
        $input_captcha = $this->input->post('input_captcha');

        $user = $this->db->get_where('user',['email' => $email])->row_array();
        if ($this->input->post('input_captcha')!= $this->session->userdata('captcha_str') ) {
            $this->session->set_flashdata('massage','<div class = "alert alert-danger" role=alert>captcha yang dimasukan salah</div>');
            redirect ('auth');
        }
        //mengecek user jika ada
        elseif($user) {
            //mengecek jika user aktif atau tidak
            if ($user['is_active'] == 1) {
                //mengecek verifikasi password
                if (password_verify($password,$user['password'])) {
                    $data =[
                        'email' =>$user['email'],
                        'user_role' =>$user['user_role'],
                        'id' => $user['id']
                    ];
                    $this->session->set_userdata($data);
                    if ($user['user_role'] == 1) {
                        redirect('home');
                    }
                }
            }
        }
    }
}