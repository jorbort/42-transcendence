import { handleRouteChange } from "../mainScript.js";

class PongGame extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.velocity;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.ptsred = 0;
        this.ptsgreen = 0;
        this.ptsyellow = 0;
        this.aiSpeed = 0.16;
        this.paddleSpeed = 0.16;
        this.movePaddle1 = 0;
        this.movePaddle2 = 0;
        this.movePaddle3 = 0;
        this.targetPaddle1Y = 0;
        this.targetPaddle2Y = 0;
        this.targetPaddle3Y = 0;
        this.ball = null; // ocultar pelota
        this.countdownText = null;
        this.loadfont = null;
        this.textred = null;
        this.textgreen = null;
        this.textyellow = null;
        this.gameStarted = false;
        this.gameHeight = 12;
        this.paddleHeight = 2;
        this.configsaved = false;
        this.addCustom = false;
        this.addCustom1 = false;
        this.addCustom2 = false;
        this.firstSelect = false;
        this.SecondSelect = false;
        this.lastSelect = false;
        this.edges;
        this.GreenposX = 0;
        this.GreenposY = 0;
        this.YellPosX = 0;
        this.YellPosY = 0;
        this.RedPosX = 0;
        this.RedPosY = 0;
        this.hexagonRadius = 0;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDownL = this.handleKeyDownL.bind(this);
        this.handleKeyUpL = this.handleKeyUpL.bind(this);
        this.handleKMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

    }

    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDownL);
        window.addEventListener('keyup', this.handleKeyUpL);
        window.addEventListener('mousedown', this.handleMouseDown);
        window.addEventListener('mouseup', this.handleMouseUp);
        this.createModalData();
    }

    disconnectedCallback()
    {
        cancelAnimationFrame(this.animationFrameId);
        this.gameStarted = false;
    }

