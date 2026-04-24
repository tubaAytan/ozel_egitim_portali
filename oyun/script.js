// --- VERİLER ---
const rutinPartlar = {
    1: {
        baslik: "Diş Fırçalama (Hazırlık)",
        veriler: [
            { metin: "Diş macununu eline alır!", resim: "adim1.jpeg", ses: "ses1.mpeg" },
            { metin: "Macunun kapağını açar!", resim: "adim2.jpeg", ses: "ses2.mpeg" },
            { metin: "Macunun kapağını yerine koyar!", resim: "adim3.jpeg", ses: "ses3.mpeg" },
            { metin: "Fırçayı eline alır!", resim: "adim4.jpeg", ses: "ses4.mpeg" },
            { metin: "Macunu fırçaya sürer!", resim: "adim5.jpeg", ses: "ses5.mpeg" }
        ],
        havuz: ["adim3.jpeg", "adim5.jpeg", "adim1.jpeg", "adim4.jpeg", "adim2.jpeg"]
    },
    2: {
        baslik: "Diş Fırçalama (Uygulama)",
        veriler: [
            { metin: "Fırçalama işlemini yapar!", resim: "adim6.jpeg", ses: "ses6.mpeg" },
            { metin: "Musluğu açar!", resim: "adim7.jpeg", ses: "ses7.mpeg" },
            { metin: "Fırçayı yerine koyar!", resim: "adim8.jpeg", ses: "ses8.mpeg" },
            { metin: "Ağzını su ile çalkalar!", resim: "adim9.jpeg", ses: "ses9.mpeg" },
            { metin: "Havlu ile kurulanır!", resim: "adim10.jpeg", ses: "ses10.mpeg"}
        ],
        havuz: ["adim8.jpeg", "adim6.jpeg", "adim9.jpeg", "adim7.jpeg", "adim10.jpeg"]
    }
};

const iletisimSorulari = [
    { soru: "Yeni bir arkadaş edindin. Ona ne demelisin?", siklar: ["Senin adın ne?", "İyi akşamlar."], dogru: 0 },
    { soru: "Parkta bir arkadaşının yanına gittin, onunla oynamak istiyorsun. Ne yaparsın?", siklar: ["Oyuncağını elinden alırsın.", "Seninle oynayabilir miyim? dersin."], dogru: 1 },
    { soru: "Sınıfa girince sınıf arkadaşlarına ilk olarak ne dersin?", siklar: ["İyi günler, merhaba.", "Görüşürüz."], dogru: 0 },
    { soru: "Yardıma ihtiyacın var, yardım isteyeceğin kişiye ne yaparsın?", siklar: ["Bana yardım eder misin? dersin.", "Elinden tutup çekersin."], dogru: 0 },
    { soru: "Uyumaya gitmeden önce ailene son olarak ne dersin?", siklar: ["İyi geceler.", "Kolay gelsin."], dogru: 0 }
];

let aktifPart = 0;
let guncelAdimIdx = 0;
let guncelSoruIdx = 0;
let mevcutHavuz = [];
let mevcutSecilenler = [];

// --- SES ÇALMA FONKSİYONU ---
function sesCal(dosya) {
    if(!dosya) return;
    const audio = new Audio(dosya);
    audio.play().catch(e => console.log("Ses çalınamadı (Dosya eksik olabilir):", dosya));
}

// --- MOD SEÇİMİ ---
function modSec(mod) {
    document.getElementById('ana-giris-ekrani').classList.add('gizli');
    if (mod === 'rutin') {
        document.getElementById('ana-ekran').classList.remove('gizli');
    } else {
        document.getElementById('iletisim-konteynir').classList.remove('gizli');
        iletisimSoruGoster();
    }
}

// --- RUTİNLER ---
function partBaslat(no) {
    aktifPart = no;
    guncelAdimIdx = 0;
    const veri = rutinPartlar[no];
    mevcutHavuz = [...veri.havuz];
    mevcutSecilenler = Array(veri.veriler.length).fill(null);

    document.getElementById('ana-ekran').classList.add('gizli');
    document.getElementById('oyun-konteynir').classList.remove('gizli');
    document.getElementById('oyun-basligi').innerText = veri.baslik;
    document.getElementById('mesaj').innerText = "";
    document.getElementById('devam-btn').classList.add('gizli');

    const sAlani = document.getElementById('secilenler-alani');
    sAlani.innerHTML = "";
    mevcutSecilenler.forEach(() => {
        let kutu = document.createElement('div');
        kutu.className = "bos-kutu";
        sAlani.appendChild(kutu);
    });

    ciz();
    setTimeout(yonergeGoster, 500);
}

