/*jshint esversion: 6*/

function initRouter() {
  let botonEnrutar = document.getElementById("enrutar");
  let barraLateral = document.getElementById("barraLateral");

  // Cargo Inputs
  agregarInputs(barraLateral);
  // Cargo Mapa
  let Mapa = cargarMapa();
  // Cargo Direction Service
  let Enrutador = new google.maps.DirectionsService();
  // Cargo Directions Renderer
  let ImpresoraDeRutas = new google.maps.DirectionsRenderer({map: Mapa});

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar.addEventListener("click", function() {
    let direcciones = getDirecciones();
    let waypoints = getWaypoints(direcciones);
    mostrarRutaEnMapa(Enrutador, ImpresoraDeRutas, direcciones, waypoints);
  });
}

// FUNCION PARA INICIAR EL MAPA
function cargarMapa() {
  return new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.618356, lng:-58.433464},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
}

// FUNCION PARA AGREGAR INPUTS
function agregarInputs(barraLateral) {
  for(i = 0; i < 25; i++) {
    barraLateral.innerHTML += "<input id='direccion[" + i + "]' class='inputs' placeholder='Ingrese una direccion' type='text' onkeydown='if (event.keyCode == 13) document.getElementById("+'"enrutar"'+").click()'/>";
  }
}

// FUNCION PARA OBTENER LAS DIRECCIONES
function getDirecciones() {
  let direccion = [];
      cantidadDeInputs = document.getElementsByClassName("inputs").length;

  for (let n = 0; n < cantidadDeInputs; n++) {
    if (document.getElementById('direccion[' + n + ']').value !== "") {
      direccion.push(document.getElementById('direccion[' + n + ']').value + ", Capital Federal");
    }
  }
  return direccion;
}

// FUNCION PARA OBTENER WAYPOINTS
function getWaypoints(direccion) {
  let waypoint = [];
      primerWaypoint = 1;
      ultimoWaypoint = direccion.length - 1;

  if (direccion.length > 2) {
    for(let n = primerWaypoint; n < ultimoWaypoint; n++) {
      waypoint.push({location: direccion[n]});
    }
  }
  return waypoint;
}

// FUNCION PARA MOSTRAR LA RUTA
function mostrarRutaEnMapa(directionsService, directionsDisplay, direccion, waypoint, botonDistancia) {
  directionsService.route({
    origin: direccion[0],
    destination: direccion[direccion.length - 1],
    waypoints: waypoint,
    optimizeWaypoints: true,
    region: "AR",
    travelMode: "WALKING",
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      mostrarRutaEnBarraLateral(response);
      calcularTiempoyDistancia(response);
    } else {
      alert('No es posible mostrar la ruta por lo siguiente: ' + status);
    }
  });
}


// FUNCION PARA MOSTRAR TIEMPO Y DISTANCIAS
function calcularTiempoyDistancia(respuesta){
  var totalDist = 0;
  var totalTime = 0;
   
  respuesta.routes[0].legs.forEach((element) => {
    totalDist += element.distance.value;
    totalTime += element.duration.value;
  });

  let distancia = document.getElementById("distancia");
  let tiempo = document.getElementById("tiempo");

  tiempo.innerHTML = "<p>TIEMPO ESTIMADO: " + (totalTime / 60).toFixed(2) + " minutos</p>"
  distancia.innerHTML = "<p> DISTANCIA TOTAL: " + (totalDist / 1000) + " km</p>";
} 


// FUNCION PARA MOSTRAR DIRECCIONES EN ORDEN
function mostrarRutaEnBarraLateral(respuesta){
  let rutas = [];
  let abc = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let n = 0;
  
  // agrego la direccion de salida
  rutas.push(respuesta.routes[0].legs[0].start_address);

  // agrego el resto de las direcciones
  respuesta.routes[0].legs.forEach((element) => {
      rutas.push(element.end_address);
  });

  // agrego los inputs restantes
  if (rutas.length < 25) {
    for (z = rutas.length; z < 25; z++) {
      rutas.push("");
    }      
  }

  // borro la barra lateral
  barraLateral.innerHTML = "";

  // escribo las direcciones en la barra lateral
  rutas.forEach((direccion) => {
    barraLateral.innerHTML += "<tr><td><p id='letras'>" + abc[n] + ": </p></td><td><input id='direccion[" + n + "]' class='inputs' value='" + direccion + "' type='text' onkeydown='if (event.keyCode == 13) document.getElementById("+'"enrutar"'+").click()'/></td></tr>"
    n++;
  });
}

// ToDo:
// Seleccionar automaticamente las direcciones mas alejadas para usarlas como inicio y fin de la ruta.
// estilos