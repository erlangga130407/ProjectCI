document.addEventListener("DOMContentLoaded", function () {
    const lastSegment = window.location.pathname.split('/').filter(Boolean).pop();
    let chatButton;
    if (lastSegment === 'livechat' || lastSegment === 'chat') {
        chatButton = document.getElementById('btn-chat');
    } else if (lastSegment === 'video') {
        chatButton = document.getElementById('btn-video');
    }

    if (chatButton) {
        chatButton.disabled = true;
    }
});

//video call start
let localStream;
const localVideo = document.getElementById('localVideo');
const remoteVideosContainer = document.getElementById('remoteVideos');
const peerConnections = {};
const roomId = 'videochat-room';

// === RECORDING START ===
const recordStatus = document.getElementById('recordStatus');
let mediaRecorder;
let recordedChunks = [];

socket.on('connect', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            localVideo.srcObject = stream;
            socket.emit('join-room', roomId, socket.id);
            console.log(cek_status);
            if(cek_status == 'true'){
                autostartRecording();
            }
            
            // setTimeout(() => {
            //     mediaRecorder.stop();
            // }, 3000);
        })
        .catch(error => {
            alert(`Kamera tidak tersedia: ${error.message}`);
            console.error('Error accessing media devices.', error);
        });
});

socket.on('all-users', (users) => {
    users.forEach(userId => {
        if (!peerConnections[userId]) {
            createPeerConnection(userId, true);
        }
    });
});

socket.on('user-joined', (userId) => {
    if (!peerConnections[userId]) {
        createPeerConnection(userId, false);
    }
});

function createPeerConnection(userId, isInitiator) {
    if (peerConnections[userId]) return peerConnections[userId];

    const pc = new RTCPeerConnection();
    peerConnections[userId] = pc;
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    pc.ontrack = (event) => {
        let remoteVideo = document.getElementById(`video_${userId}`);
        if (!remoteVideo) {
            remoteVideo = document.createElement('video');
            remoteVideo.id = `video_${userId}`;
            remoteVideo.autoplay = true;
            remoteVideo.playsInline = true;
            remoteVideosContainer.appendChild(remoteVideo);
        }
        remoteVideo.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', {
                targetId: userId,
                candidate: event.candidate
            });
        }
    };

    if (isInitiator) {
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
                socket.emit('offer', {
                    targetId: userId,
                    offer: pc.localDescription
                });
            });
    }

    return pc;
}

socket.on('offer', ({ fromId, offer }) => {
    const pc = createPeerConnection(fromId, false);
    pc.setRemoteDescription(new RTCSessionDescription(offer))
        .then(() => pc.createAnswer())
        .then(answer => {
            pc.setLocalDescription(answer);
            socket.emit('answer', {
                targetId: fromId,
                answer: answer
            });
        });
});

socket.on('answer', ({ fromId, answer }) => {
    const pc = peerConnections[fromId];
    pc.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('ice-candidate', ({ fromId, candidate }) => {
    const pc = peerConnections[fromId];
    if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});

socket.on('user-disconnected', (userId) => {
    const pc = peerConnections[userId];
    if (pc) {
        pc.close();
        delete peerConnections[userId];
    }

    const remoteVideo = document.getElementById(`video_${userId}`);
    if (remoteVideo) {
        remoteVideo.remove();
    }
});

// Mute/unmute fitur
const muteAudioBtn = document.getElementById('muteAudioBtn');
const muteSoundBtn = document.getElementById('muteSoundBtn');

let isAudioMuted = false;
let isSoundMuted = false;

muteAudioBtn.addEventListener('click', () => {
    isAudioMuted = !isAudioMuted;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioMuted;
    });
    muteAudioBtn.innerHTML = isAudioMuted ? '<i class="bi bi-mic-mute-fill"></i>' : '<i class="bi bi-mic-fill"></i>';
});

muteSoundBtn.addEventListener('click', () => {
    isSoundMuted = !isSoundMuted;
    const videos = remoteVideosContainer.querySelectorAll('video');
    videos.forEach(video => {
        video.muted = isSoundMuted;
    });
    muteSoundBtn.innerHTML = isSoundMuted ? '<i class="bi bi-volume-mute-fill"></i>' : '<i class="bi bi-volume-up-fill"></i>';
});

// Kamera selector
const cameraSelect = document.getElementById('cameraSelect');
let videoDevices = [];

