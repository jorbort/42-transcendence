
// ModalData() {
//     const modalContainer = document.createElement('div');

//     modalContainer.innerHTML = /* html */`
//     <div class="modal fade" id="customModal" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
//         <div class="modal-dialog modal-dialog-centered">
//             <div class="modal-content">
//                 <div class="modal-header">
//                     <h5 class="modal-title" id="exampleModalCenterTitle">Custom Game</h5>
//                 </div>
//                 <div class="modal-body">
//                     <form>
//                         <!-- Primer Modal Footer con la pregunta -->
//                         <div class="modal-footer d-flex justify-content-between align-items-center">
//                             <p class="text-start mb-0">¿Quieres aumentar la velocidad de la pelota con el cono?</p>
//                             <div>
//                                 <button id="btnSpeedYes" type="button" class="btn btn-success btn-sm">Sí</button>
//                                 <button id="btnSpeedNo" type="button" class="btn btn-danger btn-sm">No</button>
//                             </div>
//                         </div>

//                         <!-- Segundo Modal Footer con la pregunta -->
//                         <div class="modal-footer d-flex justify-content-between align-items-center">
//                             <p class="text-start mb-0">¿Quieres disminuir la velocidad de la pelota con el Icosahedron?</p>
//                             <div>
//                                 <button id="btnSizeYes" type="button" class="btn btn-success btn-sm">Sí</button>
//                                 <button id="btnSizeNo" type="button" class="btn btn-danger btn-sm">No</button>
//                             </div>
//                         </div>

//                         <!-- Tercer Modal Footer con la pregunta -->
//                         <div class="modal-footer d-flex justify-content-between align-items-center">
//                             <p class="text-start mb-0">¿Quieres disminuir la velocidad de las palas con el TorusKnot?</p>
//                             <div>
//                                 <button id="btnDecreaseYes" type="button" class="btn btn-success btn-sm">Sí</button>
//                                 <button id="btnDecreaseNo" type="button" class="btn btn-danger btn-sm">No</button>
//                             </div>
//                         </div>

//                         <!-- Nueva sección con la barra selectora -->
//                         <div class="modal-footer d-flex justify-content-between align-items-center">
//                             <p class="text-start mb-0">Selecciona la cantidad de jugadores para el torneo:</p>
//                             <div>
//                                 <input type="range" id="speedSlider" min="0" max="2" step="1" value="0">
//                                 <span id="sliderValue">4</span>
//                             </div>
//                         </div>

//                         <!-- Botón para guardar la configuración -->
//                         <button id="btnSave" type="button" class="btn btn-primary" disabled>Guardar Configuración</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     </div>`;

//     // Lógica para el slider
//     const slider = modalContainer.querySelector('#speedSlider');
//     const sliderValue = modalContainer.querySelector('#sliderValue');

//     // Valores específicos para el slider
//     const values = [4, 8, 12];

//     // Actualizar el valor mostrado del slider cuando se cambia
//     slider.addEventListener('input', () => {
//         const selectedValue = values[slider.value];
//         sliderValue.textContent = selectedValue;
//         this.qttplayers = selectedValue;
//     });

//     return modalContainer;
// }


// checkSavebtn()
// {
//     if (this.firstSelect && this.SecondSelect && this.lastSelect)
//     {
//         const btnSave = document.getElementById("btnSave");
//         btnSave.disabled = false; // Habilita el botón
//         btnSave.style.backgroundColor = "#007bff"; // Cambia el color a azul (color por defecto de Bootstrap)
//         btnSave.style.cursor = "pointer"; 
//     }
// }

// createModalData( container )
// {
//     const newModal = this.ModalData();

//     container.appendChild(newModal);
//     const myModal = new bootstrap.Modal(document.getElementById('customModal'), {
//         keyboard: false
//     });
//     myModal.show();

//     const handleResponse = (responseType, action) => {
//         console.log(`${responseType} respondido: ${action}`);
//         this.checkSavebtn();
//     };

//     function resetButtonStyles(buttonYesId, buttonNoId) {
//         const btnYes = document.getElementById(buttonYesId);
//         const btnNo = document.getElementById(buttonNoId);
        
//         btnYes.style.backgroundColor = "#888";
//         btnYes.style.borderColor = "#888"
//         btnYes.style.color = "#fff";
//         btnNo.style.backgroundColor = "#888";
//         btnNo.style.borderColor = "#888"
//         btnNo.style.color = "#fff";

