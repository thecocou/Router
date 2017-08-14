/*jshint esversion: 6*/

function initRouter(){
  // Cargo Mapa
  var Mapa = cargarMapa();
  // Cargo Direction Service
  Enrutador = new google.maps.DirectionsService;
  // Cargo Directions Renderer
  ImpresoraDeRutas = new google.maps.DirectionsRenderer({map: Mapa});

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar = document.getElementById('enrutar');
  botonEnrutar.addEventListener("click", function() {

    var direcciones = getDirecciones();
        waypoints = getWaypoints(direcciones);

    mostrarRuta(Enrutador, ImpresoraDeRutas, direcciones, waypoints);
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
      waypoint.push({location: direccion[n]},);
    }
  }
  return waypoint;
}

// FUNCION PARA MOSTRAR LA RUTA
function mostrarRuta(directionsService, directionsDisplay, direccion, waypoint) {
  directionsService.route({
    origin: direccion[0],
    destination: direccion[direccion.length - 1],
    waypoints: waypoints,
    optimizeWaypoints: true,
    region: "AR",
    travelMode: "WALKING",
  }, function(response, status) {
    console.log(response);
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      alert('No es posible mostrar la ruta por lo siguiente: ' + status);
    }
  });
}
