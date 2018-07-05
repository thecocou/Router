/*jshint esversion: 6*/

function initRouter() {
  let botonEnrutar = document.getElementById("enrutar");
  let barraLateral = document.getElementById("barraLateral");

  // Cargo Inputs
  agregarInputs(barraLateral, botonEnrutar);
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
    mostrarRutaEnMapa(Enrutador, ImpresoraDeRutas, direcciones, waypoints, barraLateral);
  });
}

// FUNCION PARA INICIAR EL MAPA
function cargarMapa() {
  var Mapa = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.618356, lng:-58.433464},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
  return Mapa;
}

// FUNCION PARA AGREGAR INPUTS
function agregarInputs(barraLateral, botonEnrutar) {
  for(i = 0; i < 25; i++) {
    barraLateral.innerHTML += "<input id='direccion[" + i + "]' class='inputs' placeholder='Ingrese direccion' type='text' onkeydown='if (event.keyCode == 13) document.getElementById("+'"enrutar"'+").click()'/>";
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
function mostrarRutaEnMapa(directionsService, directionsDisplay, direccion, waypoint) {
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
    } else {
      alert('No es posible mostrar la ruta por lo siguiente: ' + status);
    }
  });
}

// FUNCION PARA MOSTRAR DIRECCIONES EN ORDEN
function mostrarRutaEnBarraLateral(respuesta){
  let rutas = [];
  let abc = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  let n = 0;
  
  respuesta.routes[0].legs.forEach((element) => {
    rutas.push(abc[n] + ": " + element.end_address);
    n++;
  });

  console.log(rutas);
  
  barraLateral.innerHTML = "";

  rutas.forEach((direccion) => {
    barraLateral.innerHTML += "<tr><td><p id='direcciones'>" + direccion + "</p></td></tr>";
  });

}