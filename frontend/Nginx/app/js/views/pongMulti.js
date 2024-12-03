import { handleRouteChange } from "../mainScript.js";

class PongGame extends HTMLElement {
    constructor() {
        super();
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
        this.connectionPoints = [];
        this.L = 27;
        this.h = (Math.sqrt(3) * this.L) / 2;
        this.offset = 9;
        this.points = [];
        this.center;
        this.radio;
        this.lastTouch = "N";
        this.pointsG = 0;
        this.pointsR = 0;
        this.pointsY = 0;
        this.speed = 0.10;
        this.sohard;
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDownRed = this.handleKeyDownRed.bind(this);
        this.handleKeyUpRed = this.handleKeyUpRed.bind(this);
        this.handleKeyDownGreen = this.handleKeyDownGreen.bind(this);
        this.handleKeyUpGreen = this.handleKeyUpGreen.bind(this);
    }

    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDownRed);
        window.addEventListener('keyup', this.handleKeyUpRed);
        window.addEventListener('keydown', this.handleKeyDownGreen);
        window.addEventListener('keyup', this.handleKeyUpGreen);
        this.createModalData();
    }

    disconnectedCallback()
    {
        cancelAnimationFrame(this.animationFrameId);
        this.gameStarted = false;
    }

    newModal(goHome, tryAgain, btncruz, winnerMessage) {
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
    
    createModal() {
        const goHome = `<button id="Go-Home" type="button" class="btn btn-secondary">Go Home</button>`;
        const tryAgain = `<button id="try-again" type="button" class="btn btn-primary">Try Again</button>`;
        const btncruzend = `<button id="btn-cruz" type="button" class="btn-close" aria-label="Close"></button>`;
    
        // Determinar el ganador
        const winners = [];
        if (this.pointsY >= 3) winners.push("Yellow");
        if (this.pointsG >= 3) winners.push("Green");
        if (this.pointsR >= 3) winners.push("Red");
    
        let winnerMessage;
        if (winners.length === 0) {
            winnerMessage = "No winners yet!";
        } else if (winners.length === 1) {
            winnerMessage = `Team ${winners[0]} wins!`;
        } else {
            winnerMessage = `Teams ${winners.join(" and ")} win!`;
        }
    
        const newModal = this.newModal(goHome, tryAgain, btncruzend, winnerMessage);
    
        this.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('myModal'), {
            keyboard: false
        });
        myModal.show();
    
        const btnTryAgain = document.getElementById("try-again");
        if (btnTryAgain) {
            btnTryAgain.addEventListener('click', () => {
                myModal.dispose();
                history.pushState('', '', '/localgameMulti');
                handleRouteChange();
            });
        }
        const btnGoHome = document.getElementById("Go-Home");
        if (btnGoHome) {
            btnGoHome.addEventListener('click', () => {
                myModal.dispose();
                history.pushState('', '', '/Profile');
                handleRouteChange();
            });
        }
        const btncruz = document.getElementById("btn-cruz");
        if (btncruz) {
            btncruz.addEventListener('click', () => {
                myModal.hide();
            });
        }
    }
    
    ModalData() {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = /* html */`
        <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" data-bs-backdrop="static" aria-hidden="true">
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
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0xe67e80 });
                this.textred = this.createText("Team Red: " + this.ptsred, new THREE.Vector3(-18, -5.5, 0), font, textMaterial);
                const textMaterial1 = new THREE.MeshStandardMaterial({ color: 0xA0D7A0});
                this.textgreen = this.createText("Team Green: " + this.ptsgreen, new THREE.Vector3(12, -5.5, 0), font, textMaterial1);
                const textMaterial2 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
                this.textyellow = this.createText("Team Yellow: " + this.ptsyellow, new THREE.Vector3(-3.5, 14.5, 0), font, textMaterial2);
                const sohardMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
                this.sohard = this.createText("Don't hit too hard!", new THREE.Vector3(10, 7.5, 0), font, sohardMaterial);
                this.scene.add(this.textred);
                this.scene.add(this.textgreen);
                this.scene.add(this.textyellow);
                this.scene.add(this.sohard);
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
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xA0D7A0, metalness: 0.5, roughness: 0.5 });
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

        const adjustPoint = (start, end) => {
            const dir = new THREE.Vector3().subVectors(end, start).normalize();
            return new THREE.Vector3().addVectors(start, dir.multiplyScalar(this.offset));
        };
        
        this.points = [
            adjustPoint(new THREE.Vector3(-this.L / 2, -5, 0), new THREE.Vector3(this.L / 2, -5, 0)), // línea 1, primer punto
            adjustPoint(new THREE.Vector3(this.L / 2, -5, 0), new THREE.Vector3(-this.L / 2, -5, 0)), // línea 1, segundo punto
            adjustPoint(new THREE.Vector3(this.L / 2, -5, 0), new THREE.Vector3(0, -5 + this.h, 0)), // línea 2, primer punto
            adjustPoint(new THREE.Vector3(0, -5 + this.h, 0), new THREE.Vector3(this.L / 2, -5, 0)), // línea 2, segundo punto
            adjustPoint(new THREE.Vector3(0, -5 + this.h, 0), new THREE.Vector3(-this.L / 2, -5, 0)), // línea 3, primer punto
            adjustPoint(new THREE.Vector3(-this.L / 2, -5, 0), new THREE.Vector3(0, -5 + this.h, 0)) // línea 3, segundo punto
        ];

        this.center = this.calculateCenter();

        this.getandprintpoints();

        this.createpaddles();

        this.conectingpoints();
    }

    calculateCenter() {
        let center = new THREE.Vector3(0, 0, 0);
    
        this.points.forEach(point => {
            center.add(point); // Sumar cada punto al centro
        });
    
        center.divideScalar(this.points.length); // Dividir entre el número total de puntos
    
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const marker = new THREE.Mesh(geometry, material);
        // console.log(center)
        marker.position.copy(center)
        // this.scene.add(marker);

        return center;
    }

    calculateDistance(point1, point2)
    {
        // console.log("Distancia: " , point1.distanceTo(point2))
        // console.log("Radio:", this.radio);
        return point1.distanceTo(point2);
    }

    getandprintpoints()
    {
        //PRINTAR PUNTOS
        const pointsGeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(this.points.length * 3);

        // Añadir las coordenadas de los puntos a la geometría
        this.points.forEach((point, index) => {
            vertices[index * 3] = point.x;
            vertices[index * 3 + 1] = point.y;
            vertices[index * 3 + 2] = point.z;
        });

        pointsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

        const pointsMaterial = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 0.2
        });

        const pointsObject = new THREE.Points(pointsGeometry, pointsMaterial);
        // this.scene.add(pointsObject);

        const material = new THREE.LineBasicMaterial({
            color: 0x808080,
            linewidth: 3,
            opacity: 0.8,
            transparent: true
        });
        
        for (let i = 0; i < this.points.length; i += 2) {
            const geometry = new THREE.BufferGeometry().setFromPoints([this.points[i], this.points[i + 1]]);
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
        
        //Triangulo
        const p1 = new THREE.Vector3(-this.L / 2, -5, 0); // Vértice 1
        const p2 = new THREE.Vector3(this.L / 2, -5, 0);  // Vértice 2
        const p3 = new THREE.Vector3(0, -5 + this.h, 0);  // Vértice 3
        
        this.edges = [
            { start: p1, end: p2 },
            { start: p2, end: p3 },
            { start: p3, end: p1 },
        ];

        this.radio = this.calculateDistance(this.center, this.points[2]);
        this.connectTwoPoints(this.center, this.points[2]);
    }

    createpaddles()
    {
        const paddleGeometry = new THREE.BoxGeometry(0.6, 2, 0.1);

        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xe67e80 });
        this.paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        var m = Math.sqrt(((this.L / 2) * (this.L / 2)) + 25)
        this.RedPosX = (-this.L / 2) + 8 * ((0 - (-this.L / 2)) / m) + 0.1
        this.RedPosY = (-5) + 8 * ((0 + 5) / m) + 0.4
        this.paddle1.position.set(this.RedPosX + 0.25, this.RedPosY + 0.25, 0);
        this.paddle1.lookAt(new THREE.Vector3(0, 1, 0));
        this.scene.add(this.paddle1);

        const paddleMaterial2 = new THREE.MeshStandardMaterial({ color: 0xA0D7A0 });
        this.paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
        var m2 = Math.sqrt(((this.L / 2) * (this.L / 2)) + 25);
        this.GreenposX = (this.L / 2) - 8 * ((this.L / 2 - 0) / m2) + 0.1;
        this.GreenposY = (-5) + 8 * ((0 + 5) / m2) + 0.4;
        this.paddle2.position.set(this.GreenposX - 0.25, this.GreenposY + 0.25, 0);
        this.paddle2.lookAt(new THREE.Vector3(0, 1, 0));
        this.scene.add(this.paddle2);

        const paddleMaterial3 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const paddleGeometry2 = new THREE.BoxGeometry(2, 0.25, 0.1);
        this.paddle3 = new THREE.Mesh(paddleGeometry2, paddleMaterial3);
        this.YellPosX = 0;
        this.YellPosY = 10.3
        this.paddle3.position.set(this.YellPosX, this.YellPosY - 0.5, 0);
        this.scene.add(this.paddle3);

        this.velocity = new THREE.Vector3(0.1, 0.075, 0);
    }

    conectingpoints()
    {
        this.connectionPoints = [];
        for (let i = 0; i < this.points.length; i += 2) {
            const endOfCurrentLine = this.points[i + 1];
            const startOfNextLine = this.points[(i + 2) % this.points.length];
            this.connectionPoints.push(endOfCurrentLine, startOfNextLine);
        }

        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setFromPoints(this.connectionPoints);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffa500,
            linewidth: 0.5
        });

        const connectingLine = new THREE.Line(lineGeometry, lineMaterial);
        // this.scene.add(connectingLine);
    }

    connectTwoPoints(point1, point2)
    {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffa500,  // Color naranja
            linewidth: 0.5
        });
    
        const connectingLine = new THREE.Line(lineGeometry, lineMaterial);
        // this.scene.add(connectingLine);
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

            await this.detectAndReflect();

            await this.isSomePoint();

            this.customGame();
            
            this.checkPaddleCollision();
            
            this.updatePaddles();
            
            this.renderer.render(this.scene, this.camera);
            
            if (!this.checkIfLost())
                requestAnimationFrame(animate);
        };

        animate();
    }

    updatePaddles()
    {
        if (this.movePaddle1 !== 0) {
            let startPointLocal = new THREE.Vector3(0, -1, 0);
            let endPointLocal = new THREE.Vector3(0, 1, 0);
            this.index1 = this.movePaddle(this.paddle1, 4, this.movePaddle1, startPointLocal, endPointLocal);
        }
        if (this.movePaddle2 !== 0) {
            let startPointLocal = new THREE.Vector3(0, 1, 0);
            let endPointLocal = new THREE.Vector3(0, -1, 0);
            this.index2 = this.movePaddle(this.paddle2, 0, this.movePaddle2, startPointLocal, endPointLocal);
        }
        if (this.movePaddle3 !== 0) {
            let startPointLocal = new THREE.Vector3(-1, 0, 0);
            let endPointLocal = new THREE.Vector3(1, 0, 0); 
            this.index3 = this.movePaddle(this.paddle3, 2, this.movePaddle3, startPointLocal, endPointLocal);
        }
    }
    
    movePaddle(paddle, index, moveDirection, startPointLocal, endPointLocal)
    {
        const start = this.connectionPoints[index];
        const end = this.connectionPoints[index + 1];
        
        const direction = new THREE.Vector3().subVectors(end, start).normalize();

        const movement = direction.multiplyScalar(this.speed * moveDirection);
        
        // Comprobar si el nuevo movimiento sale de los límites de la línea
        // const newPosition = paddle.position.clone().add(movement);
        
        const startPointWorld = startPointLocal.clone();
        const endPointWorld = endPointLocal.clone();
        paddle.localToWorld(startPointWorld);
        paddle.localToWorld(endPointWorld);
    
        // Nuevo movimiento de los extremos
        const newStartPoint = startPointWorld.clone().add(movement);
        const newEndPoint = endPointWorld.clone().add(movement);


        // Comprobar si la nueva posición está dentro de la línea
        const lineDirection = new THREE.Vector3().subVectors(end, start);
        const lineLength = lineDirection.length();

        const projectedDistance = newStartPoint.distanceTo(start) / lineLength;
        const projectedDistanceEnd = newEndPoint.distanceTo(end) / lineLength;

        // Limitar el movimiento para que no se pase del inicio o del final
        if (projectedDistance >= 0 && projectedDistance <= 1 && projectedDistanceEnd >= 0 && projectedDistanceEnd <= 1) {
            paddle.position.add(movement);
        }
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

    handleKeyDownRed(event) {
        if (event.key === 'W' || event.key === 'w') {
            this.movePaddle1 = -1;
        } else if (event.key === 'S' || event.key === 's') {
            this.movePaddle1 = 1; 
        }
    }

    handleKeyUpRed(event) {
        if (event.key === 'W' || event.key === 'w' || event.key === 'S' || event.key === 's') {
            this.movePaddle1 = 0;
        }
    }

    handleKeyDownGreen(event) {
        if (event.key === 'I' || event.key === 'i') {
            this.movePaddle2 = 1;
        } else if (event.key === 'K' || event.key === 'k') {
            this.movePaddle2 = -1;
        }
    }
    
    handleKeyUpGreen(event) {
        if (event.key === 'I' || event.key === 'i' || event.key === 'K' || event.key === 'k') {
            this.movePaddle2 = 0;
        }
    }

    checkPaddleCollision() {
        // Tolerancia para las colisiones (ancho de la pala)
        const paddleWidth = 0.3;
    
        // Colisión con la pala horizontal (paddle3)
        if (this.ball.position.y >= this.paddle3.position.y - paddleWidth &&
            this.ball.position.y <= this.paddle3.position.y + paddleWidth &&
            this.ball.position.x >= this.paddle3.position.x - 1 &&
            this.ball.position.x <= this.paddle3.position.x + 1) {
            this.lastTouch = "Y";
            // console.log(this.lastTouch);
            this.ballDireccionY *= -1;
        }
        else if (this.ball.position.y >= this.paddle1.position.y - paddleWidth &&
            this.ball.position.y <= this.paddle1.position.y + paddleWidth &&
            this.ball.position.x >= this.paddle1.position.x - 1 &&
            this.ball.position.x <= this.paddle1.position.x + 1) {
            this.lastTouch = "R";
            // console.log(this.lastTouch);
            this.ball.position.x -= this.velocity.x * this.ballDireccionX;
            this.ball.position.y -= this.velocity.y * this.ballDireccionY;
            this.ballDireccionY *= -1;
            this.ballDireccionX *= -1;
            const tmp = this.velocity.x;
            this.velocity.x = this.velocity.y;
            this.velocity.y = tmp;
            // this.velocity.x += 0.02;
            }
        else if (this.ball.position.y >= this.paddle2.position.y - paddleWidth &&
            this.ball.position.y <= this.paddle2.position.y + paddleWidth &&
            this.ball.position.x >= this.paddle2.position.x - 1 &&
            this.ball.position.x <= this.paddle2.position.x + 1) {
            this.lastTouch = "G";
            // console.log(this.lastTouch);
            this.ball.position.x -= this.velocity.x * this.ballDireccionX;
            this.ball.position.y -= this.velocity.y * this.ballDireccionY;
            this.ballDireccionY *= -1;
            this.ballDireccionX *= -1;
            const tmp = this.velocity.x;
            this.velocity.x = this.velocity.y;
            this.velocity.y = tmp;
            // this.velocity.x += 0.02;
        }
    }

    resetBall()
    {
        this.ball.position.set(0, 2, 0);
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.velocity.x = 0.1;
        this.velocity.y = 0.075;
        this.lastTouch = "N";
    }

    detectLineGoal(i)
    {
        if (i == 0)
            return "G";
        else if (i == 2)
            return "Y";
        else if (i == 4)
            return "R";
    }
    
    creategeometry(text, points)
    {
        return (new THREE.TextGeometry(text + ": " + points, {
            font: this.loadfont,
            size: 0.8,
            height: 0.1,
            curveSegments: 12, // Suavidad
            bevelEnabled: true, // biselado para el borde
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 5
        }))
    }

    goalsothertwo(lineGoal)
    {
        if (lineGoal == "Y")
        {
            this.pointsG++;
            this.pointsR++;
        }
        else if (lineGoal == "R")
        {
            this.pointsG++;
            this.pointsY++;
        }
        else if (lineGoal == "G")
        {
            this.pointsR++;
            this.pointsY++;
        }
    }

    reprint(name, reset, lineGoal = undefined)
    {   
        if (name == lineGoal || name == "N")
            this.goalsothertwo(lineGoal);
        else
        {
            if (name == "G")
                this.pointsG++;
            else if (name == "R")
                this.pointsR++;
            else
                this.pointsY++;
        }
        this.textgreen.geometry.dispose();
        this.textgreen.geometry = this.creategeometry("Team Green", this.pointsG);
        this.textred.geometry.dispose();
        this.textred.geometry = this.creategeometry("Team Red", this.pointsR);
        this.textyellow.geometry.dispose();
        this.textyellow.geometry = this.creategeometry("Team Yellow", this.pointsY);
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
                this.velocity.x += 0.005;
                this.velocity.y += 0.005;
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
                this.velocity.x -= 0.005;
                this.velocity.y -= 0.005;
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
                this.speed -= 0.003;
                if (this.paddleSpeed < 0.03)
                    this.paddleSpeed = 0.03;
                this.Custom2.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
                console.log("Disminuir velocidad palas");
            }
        }
    }


    //  async detectAndReflect() {
    //     // Calcula la nueva posición de la pelota sin actualizarla aún
    //     var nextPosition = new THREE.Vector3(
    //         this.ball.position.x + this.velocity.x * this.ballDireccionX,
    //         this.ball.position.y + this.velocity.y * this.ballDireccionY,
    //         this.ball.position.z
    //     );

    //     if (this.calculateDistance(this.center, nextPosition) > this.radio + 2) {
    //         await this.pauseGameAndShowCountdown();
    //         return;
    //     }

    //     // Revisa colisión con cada borde
    //     for (let edge of this.edges) {
    //         const start = edge.start;
    //         const end = edge.end;

    //         const edgeVector = new THREE.Vector3().subVectors(end, start);
    //         const edgeLength = edgeVector.length();

    //         if (edgeLength === 0) continue; // Previene divisiones por cero

    //         const toBall = new THREE.Vector3().subVectors(nextPosition, start);
    //         const projection = edgeVector.clone().normalize().multiplyScalar(toBall.dot(edgeVector) / edgeLength);
    //         const closestPoint = start.clone().add(projection);

    //         // Verifica si el punto más cercano está dentro de la arista
    //         const t = projection.length() / edgeLength;
    //         if (t >= 0 && t <= 1) {
    //             const distanceToEdge = nextPosition.distanceTo(closestPoint);

    //             if (distanceToEdge <= 0.5) {
    //                 const normal = new THREE.Vector3().subVectors(nextPosition, closestPoint);
    //                 if (normal.length() === 0) continue; // Evita normalización de un vector nulo

    //                 normal.normalize();

    //                 // Refleja la dirección de la velocidad
    //                 const velocityVector = new THREE.Vector3(
    //                     this.velocity.x * this.ballDireccionX,
    //                     this.velocity.y * this.ballDireccionY,
    //                     0 // Asume 2D
    //                 );

    //                 const reflectedVelocity = velocityVector.reflect(normal);
    //                 // nextPosition = new THREE.Vector3(
    //                 //     this.ball.position.x - this.velocity.x * this.ballDireccionX,
    //                 //     this.ball.position.y - this.velocity.y * this.ballDireccionY,
    //                 //     this.ball.position.z
    //                 // );
    //                 this.ballDireccionX = reflectedVelocity.x > 0 ? 1 : -1;
    //                 this.ballDireccionY = reflectedVelocity.y > 0 ? 1 : -1;

    //                 return; // Evita múltiples colisiones en un solo frame
    //             }
    //         }
    //     }

    //     // Actualiza la posición de la pelota solo si no hay colisión
    //     this.ball.position.copy(nextPosition);
    // }
    async detectAndReflect() 
    {
       this.ball.position.x += this.velocity.x * this.ballDireccionX;
       this.ball.position.y += this.velocity.y * this.ballDireccionY;

       if (this.calculateDistance(this.center, this.ball.position) > this.radio + 2)
       {
           // console.log("Entras!")
           await this.pauseGameAndShowCountdown()
       }
       const ballPos = this.ball.position;
       for (let edge of this.edges) {
           const start = edge.start;
           const end = edge.end;
   
           const edgeVector = new THREE.Vector3().subVectors(end, start);
           const edgeLength = edgeVector.length();
   
           // Vector del punto inicial de la arista a la pelota
           const toBall = new THREE.Vector3().subVectors(ballPos, start);
   
           // Proyección de toBall sobre el vector de la arista
           const projection = edgeVector.clone().normalize().multiplyScalar(toBall.dot(edgeVector) / edgeLength);
   
           // Punto más cercano en la arista
           const closestPoint = start.clone().add(projection);
   
           // Comprueba si el punto más cercano está dentro de la arista
           const t = projection.length() / edgeLength;
           if (t >= 0 && t <= 1) {
               // Distancia entre la pelota y el punto más cercano
               const distanceToEdge = ballPos.distanceTo(closestPoint);
               
               const dir = new THREE.Vector3(this.ballDireccionX, this.ballDireccionY, 0);
               if (distanceToEdge <= 0.8) {
                   const normal = new THREE.Vector3().subVectors(ballPos, closestPoint).normalize();
                   //    console.log(normal)
                   // Refleja la velocidad sobre la normal
                   //    this.dir.reflect(normal);
                   this.ball.position.x -= this.velocity.x * this.ballDireccionX;
                   this.ball.position.y -= this.velocity.y * this.ballDireccionY;

                   dir.reflect(normal);
                   this.ballDireccionX = dir.x;
                   this.ballDireccionY = dir.y;
                //    console.log(this.ballDireccionX, this.ballDireccionY);
                   return;
               }
           }
       }
   }


    async isSomePoint()
    {
        const ballPos = this.ball.position;
    
        for (let i = 0; i < this.connectionPoints.length; i += 2) {
            const start = this.connectionPoints[i];
            const end = this.connectionPoints[i + 1];
    
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
    
                if (distanceToEdge <= 0.2) {
                    const normal = new THREE.Vector3().subVectors(ballPos, closestPoint).normalize();
                        this.velocity.reflect(normal);
                    // console.log(this.lastTouch)
                    this.reprint(this.lastTouch, "noreset", this.detectLineGoal(i));
                    if (this.pointsG != 3 && this.pointsR != 3 && this.pointsY != 3)
                        await this.pauseGameAndShowCountdown()
                    this.resetBall();
                    return;
                }
            }
        }
    }
    
    checkIfLost()
    {
        if (this.pointsY >= 3) {
            this.createModal()
            this.resetGame();
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsG >= 3) {
            this.createModal()
            this.resetGame();
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsR >= 3) {
            this.createModal()
            this.resetGame();
            this.gameStarted = true;
            return true;
        }
        return false;
    }
    
    async pauseGameAndShowCountdown()
    {
        // console.log("CUANTAS VEZES ENTRAS");
        this.gameStarted = false;
        this.ball.position.set(0, 2, 0);
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.scene.remove(this.ball);
        await this.showCountdown(this.scene, this.loadfont, this.renderer, this.camera);
    }
    
    resetGame()
    {
        this.pointsG = 0;
        this.pointsR = 0;
        this.pointsY = 0;
        this.lastTouch = "N";
        this.reprint("Y", "reset");
        this.reprint("G", "reset");
        this.reprint("R", "reset");
        this.ball = null;
        this.gameStarted = false;
    }

}

customElements.define('pong-gamemulti', PongGame);

export default function renderPongGameMulti() {
    return '<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><pong-gamemulti></pong-gamemulti>';
}
