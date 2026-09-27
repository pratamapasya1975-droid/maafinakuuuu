document.addEventListener("DOMContentLoaded", () => {
    // === MUSIC CONTROL SYSTEM (Persistent across pages) ===
    const bgMusic = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicToggle");
    const musicIcon = musicBtn.querySelector("i");
    
    // Ambil status musik dari sessionStorage
    let isPlaying = sessionStorage.getItem("musicPlaying") === "true";
    let savedTime = sessionStorage.getItem("musicTime") || 0;

    // Set waktu terakhir jika ada
    if (savedTime > 0) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    // Fungsi untuk update ikon
    const updateIcon = (playing) => {
        if (playing) {
            musicIcon.classList.remove("fa-music");
            musicIcon.classList.add("fa-pause");
        } else {
            musicIcon.classList.remove("fa-pause");
            musicIcon.classList.add("fa-music");
        }
    };

    // Coba putar otomatis jika sebelumnya sedang play
    if (isPlaying) {
        bgMusic.play().then(() => {
            updateIcon(true);
        }).catch(() => {
            // Jika terblokir autoplay policy browser
            isPlaying = false;
            sessionStorage.setItem("musicPlaying", "false");
            updateIcon(false);
        });
    }

    // Toggle Play/Pause saat tombol diklik
    musicBtn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play();
            isPlaying = true;
        } else {
            bgMusic.pause();
            isPlaying = false;
        }
        updateIcon(isPlaying);
        sessionStorage.setItem("musicPlaying", isPlaying);
    });

    // Simpan durasi musik sebelum berpindah halaman
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("musicTime", bgMusic.currentTime);
        sessionStorage.setItem("musicPlaying", !bgMusic.paused);
    });

    // Trigger lagu pada klik pertama di layar (jika belum play)
    document.body.addEventListener("click", (e) => {
        // Abaikan jika yang diklik adalah tombol musik agar tidak bentrok
        if (!isPlaying && !e.target.closest('#musicToggle')) {
            bgMusic.play().then(() => {
                isPlaying = true;
                updateIcon(true);
                sessionStorage.setItem("musicPlaying", "true");
            }).catch(err => console.log("Autoplay diizinkan setelah interaksi."));
        }
    }, { once: true });


    // === BACKGROUND PARTICLES (Floating Hearts/Stars) ===
    function createParticle() {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        
        // Pilih random icon (heart, star, atau sparkle)
        const shapes = ['♡', '✧', '✦'];
        particle.innerText = shapes[Math.floor(Math.random() * shapes.length)];
        
        // Styling random
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.fontSize = (Math.random() * 15 + 10) + "px"; // 10px - 25px
        particle.style.animationDuration = (Math.random() * 4 + 6) + "s"; // 6s - 10s

        // Tambahkan warna pink untuk beberapa partikel
        if(Math.random() > 0.5) {
            particle.style.color = "#f7c6d0";
        }

        document.getElementById("particles-container").appendChild(particle);

        // Bersihkan partikel setelah animasi selesai
        setTimeout(() => {
            particle.remove();
        }, 10000);
    }

    // Generate partikel setiap 1.5 detik
    setInterval(createParticle, 1500);
});