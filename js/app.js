var agregarContacto = document.getElementById('agregar');
var formulario = document.getElementById('formulario_crear_usuario');
var action = formulario.getAttribute('action');
var divCrear = document.getElementById('crear_contacto');
var tablaRegistrados = document.getElementById('registrados');
var checkboxes = document.getElementsByClassName('borrar_contacto');
var btn_borrar = document.getElementById('btn_borrar');
var tableBody = document.getElementsByTagName('tbody');
var divExistentes = document.getElementsByClassName('existentes');
var inputBuscador = document.getElementById('buscador');
var totalRegistros = document.getElementById('total');
var checkTodos = document.getElementById('borrar_todos');

function actualizarNumero() {
    var registros = tableBody[0].getElementsByTagName('tr');
    
    var cantidad = 0;
    var ocultos = 0;
    
    for( var i = 0; i < registros.length; i++) {
        var elementos = registros[i];
        if(elementos.style.display == 'table-row'){
          cantidad++;
          totalRegistros.innerHTML = cantidad;
        }  else {
          if(elementos.style.display == 'none') {
              ocultos++;
              if(ocultos == registros.length) {
                ocultos -= registros.length;
                totalRegistros.innerHTML = ocultos;
              }
          }
        }
    }
}

function registroExitoso(nombre) {
  
  //crear div y agregar un id
  var divMensaje =document.createElement('DIV');
  divMensaje.setAttribute('id', "mensaje");
  
  //agregar texto
  var texto = document.createTextNode('Creado: ' + nombre);
  divMensaje.appendChild(texto);
  
  divCrear.insertBefore(divMensaje, divCrear.childNodes[4]);
  
  //agrgar la clase mostrar
  divMensaje.classList.add('mostrar');
  
  //ocultar el mensaje de creación
  setTimeout(function() {
      divMensaje.classList.add('ocultar');
      setTimeout(function() {
          var divPadreMensaje = divMensaje.parentNode;
          divPadreMensaje.removeChild(divMensaje);
      }, 500 );
  }, 3000);
}
// construir template para insertar datos dinamicamente
function construirTemplate(nombre, telefono, registro_id) {
    //crear  nombre de contacto
    var tdNombre = document.createElement('TD');
    var textoNombre = document.createTextNode(nombre);
    var parrafoNombre = document.createElement('P');
    parrafoNombre.appendChild(textoNombre);
    tdNombre.appendChild(parrafoNombre);
    
    //Crear Input con el nombre
    var inputNombre = document.createElement('INPUT');
    inputNombre.type = 'text';
    inputNombre.name = 'contacto_' + registro_id;
    inputNombre.value = nombre;
    inputNombre.classList.add('nombre_contacto');
    
    // crear telefono de contacto
    var tdTelefono = document.createElement('TD');
    var textoTelefono = document.createTextNode(telefono);
    var parrafoTelefono = document.createElement('P');
    parrafoTelefono.appendChild(textoTelefono);
    tdTelefono.appendChild(parrafoTelefono);
    

    //Crear Input con el telefono
    var inputTelefono = document.createElement('INPUT');
    inputTelefono.type = 'text';
    inputTelefono.name = 'telefono_' + registro_id;
    inputTelefono.value = telefono;
    inputTelefono.classList.add('telefono_contacto');
    
    //crear enlace para editar
    var nodoBtn = document.createElement('A');
    var textoEnlace = document.createTextNode('Editar');
    nodoBtn.appendChild(textoEnlace);
    nodoBtn.href = '#';
    nodoBtn.classList.add('editarBtn');
    
    
    // Crear boton para guardar
    var btnGuardar = document.createElement('A');
    var textoGuardar = document.createTextNode('Guardar');
    btnGuardar.appendChild(textoGuardar);
    btnGuardar.href = '#';
    btnGuardar.classList.add('guardarBtn');
    
    // agregar el boton al td
    var notoTdEditar = document.createElement('TD');
    notoTdEditar.appendChild(nodoBtn);
    notoTdEditar.appendChild(btnGuardar);
    
    //crear checkbox para borrar
    var checkBorrar = document.createElement('INPUT');
    checkBorrar.type = 'checkbox';
    checkBorrar.name = registro_id;
    checkBorrar.classList.add('borrar_contacto');
    
    //agregar td a checkbox
    var tdCheckbox = document.createElement('TD');
    tdCheckbox.classList.add('borrar');
    tdCheckbox.appendChild(checkBorrar);
    
    /* AGREGAR nombre y telefono para editar */
    tdNombre.appendChild(inputNombre);
    tdTelefono.appendChild(inputTelefono);
    
    // Agregar al TR
    var trContacto = document.createElement('TR');
    trContacto.setAttribute('id', registro_id);
    trContacto.appendChild(tdNombre);
    trContacto.appendChild(tdTelefono);
    trContacto.appendChild(notoTdEditar);
    trContacto.appendChild(tdCheckbox);
    
    tablaRegistrados.childNodes[3].append(trContacto);
    
    actualizarNumero();
    recorrerBotonesEditar();
    recorrerBotonesGuardar(registro_id);
}

