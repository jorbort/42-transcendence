
class PongGame extends HTMLElement {
    constructor() {
        super();
        // Variables de juego y contador
        this.ballSpeedX = 0.2;
        this.ballSpeedY = 0.1;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.aiSpeed = 0.1;
        this.movePaddleLeft = 0;
        this.targetPaddleLeftY = 0;
        this.ball = null; // ocultar pelota
        this.countdownText = null;
        this.loadfont = null;
        this.playerText = null;
        this.IAText = null;
        this.gameStarted = false;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDownL = this.handleKeyDownL.bind(this);
        this.handleKeyUpL = this.handleKeyUpL.bind(this);
    }

    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDownL);
        window.addEventListener('keyup', this.handleKeyUpL);
        await this.startGame();
    }

    initObjects() {
        
        const sphereGeometry = new THREE.SphereGeometry(0.5, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
        this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.camera.position.set(0, 1.5, 20);
        this.scene.add(this.ball);

        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddleLeft.position.x = -14;
        this.paddleLeft.position.y = 2;
        this.scene.add(this.paddleLeft);

        this.paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddleRight.position.x = 12.5;
        this.paddleRight.position.y = 0;
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

    // newModal()
    // {
    //     const modalContainer = document.createElement('div');
    //     modalContainer.innerHTML = /* html */`
    //     <div class="modal-dialog modal-dialog-centered" id="myModal">
    //         <div class="modal-content">
    //             <div class="modal-header">
    //                 <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
    //                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    //             </div>
    //             <div class="modal-body">
    //                 <p>This is a vertically centered modal.</p>
    //             </div>
    //             <div class="modal-footer">
    //                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    //                 <button type="button" class="btn btn-primary">Save changes</button>
    //             </div>
    //         </div>
    //     </div>`
    //     this.appendChild(modalContainer);
    //     var myModal = new bootstrap.Modal(document.getElementById('myModal'), {
    //         keyboard: false
    //       })
    //     myModal.show(modalToggle);
    // }

    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                console.log("Font loaded successfully.");
                this.loadfont = font;
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
                this.playerText = this.createText("Player X: " + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, textMaterial);
                this.IAText = this.createText("IA: " + this.pointsIA, new THREE.Vector3(12, 9.5, 0), font, textMaterial);
                this.scene.add(this.playerText);
                this.scene.add(this.IAText);
                resolve(font); // Resolvemos la promesa con la fuente
            }, undefined, (error) => {
                console.error("Error loading font:", error);
                reject(error); // Rechazamos la promesa en caso de error
            });
        });
    }

    async startCountdown()
    {
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

        let countdown = 3;
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 0, 0), this.loadfont, textMaterial);
        this.scene.add(countdownMesh);
        while(countdown > 0)
        {
            this.printCountdown(countdown, countdownMesh, this.scene, this.loadfont);
            countdown--;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.scene.remove(countdownMesh);
    }

    async startGame() {
        
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
                        
        const animate = async () => 
        {
            if (this.gameStarted) return;

            await this.moveBall();
            
            this.checkPaddleCollision(this.ball, this.paddleLeft, this.paddleRight);
            
            if (this.ballDireccionX > 0) this.moveAI(this.paddleRight, this.ball); //ESTA MAL NO PASA CADA SEC
            
            if (this.movePaddleLeft === 1) {
                this.targetPaddleLeftY += this.aiSpeed;
            } else if (this.movePaddleLeft === -1) {
                this.targetPaddleLeftY -= this.aiSpeed;
            }
            this.targetPaddleLeftY = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 7);
            this.paddleLeft.position.y = THREE.MathUtils.lerp(this.paddleLeft.position.y, this.targetPaddleLeftY, 0.1);
            this.paddleRight.position.y = THREE.MathUtils.clamp(this.paddleRight.position.y, -3, 7);
            this.renderer.render(this.scene, this.camera);
            if (!this.checkIfLost(this.ball))
                requestAnimationFrame(animate);
        };
        animate();
    }

    async functionAMAZING(font)
    {
        console.log("HIHIHIHI")
        this.loadfont = font;
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.playerText = this.createText("Player X: " + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, textMaterial);
        this.IAText = this.createText("IA: " + this.pointsIA, new THREE.Vector3(12, 9.5, 0), font, textMaterial);
        this.scene.add(this.playerText);
        this.scene.add(this.IAText);
    }

    printCountdown(countdown,countdownMesh, scene, font) {
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
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 0, 0), font, textMaterial);
        scene.add(countdownMesh);
        while(countdown > 0)
        {
            this.printCountdown(countdown, countdownMesh, scene, font);
            countdown--;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        scene.remove(countdownMesh);
        scene.add(this.ball);
    }

    createText(text, position, font, material)
    {
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
            this.movePaddleLeft = 1;
        } else if (event.key === "ArrowDown") {
            this.movePaddleLeft = -1;
        }
    }

    handleKeyUp(event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            this.movePaddleLeft = 0;
        }
    }

    handleKeyDownL(event) {
        if (event.key === 'w') {
            this.movePaddleLeft = 1;
        } else if (event.key === 's') {
            this.movePaddleLeft = -1;
        }
    }

    handleKeyUpL(event) {
        if (event.key === 'w' || event.key === 's') {
            this.movePaddleLeft = 0;
        }
    }

    checkPaddleCollision(ball, paddleLeft, paddleRight) {
        if (ball.position.x <= paddleLeft.position.x + 0.2 && ball.position.y < paddleLeft.position.y + 1 && ball.position.y > paddleLeft.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }

        if (ball.position.x >= paddleRight.position.x - 0.2 && ball.position.y < paddleRight.position.y + 1 && ball.position.y > paddleRight.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
    }

    resetBall() {
        this.ball.position.set(0, 0, 0);
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.ballSpeedX = 0.2;
        this.ballSpeedY = 0.1;
    }

    reprint(name,points)
    {
        if (name == 'IA')
        {
            this.IAText.geometry.dispose(); // Eliminamos anterior
            this.IAText.geometry = new THREE.TextGeometry(name + " " + points, {
                font: this.loadfont,
                size: 0.8,
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
            this.playerText.geometry.dispose();
            this.playerText.geometry = new THREE.TextGeometry(name + " " + points, {
                    font: this.loadfont,
                    size: 0.8,
                    height: 0.1,
                    curveSegments: 12, // Suavidad
                    bevelEnabled: true, // biselado para el borde
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 5
                });
        }
    }

    async moveBall()
    {
        this.ball.position.x += this.ballSpeedX * this.ballDireccionX;
        this.ball.position.y += this.ballSpeedY * this.ballDireccionY;
        if (this.ball.position.x > 15) {
            this.pointsPlayer++;
            console.log("pointsPlayer = ", this.pointsPlayer);
            this.reprint("Player X", this.pointsPlayer);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.x < -15) {
            this.pointsIA++;
            console.log("PointsIA = ", this.pointsIA);
            this.reprint("IA", this.pointsIA);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.y > 8 || this.ball.position.y < -3.8) {
            this.ballDireccionY *= -1;
        }
    }

    checkIfLost()
    {
        if (this.pointsPlayer >= 3) {
            // this.newModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsIA >= 3) {
            // this.newModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        return false;
    }
    
    async pauseGameAndShowCountdown()
    {
        console.log("CUANTAS VEZES ENTRAS");
        this.gameStarted = false;
        this.ball.position.set(5, 0, 50);
        this.ballSpeedX = 0.2;
        this.ballSpeedY = 0.1;
        this.scene.remove(this.ball);
        await this.showCountdown(this.scene, this.loadfont, this.renderer, this.camera);
    }
    
    resetGame(ball)
    {
        this.pointsIA = 0;
        this.pointsPlayer = 0;
        this.reprint("Player X", this.pointsPlayer);
        this.reprint("IA", this.pointsIA);
        ball = null;
        this.gameStarted = false;
    }
    
    moveAI(paddleRight, ball)
    {
        if (ball.position.y > paddleRight.position.y) {
            paddleRight.position.y += this.aiSpeed;
        } else if (ball.position.y < paddleRight.position.y) {
            paddleRight.position.y -= this.aiSpeed;
        }
    }
}

customElements.define('pong-game', PongGame);

export default function renderPongGame() {
    return '<pong-game></pong-game>';
}
