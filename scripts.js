/*jshint esversion: 6*/

function initRouter(){
  var Mapa = cargarMapa();  // Cargo Mapa
      infoZonas = cargarDataSobreZonas();	// Cargo info sobre las Zonas
      Zonas = crearZonas(infoZonas, Mapa);

      Geocoder = new google.maps.Geocoder();
      CedulaDeNotificacion = [];
      botonBuscar = document.getElementById('buscar');
      cantidadDeCedulas = 0;

  // Al hacer click en buscar geocodificar la direccion
  botonBuscar.addEventListener("click", function() {
    CedulaDeNotificacion[cantidadDeCedulas] = new Cedula(Mapa)
    .geocodificarDireccion(Geocoder, Zonas);
    if (cantidadDeCedulas > 0) {
      ocultarMarcadorPrevio(cantidadDeCedulas, CedulaDeNotificacion);
    }
    setearOpcionesDelMapaPorDefault(Mapa);
    setearCursorEnCampoDireccion();
    blanquearInputsYTips();
    cantidadDeCedulas++;
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

// Funcion para crear las zonas
function crearZonas(infoZonas, Mapa) {
  var Zonas = [];
  for (n = 0; n < infoZonas.length; n++) {
    Zonas[n] = new Zona(infoZonas[n].nombre, infoZonas[n].notificador, infoZonas[n].coordenadas, infoZonas[n].color)
      .setearZonasEnMapa(Mapa)
      .setearZonasEnHTML();
  }
  return Zonas;
}

// CLASE ZONA
class Zona {
  constructor(nombre, notificador, coords, color) {
    this.nombre = nombre;
    this.notificador = notificador;
    this.coordenadas = coords;
    this.color = color;
    this.HTMLzona = document.createElement("table");
    this.poligonos = new google.maps.Polygon({
		  path: this.coordenadas,
		  strokeColor: this.color,
		  strokeOpacity: 0.8,
		  strokeWeight: 0,
		  fillColor: this.color,
		  fillOpacity: 1,
	  });
  }
  // metodo PARA MOSTRAR ZONAS creadas EN EL MAPA
  setearZonasEnMapa(Mapa) {
    let self = this;
  	self.poligonos.setMap(Mapa);
    return this;
  }
  // Metodo PARA MOSTRAR LA LISTA DE ZONAS creadas en la barra lateral
  setearZonasEnHTML() {
    let self = this;
    self.HTMLzona.className = "nombreZona";   // le asigno la clase
    self.HTMLzona.id = self.nombre;           // asigno id
    self.HTMLzona.innerHTML = "<th colspan='2'>" + self.nombre +
      "<th colspan='2'><span class='notbold'> Notificador: " + self.notificador + "</span></th><td colspan='2'>" +
      "<button id='" + self.HTMLzona.id; // imprimo nombre
    self.HTMLzona.style.borderColor = self.color; // asigno color
    self.HTMLzona.style["background-color"] = self.color;
    // Agrego el texto al elemento id
    document.getElementById("listaDeZonas").appendChild(self.HTMLzona);
    return this;
  }
}

// CLASE CEDULA
class Cedula {
  constructor(Mapa) {
    this.direccion = document.getElementById('direccion[1]').value;
    this.Marcador = new google.maps.Marker({map: Mapa});
    this.zona = "";
    this.HTMLement = document.createElement("tr");
  }
  // Metodo para geocodificar la direccion
  geocodificarDireccion(Geocoder, Zonas) {
    let self = this;
    Geocoder.geocode({'address': self.direccion + ", Capital Federal", componentRestrictions:{'locality': "Capital Federal"}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {        // si google pudo geocodificar la direccion
        var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        self.Marcador.setPosition(results[0].geometry.location);                // ubicar marcador
        self.Marcador.setAnimation(google.maps.Animation.DROP);                 // animar marcador
        self.zona = self.obtenerAqueZonaPertenece(Zonas, latlng);               // obtener la zona
        self.imprimirCedulasEnHTML().scrollHastaElemento();      // Agregar la cedula al html y hacer Scroll hasta esta
      } else {
        alert('No pude encontrar la direccion por el siguiente motivo: ' + status);
      }
    });
    return this;
  }
  // metodo PARA DETERMINAR EN QUE ZONA ESTA LA DIRECCION
  obtenerAqueZonaPertenece(Zonas, latlng){
    // chequeo cada uno de los poligonos hasta encontrar el que contiene la direccion
    for (let numero = 0; numero < Zonas.length; numero++) {
      if (google.maps.geometry.poly.containsLocation(latlng, Zonas[numero].poligonos)){
        return Zonas[numero].nombre;
      }
    }
  }
  // metodo PARA mostrar la DIRECCION en la ZONA
  imprimirCedulasEnHTML(){
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
  blanquearInput("direccion[1]");
  eliminarElemento("tips");
}
// Funcion para ocultar el marcador anterior
function ocultarMarcadorPrevio(numero, Cedula) {
  var anterior = numero - 1;
  Cedula[anterior].switchVisibilidadDeMarcador();
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
//cargar info de las zonas
function cargarDataSobreZonas(){
  let zona = [{
      // Zona 8
      nombre: "Zona 8",
      notificador: "ALberto",
	    coordenadas: [{lat:-34.5458023, lng:-58.41507911},
                    {lat:-34.5615662, lng:-58.43679428},
                    {lat:-34.5699171, lng:-58.44491790},
                    {lat:-34.5804886, lng:-58.45096339},
                    {lat:-34.5860586, lng:-58.45454110},
                    {lat:-34.5966673, lng:-58.45920999},
                    {lat:-34.6022390, lng:-58.44241619},
                    {lat:-34.5819963, lng:-58.41109670},
                    {lat:-34.5778040, lng:-58.40857744},
                    {lat:-34.5787050, lng:-58.40679645},
                    {lat:-34.5607169, lng:-58.39018809}],
      color: "rgba(0,0,255,0.6)"
    }
  ];
  return zona;
}
