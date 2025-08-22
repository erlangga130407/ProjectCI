<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example Access Helper
 */

// contoh fungsi sederhana
if ( ! function_exists('is_logged_in'))
{
    function is_logged_in()
    {
        $CI =& get_instance();
        return $CI->session->userdata('logged_in') ? true :false;
    }
}