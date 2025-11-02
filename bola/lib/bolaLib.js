function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1;
    var dy = y2 - y1;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + (dy / Math.abs(dx));
                gambarTitik(imageData, x, y, r, g, b);
            }
        } else {
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + (dy / Math.abs(dx));
                gambarTitik(imageData, x, y, r, g, b);
            }
        }
    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + (dx / Math.abs(dy));
                gambarTitik(imageData, x, y, r, g, b);
            }
        } else {
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + (dx / Math.abs(dy));
                gambarTitik(imageData, x, y, r, g, b);
            }
        }
    }
}

function gambarTitik(imageData, x, y, r, g, b) {
    var index;
    index = 4 * (Math.ceil(x) + (Math.ceil(y) * cnv.width));
    imageData.data[index] = r; // Red
    imageData.data[index + 1] = g; // Green
    imageData.data[index + 2] = b; // Blue
    imageData.data[index + 3] = 255; // Alpha
}

function floodFillStack(imageData, cnv, x, y, toFlood, color) {
    var tumpukan = [];
    tumpukan.push({ x: x, y: y });

    while (tumpukan.length > 0) {
        var titikS = tumpukan.pop();
        var indexS = 4 * (titikS.x + (titikS.y * cnv.width));
        var r1 = imageData.data[indexS];
        var g1 = imageData.data[indexS + 1];
        var b1 = imageData.data[indexS + 2];

        if ((toFlood.r == r1) && (toFlood.g == g1) && (toFlood.b == b1)) {
            imageData.data[indexS] = color.r;
            imageData.data[indexS + 1] = color.g;
            imageData.data[indexS + 2] = color.b;
            imageData.data[indexS + 3] = 255;

            tumpukan.push({ x: titikS.x + 1, y: titikS.y });
            tumpukan.push({ x: titikS.x - 1, y: titikS.y });
            tumpukan.push({ x: titikS.x, y: titikS.y + 1 });
            tumpukan.push({ x: titikS.x, y: titikS.y - 1 });
        }
    }
}

function lingkaranPolar(imageData, xc, yc, radius, color) {
    for (var theta = 0; theta < Math.PI * 2; theta += 0.001) {
        var x = xc + (radius * Math.cos(theta));
        var y = yc + (radius * Math.sin(theta));
        gambarTitik(imageData, x, y, color.r, color.g, color.b);
    }
}

function createTranslation(tx, ty) { 
    var translation = [ 
        [1, 0, tx], 
        [0, 1, ty], 
        [0, 0, 1] 
    ]; 
    return translation; 
} 

function transform_titik(titik_lama, m) { 
    var x_baru = m[0][0] * titik_lama.x + m[0][1] * titik_lama.y + m[0][2] * 1; 
    var y_baru = m[1][0] * titik_lama.x + m[1][1] * titik_lama.y + m[1][2] * 1; 
    return {x: x_baru, y: y_baru};
}

function gawang(imageData, sisi, yAtas, tinggi, lebar, r, g, b) {
    var yBawah = yAtas + tinggi;

    if (sisi === "kiri") {
        var Xawal = 0 + lebar;
        dda_line(imageData, Xawal, yAtas, Xawal, yBawah, r, g, b);
        dda_line(imageData, 0, yAtas, Xawal, yAtas, r, g, b);
        dda_line(imageData, Xawal, yBawah, 0, yBawah, r, g, b);
    } else {
        var xAkhir = cnv.width - lebar;
        dda_line(imageData, xAkhir, yAtas, xAkhir, yBawah, r, g, b);
        dda_line(imageData, xAkhir, yAtas, cnv.width, yAtas, r, g, b);
        dda_line(imageData, xAkhir, yBawah, cnv.width, yBawah, r, g, b);
    }
}

function kotak(imageData, sisi, cy, tinggi, tebal, jarakTepi, r, g, b) {
    var yAtas = cy - Math.floor(tinggi / 2);
    var yBawah = cy + Math.floor(tinggi / 2);
    var xStart;

    if (sisi === "kiri") {
        xStart = jarakTepi;
    } else {
        xStart = cnv.width - jarakTepi - tebal;
    }
    for (var i = 0; i < tebal; i++) {
        dda_line(imageData, xStart + i, yAtas, xStart + i, yBawah, r, g, b);
    }
}

var skorKiri = 0;
var skorKanan = 0;
function updateSkor() {
    document.getElementById("skorKiri").innerText = skorKiri;
    document.getElementById("skorKanan").innerText = skorKanan;
}

function resetBola(sisi) {
    bola.x = cnv.width / 2;
    bola.y = cnv.height / 2;
    
    var arahY;
    var random = Math.random();
    // atas bawah acak
    if (random < 0.5) {
        arahY = -1;
    } else {
        arahY = 1;
    }
    var kec = 5;
    if (sisi === "kiri") {
        bola.dx = kec;
        bola.dy = arahY * kec;
    } else {
        bola.dx = -kec;
        bola.dy = arahY * kec;
    }
    var skorMax = 5;
    if (skorKiri >= skorMax || skorKanan >= skorMax) {
        if (skorKiri > skorKanan) {
            alert("Permainan Selesai, Player Menang")
        } else {
            alert("Permainan Selesai, Komputer Menang")
        }
        skorKiri = 0; skorKanan = 0;
        powerUp.aktif = false;
        munculPowerUp = true;
    }
    console.log("Skor Kiri:", skorKiri, "     Skor Kanan:", skorKanan);
    updateSkor();
}