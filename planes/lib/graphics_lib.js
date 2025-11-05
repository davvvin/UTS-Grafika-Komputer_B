

function gambar_titik(imageData, x, y, r, g, b) {
    var index;
    index = 4 * (Math.round(x) + (Math.round(y) * cnv.width));
    imageData.data[index + 0] = r; // Red
    imageData.data[index + 1] = g; // Green
    imageData.data[index + 2] = b; // Blue
    imageData.data[index + 3] = 255; // Alpha
}

function dda_line(imageData, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + (dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y - (dy / Math.abs(dx));
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    } else {
        if (y2 > y1) {
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + (dx / Math.abs(dy));
                gambar_titik(imageData, x, y, r, g, b);
            }
        } else {
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x - (dx / Math.abs(dy));
                gambar_titik(imageData, x, y, r, g, b);
            }
        }
    }
}


function lingkaran_polar(imageData, xc, yc, radius, r, g, b) {
    for (var theta = 0; theta < Math.PI * 2; theta += 0.0005) {
        var x = xc + radius * Math.cos(theta);
        var y = yc + radius * Math.sin(theta);
        gambar_titik(imageData, x, y, r, g, b);
    }
    }

function translasi(titik_lama, jarak) {
    var x_baru = titik_lama.x + jarak.x;
    var y_baru = titik_lama.y + jarak.y;
    return { x: x_baru, y: y_baru };
}

function getDistance(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}