function crearUsuario() {
    var form_datos = new FormData(formulario);
    for([key, value] of form_datos.entries()) {
      console.log(key + ": " + value);
    } 
    var xhr = new XMLHttpRequest();
    xhr.open('POST', action, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var resultado = xhr.responseText;
            console.log(resultado);
            var json = JSON.parse(resultado);
            if(json.respuesta == true) {
                registroExitoso(json.nombre);
                construirTemplate(json.nombre, json.telefono, json.id);
                var totalActualizado = parseInt(totalRegistros.textContent) + 1;
                totalRegistros.innerHTML = totalActualizado;
            }
        }
    }
    xhr.send(form_datos);
    
}

function mostrarEliminado() {
  // crear div y agregar id
  var divEliminado = document.createElement('DIV');
  divEliminado.setAttribute('id', 'borrado');
  
  // agregar texto
  var texto = document.createTextNode('Eliminado de lista de contactos');
  divEliminado.appendChild(texto);
  
  divExistentes[0].insertBefore(divEliminado, divExistentes[0].childNodes[0]);
  
  //agregar clase de CSS
  divEliminado.classList.add('mostrar');
  
  //ocultar el mensaje de creación
  setTimeout(function() {
      divEliminado.classList.add('ocultar');
      setTimeout(function() {
          var divPadreMensaje = divEliminado.parentNode;
          divPadreMensaje.removeChild(divEliminado);
      }, 500 );
  }, 3000);
}

function eliminarHTML(ids_borrados) {
    for(i = 0; i <  ids_borrados.length;i++) {
        var elementoBorrar = document.getElementById(ids_borrados[i]);
        tableBody[0].removeChild(elementoBorrar);
    }
}

function contactosEliminar(contactos) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'borrar.php?id=' + contactos, true );
  console.log('borrar.php?id=' + contactos);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
          var resultadoBorrar = xhr.responseText;
          var json = JSON.parse(resultadoBorrar);
          if(json.respuesta == false) {
              alert("seleccione un elemento");
          } else {
              console.log('Resultado: ' + resultadoBorrar);
              eliminarHTML(contactos);
              mostrarEliminado();
              var totalActualizado = parseInt(totalRegistros.textContent) - json.borrados;
              totalRegistros.innerHTML = totalActualizado;
          }
      }
  };
  xhr.send();
}

function checkboxSeleccionado() {
  var contactos = [];
  for(i = 0; i < checkboxes.length;i++) {
      if(checkboxes[i].checked == true) {
          contactos.push(checkboxes[i].name);
      }
  }
  contactosEliminar(contactos);
}

for(var i = 0; i < checkboxes.length; i++) {
  checkboxes[i].addEventListener('change', function() {
      if(this.checked) {
         this.parentNode.parentNode.classList.add('activo');
      } else {
         this.parentNode.parentNode.classList.remove('activo');
      }
  });
}

agregarContacto.addEventListener('click', function(e) {
  e.preventDefault();
  crearUsuario();
});

btn_borrar.addEventListener('click', function() {
    checkboxSeleccionado();
});



function ocultarRegistros(nombre_buscar){
    // variable para todos los registros
    var registros = tableBody[0].getElementsByTagName('tr');
    
    // expresion regular que busca el nombre con case insensitive
    var expression = new RegExp(nombre_buscar, "i");
    
    for(var i = 0; i < registros.length;i++) {
        registros[i].classList.add('ocultar');
        registros[i].style.display = 'none';
        
        if(registros[i].childNodes[1].textContent.replace(/\s/g, "").search(expression) != -1 || nombre =='') {
            registros[i].classList.add('mostrar');
            registros[i].classList.remove('ocultar');
            registros[i].style.display = 'table-row';
        } 
    }
    actualizarNumero();
}

