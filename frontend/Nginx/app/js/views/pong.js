class PongGame extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = (Math.random() < 0.5 ? -1 : 1) * 0.07;
        this.ballSpeedY = (Math.random() < 0.5 ? -1 : 1) * 0.05; 
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.aiSpeed = 0.1;
        this.movePaddleLeft = 0;
        this.targetPaddleLeftY = 0;
        this.loadfont = null; // Inicializar variable para la fuente
        this.playerText = null; // Inicializar variable para el texto del jugador
        this.IAText = null; // Inicializar variable para el texto de la IA
    }

    connectedCallback() {
        this.startGame();
    }

    disconnectedCallback() {
        this.disconnectGame();
    }

    startGame() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.appendChild(renderer.domElement);

        const sphereGeometry = new THREE.SphereGeometry(0.3, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
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

        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
            this.loadfont = font;
            const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            this.playerText = this.createText("Player X: " + this.pointsPlayer, new THREE.Vector3(-10, 4.5, 0), font, textMaterial);
            this.IAText = this.createText("IA: " + this.pointsIA, new THREE.Vector3(7, 4.5, 0), font, textMaterial);
            scene.add(this.playerText);
            scene.add(this.IAText);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            // Actualizar la posición de la bola
            sphere.position.x += this.ballSpeedX; // Usar this
            sphere.position.y += this.ballSpeedY; // Usar this

            this.checkIfLost(sphere); // Llamar el método correctamente

            // Colisiones con los bordes del campo
            if (sphere.position.y > 4 || sphere.position.y < -4) {
                this.ballSpeedY *= -1; // Usar this
            }

            this.checkPaddleCollision(sphere, paddleLeft, paddleRight); // Pasar objetos si es necesario
            
            if (this.ballSpeedX > 0) this.moveAI(paddleRight, sphere); // Usar this

            if (this.movePaddleLeft === 1) {
                this.targetPaddleLeftY += this.aiSpeed; // Usar this
            } else if (this.movePaddleLeft === -1) {
                this.targetPaddleLeftY -= this.aiSpeed; // Usar this
            }

            this.targetPaddleLeftY = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 3);
            paddleLeft.position.y = THREE.MathUtils.lerp(paddleLeft.position.y, this.targetPaddleLeftY, 0.1); // Usar this
            paddleRight.position.y = THREE.MathUtils.clamp(paddleRight.position.y, -3, 3);

            renderer.render(scene, camera);
        };
        animate();
    }

    resetBall(sphere) {
        sphere.position.set(0, 0, 0);
        this.ballSpeedX = -this.ballSpeedX; // Usar this
    }

    checkIfLost(sphere) {
        if (sphere.position.x > 10.5) {
            this.pointsPlayer++; // Usar this
            this.updateText(this.playerText, "Player X: " + this.pointsPlayer); // Usar this
            this.resetBall(sphere); // Llamar a resetBall correctamente
        }
        if (sphere.position.x < -10.5) {
            this.pointsIA++; // Usar this
            this.updateText(this.IAText, "IA: " + this.pointsIA); // Usar this
            this.resetBall(sphere); // Llamar a resetBall correctamente
        }
    }

    checkPaddleCollision(sphere, paddleLeft, paddleRight) {
        // Colisión con la pala izquierda
        if (sphere.position.x <= paddleLeft.position.x + 0.2 &&
            sphere.position.y >= paddleLeft.position.y - 1 &&
            sphere.position.y <= paddleLeft.position.y + 1) {
            this.ballSpeedX *= -1; // Usar this
            this.ballSpeedX += 0.010; // Usar this
            this.ballSpeedY += 0.003; // Usar this
        }

        // Colisión con la pala derecha
        if (sphere.position.x >= paddleRight.position.x - 0.2 &&
            sphere.position.y >= paddleRight.position.y - 1 &&
            sphere.position.y <= paddleRight.position.y + 1) {
            this.ballSpeedX *= -1; // Usar this
            this.ballSpeedX += 0.010; // Usar this
            this.ballSpeedY += 0.003; // Usar this
        }
    }

    moveAI(paddleRight, sphere) {
        const aiPosition = paddleRight.position.y;
        const ballPosition = sphere.position.y;

        if (ballPosition > aiPosition + 0.5 && aiPosition < 3) {
            paddleRight.position.y += this.aiSpeed; // Usar this
        } else if (ballPosition < aiPosition - 0.5 && aiPosition > -3) {
            paddleRight.position.y -= this.aiSpeed; // Usar this
        }
    }

    createText(text, position, font, material) {
        const geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        return mesh;
    }

    updateText(textMesh, newText) {
        textMesh.geometry.dispose(); // Limpiar geometría anterior
        textMesh.geometry = new THREE.TextGeometry(newText, {
            font: this.loadfont,
            size: 0.5,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: false,
        });
    }
}

customElements.define('pong-game', PongGame);

export default function renderPongGame() {
    return '<pong-game></pong-game>';
}
