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

    initObjects()
    {   
  
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

        const L = 27;
        const h = (Math.sqrt(3) * L) / 2;
        const offset = 9; // Distancia desde el final de cada línea
        
        // Función para calcular puntos ajustados
        const adjustPoint = (start, end, offset) => {
            const dir = new THREE.Vector3().subVectors(end, start).normalize(); // Dirección entre los puntos
            return new THREE.Vector3().addVectors(start, dir.multiplyScalar(offset)); // Ajuste del punto con el offset
        };
        
        // Ajuste de puntos para crear las "líneas flotantes"
        const points = [
            adjustPoint(new THREE.Vector3(-L / 2, -5, 0), new THREE.Vector3(L / 2, -5, 0), offset), // línea 1, primer punto
            adjustPoint(new THREE.Vector3(L / 2, -5, 0), new THREE.Vector3(-L / 2, -5, 0), offset), // línea 1, segundo punto
            adjustPoint(new THREE.Vector3(L / 2, -5, 0), new THREE.Vector3(0, -5 + h, 0), offset), // línea 2, primer punto
            adjustPoint(new THREE.Vector3(0, -5 + h, 0), new THREE.Vector3(L / 2, -5, 0), offset), // línea 2, segundo punto
            adjustPoint(new THREE.Vector3(0, -5 + h, 0), new THREE.Vector3(-L / 2, -5, 0), offset), // línea 3, primer punto
            adjustPoint(new THREE.Vector3(-L / 2, -5, 0), new THREE.Vector3(0, -5 + h, 0), offset) // línea 3, segundo punto
        ];

        const material = new THREE.LineBasicMaterial({
            color: 0x808080, // Gris
            linewidth: 3,    // Grosor de la línea
            opacity: 0.8,    // Opacidad de la línea (si quieres que sea algo transparente)
            transparent: true // Habilitar transparencia
        });
        
        for (let i = 0; i < points.length; i += 2) {
            const geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        }
        
        const Custom2Geometry =  new THREE.TorusKnotGeometry(0.4, 0.12, 47, 7);
        const Custom2Material = new THREE.MeshStandardMaterial({ color: 0x00FFFF, metalness: 0.5, roughness: 0.5 });
        this.Custom2 = new THREE.Mesh(Custom2Geometry, Custom2Material);
        this.Custom2.position.set(-4, -2, 0);
        this.camera.position.set(0, 1, 20);
        if (this.addCustom2)
            this.scene.add(this.Custom2);

        const p1 = new THREE.Vector3(-L / 2, -5, 0); // Vértice 1
        const p2 = new THREE.Vector3(L / 2, -5, 0);  // Vértice 2
        const p3 = new THREE.Vector3(0, -5 + h, 0);  // Vértice 3

        // Cálculo del centro del triángulo
        const centerX = (p1.x + p2.x + p3.x) / 3;
        const centerY = (p1.y + p2.y + p3.y) / 3;
        const centerZ = (p1.z + p2.z + p3.z) / 3;

        // Crear un vector con las coordenadas del centro
        const center = new THREE.Vector3(centerX, centerY, centerZ);

        console.log(center);  // Imprime las coordenadas del centro


        const paddleGeometry = new THREE.BoxGeometry(0.4, 2, 0.1);
        const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

        this.paddle1 = new THREE.Mesh(paddleGeometry, paddleMaterial);
        var m = Math.sqrt(((L / 2) * (L / 2)) + 25)
        this.RedPosX = (-L / 2) + 8 * ((0 - (-L / 2)) / m)
        this.RedPosY = (-5) + 8 * ((0 + 5) / m)
        this.paddle1.position.set(this.RedPosX, this.RedPosY, 0);
       
        // this.paddle1.lookAt(center);
        this.paddle1.lookAt(new THREE.Vector3(0, 1, 0));

        this.scene.add(this.paddle1);

        const paddleMaterial2 = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.paddle2 = new THREE.Mesh(paddleGeometry, paddleMaterial2);
        var m2 = Math.sqrt(((L / 2) * (L / 2)) + 25);
        this.GreenposX = (L / 2) - 8 * ((L / 2 - 0) / m2);
        this.GreenposY = (-5) + 8 * ((0 + 5) / m2);
        this.paddle2.position.set(this.GreenposX, this.GreenposY, 0);
        
        this.paddle2.lookAt(new THREE.Vector3(0, 1, 0));
        this.scene.add(this.paddle2);

        const paddleMaterial3 = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const paddleGeometry2 = new THREE.BoxGeometry(2, 0.4, 0.1);
        this.paddle3 = new THREE.Mesh(paddleGeometry2, paddleMaterial3);
        this.YellPosX = 0;
        this.YellPosY = -12 + h;
        this.paddle3.position.set(this.YellPosX , this.YellPosY, 0);
        this.scene.add(this.paddle3);

        this.edges = [
            { start: points[0], end: points[1] }, // Primera arista
            { start: points[1], end: points[2] }, // Segunda arista
            { start: points[2], end: points[0] }, // Tercera arista
            { start: points[3], end: points[4] }, // Cuarta arista
            { start: points[4], end: points[5] }, // Quinta arista
            { start: points[5], end: points[3] }, // Sexta arista
        ];

        this.velocity = new THREE.Vector3(0.15, 0.05, 0);
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
            await this.detectAndReflect();

            // this.customGame();
            
            this.checkPaddleCollision();
            
            this.movaPaddles();
            
            // this.paddle1.position.y = THREE.MathUtils.clamp(this.targetPaddle1Y, -4, 0);
            // this.paddle2.position.y  = THREE.MathUtils.clamp(this.targetPaddle2Y, -4, 0);
            // this.paddle3.position.y  = THREE.MathUtils.clamp(this.targetPaddle3Y, 11, 0);
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
        if (event.button === 0) { // Botón izquierdo del ratón
            this.movePaddle2 = 1;
        } else if (event.button === 2) { // Botón derecho del ratón
            this.movePaddle2 = -1;
        }
    }
    
    handleMouseUp(event) {
        if (event.button === 0 || event.button === 2) { // Ambos botones
            this.movePaddle2 = 0;
        }
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


    movaPaddles()
    {
        if (this.movePaddle1 === 1 && this.targetPaddle1Y < 8) {
            this.targetPaddle1Y += this.paddleSpeed;
        } else if (this.movePaddle1 === -1 && this.targetPaddle1Y > -4) {
            this.targetPaddle1Y -= this.paddleSpeed;
        }
        if (this.movePaddle2 === 1 && this.targetPaddle2Y < 8) {
            this.targetPaddle2Y += this.aiSpeed;
        } else if (this.movePaddle2 === -1 && this.targetPaddle2Y > -4) {
            this.targetPaddle2Y -= this.aiSpeed;
        }
        if (this.movePaddle3 === 1 && this.targetPaddle3Y < 8) {
            this.targetPaddle3Y += this.paddleSpeed;
        } else if (this.movePaddle3 === -1 && this.targetPaddle3Y > -4) {
            this.targetPaddle3Y -= this.paddleSpeed;
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
