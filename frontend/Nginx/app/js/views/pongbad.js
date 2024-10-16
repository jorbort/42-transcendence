export function gameScreen() {
    const app = document.getElementById('app');
    app.innerHTML = ''; // Limpiar el contenido actual

    const title = document.createElement("h2");
    title.textContent = "PROBANDO";
    title.style.position = "absolute";
    title.style.top = "10px";
    title.style.width = "100%";
    title.style.textAlign = "center";
    title.style.color = "white";
    app.appendChild(title);
    

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(0.3, 27, 27);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    // sphere.position.set(0, 0, 0);
    camera.position.set(0, 0, 20);
    scene.add(sphere);
    
    const paddleGeometry = new THREE.BoxGeometry(0.2, 2, 0.1);
    const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddleLeft.position.x = -10; 
    paddleLeft.position.y = 0; 
    scene.add(paddleLeft);
    
    const paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddleRight.position.x = 10; 
    paddleRight.position.y = 0; 
    scene.add(paddleRight);
    
    const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const points = [];
    points.push(new THREE.Vector3(-10.5, 4, 0)); // Esquina superior izquierda
    points.push(new THREE.Vector3(10.5, 4, 0)); // Esquina superior derecha
    points.push(new THREE.Vector3(10.5, -4, 0)); // Esquina inferior derecha
    points.push(new THREE.Vector3(-10.5, -4, 0)); // Esquina inferior izquierda
    points.push(new THREE.Vector3(-10.5, 4, 0)); // Esquina superior izquierda
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const border = new THREE.LineSegments(geometry, borderMaterial);
    scene.add(border);
    
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
    
    let ballSpeedX = (Math.random() < 0.5 ? -1 : 1) * 0.9;
    let ballSpeedY = (Math.random() < 0.5 ? -1 : 1) * 0.9; 
    let playerText;
    let IAText;
    let loadfont;
    let pointsPlayer = 0;
    let pointsIA = 0;
    const aiSpeed = 0.1;

    // movimiento fluido
    let paddleSpeed = 0.1;
    let movePaddleLeft = 0
    let targetPaddleLeftY = paddleLeft.position.y;

    function createText(text, position, font, textMaterial) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12, // Suavidad
            bevelEnabled: true, // biselado para el borde
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        return textMesh;
    }

    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        console.log("Font loaded successfully");
        loadfont = font;
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        playerText = createText("Player X: " + pointsPlayer, new THREE.Vector3(-10, 4.5, 0), font, textMaterial);
        IAText = createText("IA: " + pointsIA, new THREE.Vector3(7, 4.5, 0), font, textMaterial);
        scene.add(playerText);
        scene.add(IAText);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Actualizar la posición de la bola
        sphere.position.x += ballSpeedX;
        sphere.position.y += ballSpeedY;

        checkIfLost();

        // Colisiones con los bordes del campo
        if (sphere.position.y > 4 || sphere.position.y < -4) {
            ballSpeedY *= -1;
        }

        checkPaddleCollision();
        
        if (ballSpeedX > 0) moveAI();

        if (movePaddleLeft === 1) {
            targetPaddleLeftY += paddleSpeed;
        } else if (movePaddleLeft === -1) {
            targetPaddleLeftY -= paddleSpeed;
        }

        targetPaddleLeftY = THREE.MathUtils.clamp(targetPaddleLeftY, -3, 3);
        paddleLeft.position.y = THREE.MathUtils.lerp(paddleLeft.position.y, targetPaddleLeftY, 0.1);
        paddleRight.position.y = THREE.MathUtils.clamp(paddleRight.position.y, -3, 3);

        renderer.render(scene, camera);
    }
    animate();

    function resetBall() {
        sphere.position.set(0, 0, 0);
        ballSpeedX = -ballSpeedX;
    }

    function checkIfLost() {
        if (sphere.position.x > 10.5) {
            pointsPlayer++;
            playerText.geometry.dispose(); // Eliminamos anterior
            playerText.geometry = new THREE.TextGeometry("Player X: " + pointsPlayer, {
                font: loadfont,
                size: 0.5,
                height: 0.1,
                curveSegments: 12, // Suavidad
                bevelEnabled: true, // biselado para el borde
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            resetBall();
        }
        if (sphere.position.x < -10.5) {
            pointsIA++;
            IAText.geometry.dispose();
            IAText.geometry = new THREE.TextGeometry("IA: " + pointsIA, {
                font: loadfont,
                size: 0.5,
                height: 0.1,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            resetBall();
        }
    }

    function checkPaddleCollision() {
        // Colisión con la pala izquierda
        if (sphere.position.x <= paddleLeft.position.x + 0.2 &&
            sphere.position.y >= paddleLeft.position.y - 1 &&
            sphere.position.y <= paddleLeft.position.y + 1) {
            ballSpeedX *= -1;
            ballSpeedX += 0.010;
            ballSpeedY += 0.003;
        }

        // Colisión con la pala derecha
        if (sphere.position.x >= paddleRight.position.x - 0.2 &&
            sphere.position.y >= paddleRight.position.y - 1 &&
            sphere.position.y <= paddleRight.position.y + 1) {
            ballSpeedX *= -1;
            ballSpeedX += 0.010;
            ballSpeedY += 0.003;
        }
    }

    function moveAI() {
        const aiPosition = paddleRight.position.y;
        const ballPosition = sphere.position.y;

        if (ballPosition > aiPosition + 0.5 && aiPosition < 3) {
            paddleRight.position.y += aiSpeed;
        } else if (ballPosition < aiPosition - 0.5 && aiPosition > -3) {
            paddleRight.position.y -= aiSpeed;
        }
    }

    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                movePaddleLeft = 1; // Mover hacia arriba
                break;
            case 's':
                movePaddleLeft = -1; // Mover hacia abajo
                break;
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 's') {
            movePaddleLeft = 0; // Detener movimiento
        }
    });

    // Ajustar la escena al redimensionar la ventana
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
    return `<h1>HOLA</h1>
    <canvas></canvas>`;

}