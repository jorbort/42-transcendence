class PongGameTournament extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.aiSpeed = 0.016;
        this.paddleSpeed = 0.16;
        this.movePaddleLeft = 0;
        this.movePaddleRight = 0;
        this.targetPaddleLeftY = 0;
        this.targetPaddleRightY = 0;
        this.ball = null; // ocultar pelota
        this.loadfont = null;
        this.playerText = null;
        this.IAText = null;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.player1 = null;
        this.player2 = null;
        this.onGameEnd = null;
        this.gameStarted = false;
        this.IA = false;
    }
   

    
    
    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
        return await this.startPong();
    }
    disconnectedCallback() {
        cancelAnimationFrame(this.animationFrameId);
        this.resetGame();
    }
    resetGame() {
        this.pointsIA = 0;
        this.pointsPlayer = 0;
        this.reprint("Player X", this.pointsPlayer);
        this.reprint("IA", this.pointsIA);
        this.ball = null;
        this.gameStarted = false;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.IA = false;
    }
    initObjects() {
        const sphereGeometry = new THREE.SphereGeometry(0.5, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
        this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.ball.position.set(0, 2, 0);
        this.camera.position.set(0, 1, 20);
        this.scene.add(this.ball);

        const CustomGeometry = new THREE.ConeGeometry(0.5, 1, 16);
        const CustomMaterial = new THREE.MeshStandardMaterial({ color: 0xFFC0CB, metalness: 0.5, roughness: 0.5 });
        this.Custom = new THREE.Mesh(CustomGeometry, CustomMaterial);
        this.Custom.position.set(4, -2, 0);
        this.camera.position.set(0, 1, 20);
        if (this.addCustom)
            this.scene.add(this.Custom);

        const Custom1Geometry = new THREE.IcosahedronGeometry(0.5);
        const Custom1Material = new THREE.MeshStandardMaterial({ color: 0x00FF00, metalness: 0.5, roughness: 0.5 });
        this.Custom1 = new THREE.Mesh(Custom1Geometry, Custom1Material);
        this.Custom1.position.set(-1, 4, 0);
        this.camera.position.set(0, 1, 20);
        if (this.addCustom1)
            this.scene.add(this.Custom1);

        const Custom2Geometry = new THREE.TorusKnotGeometry(0.4, 0.12, 47, 7);
        const Custom2Material = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.5, roughness: 0.5 });
        this.Custom2 = new THREE.Mesh(Custom2Geometry, Custom2Material);
        this.Custom2.position.set(-4, -2, 0);
        this.camera.position.set(0, 1, 20);
        if (this.addCustom2)
            this.scene.add(this.Custom2);

        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddleLeft.position.x = -14;
        this.paddleLeft.position.y = 2;
        this.targetPaddleLeftY = 2;
        this.scene.add(this.paddleLeft);
        const paddleMaterial1 = new THREE.MeshStandardMaterial({ color: 0x0000FF });
        this.paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial1);
        this.paddleRight.position.x = 12.5;
        this.targetPaddleRightY = 2;
        this.paddleRight.position.y = 2;
        this.scene.add(this.paddleRight);
        const borderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const points = [
            new THREE.Vector3(-15, 8, 0),
            new THREE.Vector3(13.5, 8, 0),
            new THREE.Vector3(13.5, -4, 0),
            new THREE.Vector3(-15, -4, 0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const border = new THREE.LineSegments(geometry, borderMaterial);
        this.scene.add(border);
    }
    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                this.loadfont = font;
                const playerMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Rojo para jugador 1
                const playerMaterial2 = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Azul para jugador 2
                this.playerText = this.createText(this.player1.name + ": " + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, playerMaterial1);
                this.IAText = this.createText(this.player2.name + ": " + this.pointsIA, new THREE.Vector3(8, 9.5, 0), font, playerMaterial2);
                this.scene.add(this.playerText);
                this.scene.add(this.IAText);
                resolve(font); // Resolvemos la promesa con la fuente
            }, undefined, (error) => { console.error("Error loading font:", error); reject(error); }); // Rechazamos la promesa en caso de error     
        });
    }
    async startCountdown() {
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff });
        let countdown = 3;
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 1.5, 0), this.loadfont, textMaterial);
        this.scene.add(countdownMesh);
        while (countdown > 0) {
            this.printCountdown(countdown, countdownMesh, this.scene, this.loadfont);
            countdown--;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.scene.remove(countdownMesh);
    }

    async startPong() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.appendChild(this.renderer.domElement);
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
        await this.loadFont();
        this.renderer.render(this.scene, this.camera);
        await this.startCountdown();
        this.initObjects();
        const animate = async () => {
            if (this.gameStarted) return;
            await this.moveBall();
            if (this.IA)
                this.IntervalIA = setInterval(this.moveAI(this), 1000, this);
            this.movaPaddles();
            this.checkPaddleCollision();
            this.customGame();
            this.paddleLeft.position.y = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 7);
            this.paddleRight.position.y = THREE.MathUtils.clamp(this.targetPaddleRightY, -3, 7);
            this.renderer.render(this.scene, this.camera);
            if (!this.checkIfLost(this.ball))
                requestAnimationFrame(animate);
            else
                return false;
        };

        animate();
    }
    moveAI(object) {
        const ballSpeedX = (object.ballSpeedX * object.ballDireccionX);
        const ballSpeedY = (object.ballSpeedY * object.ballDireccionY);
        const minY = -4; // Límite inferior del área de juego
        const maxY = 8;  // Límite superior del área de juego
        let futureLeft = object.ball.position.y + ((object.paddleLeft.position.x - object.ball.position.x) / ballSpeedX) * ballSpeedY;
        while (futureLeft < minY || futureLeft > maxY) {
            if (futureLeft < minY) 
                futureLeft = minY + (minY - futureLeft);
            else if (futureLeft > maxY) 
                futureLeft = maxY - (futureLeft - maxY);
        }
        object.targetPaddleLeftY+=(object.aiSpeed * (futureLeft > object.paddleLeft.position.y ? 1 : -1));
        object.paddleLeft.position.y = THREE.MathUtils.clamp(object.paddleLeft.position.y, minY, maxY);
    }
    printCountdown(countdown, countdownMesh, scene, font) {
        scene.remove(countdownMesh);
        countdownMesh.geometry.dispose();
        countdownMesh.geometry = new THREE.TextGeometry(countdown.toString(), {
            font: font,
            size: 0.8,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        scene.add(countdownMesh);
        this.renderer.render(scene, this.camera)
    }
    async showCountdown(scene, font, renderer, camera) {
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        let countdown = 3;
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 1.5, 0), font, textMaterial);
        scene.add(countdownMesh);
        while (countdown > 0) {
            this.printCountdown(countdown, countdownMesh, scene, font);
            countdown--;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        scene.remove(countdownMesh);
        scene.add(this.ball);
    }
    createText(text, position, font, material) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.8,
            height: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        });
        const textMesh = new THREE.Mesh(textGeometry, material);
        textMesh.position.copy(position);
        return textMesh;
    }
    handleKeyDown(event) {
        if (event.key === "ArrowUp") {
            this.movePaddleRight = 1;
        } else if (event.key === "ArrowDown")
            this.movePaddleRight = -1;
    }

    handleKeyUp(event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown")
            this.movePaddleRight = 0;
    }

    handleKeyDownL(event) {
        if (event.key === 'w' || event.key === 'W') {
            this.movePaddleLeft = 1;
        } else if (event.key === 's' || event.key === 'S')
            this.movePaddleLeft = -1;
    }

    handleKeyUpL(event) {
        if (event.key === 'w' || event.key === 's')
            this.movePaddleLeft = 0;
    }

    checkPaddleCollision() {
        // Detectar colisión con el paddle izquierdo
        if (this.ball.position.x <= this.paddleLeft.position.x + 0.2 &&
            this.ball.position.x > this.paddleLeft.position.x && // Asegurarse de que la pelota no esté detrás del paddle
            this.ball.position.y < this.paddleLeft.position.y + 1 &&
            this.ball.position.y > this.paddleLeft.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
        // Detectar colisión con el paddle derecho
        if (this.ball.position.x >= this.paddleRight.position.x - 0.2 &&
            this.ball.position.x < this.paddleRight.position.x && // Asegurarse de que la pelota no esté detrás del paddle
            this.ball.position.y < this.paddleRight.position.y + 1 &&
            this.ball.position.y > this.paddleRight.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
    }


    resetBall() {
        this.ball.position.set(0, 2, 0);
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.aiSpeed = 0.16;
        this.paddleSpeed = 0.16
    }

    reprint(name, points) {
        const playerMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Rojo para jugador 1
        const playerMaterial2 = new THREE.MeshStandardMaterial({ color: 0x0000FF }); // Azul para jugador 2

        if (name == this.player2.name) {
            this.IAText.geometry.dispose(); // Eliminamos anterior
            this.IAText.geometry = new THREE.TextGeometry(name + ": " + points, {
                font: this.loadfont,
                size: 0.8,
                height: 0.1,
                curveSegments: 12, // Suavidad
                bevelEnabled: true, // biselado para el borde
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            this.IAText.material = playerMaterial2; // Aplicamos el material azul
        }
        else {
            this.playerText.geometry.dispose();
            this.playerText.geometry = new THREE.TextGeometry(name + ": " + points, {
                font: this.loadfont,
                size: 0.8,
                height: 0.1,
                curveSegments: 12, // Suavidad
                bevelEnabled: true, // biselado para el borde
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelSegments: 5
            });
            this.playerText.material = playerMaterial1; // Aplicamos el material rojo
        }
    }

    customGame() {
        const proximityRange = 1.5;
        if (this.addCustom) {
            if (Math.abs(this.Custom.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom.position.y - this.ball.position.y) <= proximityRange) {// Aumentar velocidad pelota
                this.ballSpeedX += 0.0015;
                this.ballSpeedY += 0.0005;
                this.Custom.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom1) {
            if (Math.abs(this.Custom1.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom1.position.y - this.ball.position.y) <= proximityRange) { // Disminuir velocidad de la pelota
                this.ballSpeedX -= 0.015;
                this.ballSpeedY -= 0.005;
                this.Custom1.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom2) {
            if (Math.abs(this.Custom2.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom2.position.y - this.ball.position.y) <= proximityRange) {// Disminuir velocidad de palas
                if (this.ballDireccionX < 0)
                    this.aiSpeed -= 0.03;
                else
                    this.paddleSpeed -= 0.03;
                if (this.aiSpeed < 0.03)
                    this.aiSpeed = 0.03;
                if (this.paddleSpeed < 0.03)
                    this.paddleSpeed = 0.03;
                this.Custom2.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
    }

    async moveBall() {
        this.ball.position.x += this.ballSpeedX * this.ballDireccionX;
        this.ball.position.y += this.ballSpeedY * this.ballDireccionY;
        if (this.ball.position.x > 15) {
            this.pointsPlayer++;
            this.reprint(this.player1.name, this.pointsPlayer);
            await this.pauseGameAndShowCountdown();
            this.resetBall();
        }
        if (this.ball.position.x < -15) {
            this.pointsIA++;
            this.reprint(this.player2.name, this.pointsIA);
            await this.pauseGameAndShowCountdown();
            this.resetBall();
        }
        if (this.ball.position.y > 8 || this.ball.position.y < -3.8)
            this.ballDireccionY *= -1;
    }
    // movaPaddles() {
    //     if (this.movePaddleLeft === 1) {
    //         this.targetPaddleLeftY += this.paddleSpeed;
    //     } else if (this.movePaddleLeft === -1)
    //         this.targetPaddleLeftY -= this.paddleSpeed;
    //     if (this.movePaddleRight === 1) {
    //         this.targetPaddleRightY += this.paddleSpeed;
    //     } else if (this.movePaddleRight === -1)
    //         this.targetPaddleRightY -= this.paddleSpeed;
    // }

    movaPaddles()
    {
        if (this.movePaddleLeft === 1 && this.targetPaddleLeftY < 8) {
            this.targetPaddleLeftY += this.aiSpeed;
        } else if (this.movePaddleLeft === -1 && this.targetPaddleLeftY > -4)
            this.targetPaddleLeftY -= this.aiSpeed;
        if (this.movePaddleRight === 1 && this.targetPaddleRightY < 8) {
            this.targetPaddleRightY += this.paddleSpeed;
        } else if (this.movePaddleRight === -1 && this.targetPaddleRightY > -4) {
            this.targetPaddleRightY -= this.paddleSpeed;
        }
    }

    // Verificar si alguien perdió
    checkIfLost() {
        if (this.pointsPlayer >= 3) {
                this.onGameEnd(this.player1, this.pointsPlayer, this.pointsIA);// Llamar al callback con el ganador
            return true;
        }
        else if (this.pointsIA >= 3) {
                this.onGameEnd(this.player2, this.pointsPlayer, this.pointsIA);// Llamar al callback con el ganador
            return true;
        }
        return false;
    }
    async pauseGameAndShowCountdown() {
        this.ball.position.set(5, 2, 50);
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.aiSpeed = 0.16;
        this.paddleSpeed = 0.16;
        this.scene.remove(this.ball);
        if (!(this.pointsPlayer == 3 || this.pointsIA == 3))
            await this.showCountdown(this.scene, this.loadfont, this.renderer, this.camera);
    }
}
customElements.define('pong-tournament', PongGameTournament);
export default function renderPonTournament(addCustom, player1, player2, onGameEnd) {
    const element = document.createElement('pong-tournament');
    element.player1 = player1;
    element.player2 = player2;
    if (player1.type === 'AI')
        element.IA = true;
    if (player2.type === 'AI') {
        element.IA = true;
        element.player1 = player2;
        element.player2 = player1;
    }
    element.onGameEnd = onGameEnd;
    if (addCustom > 0)
        element.addCustom = true;
    if (addCustom > 1)
        element.addCustom1 = true;
    if (addCustom > 2)
        element.addCustom2 = true;
    return element;
}
