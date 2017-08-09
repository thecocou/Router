/*jshint esversion: 6*/

function initRouter(){
  var Mapa = cargarMapa();  // Cargo Mapa
      Geocoder = new google.maps.Geocoder();
      enrutador = new google.maps.DirectionsService;
      displayRoutes = new google.maps.DirectionsRenderer({map: Mapa});
      botonEnrutar = document.getElementById('enrutar');
      direccion = [];

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar.addEventListener("click", function() {

    for (i = 0; i < 4; i++) {
      if (document.getElementById('direccion[' + i + ']').value !== "") {
        direccion[i] = document.getElementById('direccion[' + i + ']').value;
        console.log(direccion);
      }
    }

    mostrarRuta(direccion);

    setearOpcionesDelMapaPorDefault(Mapa);
    setearCursorEnCampoDireccion();
    blanquearInputsYTips();
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

/*
function mostrarRuta(direcciones) {
  enrutador.route({
    origin: direcciones[0],
    destination: direcciones[length],
    travelMode: "WALKING",
    transitOptions: {routingPreference: "LESS_WALKING"},
    waypoints: [
      {direcciones[0]},
      {direcciones[1]},
      {direcciones[2]}
    ],
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
*/

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



















/*
// CLASE RUTA
class Ruta {
  constructor(Mapa) {
    this.direccion = document.getElementById('direccion[0]').value;
    this.Marcador = new google.maps.Marker({map: Mapa});
    this.zona = "Capital Federal";
    this.HTMLement = document.createElement("tr");
  }
  // Metodo para geocodificar la direccion
  enrutarDirecciones(Geocoder, Zonas) {
    let self = this;
    Geocoder.geocode({'address': self.direccion + ", Capital Federal", componentRestrictions:{'locality': "Capital Federal"}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {        // si google pudo geocodificar la direccion
        var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        self.Marcador.setPosition(results[0].geometry.location);                // ubicar marcador
        self.imprimirRutasEnHTML().scrollHastaElemento();      // Agregar la cedula al html y hacer Scroll hasta esta
      } else {
        alert('No pude encontrar la direccion por el siguiente motivo: ' + status);
      }
    });
    return this;
  }
  // metodo PARA mostrar la DIRECCION en la ZONA
  imprimirRutasEnHTML(){
    let self = this;
    self.HTMLement.className = "cedulaStyle"; // le asigno la clase
    self.HTMLement.innerHTML = "<td class='col' id='numorden'>" + document.getElementById(self.zona).rows.length +
      "<td class='col'>" + self.direccion + "</td><td class='col'>" +
      "<input type='button' class='botonEliminar' value='X' onclick='eliminarRow(this)'></td>"; // creo las celdas
    document.getElementById(self.zona).appendChild(self.HTMLement); // asigno las celdas a la tabla
    return this;
  }
  // Mostrar / Ocultar el Marcador en el Mapa
  switchVisibilidadDeMarcador() {
    let self = this;
    self.Marcador.getVisible() ? self.Marcador.setVisible(false) : self.Marcador.setVisible(true);
    return this;
  }
  // Scroll hasta la ultima cedula agregada
  scrollHastaElemento() {
    let self = this;
    let element = self.HTMLement;
    element.scrollIntoView(false);
    return this;
  }
}*/

// Funcion para limpiar los inputs
function blanquearInputsYTips(){
  blanquearInput("direccion[0]");
  eliminarElemento("tips");
}

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
