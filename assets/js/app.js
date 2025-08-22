const socket = io('https://socket.trisnatya.my.id/');

const real_url = window.location.pathname;
const url_arr = real_url.split("/");
let urls = "";

if ((url_arr[1].toLowerCase() == 'livechat') && (url_arr[1] != null || url_arr[1] != '')) {
    urls = window.location.origin + '/' + url_arr[1] + '/';
} else {
    urls = window.location.origin + '/';
}