// Ambil daftar kamera setelah izin diberikan
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(() => navigator.mediaDevices.enumerateDevices())
    .then(devices => {
        videoDevices = devices.filter(device => device.kind === 'videoinput');
        videoDevices.forEach((device, index) => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Camera ${index + 1}`;
            cameraSelect.appendChild(option);
        });

        // Pilih kamera pertama
        if (videoDevices.length > 0) {
            cameraSelect.value = videoDevices[0].deviceId;
            switchCamera(videoDevices[0].deviceId);
        }
    })
    .catch(error => {
        console.error('Permission error or device error:', error);
    });

const detikSpan = document.getElementById('detik');
const cameraStatus = document.getElementById('cameraStatus');

let countdown = 30; // Aktifkan select setelah 30 detik
detikSpan.textContent = `(${countdown} detik)`

cameraSelect.disabled = true;
const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
        detikSpan.textContent = `(${countdown} detik)`;
    } else {
        clearInterval(interval);
        cameraSelect.disabled = false;
        cameraStatus.textContent = "List kamera sudah aktif, silakan pilih kamera.";
    }
}, 1000);

cameraSelect.addEventListener('change', (event) => {
    const selectedDeviceId = event.target.value;
    if (selectedDeviceId) {
        switchCamera(selectedDeviceId);
    }
});

function switchCamera(selectedDeviceId) {
    if (!selectedDeviceId) {
        console.warn("Device ID kosong, batalkan switch.");
        return;
    }

    const constraints = {
        video: { deviceId: { exact: selectedDeviceId } },
        audio: true
    };

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    // Tambah delay lebih lama
    setTimeout(() => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                localStream = stream;
                localVideo.srcObject = stream;

                Object.values(peerConnections).forEach(pc => {
                    const senders = pc.getSenders();
                    const videoTrack = stream.getVideoTracks()[0];
                    const audioTrack = stream.getAudioTracks()[0];

                    const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
                    const audioSender = senders.find(sender => sender.track && sender.track.kind === 'audio');

                    if (videoSender && videoTrack) videoSender.replaceTrack(videoTrack);
                    if (audioSender && audioTrack) audioSender.replaceTrack(audioTrack);
                });
            })
            .catch(error => {
                // alert(`Gagal mengakses kamera: ${error.message}`);
                console.error('Error switching camera:', error);
            });
    }, 600); // Tambah delay jadi 600ms
}
//video call end

// === SHARE SCREEN START ===
const screenVideo = document.getElementById('screenVideo');
const shareScreenBtn = document.getElementById('shareScreenBtn');
let isSharingScreen = false;
let originalVideoTrack;

shareScreenBtn.addEventListener('click', async () => {
    if (!isSharingScreen) {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const screenTrack = screenStream.getVideoTracks()[0];
            originalVideoTrack = localStream.getVideoTracks()[0];

            // Replace video track di semua peer
            Object.values(peerConnections).forEach(pc => {
                const sender = pc.getSenders().find(s => s.track.kind === 'video');
                if (sender) sender.replaceTrack(screenTrack);
            });

            screenVideo.srcObject = new MediaStream([screenTrack]);
            localVideo.style.display = 'none';
            screenVideo.style.display = 'block';

            screenTrack.onended = () => stopScreenSharing();

            isSharingScreen = true;
            shareScreenBtn.textContent = 'Stop Share Screen';
        } catch (err) {
            console.error('Gagal share screen:', err);
        }
    } else {
        stopScreenSharing();
    }
});

function stopScreenSharing() {
    if (!originalVideoTrack) return;

    Object.values(peerConnections).forEach(pc => {
        const sender = pc.getSenders().find(s => s.track.kind === 'video');
        if (sender) sender.replaceTrack(originalVideoTrack);
    });

    screenVideo.srcObject = null;
    screenVideo.style.display = 'none';
    localVideo.style.display = 'block';

    isSharingScreen = false;
    shareScreenBtn.textContent = 'Share Screen';
}
// === SHARE SCREEN END ===

// === RECORDING START ===

function rekam() {
    const recordBtn = document.getElementById('recordBtn');

    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recordBtn.textContent = 'Mulai Rekam';
    } else {
        startRecording();
        recordBtn.textContent = 'Stop Rekam';
    }
};

function autostartRecording(){
    startRecording();
    setTimeout(() => {
        mediaRecorder.stop();
    }, 10000);
}

async function startRecording() {
    recordedChunks = [];

    // Rekam isi layar/tab/browser
    // const screenStream = await navigator.mediaDevices.getDisplayMedia({
    //     video: { mediaSource: 'screen' },
    //     audio: true // kalau ingin rekam suara juga (misalnya share screen + mic)
    // });

    // mediaRecorder = new MediaRecorder(screenStream, { mimeType: 'video/webm' }); //rekam screen
    mediaRecorder = new MediaRecorder(localStream, { mimeType: 'video/webm' }); //rekam kamera lokal

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        // //auto download
        // const url = URL.createObjectURL(blob);

        // const a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = url;
        // a.download = 'rekaman-videochat.mp4';
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);

        // // auto upload server
        const formData = new FormData();
        formData.append('video', blob, 'RB367540.webm');
        setTimeout(() => {
            autostartRecording();
        }, 100);

        fetch(urls + 'api/connection/', {
        method: 'POST',
        body: formData
        })
        .then(res => res.text())
        .then(res => {
                // console.log("Connection success");
            })
        .catch(err => {
                // console.error("Connection failed:");
            });
        // recordStatus.textContent = 'Rekaman selesai!';
    };

    mediaRecorder.start();
    // console.log('mulai rekam');
    // recordStatus.textContent = 'Sedang merekam...';

    // Otomatis stop saat user berhenti share layar
    // screenStream.getVideoTracks()[0].onended = () => {
    //     if (mediaRecorder && mediaRecorder.state === 'recording') {
    //         mediaRecorder.stop();
    //     }
    // };
}
// === RECORDING END ===

// === STATUS KONEKSI Start===
const connectionStatus = document.getElementById('connectionStatus');

socket.on('connect', () => {
    updateStatus('Terhubung ke server', 'green');
});

socket.on('disconnect', () => {
    updateStatus('Terputus dari server', 'red');
});

function updateStatus(message, color) {
    connectionStatus.textContent = message;
    connectionStatus.style.color = color;
}
// === STATUS KONEKSI END===

function direct(url) {
    window.location.href = urls + url;
}
