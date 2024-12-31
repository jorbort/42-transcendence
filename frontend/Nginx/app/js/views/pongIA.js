import { handleRouteChange } from "../mainScript.js";
import { getCookie } from '../webComponents/friendsListComponent.js';

class PongGame extends HTMLElement {
    constructor() {
        super();
        this.ballSpeedX = 0.13;
        this.ballSpeedY = 0.05;
        this.aiSpeed = 0.18;
        this.paddleSpeed = 0.18;
        this.ballDireccionX = (Math.random() < 0.5 ? -1 : 1);
        this.ballDireccionY = (Math.random() < 0.5 ? -1 : 1);
        this.pointsPlayer = 0;
        this.pointsIA = 0;
        this.movePaddleLeft = 0;
        this.movePaddleRight = 0;
        this.targetPaddleLeftY = 0;
        this.targetPaddleRightY = 0;
        this.ball = null; // ocultar pelota
        this.countdownText = null;
        this.loadfont = null;
        this.playerText = null;
        this.user_name = localStorage.getItem('username');
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
        this.handleKeyDownL = this.handleKeyDownL.bind(this);
        this.handleKeyUpL = this.handleKeyUpL.bind(this);
    }

    async connectedCallback() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('keydown', this.handleKeyDownL);
        window.addEventListener('keyup', this.handleKeyUpL);
        this.createModalData();
    }

    disconnectedCallback() {
        clearInterval(this.IntervalIA);
        cancelAnimationFrame(this.animationFrameId);
        this.gameStarted = false;
    }

    initObjects() {

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

        const Custom2Geometry = new THREE.TorusKnotGeometry(0.4, 0.12, 47, 7);
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
        if (this.pointsPlayer >= 3) winners.push(this.user_name); // Nombre del jugador
        if (this.pointsIA >= 3) winners.push("IA");         // Nombre de la IA
        let winnerMessage;
        if (winners.length === 0) {
            winnerMessage = "No winners yet!";
        } else if (winners.length === 1) {
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
                    myModal.dispose();
                    document.getElementById('myModal').remove();
                    history.pushState('', '', '/localgame1vsIA');
                    handleRouteChange();
                });
            }
            const btnGoHome = document.getElementById("Go-Home");
            if (btnGoHome) {
                btnGoHome.addEventListener('click', () => {
                    myModal.dispose();
                    document.getElementById('myModal').remove();
                    history.pushState('', '', '/Profile');
                    handleRouteChange();
                });
            }
            const btncruz = document.getElementById("btn-cruz");
            if (btncruz) {
                btncruz.addEventListener('click', () => {
                    myModal.hide();
                    document.getElementById('myModal').remove();
                    history.pushState('', '', '/Profile');
                    handleRouteChange();
                });
            }
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
                             <label>
                                <input type="checkbox" id="chkSpeed"> Aumentar velocidad con el cono
                            </label>
                        </div>
                        <div class="modal-footer d-flex justify-content-between align-items-center">
                            <label>
                                <input type="checkbox" id="chkSize"> Disminuir velocidad con el Icosahedron
                            </label>
                        </div>
                        <div class="modal-footer d-flex justify-content-between align-items-center">
                            <label>
                                <input type="checkbox" id="chkDecrease"> Disminuir velocidad de las palas con el TorusKnot
                            </label>
                        </div>
                        <button id="btnSave" type="button" class="btn btn-primary">Guardar Configuración</button>
                        <button id="btnCancel" type="button" class="btn btn-secondary">Cancelar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;
        return modalContainer;
    }

    async createModalData() {
        const newModal = this.ModalData();
        this.appendChild(newModal);
        const myModal = new bootstrap.Modal(document.getElementById('customModal'), {
            keyboard: false
        });
        myModal.show();

        document.getElementById("btnSave").addEventListener('click', async () => {
            if (document.querySelector('#chkSpeed').checked) this.addCustom = true;
            if (document.querySelector('#chkSize').checked) this.addCustom1 = true;
            if (document.querySelector('#chkDecrease').checked) this.addCustom2 = true;
            myModal.dispose();
            document.getElementById('customModal').remove();
            await this.startGame();
        });

        document.getElementById("btnCancel").addEventListener('click', async () => {
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            myModal.dispose();
            document.getElementById('customModal').remove();

            history.pushState('', '', '/Profile');
            handleRouteChange();
            //await this.startGame();
        });
        document.getElementById("btncruz").addEventListener('click', async () => {
            this.addCustom = false;
            this.addCustom1 = false;
            this.addCustom2 = false;
            myModal.dispose();
            document.getElementById('customModal').remove();
            history.pushState('', '', '/Profile');
            handleRouteChange();
            //await this.startGame();
        });
        // Interceptar la acción del botón "Atrás" del navegador
        window.onpopstate = (event) => {
            myModal.dispose();
            history.pushState('', '', '/Profile');
            handleRouteChange();
        };
    }

    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
                this.loadfont = font;
                const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
                this.playerText = this.createText(this.user_name + ": " + this.pointsPlayer, new THREE.Vector3(-15, 9.5, 0), font, textMaterial);
                this.IAText = this.createText("IA: " + this.pointsIA, new THREE.Vector3(8, 9.5, 0), font, textMaterial);
                this.scene.add(this.playerText);
                this.scene.add(this.IAText);
                resolve(font);
            }, undefined, (error) => {
                console.error("Error loading font:", error);
                reject(error);
            });
        });
    }

    async startCountdown() {
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
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

    async startGame() {
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

        const animate = async () => {
            if (this.gameStarted) return;

            await this.moveBall();

            this.customGame();

            this.checkPaddleCollision();

            this.movaPaddles();

            this.paddleLeft.position.y = THREE.MathUtils.clamp(this.targetPaddleLeftY, -3, 7);
            this.paddleRight.position.y = THREE.MathUtils.clamp(this.targetPaddleRightY, -3, 7);
            this.renderer.render(this.scene, this.camera);

            if (!this.checkIfLost())
                requestAnimationFrame(animate);
        };

        this.IntervalIA = setInterval(this.moveAI, 1000, this);

        animate();
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

    checkPaddleCollision() {// Detectar colisión con el paddle izquierdo
        if (this.ball.position.x <= this.paddleLeft.position.x + 0.2 &&
            this.ball.position.x > this.paddleLeft.position.x && // Asegurarse de que la pelota no esté detrás del paddle
            this.ball.position.y < this.paddleLeft.position.y + 1 &&
            this.ball.position.y > this.paddleLeft.position.y - 1) {
            this.ballDireccionX *= -1;
            this.ballSpeedX += 0.009;
            this.ballSpeedY += 0.0009;
        } // Detectar colisión con el paddle derecho
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
        this.paddleSpeed = 0.16;
    }

    reprint(name, points) {
        if (name == 'IA') {
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
        else {
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
        {
            if (Math.abs(this.Custom.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom.position.y - this.ball.position.y) <= proximityRange) {
                this.ballSpeedX += 0.0015;
                this.ballSpeedY += 0.0005;
                this.Custom.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom1) {
            if (Math.abs(this.Custom1.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom1.position.y - this.ball.position.y) <= proximityRange) {
                this.ballSpeedX -= 0.015;
                this.ballSpeedY -= 0.005;
                this.Custom1.position.set(Math.floor(Math.random() * (4 - (-5) + 1)) + (-5), Math.floor(Math.random() * (5 - (-3) + 1)) + (-3), 0);
            }
        }
        if (this.addCustom2) {
            if (Math.abs(this.Custom2.position.x - this.ball.position.x) <= proximityRange &&
                Math.abs(this.Custom2.position.y - this.ball.position.y) <= proximityRange) {
                if (this.ballDireccionX > 0)
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
            this.reprint(this.user_name, this.pointsPlayer);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.x < -15) {
            this.pointsIA++;
            this.reprint("IA", this.pointsIA);
            await this.pauseGameAndShowCountdown()
            this.resetBall();
        }
        if (this.ball.position.y > 7.5 || this.ball.position.y < -3.5) {
            this.ballDireccionY *= -1;
        }
    }

    movaPaddles() {
        if (this.movePaddleLeft === 1 && this.targetPaddleLeftY < 8) {
            this.targetPaddleLeftY += this.aiSpeed;
        } else if (this.movePaddleLeft === -1 && this.targetPaddleLeftY > -4)
            this.targetPaddleLeftY -= this.aiSpeed;

        if (Math.abs(this.targetPaddleRightY - this.futureLeftY) > 0.2) {
            if (this.targetPaddleRightY > this.futureLeftY) {
                this.targetPaddleRightY -= this.aiSpeed;
            } else if (this.targetPaddleRightY < this.futureLeftY) {
                this.targetPaddleRightY += this.aiSpeed;
            }
        }

        this.paddleLeft.position.y = THREE.MathUtils.clamp(this.paddleLeft.position.y, -4, 8);
        this.paddleRight.position.y = THREE.MathUtils.clamp(this.paddleRight.position.y, -4, 8);
    }

    async insertresultinbd(username, localplayer, bool) {
        let token = getCookie('access_token');

        const formData = new FormData();
        formData.append('player1', username);
        formData.append('player2', localplayer);
        formData.append('player1_score', this.pointsPlayer);
        formData.append('player2_score', this.pointsIA);
        if (bool == 0) {
            formData.append('winner', username);
        } else {
            formData.append('winner', localplayer);
        }

        try {
            const response = await fetch("https://localhost:3042/users/matches/register/", {
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

    checkIfLost() {
        if (this.pointsPlayer >= 3) {
            clearInterval(this.IntervalIA);
            this.insertresultinbd(localStorage.getItem('username'), "IA", 0);
            this.createModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        else if (this.pointsIA >= 3) {
            clearInterval(this.IntervalIA);
            this.insertresultinbd(localStorage.getItem('username'), "IA", 1);
            this.createModal()
            this.resetGame(this.ball);
            this.gameStarted = true;
            return true;
        }
        return false;
    }

    async pauseGameAndShowCountdown() {
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

    resetGame() {
        this.pointsIA = 0;
        this.pointsPlayer = 0;
        this.reprint(this.user_name, this.pointsPlayer);
        this.reprint("IA", this.pointsIA);
        this.ball = null;
        this.gameStarted = false;
    }

    moveAI(object) {
        const ballSpeedX = (object.ballSpeedX * object.ballDireccionX);
        const ballSpeedY = (object.ballSpeedY * object.ballDireccionY);
        const minY = -4;
        const maxY = 8;
        let futureLeft = object.ball.position.y + ((object.paddleRight.position.x - object.ball.position.x) / ballSpeedX) * ballSpeedY;

        while (futureLeft < minY || futureLeft > maxY) {
            if (futureLeft < minY) {
                futureLeft = minY + (minY - futureLeft);
            } else if (futureLeft > maxY) {
                futureLeft = maxY - (futureLeft - maxY);
            }
        }
        object.futureLeftY = futureLeft;
    }

}

customElements.define('pong-gameia', PongGame);

export default function renderPongGameIA() {
    return '<header-nav-bar></header-nav-bar><side-nav-bar></side-nav-bar><pong-gameia></pong-gameia>';
}
