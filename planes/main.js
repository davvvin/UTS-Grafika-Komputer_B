
const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

let mouseX = 0;
let mouseY = 0;

const playerModel = [
    { x: 0, y: -15 },
    { x: -15, y: 15 },
    { x: 15, y: 15 }
];

// coba buat pelurunya dulu
let bullets = [];
const bulletSpeed = 5;

// musuhan nih
let enemies = [];
const enemySpawnRate = 0.01; // kemungkinan untuk munculnya musuh (Increased for testing)


// pergerakan peswat
cnv.addEventListener('mousemove', (e) => {
    const rect = cnv.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// menembak
cnv.addEventListener('click', (e) =>{
    let endOfPlane = {
        x: mouseX,
        y: mouseY - 20,
    }
    bullets.push(endOfPlane);
})

function gameLoop() {
    let imageData = ctx.createImageData(cnv.width, cnv.height);

    let playerPoints = [];
    for (let i = 0; i < playerModel.length; i++) {
        const p = playerModel[i];
        
        const newX = p.x + mouseX;
        const newY = p.y + mouseY;
        
        playerPoints.push({ x: newX, y: newY });
    }

    // our ship
    lingkaran_polar(imageData, mouseX-15*3, mouseY-15, 15, 0, 0, 255);
    lingkaran_polar(imageData, mouseX-15, mouseY, 15, 255, 0, 0);
    lingkaran_polar(imageData, mouseX, mouseY, 30, 0, 0, 255);
    lingkaran_polar(imageData, mouseX+15, mouseY, 15, 255, 0, 0);
    lingkaran_polar(imageData, mouseX+15*3, mouseY-15, 15, 0, 0, 255);

    // update dan gambar peluru
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];

        
        bullet.y -= bulletSpeed;

        if (bullet.y < 0) {
            bullets.splice(i, 1);
        } else {
            lingkaran_polar(imageData, bullet.x, bullet.y, 4, 255, 255, 0); 
        }

    }

    // spawn musuh (ke dalam array jadi belum digambar)
    if (Math.random() < enemySpawnRate) {
        enemies.push({
            x: Math.random() * cnv.width, // letak spawn musuh secara horizontal 
            y: -20, // letak spawn musuh (di atas canvas)
            radius:20, // besar musuh
            speedY: 0.5,// kecepatan musuh bergerak kebawah
            speedX: 0.5 + Math.random(), // kecepatan musuh bergerak kesamping
            directionChangeTimer: 60 // timer untuk musuh ganti arah (kiri/kanan)
        });
    }   

    // spawn musuh (gambar + gerak dkk)
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];

        // pergerakan horizontal dan vertikal
        enemy.y += enemy.speedY;
        enemy.x += enemy.speedX; 

        // kedut kedut
        enemy.directionChangeTimer--;
        if (enemy.directionChangeTimer <= 0) {
            // saat berganti arah, acak kecepatan pergerakan kiri kanan
            enemy.speedX = (Math.random() * 2 - 1) * 2;
            // ulang timer untuk ganti arah
            enemy.directionChangeTimer = Math.random() * 60 + 60; // 1-2 seconds
        }

        // jika musuh mengenai tepi canvas, balik arah
        if (enemy.x - enemy.radius < 0 || enemy.x + enemy.radius > cnv.width) {
            enemy.speedX *= -1; // balik arah
        }

        lingkaran_polar(imageData, enemy.x, enemy.y, enemy.radius, 0, 255, 0); // gambar musuh

    }

    ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(gameLoop);
}

gameLoop();