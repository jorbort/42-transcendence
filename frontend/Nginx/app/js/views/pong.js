class PongGame extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = 0.2;
        this.ballSpeedY = 0.1;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.aiSpeed = 0.1;
        this.movePaddleLeft = 0;
        this.targetPaddleLeftY = 0;
        this.loadfont = null;
        this.playerText = null;
        this.IAText = null;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        this.startGame();
    }

    disconnectedCallback() {
        // this.disconnectGame();
    }

    handleKeyDown(event) {
        if (event.key === 'w') {
            this.movePaddleLeft = 1;
        } else if (event.key === 's') {
            this.movePaddleLeft = -1;
        }
    }

    handleKeyUp(event) {
        if (event.key === 'w' || event.key === 's') {
            this.movePaddleLeft = 0;
        }
    }

    startGame() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.appendChild(renderer.domElement);

        const sphereGeometry = new THREE.SphereGeometry(0.5, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        camera.position.set(0, 0, 20);
        scene.add(sphere);

        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddleLeft.position.x = -14; 
        paddleLeft.position.y = 0; 
        scene.add(paddleLeft);

        const paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
        paddleRight.position.x = 12.5; 
        paddleRight.position.y = 0; 
        scene.add(paddleRight);

        const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const points = [];
        points.push(new THREE.Vector3(-15, 8, 0)); // Esquina superior izquierda
        points.push(new THREE.Vector3(13.5, 8, 0)); // Esquina superior derecha
        points.push(new THREE.Vector3(13.5, -4, 0)); // Esquina inferior derecha
        points.push(new THREE.Vector3(-15, -4, 0)); // Esquina inferior izquierda

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
            this.playerText = this.createText("Player X: " + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, textMaterial);
            this.IAText = this.createText("IA: " + this.pointsIA, new THREE.Vector3(12, 9.5, 0), font, textMaterial);
            scene.add(this.playerText);
            scene.add(this.IAText);
        });

        const animate = () => {
            // Actualizar la posición de la bola
            sphere.position.x += this.ballSpeedX * this.ballDireccionX;
            sphere.position.y += this.ballSpeedY * this.ballDireccionY;
            
            if (this.checkIfLost(sphere))
                return ;
            
            // Colisiones con los bordes del campo
            if (sphere.position.y > 8 || sphere.position.y < -3.8) {
                this.ballDireccionY *= -1; // Cambiar la dirección vertical
            }
            
            this.checkPaddleCollision(sphere, paddleLeft, paddleRight);
            
            if (this.ballDireccionX > 0) this.moveAI(paddleRight, sphere);
            
            if (this.movePaddleLeft === 1) {
                this.targetPaddleLeftY += this.aiSpeed;
            } else if (this.movePaddleLeft === -1) {
                this.targetPaddleLeftY -= this.aiSpeed;
            }
            
            this.targetPaddleLeftY = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 7);
            paddleLeft.position.y = THREE.MathUtils.lerp(paddleLeft.position.y, this.targetPaddleLeftY, 0.1);
            paddleRight.position.y = THREE.MathUtils.clamp(paddleRight.position.y, -3, 7);
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    }

    resetBall(sphere) {
        sphere.position.set(0, 0, 0);
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1); // Dirección X al azar
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1); // Dirección Y al azar
        this.ballSpeedX = 0.2;
        this.ballSpeedY = 0.1;
    }

    reprint(name,points) {
        if (name == 'IA')
        {
            this.IAText.geometry.dispose(); // Eliminamos anterior
            this.IAText.geometry = new THREE.TextGeometry(name + " " + points, {
                font: this.loadfont,
                size: 0.7,
                height: 0.1,
                curveSegments: 12, // Suavidad
                bevelEnabled: true, // biselado para el borde
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
        }
        else
        {
            this.playerText.geometry.dispose(); // Eliminamos anterior
            this.playerText.geometry = new THREE.TextGeometry(name + " " + points, {
                    font: this.loadfont,
                    size: 0.7,
                    height: 0.1,
                    curveSegments: 12, // Suavidad
                    bevelEnabled: true, // biselado para el borde
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 5
                });
        }
    }

    checkIfLost(sphere) {
        if (sphere.position.x > 15) {
            this.resetBall(sphere);
            this.pointsPlayer++;
            this.reprint("Player X", this.pointsPlayer);
            console.log("Puntos Player =", this.pointsPlayer);
            if (this.pointsPlayer >= 3)
            {
                // alert("¡Felicidades! " + "player X" + " ha ganado la partida de pong.");
                this.pointsIA = 0;
                this.pointsPlayer = 0;
                this.reprint("Player X", this.pointsPlayer);
                this.reprint("IA", this.pointsIA);
                return true;
            }
        }
        if (sphere.position.x < -15) {
            this.resetBall(sphere);
            this.pointsIA++;
            console.log("X = ", sphere.position.x);
            console.log("Puntos IA =", this.pointsIA);
            this.reprint("IA", this.pointsIA);
            if (this.pointsIA >= 3)
            {
                // alert("La IA ha ganado la partida de pong");
                this.pointsIA = 0;
                this.pointsPlayer = 0;
                this.reprint("Player X", this.pointsPlayer);
                this.reprint("IA", this.pointsIA);
                return true;
            }
        }
        return false;
    }

    checkPaddleCollision(sphere, paddleLeft, paddleRight) {
        // Colisión con la pala izquierda
        if (sphere.position.x <= paddleLeft.position.x + 0.2 &&
            sphere.position.y < paddleLeft.position.y + 1.4 &&
            sphere.position.y > paddleLeft.position.y - 1.4) {
            this.ballDireccionX = 1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }

        // Colisión con la pala derecha
        if (sphere.position.x >= paddleRight.position.x - 0.2 &&
            sphere.position.y < paddleRight.position.y + 1.4 &&
            sphere.position.y > paddleRight.position.y - 1.4) {
            this.ballDireccionX = -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
    }

    moveAI(paddleRight, sphere) {
        if (sphere.position.y > paddleRight.position.y) {
            paddleRight.position.y += this.aiSpeed;
        } else if (sphere.position.y < paddleRight.position.y) {
            paddleRight.position.y -= this.aiSpeed;
        }
    }

    createText(text, position, font, material) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.7,
            height: 0.1,
            curveSegments: 12, // Suavidad
            bevelEnabled: true, // biselado para el borde
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.copy(position);
        return textMesh;
    }
}

customElements.define('pong-game', PongGame);


export default function renderPongGame() {
    return '<pong-game></pong-game>';
}
