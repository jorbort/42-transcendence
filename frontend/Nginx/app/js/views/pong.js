import { handleRouteChange } from "../mainScript.js";
import headerNavBar from '../webComponents/headerNavBar.js';
import SideNavBar from  '../webComponents/sideNavBarComponent.js';
import { getCookie } from '../webComponents/friendsListComponent.js';


class PongGame extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = 0.15;
        this.ballSpeedY = 0.05;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.aiSpeed = 0.16;
        this.paddleSpeed = 0.16;
        this.movePaddleLeft = 0;
        this.movePaddleRight = 0;
        this.targetPaddleLeftY = 0;
        this.targetPaddleRightY = 0;
        this.ball = null; // ocultar pelota
        this.countdownText = null;
        this.loadfont = null;
        this.user_name = localStorage.getItem('username');
        this.playerText = null;
        this.IAText = null;
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
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyUpL = this.handleKeyUpL.bind(this);
        this.handleKeyDownL = this.handleKeyDownL.bind(this);
    }

    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDownL);
        window.addEventListener('keyup', this.handleKeyUpL);
        this.createModalData();
    }

    disconnectedCallback()
    {
        cancelAnimationFrame(this.animationFrameId);
        this.gameStarted = false;
    }

z

    newModal( goHome, tryAgain, btncruz, winnerMessage) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = /* html */`
            <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" data-bs-backdrop="static" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">Result Game</h5>
                            ${btncruz}
                        </div>
                        <div class="modal-body d-flex flex-column justify-content-center align-items-center">
                            <p>!Game Over!</p>
                            <p>${winnerMessage}</p>
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
    
        // Determinar el ganador
        const winners = [];
        if (this.pointsPlayer >= 3) winners.push(this.user_name);
        if (this.pointsIA >= 3) winners.push("localplayer");
    
        let winnerMessage;
        if (winners.length === 0) {
            winnerMessage = "No winners yet!";
        } else if (winners.length === 1)
            winnerMessage = `${winners[0]} wins!`;

        const newModal = this.newModal(goHome, tryAgain, btncruzend, winnerMessage);
            
        this.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
            keyboard: false
        });
        myModal.show();

        
        const btnTryAgain = document.getElementById("try-again");
        if (btnTryAgain) {
            btnTryAgain.addEventListener('click', () => {
                myModal.dispose()
                history.pushState('', '', '/localgame1vs1');
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
        <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
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
    }
    
    checkSavebtn()
    {
        if (this.firstSelect && this.SecondSelect && this.lastSelect)
        {
            const btnSave = document.getElementById("btnSave");
            btnSave.disabled = false;
            btnSave.style.backgroundColor = "#007bff";
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
                myModal.dispose()
                document.getElementById('customModal').remove();
                await this.startGame();
            }
        });
        document.getElementById("btnCancel").addEventListener('click', async () => {
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            myModal.dispose()
            document.getElementById('customModal').remove();
            await this.startGame();
        });
        document.getElementById("btncruz").addEventListener('click', async () => {
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            myModal.dispose()
            document.getElementById('customModal').remove();
            await this.startGame();
        });
    }

    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                this.loadfont = font;
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
                this.playerText = this.createText(localStorage.getItem('username') + ":" + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, textMaterial);
                this.IAText = this.createText("localplayer: " + this.pointsIA, new THREE.Vector3(8, 9.5, 0), font, textMaterial);
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

    initObjects()
    {   
  
        const sphereGeometry = new THREE.SphereGeometry(0.5, 27, 27);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xA0D7A0 , metalness: 0.5, roughness: 0.5 });
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

        const Custom2Geometry =  new THREE.TorusKnotGeometry(0.4, 0.12, 47, 7);
        const Custom2Material = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.5, roughness: 0.5 });
        this.Custom2 = new THREE.Mesh(Custom2Geometry, Custom2Material);
        this.Custom2.position.set(-4, -2, 0);
        this.camera.position.set(0, 1, 20);
        if (this.addCustom2)
            this.scene.add(this.Custom2);

        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xe67e80 });
        this.paddleLeft = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.paddleLeft.position.x = -14;
        this.paddleLeft.position.y = 2;
        this.targetPaddleLeftY = 2;
        this.scene.add(this.paddleLeft);

        this.paddleRight = new THREE.Mesh(paddleGeometry, paddleMaterial);
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
    
    async startGame()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 10;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x323b41, 1);
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

            this.customGame();
            
            this.checkPaddleCollision();
            
            this.movaPaddles();
            
            this.paddleLeft.position.y = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 7);
            this.paddleRight.position.y  = THREE.MathUtils.clamp(this.targetPaddleRightY, -3, 7);
            this.renderer.render(this.scene, this.camera);
            
            if (!this.checkIfLost())
                requestAnimationFrame(animate);
        };

        animate();
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
            this.movePaddleRight = 1;
        } else if (event.key === "ArrowDown") {
            this.movePaddleRight = -1;
        }
    }

    handleKeyUp(event) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            this.movePaddleRight = 0;
        }
    }

    handleKeyDownL(event) {
        if (event.key === 'w' || event.key === 'W') {
            this.movePaddleLeft = 1;
        } else if (event.key === 's' || event.key === 'S') {
            this.movePaddleLeft = -1; 
        }
    }

    handleKeyUpL(event) {
        if (event.key === 'w' || event.key === 's' || event.key === 'S' || event.key === 'W') {
            this.movePaddleLeft = 0;
        }
    }

    checkPaddleCollision() {
        if (this.ball.position.x <= this.paddleLeft.position.x + 0.7 && this.ball.position.y < this.paddleLeft.position.y + 1 && this.ball.position.y > this.paddleLeft.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        }
        if (this.ball.position.x >= this.paddleRight.position.x - 0.7 && this.ball.position.y < this.paddleRight.position.y + 1 && this.ball.position.y > this.paddleRight.position.y - 1) {
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
        if (name == 'localplayer')
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
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelSegments: 5
                });
        }
    }

    customGame() {
        const proximityRange = 1.5;
        if (this.addCustom)
        {
            if (Math.abs(this.Custom.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom.position.y - this.ball.position.y) <= proximityRange)
            {
                this.ballSpeedX += 0.0015;
                this.ballSpeedY += 0.0005;
                this.Custom.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom1)
        {
            if (Math.abs(this.Custom1.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom1.position.y - this.ball.position.y) <= proximityRange)
            {
                this.ballSpeedX -= 0.015;
                this.ballSpeedY -= 0.005;
                this.Custom1.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom2)
        {
            if (Math.abs(this.Custom2.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom2.position.y - this.ball.position.y) <= proximityRange)
            {
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


    async moveBall()
    {
        this.ball.position.x += this.ballSpeedX * this.ballDireccionX;
        this.ball.position.y += this.ballSpeedY * this.ballDireccionY;
        if (this.ball.position.x > 17) {
            this.pointsPlayer++;
            this.reprint(localStorage.getItem('username'), this.pointsPlayer);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.x < -17) {
            this.pointsIA++;
            this.reprint("localplayer", this.pointsIA);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.y > 7.5 || this.ball.position.y < -3.5) {
            this.ballDireccionY *= -1;
        }
    }

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

    async insertresultinbd(username, localplayer, bool)
    {
        let token = getCookie('access_token');

        const formData = new FormData();
        formData.append('player1', username);
        formData.append('player2', localplayer);
        formData.append('player1_score', this.pointsPlayer);
        formData.append('player2_score', this.pointsIA);
        if (bool == 0){
            formData.append('winner', username);
        } else {
            formData.append('winner', localplayer);
        }

        try {
            const response = await fetch("https://localhost:8000/matches/register", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error en la petición');
            }

            const result = await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    checkIfLost()
    {
        if (this.pointsPlayer >= 3) {
            this.insertresultinbd(localStorage.getItem('username'), "localplayer", 0);
            this.createModal();
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsIA >= 3) {
            this.insertresultinbd(localStorage.getItem('username'), "localplayer", 1);
            this.createModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        return false;
    }
    
    async pauseGameAndShowCountdown()
    {
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
        this.reprint(localStorage.getItem('username'), this.pointsPlayer);
        this.reprint("localplayer", this.pointsIA);
        this.ball = null;
        this.gameStarted = false;
    }

}

customElements.define('pong-game', PongGame);

export default function renderPongGame() {

    return '<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><pong-game></pong-game>';
}
