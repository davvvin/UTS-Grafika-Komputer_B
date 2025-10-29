var cnv = document.getElementById("canva1");
var contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);

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
    tumpukan.push({x: x, y: y});

    while(tumpukan.length > 0) {
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

            tumpukan.push({x: titikS.x + 1, y: titikS.y});
            tumpukan.push({x: titikS.x - 1, y: titikS.y});
            tumpukan.push({x: titikS.x, y: titikS.y + 1});
            tumpukan.push({x: titikS.x, y: titikS.y - 1});
        }
    }
}

function lingkaranPolar(imageData, xc, yc, radius, color) {
    for (var theta= 0; theta < Math.PI * 2; theta += 0.001) {
        var x = xc + (radius * Math.cos(theta));
        var y = yc + (radius * Math.sin(theta));
        gambarTitik(imageData, x, y, color.r, color.g, color.b);
    }
}

function translasi(titik_lama, jarak) {
    var x_baru = titik_lama.x + jarak.x;
    var y_baru = titik_lama.y + jarak.y;

    return {x: x_baru, y: y_baru};
}

function gawang(imageData, sisi, yAtas, tinggi, lebar, r, g, b) {
    var yBawah = yAtas + tinggi;

    if (sisi === "kiri") {
        var Xawal  = 0 + lebar;  
        dda_line(imageData, Xawal,  yAtas, Xawal,  yBawah, r, g, b);
        dda_line(imageData, 0, yAtas, Xawal,  yAtas, r, g, b);
        dda_line(imageData, Xawal, yBawah, 0,  yBawah, r, g, b);
    } else {
        var xAkhir  = cnv.width - lebar;      
        dda_line(imageData, xAkhir,  yAtas, xAkhir,  yBawah, r, g, b);
        dda_line(imageData, xAkhir,  yAtas, cnv.width, yAtas, r, g, b);
        dda_line(imageData, xAkhir,  yBawah, cnv.width, yBawah, r, g, b);
    }
}

