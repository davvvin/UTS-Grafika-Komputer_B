const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

const gameOverScreen = document.getElementById('gameOverScreen');
const nyawa = document.getElementById('nyawaDisplay');
const skor = document.getElementById('skorDisplay');

let mouseX = 0;
let mouseY = 0;

// --- TAMBAHAN BARU UNTUK STARFIELD ---
let stars = [];
const numStars = 100; 
const minStarVelocity = 0.5; 
const maxStarVelocity = 1.5; 

const playerModel = [
    { x: 0, y: -15 },
    { x: -15, y: 15 },
    { x: 15, y: 15 }
];

// model pesawat player
const playerRadius = 30;
let playerLives = 3;
let isGameOver = false;
let playerScore = 0;
let isGameWon = false;

// coba buat pelurunya dulu
let bullets = [];
const bulletSpeed = 5;
const bulletRadius = 4;

// musuhan nih
let enemies = [];
const enemySpawnRate = 0.01; // kemungkinan untuk munculnya musuh 


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

function updateHUD() {
    // update tampilan nyawa dan skor
    nyawa.innerText = playerLives;
    skor.innerText = playerScore;
    
}

// membuat bintang-bintang
function createStars() {
    for(let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * cnv.width,
            y: Math.random() * cnv.height, 
            size: Math.random() * 1.5 + 0.5,
            velocity: (Math.random() * (maxStarVelocity - minStarVelocity)) + minStarVelocity
        });
    }
}

function gameLoop() {
    // update head up display-nya di sini
    updateHUD();

    if (isGameOver) {
        return; 
    }

    let imageData = ctx.createImageData(cnv.width, cnv.height);

    // menggambar bin tang di canvas
    for(let i = 0; i < stars.length; i++) {
        var star = stars[i];

        var distanceMoved = {x: 0, y: star.velocity};
        var newPost = translasi({x: star.x, y: star.y}, distanceMoved);

        star.x = newPost.x;
        star.y = newPost.y;


        // ini klo bintangnya udah di bawah layar, bakal respawn ke atas lagi (y: 0)
        if(star.y > cnv.height) {
            stars[i] = {
                x: Math.random() * cnv.width,
                y: 0, 
                size: Math.random() * 1.5 + 0.5,
                velocity: (Math.random() * (maxStarVelocity - minStarVelocity)) + minStarVelocity
            };
        }

        var brightness = 150 + (star.size * 50); 
        gambar_titik(imageData, star.x, star.y, brightness, brightness, brightness);
    }
    

    // hardcode pesawat
    lingkaran_polar(imageData, mouseX-15*3, mouseY-15, 15, 0, 0, 255);
    lingkaran_polar(imageData, mouseX-15, mouseY, 15, 255, 0, 0);
    lingkaran_polar(imageData, mouseX, mouseY, playerRadius, 0, 0, 255);
    lingkaran_polar(imageData, mouseX+15, mouseY, 15, 255, 0, 0);
    lingkaran_polar(imageData, mouseX+15*3, mouseY-15, 15, 0, 0, 255);

    // update dan gambar peluru
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];

        bullet.y -= bulletSpeed;

        if (bullet.y < 0) {
            bullets.splice(i, 1);
        } else {
            lingkaran_polar(imageData, bullet.x, bullet.y, bulletRadius, 255, 255, 0); 
        }

    }

    // spawn musuh (ke dalam array jadi belum digambar)
    if (Math.random() < enemySpawnRate) {
        enemies.push({
            x: Math.random() * cnv.width, 
            y: -20, 
            radius:20, 
            speedY: 0.5,
            speedX: 0.5 + Math.random(), 
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
            enemy.speedX *= -1;
        }

        lingkaran_polar(imageData, enemy.x, enemy.y, enemy.radius, 255, 0, 255); 

        // kondisi game menang
        if (playerScore >= 100) {
            isGameWon = true;
            isGameOver = true;
            gameOverScreen.innerHTML = '<div><b>KAMU MENANG!</b></div>';
            gameOverScreen.style.display = 'flex';
        }

        // untuk cek tabrakan antara musuh sm pesawat kt (ide A)
        var distP = getDistance(enemy.x, enemy.y, mouseX, mouseY);
    
        if (distP < enemy.radius + playerRadius) {
            playerLives--;
            enemies.splice(i, 1);
            // setiap pengurangan nyawa terjadi, update tampilan nyawa dan selalu cek TERUS jika nyawa habis
            // dan jika nyawa habis, tampilkan gameOverScreen
            if (playerLives <= 0) {
                isGameOver = true;
                gameOverScreen.style.display = 'flex';
            }

        } else {
            // kita hrus cek, untuk setiap musuh apakah kena peluru ato ngga
            for (var j = bullets.length - 1; j >= 0; j--) {
                var bullet = bullets[j];
                var distance = getDistance(enemy.x, enemy.y, bullet.x, bullet.y);
                if (distance < enemy.radius + bulletRadius) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    playerScore += 10;
                    break;
                }
            }
        }

        
    }

    ctx.putImageData(imageData, 0, 0);

    requestAnimationFrame(gameLoop);
}

createStars();
gameLoop();