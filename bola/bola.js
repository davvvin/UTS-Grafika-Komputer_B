var keyW = false;
var keyS = false;
document.addEventListener("keydown", function (event) {
    var key = event.key.toLowerCase();
    if (key === "w") {
        keyW = true;
    } else if (key === "s") {
        keyS = true;
    }
});

document.addEventListener("keyup", function (event) {
    var key = event.key.toLowerCase();
    if (key === "w") {
        keyW = false;
    } else if (key === "s") {
        keyS = false;
    }
});

var cnv = document.getElementById("canva1");
var contex1 = cnv.getContext("2d");
var imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);

// parameter kotak
var kotakTebal = 15;
var kotakJarakTepi = 15;
var kotakTinggiKiri = 120;
var kotakTinggiKanan = 120;
// centernya 
var kotakKiriCY = Math.floor(cnv.height / 2);
var kotakKananCY = Math.floor(cnv.height / 2);

var aiKec = 4;
var lastTouch = "kiri";
var bola = { x: cnv.width / 2, y: cnv.height / 2, radius: 10, dx: 5, dy: -5, color: { r: 0, g: 0, b: 255 } };
function polar_circle2() {
    // mantul kotak kiri(player)
    // batas batas kotak
    var kotakKiriX1 = kotakJarakTepi;
    var kotakKiriX2 = kotakJarakTepi + kotakTebal;
    var kotakKiriY1 = kotakKiriCY - Math.floor(kotakTinggiKiri / 2);
    var kotakKiriY2 = kotakKiriCY + Math.floor(kotakTinggiKiri / 2);
    if ((bola.x - bola.radius) <= kotakKiriX2 && (bola.x + bola.radius) >= kotakKiriX1 && bola.y >= kotakKiriY1 && bola.y <= kotakKiriY2 && bola.dx < 0) {
        bola.dx *= -1;
        bola.x = kotakKiriX2 + bola.radius + 0.5;
        lastTouch = "kiri";
    }
    
    // mantul kotak kanan 
    // batas batas kotak
    var kotakKananX1 = cnv.width - kotakJarakTepi - kotakTebal;
    var kotakKananX2 = cnv.width - kotakJarakTepi;
    var kotakKananY1 = kotakKananCY - Math.floor(kotakTinggiKanan / 2);
    var kotakKananY2 = kotakKananCY + Math.floor(kotakTinggiKanan / 2);
    if ((bola.x + bola.radius) >= kotakKananX1 && (bola.x - bola.radius) <= kotakKananX2 && bola.y >= kotakKananY1 && bola.y <= kotakKananY2 && bola.dx > 0) {
        bola.dx *= -1;
        bola.x = kotakKananX1 - bola.radius - 0.5;
        lastTouch = "kanan";
    }

    // gerak bola
    var matriks = createTranslation(bola.dx, bola.dy); 
    var posBaru = transform_titik({x: bola.x, y: bola.y}, matriks); 
    bola.x = posBaru.x; 
    bola.y = posBaru.y;

    // sentuh kiri canvas
    if (bola.x - bola.radius <= 0) {
        skorKanan++;
        resetBola("kiri");
        requestAnimationFrame(polar_circle2);
        return;
    }
    // sentuh kanan 
    if (bola.x + bola.radius >= cnv.width) {
        skorKiri++;
        resetBola("kanan");
        requestAnimationFrame(polar_circle2);
        return;
    }

    // mantul frame canvas atas bawah
    if (bola.y + bola.radius > cnv.height || bola.y - bola.radius < 0) {
        bola.dy *= -1;
    }

    contex1.clearRect(0, 0, cnv.width, cnv.height);
    imageData = contex1.getImageData(0, 0, cnv.width, cnv.height);

    // bikin garis lingkaran tengah
    var cx = Math.floor(cnv.width / 2);
    var cy = Math.floor(cnv.height / 2);
    dda_line(imageData, cx, 0, cx, cnv.height, 30, 30, 30);
    lingkaranPolar(imageData, cx, cy, 60, { r: 30, g: 30, b: 30 })

    // gerak player
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

    // batas atas bawah  (biar kotak ga tembus frame atas bawah)
    // kiri
    var tengahKiri = Math.floor(kotakTinggiKiri / 2);
    if (kotakKiriCY - tengahKiri < 0) {
        kotakKiriCY = tengahKiri;
    }
    if (kotakKiriCY + tengahKiri > cnv.height) {
        kotakKiriCY = cnv.height - tengahKiri;
    }

    // kanan
    var tengahKanan = Math.floor(kotakTinggiKanan / 2);
    if (kotakKananCY - tengahKanan < 0) {
        kotakKananCY = tengahKanan;
    }
    if (kotakKananCY + tengahKanan > cnv.height) {
        kotakKananCY = cnv.height - tengahKanan;
    }

    // bikin kotak 
    kotak(imageData, "kiri", kotakKiriCY, kotakTinggiKiri, kotakTebal, kotakJarakTepi, 255, 0, 0);
    kotak(imageData, "kanan", kotakKananCY, kotakTinggiKanan, kotakTebal, kotakJarakTepi, 0, 255, 0);

    // bikin gambar gawang
    var tinggi = 200;
    var yAwal = Math.floor((cnv.height - tinggi) / 2);
    var lebar = 80;
    gawang(imageData, "kiri", yAwal, tinggi, lebar, 30, 30, 30);
    gawang(imageData, "kanan", yAwal, tinggi, lebar, 30, 30, 30);

    updatePowerUp();

    
    lingkaranPolar(imageData, bola.x, bola.y, bola.radius, bola.color);
    floodFillStack(imageData, cnv, Math.floor(bola.x), Math.floor(bola.y), { r: 0, g: 0, b: 0 }, bola.color);

    contex1.putImageData(imageData, 0, 0);
    requestAnimationFrame(polar_circle2);
}
polar_circle2();