z

    newModal( goHome, tryAgain, btncruz) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = /* html */`
            <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Result Game</h5>
                            ${btncruz}
                        </div>
                        <div class="modal-body d-flex flex-column justify-content-center align-items-center">
                            <p>!Game Over!</p>
                        </div>
                        <div class="modal-footer">
                            ${goHome}
                            ${tryAgain}
                        </div>
                    </div>
                </div>
            </div>`;
        return modalContainer;
    }

    createModal(){
        const   goHome = `<button id="Go-Home" type="button" class="btn btn-secondary">Go Home</button>`
        const   tryAgain = `<button id="try-again" type="button" class="btn btn-primary">Try Againg</button>`
        const   btncruzend = `<button id="btn-cruz" type="button" class="btn-close" aria-label="Close"></button>`
        const   newModal = this.newModal( goHome, tryAgain, btncruzend);
        
        this.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
            keyboard: false
        });
        myModal.show();

        const btnTryAgain = document.getElementById("try-again");
        if (btnTryAgain) {
            btnTryAgain.addEventListener('click', () => {
                myModal.dispose()
                history.pushState('', '', '/localgameMulti');
                handleRouteChange();
            });
        }
        const btnGoHome = document.getElementById("Go-Home");
        if (btnGoHome) {
            btnGoHome.addEventListener('click', () => {
                myModal.dispose()
                history.pushState('', '', '/Profile');
                handleRouteChange();
            });
        }
        const btncruz = document.getElementById("btn-cruz");
        if (btncruz) {
            btncruz.addEventListener('click', () => {
                myModal.hide()
            });
        }
    }

    ModalData() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = /* html */`
        <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Custom Game</h5>
                    <button id="btncruz" type="button" class="btn-close" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <form>
                    <div class="modal-footer d-flex justify-content-between align-items-center">
                        <p class="text-start mb-0">¿Quieres aumentar la velocidad de la pelota con el cono?</p>
                        <div>
                            <button id="btnSpeedYes" type="button" class="btn btn-success btn-sm">Sí</button>
                            <button id="btnSpeedNo" type="button" class="btn btn-danger btn-sm">No</button>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between align-items-center">
                        <p class="text-start mb-0">¿Quieres disminuir la velocidad de la pelota con el Icosahedron?</p>
                        <div>
                            <button id="btnSizeYes" type="button" class="btn btn-success btn-sm">Sí</button>
                            <button id="btnSizeNo" type="button" class="btn btn-danger btn-sm">No</button>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between align-items-center">
                        <p class="text-start mb-0">¿Quieres disminuir la velocidad de las palas con el TorusKnot?</p>
                        <div>
                            <button id="btnDecreaseYes" type="button" class="btn btn-success btn-sm">Sí</button>
                            <button id="btnDecreaseNo" type="button" class="btn btn-danger btn-sm">No</button>
                        </div>
                    </div>
                    <button id="btnSave" type="button" class="btn btn-primary" disabled>Guardar Configuración</button>
                    <button id="btnCancel" type="button" class="btn btn-secondary">Cancelar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>`;
        return modalContainer;
        // <button id="btnSave" type="button" class="btn btn-primary">Guardar Configuración</button>
    }
    
    checkSavebtn()
    {
        if (this.firstSelect && this.SecondSelect && this.lastSelect)
        {
            const btnSave = document.getElementById("btnSave");
            btnSave.disabled = false; // Habilita el botón
            btnSave.style.backgroundColor = "#007bff"; // Cambia el color a azul (color por defecto de Bootstrap)
            btnSave.style.cursor = "pointer"; 
        }
    }

    async createModalData()
    {
        const newModal = this.ModalData();
    
        this.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('customModal'), {
            keyboard: false
        });
        myModal.show();
    
        const handleResponse = (responseType, action) => {
            console.log(`${responseType} respondido: ${action}`);
            this.checkSavebtn();
        };
    
        function resetButtonStyles(buttonYesId, buttonNoId) {
            const btnYes = document.getElementById(buttonYesId);
            const btnNo = document.getElementById(buttonNoId);
            
            btnYes.style.backgroundColor = "#888";
            btnYes.style.borderColor = "#888"
            btnYes.style.color = "#fff";
            btnNo.style.backgroundColor = "#888";
            btnNo.style.borderColor = "#888"
            btnNo.style.color = "#fff";

        }

        function initializeButtons() {
            const buttons = ["btnSpeedYes", "btnSpeedNo", "btnSizeYes", "btnSizeNo", "btnDecreaseYes", "btnDecreaseNo"];
            buttons.forEach(buttonId => {
                const btn = document.getElementById(buttonId);
                btn.style.backgroundColor = "#888";
                btn.style.borderColor = "#888"
                btn.style.color = "#fff";
            });
        }

        initializeButtons();

        document.getElementById("btnSpeedYes").addEventListener('click', () => {
            resetButtonStyles("btnSpeedYes", "btnSpeedNo");
            const btn = document.getElementById("btnSpeedYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom = true;
            this.firstSelect = true;
            handleResponse("Aumentar velocidad", "Si");
        });

        document.getElementById("btnSpeedNo").addEventListener('click', () => {
            resetButtonStyles("btnSpeedYes", "btnSpeedNo");
            const btn = document.getElementById("btnSpeedNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.addCustom = false;
            this.firstSelect = true;
            handleResponse("Aumentar velocidad", "No");
        });

        document.getElementById("btnSizeYes").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom1 = true;
            this.SecondSelect = true;
            handleResponse("Aumentar tamaño", "Si");
        });

        document.getElementById("btnSizeNo").addEventListener('click', () => {
            resetButtonStyles("btnSizeYes", "btnSizeNo");
            const btn = document.getElementById("btnSizeNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.SecondSelect = true;
            this.addCustom1 = false;
            handleResponse("Aumentar tamaño", "No");
        });

        document.getElementById("btnDecreaseYes").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseYes");
            btn.style.backgroundColor = "green";
            btn.style.color = "#fff";
            this.addCustom2 = true;
            this.lastSelect = true;
            handleResponse("Disminuir tamaño", "Si");
        });

        document.getElementById("btnDecreaseNo").addEventListener('click', () => {
            resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
            const btn = document.getElementById("btnDecreaseNo");
            btn.style.backgroundColor = "red";
            btn.style.color = "#fff";
            this.lastSelect = true;
            this.addCustom2 = false;
            handleResponse("Disminuir tamaño", "No");
        });

        document.getElementById("btnSave").addEventListener('click', async () => {
            if (this.firstSelect && this.SecondSelect && this.lastSelect)
            {
                // myModal.hide();
                myModal.dispose()
                document.getElementById('customModal').remove();
                await this.startGame();
            }
        });
        document.getElementById("btnCancel").addEventListener('click', async () => {
            console.log("Cancel Seleccionado.");
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            // myModal.hide();
            myModal.dispose()
            document.getElementById('customModal').remove();
            await this.startGame();
        });
        document.getElementById("btncruz").addEventListener('click', async () => {
            console.log("Cruz Seleccionado.");
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            // myModal.hide();
            myModal.dispose()
            document.getElementById('customModal').remove();
            await this.startGame();
        });
    }

    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                console.log("Font loaded successfully.");
                this.loadfont = font;
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                this.textred = this.createText("Team Red: " + this.ptsred, new THREE.Vector3(-18, -5.5, 0), font, textMaterial);
                const textMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00ff00});
                this.textgreen = this.createText("Team Green: " + this.ptsgreen, new THREE.Vector3(12, -5.5, 0), font, textMaterial1);
                const textMaterial2 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
                this.textyellow = this.createText("Team Yellow: " + this.ptsyellow, new THREE.Vector3(-3.5, 14.5, 0), font, textMaterial2);
                this.scene.add(this.textred);
                this.scene.add(this.textgreen);
                this.scene.add(this.textyellow);
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
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 1.5, 0), this.loadfont, textMaterial);
        this.scene.add(countdownMesh);
        while(countdown > 0)
        {
            this.printCountdown(countdown, countdownMesh, this.scene, this.loadfont);
            countdown--;
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.scene.remove(countdownMesh);
    }

    initObjects() {
        const sphereGeometry = new THREE.SphereGeometry(0.5, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x87CEEB, metalness: 0.5, roughness: 0.5 });
        this.ball = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.ball.position.set(0, 2, 0);
        this.camera.position.set(0, 1, 20);
        this.scene.add(this.ball);
    
        this.hexagonRadius = 11; // Radio del hexágono
        const hexagonGeometry = new THREE.CylinderGeometry(this.hexagonRadius, this.hexagonRadius, 0.1, 6, 1); 
        const hexagonEdges = new THREE.EdgesGeometry(hexagonGeometry);
        const hexagonEdgeMaterial = new THREE.LineBasicMaterial({ color: 0x808080 });
        this.hexagon = new THREE.LineSegments(hexagonEdges, hexagonEdgeMaterial);
        this.hexagon.rotation.x = Math.PI / 2; // Asegura que esté plano
        this.hexagon.position.set(0, 3, 0);
        this.scene.add(this.hexagon);
    
        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial1 = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const paddleMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const paddleMaterial3 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    
        const paddlePositions = [
            { x: this.hexagonRadius * Math.cos(Math.PI / 3), y: 10, z: 0 },  // Lado 0
            { x: this.hexagonRadius * Math.cos(3.6 * Math.PI / 3), y: 3, z: 0 },  // Lado 2
            { x: this.hexagonRadius * Math.cos(5 * Math.PI / 3), y: -4, z: 0 },  // Lado 4
        ];
    
        const paddleOrientations = [
            Math.PI / 3, 
            3 * Math.PI / 3, 
            5 * Math.PI / 3
        ];

        const paddleLines = [
            { start: { x: 5.5, y: 9.5 }, end: { x: 0, y: 12.5 } },  // Línea del lado 0 (pala roja)
            { start: { x: -11.5, y: 15 }, end: { x: -5.5, y: -9.5 } },   // Línea del lado 2 (pala verde)
            { start: { x: -5.5, y: -7.5 }, end: { x: 11, y: 0 } },     // Línea del lado 4 (pala amarilla)
        ];
    
        this.paddles = [];
        const paddleMaterials = [paddleMaterial1, paddleMaterial2, paddleMaterial3];
        for (let i = 0; i < 3; i++) {
            const paddle = {
                mesh: new THREE.Mesh(paddleGeometry, paddleMaterials[i]),
                position: { x: paddlePositions[i].x, y: paddlePositions[i].y, z: paddlePositions[i].z },
                orientation: paddleOrientations[i],
                line: paddleLines[i],
            };
            paddle.mesh.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
            paddle.mesh.rotation.z = paddle.orientation;
            this.scene.add(paddle.mesh);
            this.paddles.push(paddle);
        }
    }
        
    async startGame()
    {
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
        
        // await this.startCountdown();
        
        this.initObjects();
                        
        const animate = async () => 
        {
            if (this.gameStarted) return;

            // await this.moveBall();
            // await this.detectAndReflect();

            // this.customGame();
                        
            this.updatePaddleMovement();

            this.renderer.render(this.scene, this.camera);
            
            if (!this.checkIfLost())
                requestAnimationFrame(animate);
        };

        animate();
    }

    updatePaddleMovement() {
        const movementSpeed = 0.2; // Velocidad de movimiento de las palas
    
        // Mover pala 1 (Teclas W y S)
        this.movePaddle(0, this.movePaddle1 * movementSpeed);
    
        // Mover pala 2 (Raton izquierdo y derecho)
        this.movePaddle(1, this.movePaddle2 * movementSpeed);
    
        // Mover pala 3 (Teclas Flecha arriba y abajo)
        this.movePaddle(2, this.movePaddle3 * movementSpeed);
    }
    
    movePaddle(index, movement) {
        const paddle = this.paddles[index];
        const paddleMesh = paddle.mesh;
        const angle = -paddle.orientation;
    
        // Calculamos el movimiento en X y Y con respecto a la orientación de la pala
        const movementInX = movement * Math.sin(angle);
        const movementInY = movement * Math.cos(angle);
    
        // Nueva posición de la pala después del movimiento
        const newPosition = {
            x: paddle.position.x + movementInX,
            y: paddle.position.y + movementInY,
        };
    
        // Proyectamos la nueva posición sobre la línea del hexágono correspondiente
        const lineStart = paddle.line.start; // Punto inicial de la línea
        const lineEnd = paddle.line.end;     // Punto final de la línea
    
        const lineVector = {
            x: lineEnd.x - lineStart.x,
            y: lineEnd.y - lineStart.y,
        };
    
        const lineLengthSquared = lineVector.x ** 2 + lineVector.y ** 2;
    
        const paddleToStart = {
            x: newPosition.x - lineStart.x,
            y: newPosition.y - lineStart.y,
        };
    
        // Proyección escalar de la posición de la pala sobre el vector de la línea
        const t = Math.max(
            0,
            Math.min(1, (paddleToStart.x * lineVector.x + paddleToStart.y * lineVector.y) / lineLengthSquared)
        );
    
        // Calculamos la posición limitada en la línea
        const limitedPosition = {
            x: lineStart.x + t * lineVector.x,
            y: lineStart.y + t * lineVector.y,
        };
    
        // Actualizamos la posición de la pala
        paddle.position.x = limitedPosition.x;
        paddle.position.y = limitedPosition.y;
    
        // Actualizamos la posición de la pala en el escenario
        paddleMesh.position.set(paddle.position.x, paddle.position.y, paddle.position.z);
    }
    
    

    isPointInTriangle(p, p1, p2, p3) {
        const area = (p1, p2, p3) => Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2.0);
    
        const A = area(p1, p2, p3);
        const A1 = area(p, p2, p3);
        const A2 = area(p1, p, p3);
        const A3 = area(p1, p2, p);
    
        return Math.abs(A - (A1 + A2 + A3)) < 0.01; // Ajustar el margen de error
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
        const countdownMesh = this.createText(countdown.toString(), new THREE.Vector3(0, 1.5, 0), font, textMaterial);
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
            this.movePaddle3 = 1;
        } else if (event.key === "ArrowDown") {
            this.movePaddle3 = -1;
        }
    }

    handleKeyUp(event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            this.movePaddle3 = 0;
        }
    }

    handleKeyDownL(event) {
        if (event.key === 'W' || event.key === 'w') {
            this.movePaddle1 = 1;
        } else if (event.key === 'S' || event.key === 's') {
            this.movePaddle1 = -1; 
        }
    }

    handleKeyUpL(event) {
        if (event.key === 's' || event.key === 'S' || event.key === 'w' || event.key === 'W') {
            this.movePaddle1 = 0;
        }
    }

    handleMouseDown(event) {
        if (event.key === 'T' || event.key === 't') {
            this.movePaddle2 = 1;
        } else if (event.key === 'G' || event.key === 'g') {
            this.movePaddle2 = -1; 
        }
        // console.log('MouseDown:', event.button);
        // if (event.button === 0) { // Botón izquierdo del ratón
        //     this.movePaddle2 = 1;
        // } else if (event.button === 2) { // Botón derecho del ratón
        //     this.movePaddle2 = -1;
        // }
    }
    
    handleMouseUp(event) {
        if (event.key === 'T' || event.key === 't' || event.key === 'G' || event.key === 'g') {
            this.movePaddle2 = 0;
        }
        // console.log('MouseUp:', event.button);
        // if (event.button === 0 || event.button === 2) { // Ambos botones
        //     this.movePaddle2 = 0;
        // }
    }


    checkPaddleCollision()
    {
        if (this.ball.position.x >= this.paddle3.position.x - 0.7 && this.ball.position.y < this.paddle3.position.y + 1 && this.ball.position.y > this.paddle3.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
        if (this.ball.position.x >= this.paddle1.position.x - 0.7 && this.ball.position.y < this.paddle1.position.y + 1 && this.ball.position.y > this.paddle1.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
        if (this.ball.position.x <= this.paddle2.position.x + 0.7 && this.ball.position.y < this.paddle2.position.y + 1 && this.ball.position.y > this.paddle2.position.y - 1) {
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

    reprint(name,points)
    {
        if (name == 'Player2')
        {
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
        }
        else
        {
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
        }
    }

    customGame() {
        const proximityRange = 1.5;
        // console.log(this.addCustom, this.addCustom1, this.addCustom2);
        // console.log("X =", this.Custom2.position.x, "Y =",this.Custom2.position.y, "Xpelota =", this.ball.position.x, "Y =",this.ball.position.y);
        if (this.addCustom)
        {
            if (Math.abs(this.Custom.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom.position.y - this.ball.position.y) <= proximityRange)
            {
                // Aumentar velocidad pelota
                this.ballSpeedX += 0.0015;
                this.ballSpeedY += 0.0005;
                this.Custom.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
                console.log("Aumento velocidad pelota");
            }
        }
        if (this.addCustom1)
        {
            if (Math.abs(this.Custom1.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom1.position.y - this.ball.position.y) <= proximityRange)
            {
                // Disminuir velocidad de la pelota
                this.ballSpeedX -= 0.015;
                this.ballSpeedY -= 0.005;
                this.Custom1.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
                console.log("Disminuir velocidad pelota");
            }
        }
        if (this.addCustom2)
        {
            if (Math.abs(this.Custom2.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom2.position.y - this.ball.position.y) <= proximityRange)
            {
                // Disminuir velocidad de palas
                if (this.ballDireccionX < 0)
                    this.aiSpeed -= 0.03;
                else
                    this.paddleSpeed -= 0.03;
                if (this.aiSpeed < 0.03)
                    this.aiSpeed = 0.03;
                if (this.paddleSpeed < 0.03)
                    this.paddleSpeed = 0.03;
                this.Custom2.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
                console.log("Disminuir velocidad palas");
            }
        }
    }


    async moveBall()
    {
        this.ball.position.x += this.ballSpeedX * this.ballDireccionX;
        this.ball.position.y += this.ballSpeedY * this.ballDireccionY;
        if (this.ball.position.x > 15) {
            this.pointsPlayer++;
            this.reprint("Team1", this.pointsPlayer);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.x < -15) {
            this.pointsIA++;
            this.reprint("Team2", this.pointsIA);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.y > 7.5 || this.ball.position.y < -3.5) {
            this.ballDireccionY *= -1;
        }
    }

     async detectAndReflect() 
     {
        this.ball.position.x += this.velocity.x * this.ballDireccionX;
        this.ball.position.y += this.velocity.y * this.ballDireccionY;

        const ballPos = this.ball.position;
        for (let edge of this.edges) {
            const start = edge.start;
            const end = edge.end;
    
            const edgeVector = new THREE.Vector3().subVectors(end, start);
            const edgeLength = edgeVector.length();
    
            // Vector del punto inicial de la arista a la pelota
            const toBall = new THREE.Vector3().subVectors(ballPos, start);
    
            // Proyección de `toBall` sobre el vector de la arista
            const projection = edgeVector.clone().normalize().multiplyScalar(toBall.dot(edgeVector) / edgeLength);
    
            // Punto más cercano en la arista
            const closestPoint = start.clone().add(projection);
    
            // Comprueba si el punto más cercano está dentro de la arista
            const t = projection.length() / edgeLength;
            if (t >= 0 && t <= 1) {
                // Distancia entre la pelota y el punto más cercano
                const distanceToEdge = ballPos.distanceTo(closestPoint);
    
                if (distanceToEdge <= 0.5) {
                    const normal = new THREE.Vector3().subVectors(ballPos, closestPoint).normalize();
    
                    // Refleja la velocidad sobre la normal
                    this.velocity.reflect(normal);
                    return;
                }
            }
        }
    }

    checkIfLost()
    {
        if (this.pointsPlayer >= 3) {
            this.createModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsIA >= 3) {
            this.createModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        return false;
    }
    
    async pauseGameAndShowCountdown()
    {
        // console.log("CUANTAS VEZES ENTRAS");
        this.gameStarted = false;
        this.ball.position.set(5, 2, 50);
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.aiSpeed = 0.16;
        this.paddleSpeed = 0.16;
        this.scene.remove(this.ball);
        if (!(this.pointsPlayer == 3 || this.pointsIA == 3))
            await this.showCountdown(this.scene, this.loadfont, this.renderer, this.camera);
    }
    
    resetGame()
    {
        this.pointsIA = 0;
        this.pointsPlayer = 0;
        this.reprint("Team1", this.pointsPlayer);
        this.reprint("Team2", this.pointsIA);
        this.ball = null;
        this.gameStarted = false;
    }

}

customElements.define('pong-gamemulti', PongGame);

export default function renderPongGameMulti() {
    return '<pong-gamemulti></pong-gamemulti>';
}
