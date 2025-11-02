var durasi = 5000;

// power up kotaknya jadi tinggi, 520
function powerKotakTinggi(side) {
    var tinggiBaru = 400;
    
    if (side === "kiri") {
        kotakTinggiKiri = 120 + tinggiBaru;
        setTimeout(function () {
            kotakTinggiKiri = 120;
        }, durasi);
    } else if (side === "kanan") {
        kotakTinggiKanan = 120 + tinggiBaru;
        setTimeout(function () {
            kotakTinggiKanan = 120;
        }, durasi);
    }
}

// power up kotaknya jadi pendek, 40
function powerKotakPendek(side) {
    var tinggiBaru = 80;

    if (side === "kiri") {
        kotakTinggiKiri = 120 - tinggiBaru;
        setTimeout(function () {
            kotakTinggiKiri = 120;
        }, durasi);
    } else if (side === "kanan") {
        kotakTinggiKanan = 120 - tinggiBaru;
        setTimeout(function () {
            kotakTinggiKanan = 120;
        }, durasi);
    }
}

// power up bola nya jadi cepet
function powerBola() {
    bola.dx = bola.dx * 2;
    bola.dy = bola.dy * 2;
}

// power up bola nya jadi cepet tapi sekalian balik
function bolaBalik() {
    bola.dx = bola.dx * -2;
    bola.dy = bola.dy * -2;
}

var powerUp = { aktif: false, x: 0, y: 0, w: 20, h: 20, warna: { r: 255, g: 255, b: 0 } };
var munculPowerUp = true;
function updatePowerUp() {
    if (!powerUp.aktif && munculPowerUp) {
        if (Math.random() < 0.5) {
            powerUp.aktif = true;
            powerUp.x = 150 + Math.random() * (cnv.width - 300);
            powerUp.y = 50 + Math.random() * (cnv.height - 100);
        }
    }

    if (powerUp.aktif) {
        for (var i = 0; i < powerUp.w; i++) {
            dda_line(imageData, powerUp.x + i, powerUp.y, powerUp.x + i, powerUp.y + powerUp.h, powerUp.warna.r, powerUp.warna.g, powerUp.warna.b);
        }

        if (bola.x >= powerUp.x - bola.radius && bola.x <= powerUp.x + powerUp.w + bola.radius && bola.y >= powerUp.y - bola.radius && bola.y <= powerUp.y + powerUp.h + bola.radius) {
            var rndm = Math.random();
            if (rndm < 0.25) {
                powerKotakTinggi(lastTouch);
            } else if (rndm >= 0.25 && rndm < 0.5) {
                powerBola();
            } else if (rndm >= 0.5 && rndm < 0.75) {
                powerKotakPendek(lastTouch);
            } else {
                bolaBalik();
            }
            
            powerUp.aktif = false;
            munculPowerUp = false;

            setTimeout(() => {
                munculPowerUp = true;
            }, durasi);
        }
    }
}