/*jshint esversion: 6*/

function initRouter(){
  var Mapa = cargarMapa();  // Cargo Mapa
      Geocoder = new google.maps.Geocoder();
      botonEnrutar = document.getElementById('enrutar');

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar.addEventListener("click", function() {
    Rutas = new Ruta(Mapa)
      .enrutarDirecciones(Geocoder, Zonas);

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

var DirectionsRequest = {
  origin: "Capital Federal",
  destination: "Capital Federal",
  travelMode: "WALKING",
  transitOptions: {routingPreference: "LESS_WALKING"},
  waypoints[3]: DirectionsWaypoint: [
    {document.getElementById('direccion[0]').value}
    {document.getElementById('direccion[1]').value}
    {document.getElementById('direccion[2]').value}
  ],
  optimizeWaypoints: true,
  region: "AR"
}

<script>
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: -24.345, lng: 134.46}  // Australia.
        });

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
          draggable: true,
          map: map,
          panel: document.getElementById('right-panel')
        });

        directionsDisplay.addListener('directions_changed', function() {
          computeTotalDistance(directionsDisplay.getDirections());
        });

        displayRoute('Perth, WA', 'Sydney, NSW', directionsService,
            directionsDisplay);
      }

      function displayRoute(origin, destination, service, display) {
        service.route({
          origin: origin,
          destination: destination,
          waypoints: [{location: 'Adelaide, SA'}, {location: 'Broken Hill, NSW'}],
          travelMode: 'DRIVING',
          avoidTolls: true
        }, function(response, status) {
          if (status === 'OK') {
            display.setDirections(response);
          } else {
            alert('Could not display directions due to: ' + status);
          }
        });
      }

      function computeTotalDistance(result) {
        var total = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
        }
        total = total / 1000;
        document.getElementById('total').innerHTML = total + ' km';
      }
    </script>


*/

















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
}

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
