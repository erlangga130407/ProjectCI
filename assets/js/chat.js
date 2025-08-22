document.addEventListener("DOMContentLoaded", function () {
    const lastSegment = window.location.pathname.split('/').filter(Boolean).pop();
    let chatButton, chatButton2;

    if (lastSegment === 'video') {
        chatButton = document.getElementById('btn-video');
    } else {
        chatButton = document.getElementById('btn-chat');
        chatButton2 = document.getElementById('btn-chat2');
        if (chatButton2) chatButton2.disabled = true;
    }

    if (chatButton) chatButton.disabled = true;

    const form = document.getElementById('form-chat');
    form.style.display = 'none';

    // Sound notifikasi
    notificationSound = new Audio(urls + 'assets/sounds/hey.mp3');

    document.body.addEventListener('click', () => {
        notificationSound.play().then(() => {
            notificationSound.pause();
            notificationSound.currentTime = 0;
        }).catch(() => {});
    }, { once: true });

    // Saat menerima pesan
    socket.on('receive_message', data => {
        const currentRoom = document.getElementById('room_id_hide').value;
        if (data.room_id !== currentRoom) return;

        const username = document.getElementById('username').value;
        const device_id = document.getElementById('device_id_hide').value;
        tampilkanChat(data, username, device_id);

        if (data.username !== username && notificationSound) {
            notificationSound.play().catch(err => console.warn("Gagal memutar suara:", err));
        }
    });
});

let notificationSound;
let soundPlayed = false;

// Sound notifikasi
function playInitialSound() {
    if (!soundPlayed) {
        notificationSound = new Audio(urls + 'assets/sounds/sexy.mp3');
        notificationSound.play().then(() => {
            notificationSound.pause();
            notificationSound.currentTime = 0;
            soundPlayed = true;
        }).catch(() => {});
    }
}

function tampilkanChat(data, currentUsername, currentDevice_id) {
    const chatBox = document.getElementById('chat-box');
    const div = document.createElement('div');

    div.innerHTML = `<strong>${data.username}:</strong> ${data.message}`;
    div.style.textAlign = data.device_id === currentDevice_id ? 'right' : 'left';
    div.style.backgroundColor = data.username === currentUsername ? '#e0e0e0' : '#f5f5f5';
    div.style.padding = '5px';
    div.style.margin = '5px 0';
    div.style.borderRadius = '5px';

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function join_room() {
    playInitialSound(); //🔊 Putar suara saat klik tombol

    const room_id = document.getElementById('room_id').value;
    if (!room_id) return alert("Room ID tidak boleh kosong.");
    if (!confirm(`Apakah kamu ingin join room ${room_id}?`)) return;

    toggleLoading(true);
    try {
        const response = await fetch(urls + 'api/get_room/' + room_id);
        const data = await response.json();

        if (data.room_id) {
            const device_id = await getClientInfo(data.room_id);

            document.getElementById('chat-box').innerHTML = '';
            document.getElementById('form-chat').style.display = 'block';
            document.getElementById('room').textContent = `Room ${data.room_id}`;
            document.getElementById('room_id_hide').value = data.room_id;
            document.getElementById('device_id_hide').value = device_id;
            get_history_chat(data.room_id);

            socket.emit('join-room', room_id, socket.id, device_id);
        } else {
            alert("Room tidak ditemukan.");
        }
    } catch (error) {
        console.error("Gagal memanggil API:", error);
    } finally {
        toggleLoading(false);
    }
}

async function new_room() {
    playInitialSound(); //🔊 Putar suara saat klik tombol

    if (!confirm("Apakah kamu ingin membuat room baru?")) return;
    toggleLoading(true);
    try {
        const response = await fetch(urls + 'api/new_room');
        const data = await response.json();

        if (data.room_id) {
            const device_id = await getClientInfo(data.room_id);

            document.getElementById('chat-box').innerHTML = '';
            document.getElementById('form-chat').style.display = 'block';
            document.getElementById('room').textContent = `Room ${data.room_id}`;
            document.getElementById('room_id').value = data.room_id;
            document.getElementById('room_id_hide').value = data.room_id;
            document.getElementById('device_id_hide').value = device_id;

            socket.emit('join-room', data.room_id, socket.id, device_id);
        }
    } catch (error) {
        console.error("Gagal memanggil API:", error);
    } finally {
        toggleLoading(false);
    }
}

function getClientInfo(room_id) {
    return new Promise((resolve) => {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const resolution = `${window.screen.width}x${window.screen.height}`;
        const deviceMemory = navigator.deviceMemory || 'unknown';

        let gl = document.createElement('canvas').getContext('webgl');
        let gpu = 'unknown';
        if (gl) {
            let debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }

        const client = {
            room_id: room_id,
            userAgent: ua,
            platform,
            language,
            resolution,
            deviceMemory: `${deviceMemory} GB`,
            gpu
        };

        fetch(urls + 'api/device', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ client_info: client })
        })
        .then(response => response.json())
        .then(data => resolve(data.device_id || null))
        .catch(() => resolve(null));
    });
}

function get_history_chat(room_id) {
    fetch(urls + 'api/get_chat/' + room_id)
        .then(res => res.json())
        .then(chats => {
            const chatBox = document.getElementById('chat-box');
            const username = document.getElementById('username').value;
            const device_id = document.getElementById('device_id_hide').value;
            chatBox.innerHTML = '';
            chats.forEach(data => tampilkanChat(data, username, device_id));
        });
}

function sendMessage(event) {
    if (event) event.preventDefault();

    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    const room_id = document.getElementById('room_id_hide').value;
    const device_id = document.getElementById('device_id_hide').value;

    if (!username || !message) return;

    socket.emit('send_message', { username, message, room_id, device_id });
    document.getElementById('message').value = '';
    document.getElementById('username').hidden = true;

    // Tampilkan langsung pesan milik sendiri
    // tampilkanChat({ username, message }, username);
}

function toggleLoading(isLoading) {
    const waiting = document.getElementById('waiting');
    const join_room = document.getElementById('join_room');
    const new_room = document.getElementById('new_room');
    const form = document.getElementById('form-chat');

    if (isLoading) {
        waiting.textContent = 'menghubungkan ...';
        waiting.style.color = 'grey';
        waiting.style.display = 'block';
        join_room.disabled = true;
        new_room.disabled = true;
        form.style.display = 'none';
    } else {
        waiting.style.display = 'none';
        join_room.disabled = false;
        new_room.disabled = false;
    }
}

function direct(url) {
    window.location.href = urls + url;
}
