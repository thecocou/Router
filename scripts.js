/*jshint esversion: 6*/

function initRouter(){
  var Mapa = cargarMapa();  // Cargo Mapa
      Geocoder = new google.maps.Geocoder();
      enrutador = new google.maps.DirectionsService;
      displayRoutes = new google.maps.DirectionsRenderer({map: Mapa});
      botonEnrutar = document.getElementById('enrutar');

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar.addEventListener("click", function() {

    var direcciones = getDirecciones();
    var waypoints = getWaypoints(direcciones);

    mostrarRuta(direcciones, waypoints);

    setearOpcionesDelMapaPorDefault(Mapa);
    setearCursorEnCampoDireccion();
  });
}

// FUNCION PARA INICIAR EL MAPA
function cargarMapa() {
  var Mapa = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.618356, lng:-58.433464},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  return Mapa;
}

// FUNCION PARA OBTENER LAS DIRECCIONES
function getDirecciones() {
  let direccion = [];
  for (let i = 0; i < 4; i++) {
    if (document.getElementById('direccion[' + i + ']').value !== "") {
      direccion[i] = document.getElementById('direccion[' + i + ']').value + ", Capital Federal";
    }
  }
  return direccion;
}

// FUNCION PARA OBTENER WAYPOINTS
function getWaypoints(direccion) {
  let waypoint = [];
  for(let n = 1; n < direccion.length - 1; n++) {
    waypoint[n - 1] = {location: direccion[n], stopover: true,};
  }
  return waypoint;
}

// FUNCION PARA MOSTRAR LA RUTA
function mostrarRuta(direccion, waypoint) {
  enrutador.route({
    origin: direccion[0],
    destination: direccion[direccion.length - 1],
    travelMode: "WALKING",
    transitOptions: {routingPreference: "LESS_WALKING"},
    waypoints: waypoint,
    optimizeWaypoints: true,
    region: "AR"
  }, function(response, status) {
    if (status === 'OK') {
      displayRoutes.setDirections(response);
    } else {
      alert('No es posible mostrar la ruta por lo siguiente: ' + status);
    }
  });
}

/*
function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}*/

// FUNCION PARA ELIMINAR UN ELEMENTO
function eliminarElemento(elemento){
  if(document.getElementById(elemento))
		document.getElementById(elemento).remove();
}

// Funcion para eliminar una fila (cedula)
function eliminarRow(row) {
  if (confirm("Estas seguro que deseas eliminar esta cedula?")) {
    var rowSeleccionada = row.parentNode.parentNode;
    rowSeleccionada.parentNode.removeChild(rowSeleccionada);
  }
}

// FUNCION PARA DEJAR EN BLANCO UN INPUT
function blanquearInput(elemento){
  document.getElementById(elemento).value = "";
}

// FUNCION PARA SETEAR LA POSICION DEL MAPA POR DEFECTO
function setearOpcionesDelMapaPorDefault(map) {
  map.setCenter({lat:-34.618356, lng:-58.433464});
  map.setZoom(12);
}

// funcion para volver el cursor al imput direccion
function setearCursorEnCampoDireccion() {
  document.getElementById("direccion[1]").focus();
}