inputBuscador.addEventListener('input', function() {
  ocultarRegistros(this.value);
} );

// Seleccionar todos

checkTodos.addEventListener('click', function() {
    if(this.checked) {
        var todosRegistros = tableBody[0].getElementsByTagName('tr');
        for(var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
            todosRegistros[i].classList.add('activo');
        }
    } else {
        var todosRegistros = tableBody[0].getElementsByTagName('tr');
        for(var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
            todosRegistros[i].classList.remove('activo');
        }
    }
});


/* Recorrer botones de guardar **/
function recorrerBotonesGuardar(id) {
    var btn_guardar = tableBody[0].querySelectorAll('.guardarBtn');
    for(var i = 0; i < btn_guardar.length; i++) {
        btn_guardar[i].addEventListener('click', function() {
            actualizarRegistro(id);
        });
    }
}
/*** Editar registros **/

function recorrerBotonesEditar() {
    var btn_editar = tableBody[0].querySelectorAll('.editarBtn');
    
    for(var i = 0; i < btn_editar.length; i++) {
        btn_editar[i].addEventListener('click', function(event) {
            event.preventDefault();
            deshabilitarEdicion();
            
            var registroActivo = this.parentNode.parentNode;
            registroActivo.classList.add('modo-edicion');
            registroActivo.classList.remove('desactivado');

            // Actualizamos el registro en especifico
            actualizarRegistro(registroActivo.id);
        });
    }
}
function deshabilitarEdicion() {
    var registrosTr = document.querySelectorAll('#registrados tbody tr');
    for(var i = 0; i < registrosTr.length; i++) {
        registrosTr[i].classList.add('desactivado');
    }
}

function habilitarEdicion() {
    var registrosTr = document.querySelectorAll('#registrados tbody tr');
    for(var i = 0; i < registrosTr.length; i++) {
        registrosTr[i].classList.remove('desactivado');
    }
}
function actualizarRegistro(idRegistro) {
    console.log(idRegistro);
    
    // Seleccionar Boton de Guardar del Registro en especifico (se pasa el ID)
    var btnGuardar = document.getElementById(idRegistro).getElementsByClassName('guardarBtn');
    
    btnGuardar[0].addEventListener('click', function(e) {
        e.preventDefault();
        
        // Obtiene el valor del campo nombre
        var inputNombreNuevo = document.getElementById(idRegistro).getElementsByClassName('nombre_contacto');
        var nombreNuevo = inputNombreNuevo[0].value;
        
        // Obtiene el valor del campo telefono
        var inputTelefonoNuevo =  document.getElementById(idRegistro).getElementsByClassName('telefono_contacto');
        var telefonoNuevo = inputTelefonoNuevo[0].value;
        
        // Objeto con todos los datos 
        var contacto = {
            nombre :nombreNuevo,
            telefono: telefonoNuevo,
            id: idRegistro
        };
        actualizarAjax(contacto);
    });
}

function actualizarAjax(datosContacto) {
    
    // Convierte Objeto a JSON
    var jsonContacto = JSON.stringify(datosContacto);
    // Crear la conexión
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'actualizar.php?datos=' + jsonContacto, true );
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var resultado = xhr.responseText;
            var resultadoJson = JSON.parse(resultado);
            if(resultadoJson.respuesta == true) {
                var registroActivo = document.getElementById(datosContacto.id);
                
                // Inserta dinamicamente el nombre
                registroActivo.getElementsByTagName('td')[0].getElementsByTagName('p')[0].innerHTML = resultadoJson.nombre;
                console.dir(registroActivo.getElementsByTagName('td'));
                
            // Inserta dinamicamente el telefono
                registroActivo.getElementsByTagName('td')[1].getElementsByTagName('p')[0].innerHTML = resultadoJson.telefono;
                
                // Borrar modo edición
                registroActivo.classList.remove('modo-edicion');
                habilitarEdicion();
            } else {
                console.log("hubo un error!!");
            }

        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function(event) {
    recorrerBotonesEditar();
});