//     }

//     function initializeButtons() {
//         const buttons = ["btnSpeedYes", "btnSpeedNo", "btnSizeYes", "btnSizeNo", "btnDecreaseYes", "btnDecreaseNo"];
//         buttons.forEach(buttonId => {
//             const btn = document.getElementById(buttonId);
//             btn.style.backgroundColor = "#888";
//             btn.style.borderColor = "#888"
//             btn.style.color = "#fff";
//         });
//     }

//     initializeButtons();

//     document.getElementById("btnSpeedYes").addEventListener('click', () => {
//         resetButtonStyles("btnSpeedYes", "btnSpeedNo");
//         const btn = document.getElementById("btnSpeedYes");
//         btn.style.backgroundColor = "green";
//         btn.style.color = "#fff";
//         this.addCustom = true;
//         this.firstSelect = true;
//         handleResponse("Aumentar velocidad", "Si");
//     });

//     document.getElementById("btnSpeedNo").addEventListener('click', () => {
//         resetButtonStyles("btnSpeedYes", "btnSpeedNo");
//         const btn = document.getElementById("btnSpeedNo");
//         btn.style.backgroundColor = "red";
//         btn.style.color = "#fff";
//         this.addCustom = false;
//         this.firstSelect = true;
//         handleResponse("Aumentar velocidad", "No");
//     });

//     document.getElementById("btnSizeYes").addEventListener('click', () => {
//         resetButtonStyles("btnSizeYes", "btnSizeNo");
//         const btn = document.getElementById("btnSizeYes");
//         btn.style.backgroundColor = "green";
//         btn.style.color = "#fff";
//         this.addCustom1 = true;
//         this.SecondSelect = true;
//         handleResponse("Aumentar tamaño", "Si");
//     });

//     document.getElementById("btnSizeNo").addEventListener('click', () => {
//         resetButtonStyles("btnSizeYes", "btnSizeNo");
//         const btn = document.getElementById("btnSizeNo");
//         btn.style.backgroundColor = "red";
//         btn.style.color = "#fff";
//         this.SecondSelect = true;
//         this.addCustom1 = false;
//         handleResponse("Aumentar tamaño", "No");
//     });

//     document.getElementById("btnDecreaseYes").addEventListener('click', () => {
//         resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
//         const btn = document.getElementById("btnDecreaseYes");
//         btn.style.backgroundColor = "green";
//         btn.style.color = "#fff";
//         this.addCustom2 = true;
//         this.lastSelect = true;
//         handleResponse("Disminuir tamaño", "Si");
//     });

//     document.getElementById("btnDecreaseNo").addEventListener('click', () => {
//         resetButtonStyles("btnDecreaseYes", "btnDecreaseNo");
//         const btn = document.getElementById("btnDecreaseNo");
//         btn.style.backgroundColor = "red";
//         btn.style.color = "#fff";
//         this.lastSelect = true;
//         this.addCustom2 = false;
//         handleResponse("Disminuir tamaño", "No");
//     });

//     document.getElementById("btnSave").addEventListener('click', async () => {
//         if (this.firstSelect && this.SecondSelect && this.lastSelect)
//         {
//             myModal.dispose()
//             document.getElementById('customModal').remove();
//             localStorage.setItem("addCustom", this.addCustom);
//             localStorage.setItem("addCustom1", this.addCustom);
//             localStorage.setItem("addCustom2", this.addCustom2);
//             this.configsaved = true;
//             localStorage.setItem("btnsave", this.configsaved );
//             localStorage.setItem("qttplayers", this.qttplayers );
//             //Guardar variables localstoarge
//         }
//     });
//     // document.getElementById("btnCancel").addEventListener('click', async () => {
//     //     console.log("Cancel Seleccionado.");
//     //     this.addCustom = false;
//     //     this.addCustom1 = false;
//     //     this.addCustom2 = false;
//     //     // myModal.hide();
//     //     myModal.dispose()
//     //     document.getElementById('customModal').remove();
//     //     await this.startGame();
//     // });
//     // document.getElementById("btncruz").addEventListener('click', async () => {
//     //     console.log("Cruz Seleccionado.");
//     //     this.addCustom = false;
//     //     this.addCustom1 = false;
//     //     this.addCustom2 = false;
//     //     // myModal.hide();
//     //     myModal.dispose()
//     //     document.getElementById('customModal').remove();
//     //     await this.startGame();
//     // });
// };