function kotak(imageData, sisi, cy, tinggi, tebal, jarakTepi, r, g, b) {
    var yAtas  = cy - Math.floor(tinggi / 2);
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

var bola = {x: cnv.width / 2, y: cnv.height / 2, radius: 10, dx: 5, dy: -5, color: { r: 0, g: 0, b: 255 }};

var kotakTinggi = 120;
var kotakTebal  = 15;
var kotakJarak = 15;

var kotakKiriCY  = Math.floor(cnv.height / 2);
var kotakKananCY = Math.floor(cnv.height / 2);

var keyW = false;
var keyS = false;
var aiKec = 4;

document.addEventListener("keydown", function(event) {
    var key = event.key.toLowerCase();
    if (key === "w") {
        keyW = true;
    } else if (key === "s") {
        keyS = true;
    }
});

document.addEventListener("keyup", function(event) {
    var key = event.key.toLowerCase();
    if (key === "w") {
        keyW = false;
    } else if (key === "s") {
        keyS = false;
    }
});

var skorKiri = 0;
var skorKanan = 0;
var skorMax  = 5;
function updateSkor() {
    document.getElementById("skorKiri").innerText = skorKiri;
    document.getElementById("skorKanan").innerText = skorKanan;
}

function resetBola(kiri = true) {
    bola.x = cnv.width / 2;
    bola.y = cnv.height / 2;
    var arahY;
    var random = Math.random();
    if (random < 0.5) {
        arahY = -1;
    } else {
        arahY = 1; 
    }
    var kec = 5;
    if (kiri) {
        bola.dx = kec;          
        bola.dy = arahY * kec; 
    } else {
        bola.dx = -kec;         
        bola.dy = arahY * kec; 
    }
    if (skorKiri >= skorMax || skorKanan >= skorMax) {
        if (skorKiri > skorKanan) {
            alert("Permainan Selesai, Player Menang")
        } else {
            alert("Permainan Selesai, Komputer Menang")
        }
        skorKiri = 0; skorKanan = 0;
    }
    console.log("Skor Kiri:", skorKiri, "     Skor Kanan:", skorKanan);
    updateSkor();
}


function polar_circle2(){
    // mantul kotak kiri(player)
    var kotakKiriX1 = kotakJarak;
    var kotakKiriX2 = kotakJarak + kotakTebal;
    var kotakKiriY1 = kotakKiriCY - Math.floor(kotakTinggi / 2);
    var kotakKiriY2 = kotakKiriCY + Math.floor(kotakTinggi / 2);
    if ((bola.x - bola.radius) <= kotakKiriX2 && (bola.x + bola.radius) >= kotakKiriX1 && bola.y >= kotakKiriY1 && bola.y <= kotakKiriY2 && bola.dx < 0) {
        bola.dx *= -1;                 
        bola.x  = kotakKiriX2 + bola.radius + 0.5;
    }  

    // mantul kotak kanan 
    var kotakKananX1 = cnv.width - kotakJarak - kotakTebal;
    var kotakKananX2 = cnv.width - kotakJarak;
    var kotakKananY1 = kotakKananCY - Math.floor(kotakTinggi / 2);
    var kotakKananY2 = kotakKananCY + Math.floor(kotakTinggi / 2);
    if ((bola.x + bola.radius) >= kotakKananX1 && (bola.x - bola.radius) <= kotakKananX2 && bola.y >= kotakKananY1 && bola.y <= kotakKananY2 && bola.dx > 0) {
        bola.dx *= -1;
        bola.x  = kotakKananX1 - bola.radius - 0.5;
    }

    // gerak bola
    var posisiBaru = translasi({x: bola.x, y: bola.y}, {x: bola.dx, y: bola.dy});
    bola.x = posisiBaru.x;
    bola.y = posisiBaru.y;

    if (bola.x - bola.radius <= 0) {
        skorKanan++;
        resetBola(true);   
        requestAnimationFrame(polar_circle2);
        return;
    }
    if (bola.x + bola.radius >= cnv.width) {
        skorKiri++;
        resetBola(false); 
        requestAnimationFrame(polar_circle2);
        return;
    }

    if (bola.y + bola.radius > cnv.height || bola.y - bola.radius < 0) {
            bola.dy *= -1;
    }

    contex1.clearRect(0, 0, cnv.width, cnv.height);
    imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);

    var cx = Math.floor(cnv.width / 2);
    var cy = Math.floor(cnv.height / 2);
    dda_line(imageData, cx, 0, cx, cnv.height, 30, 30, 30);
    lingkaranPolar(imageData, cx, cy, 60, {r: 30, g: 30, b: 30})
    
    if (keyW) {
        kotakKiriCY -= 4;
    }
    if (keyS) {
        kotakKiriCY += 4;
    }

    // gerak komputer
    if (bola.y < kotakKananCY) {
        kotakKananCY -= aiKec;
    } else if (bola.y > kotakKananCY) {
        kotakKananCY += aiKec;
    }

    // batas atas bawah
    // kiri
    var tengah = Math.floor(kotakTinggi / 2);
    if (kotakKiriCY - tengah < 0) {
        kotakKiriCY = tengah;
    }
    if (kotakKiriCY + tengah > cnv.height) {
        kotakKiriCY = cnv.height - tengah;
    }

    // kanan
    if (kotakKananCY - tengah < 0) {
        kotakKananCY = tengah; 
    }
    if (kotakKananCY + tengah > cnv.height) { 
        kotakKananCY = cnv.height - tengah; 
    }

    kotak(imageData, "kiri",  kotakKiriCY,  kotakTinggi, kotakTebal, kotakJarak, 255, 0, 0);
    kotak(imageData, "kanan", kotakKananCY, kotakTinggi, kotakTebal, kotakJarak, 0, 255, 0);
    
    var tinggi = 200;
    var yAwal = Math.floor((cnv.height - tinggi) / 2);
    var lebar  = 80;
    gawang(imageData, "kiri",  yAwal, tinggi, lebar, 30, 30, 30);
    gawang(imageData, "kanan", yAwal, tinggi, lebar, 30, 30, 30);

    lingkaranPolar(imageData, bola.x, bola.y, bola.radius, bola.color);
    floodFillStack(imageData, cnv, Math.floor(bola.x), Math.floor(bola.y), {r:0,g:0,b:0}, bola.color);

    contex1.putImageData(imageData, 0, 0);
    requestAnimationFrame(polar_circle2);
}
polar_circle2();