function yonergeGoster() {
    const veri = rutinPartlar[aktifPart];
    if (guncelAdimIdx >= veri.veriler.length) return;
    
    const yEkrani = document.getElementById('yonerge-ekrani');
    const yMetni = document.getElementById('yonerge-metni');
    const icerik = document.getElementById('oyun-icerik-alani');
    
    const adim = veri.veriler[guncelAdimIdx];
    yMetni.innerText = adim.metin;
    yEkrani.classList.remove('gizli');
    icerik.classList.add('oyun-pasif');

    // Sesi çal
    sesCal(adim.ses);

    setTimeout(() => {
        yEkrani.classList.add('gizli');
        icerik.classList.remove('oyun-pasif');
    }, 2500); 
}

function yukarıGonder(idx) {
    const veri = rutinPartlar[aktifPart];
    const secilenResim = mevcutHavuz[idx];
    const mesajKutusu = document.getElementById('mesaj');

    if (secilenResim === veri.veriler[guncelAdimIdx].resim) {
        mevcutSecilenler[guncelAdimIdx] = secilenResim;
        mevcutHavuz[idx] = null;
        guncelAdimIdx++;
        mesajKutusu.innerText = "";
        ciz();
        if (guncelAdimIdx < veri.veriler.length) setTimeout(yonergeGoster, 800);
        else basariAni();
    } else {
        mesajKutusu.innerText = "Tekrar dene!";
        mesajKutusu.style.color = "red";
        // Yanlış resme tıklanıldığında bir sarsıntı efekti eklenebilir
    }
}

function basariAni() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    document.getElementById('mesaj').innerHTML = "<h2 style='color:#48bb78; font-size:40px;'>HARİKA!</h2>";
    document.getElementById('devam-btn').classList.remove('gizli');
}

function ciz() {
    const hAlani = document.getElementById('havuz-alani');
    const kutular = document.querySelectorAll('.bos-kutu');
    hAlani.innerHTML = "";
    mevcutHavuz.forEach((resim, i) => {
        if (resim) {
            let img = document.createElement('img');
            img.src = resim;
            img.onclick = () => yukarıGonder(i);
            hAlani.appendChild(img);
        }
    });
    mevcutSecilenler.forEach((resim, i) => {
        kutular[i].innerHTML = resim ? `<img src="${resim}">` : "";
    });
}

function sonrakiPartaGec() {
    if (rutinPartlar[aktifPart + 1]) partBaslat(aktifPart + 1);
    else { location.reload(); }
}

// --- İLETİŞİM ---
function iletisimSoruGoster() {
    const s = iletisimSorulari[guncelSoruIdx];
    document.getElementById('iletisim-soru-metni').innerText = s.soru;
    document.getElementById('sik-metin-0').innerText = s.siklar[0];
    document.getElementById('sik-metin-1').innerText = s.siklar[1];
}

function iletisimCevapKontrol(secilen) {
    const dogru = iletisimSorulari[guncelSoruIdx].dogru;
    const mesaj = document.getElementById('iletisim-mesaj');
    const buton = document.getElementById(`sik-metin-${secilen}`);

    if (secilen === dogru) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        mesaj.innerHTML = "<span style='color:#48bb78'>AFERİN! DOĞRU!</span>";
        guncelSoruIdx++;
        setTimeout(() => {
            mesaj.innerText = "";
            if (guncelSoruIdx < iletisimSorulari.length) iletisimSoruGoster();
            else {
                mesaj.innerHTML = "<h1>HARİKA! Hepsini Bitirdin.</h1>";
                setTimeout(() => location.reload(), 3000);
            }
        }, 2000);
    } else {
        buton.classList.add('yanlis-cevap');
        mesaj.innerHTML = "<span style='color:red'>Hımm, tekrar dene!</span>";
        setTimeout(() => {
            buton.classList.remove('yanlis-cevap');
            mesaj.innerText = "";
        }, 1000);
    }
}

// --- SİSTEM ---
function menuAcKapat() { document.getElementById('menu-icerik').classList.toggle('gizli'); }
function oyunuBitir() { 
    document.body.innerHTML = `
        <div style="text-align:center; color:white; margin-top:20%;">
            <h1>Program Kapatıldı.</h1>
            <button onclick="location.reload()" style="padding:15px; border-radius:10px; cursor:pointer;">Yeniden Başlat</button>
        </div>`; 
}