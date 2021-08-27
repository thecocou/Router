/*jshint esversion: 6*/
var data = { city: localStorage.getItem("ciudad") };

function initRouter() {
  let botonEnrutar = document.getElementById("enrutar");
  let direcciones = document.getElementById("direcciones");
  let guardarMenu = document.getElementById("guardarMenu");
  let menuButton = document.getElementById("menuButton");
  let inputCiudad = document.getElementById("ciudad");

  if (data.city == null || data.city == undefined || data.city == "") {
    animarCss("menu", "invisible", "visible");
    inputCiudad.focus();
  } else {
    buscarCityLatLng(data.city)
  }

 // Cargo Mapa
  let Mapa = cargarMapa();  
  // Cargo Inputs
  agregarInputs(direcciones);
  // Cargo Direction Service
  let Enrutador = new google.maps.DirectionsService();
  // Cargo Directions Renderer
  let ImpresoraDeRutas = new google.maps.DirectionsRenderer({ map: Mapa });

  // Al hacer click en buscar geocodificar la direccion
  botonEnrutar.addEventListener("click", async function () {
    getInicio();
    getFin();
    let direcciones = getDirecciones();
    let waypoints = getWaypoints(direcciones);

    mostrarRutaEnMapa(Enrutador, ImpresoraDeRutas, direcciones, waypoints);
  });

  // mostrar menu
  menuButton.addEventListener("click", function () {
    animarCss("menu", "invisible", "visible");
  });

  // guardar nueva ciudad
  guardarMenu.addEventListener("click", function () {
    ingresarCiudad(inputCiudad.value);
  });
}

// Guardar Ciudad
function ingresarCiudad(inputCiudad) {
  if (inputCiudad !== "" && inputCiudad !== " ") {
    localStorage.setItem("ciudad", inputCiudad);
    data.city = localStorage.getItem("ciudad");
    animarCss("menu", "visible", "invisible");
  }
}

// BUSCAR LAT Y LNG PARA LA CIUDAD ELEGIDA
async function buscarCityLatLng(cityName) {
  var geocoder = new google.maps.Geocoder();
  await geocoder.geocode({ address: cityName }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      
      data.latlng = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };

      return data.latlng;
    } else {
      alert(`No se encontro la ciudad ${status}`);
    }
  });
}

// FUNCION PARA AGREGAR INPUTS
function agregarInputs(direcciones) {
  for (i = 0; i < 25; i++) {
    direcciones.innerHTML += 
      `<input id='direccion[${i}]' class='inputs' autocomplete='ñope' placeholder='Ingrese una dirección' type='text' onkeydown='if (event.keyCode == 13) document.getElementById("enrutar").click()'/>`;
  }
}

// FUNCION PARA OBTENER LAS DIRECCIONES
function getDirecciones() {
  let direccion = [];
  cantidadDeInputs = document.getElementsByClassName("inputs").length;

  for (let n = 0; n < cantidadDeInputs; n++) {
    if (document.getElementById(`direccion[${n}]`).value !== "") {
      direccion.push(
        document.getElementById(`direccion[${n}]`).value + `, ${data.city}`
      );
    }
  }
  return direccion;
}

// FUNCION PARA INICIAR EL MAPA
function cargarMapa() {
  return new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.618356, lng: -58.433464 }, //ciudad.latlng, //
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
}


// buscar Direccion de inicio
function getInicio() {
  data.inicio = 'none'
  let inputsInicio = document.getElementsByName("inicio");
  inputsInicio.forEach((input) => {
    if (input.checked) {
      data.inicio = parseInt((input.id).split("-")[1])
    }
  });
}

// buscar Direccion de fin
function getFin() {
  data.fin = 'none';
  let inputsFin = document.getElementsByName("fin");
  inputsFin.forEach((input) => {
    if(input.checked) {
      data.fin = parseInt(input.id.split("-")[1]);
    }
  });
}

// FUNCION PARA OBTENER WAYPOINTS
function getWaypoints(direcciones) {
  let waypoint = [];

  if(data.inicio === 'none') {
    data.inicio = 0;
  }
  if(data.fin === 'none') {
    data.fin = direcciones.length -1;
  }

  let n = 0;
  if (direcciones.length > 2) {
    for (let n = 0; n < direcciones.length; n++) {
      if (data.inicio !== n && data.fin !== n) {
        waypoint.push({ location: direcciones[n] });
      }  
    }
  }

  console.log(direcciones);
  console.log(waypoint);

  return waypoint;
}

// FUNCION PARA MOSTRAR LA RUTA
function mostrarRutaEnMapa( directionsService, directionsDisplay, direccion, waypoint ) {

  let locomocion = document.getElementById("locomocion");

    console.log(data.inicio);
    console.log(data.fin);

  directionsService.route(
    {
      origin: direccion[data.inicio],
      destination: direccion[data.fin],
      waypoints: waypoint,
      optimizeWaypoints: true,
      region: "AR",
      travelMode: locomocion.checked ? "DRIVING" : "WALKING",
    },
    function (response, status) {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
        mostrarRutaEnBarraLateral(response);
        calcularTiempoyDistancia(response);
      } else {
        alert(`No es posible mostrar la ruta: ${status}`);
        animarCss("menu", "invisible", "visible");
      }
    }
  );
}

// FUNCION PARA MOSTRAR TIEMPO Y DISTANCIAS
function calcularTiempoyDistancia(respuesta) {
  var totalDist = 0;
  var totalTime = 0;

  respuesta.routes[0].legs.forEach((element) => {
    totalDist += element.distance.value;
    totalTime += element.duration.value;
    /*    console.log(element.end_address)
    console.log(element.distance.text);
    console.log(element.duration.text);
*/
  });

  let distancia = document.getElementById("distancia");
  let tiempo = document.getElementById("tiempo");

  tiempo.estimadoHoras = (totalTime / 60 / 60).toFixed(0);
  tiempo.estimadoMinutos = ((totalTime / 60) % 60).toFixed(0);

  tiempo.innerHTML =
    `<p>: ${tiempo.estimadoHoras} h ${tiempo.estimadoMinutos} min</p>`;
  distancia.innerHTML = `<p>: ${(totalDist / 1000).toFixed(1)} km</p>`;
}

// FUNCION PARA MOSTRAR DIRECCIONES EN ORDEN
function mostrarRutaEnBarraLateral(respuesta) {
  let rutas = [];
  let abc = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P",
    "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  ];
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
  direcciones.innerHTML = "";

  // escribo las direcciones en la barra lateral
  rutas.forEach((direccion) => {
    direcciones.innerHTML +=
      `<p id='letras'>${abc[n]}</p>
      <input id='direccion[${n}]' class='inputs' autocomplete='nope2' value='${direccion.substr(0, direccion.indexOf(","))}' type='text' onkeydown='if (event.keyCode == 13) document.getElementById("enrutar").click()'/>`
      
      if(direccion !== '') {
        direcciones.innerHTML += `
        <label class="label-inicioFin" for="inicio-${n}">
        <input type="radio" class="inicioFin" name="inicio" id="inicio-${n}">
            <svg class="radioIcono" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.63 8.9">
              <g id="Capa_2" data-name="Capa 2">
                <g id="Capa_1-2" data-name="Capa 1">
                  <path d="M0,8.74V.17H1.37V8.74Z" />
                  <path d="M2.72,8.74V.17H4.4L6.9,6.55V.17H8.2V8.74H6.52L4,2.18V8.74Z" />
                  <path d="M9.55,8.74V.17h1.37V8.74Z" />
                  <path d="M16.18,5.66h1.36v.18A3.57,3.57,0,0,1,17,8a2.38,2.38,0,0,1-2.08.94,2.37,2.37,0,0,1-2.22-1.08,6.92,6.92,0,0,1-.61-3.37,6.94,6.94,0,0,1,.61-3.37A2.41,2.41,0,0,1,14.92,0c1.72,0,2.58.9,2.58,2.69v.15H16.13V2.7C16.13,1.57,15.72,1,14.9,1a1.15,1.15,0,0,0-1.1.66,7.06,7.06,0,0,0-.36,2.73,7.31,7.31,0,0,0,.36,2.76,1.12,1.12,0,0,0,1.1.69c.85,0,1.28-.69,1.28-2.06Z" />
                  <path d="M18.44,8.74V.17h1.37V8.74Z" />
                  <path d="M23.8,8.9a2.35,2.35,0,0,1-2.16-1.07A6.53,6.53,0,0,1,21,4.45a6.56,6.56,0,0,1,.68-3.38A2.37,2.37,0,0,1,23.8,0,2.36,2.36,0,0,1,26,1.07a6.56,6.56,0,0,1,.68,3.38A6.53,6.53,0,0,1,26,7.83,2.34,2.34,0,0,1,23.8,8.9Zm0-1a1.11,1.11,0,0,0,1-.62,6.64,6.64,0,0,0,.42-2.83,6.43,6.43,0,0,0-.42-2.78,1.19,1.19,0,0,0-2.08,0,6.4,6.4,0,0,0-.43,2.78,6.6,6.6,0,0,0,.43,2.83A1.1,1.1,0,0,0,23.8,7.87Z" />
                </g>
              </g>
            </svg>
          </label>

          <label class="label-inicioFin" for="fin-${n}">
          <input type="radio" class="inicioFin" name="fin" id="fin-${n}">
            <svg class="radioIcono" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.69 8.57">
              <g id="Capa_2" data-name="Capa 2">
              <g id="Capa_1-2" data-name="Capa 1">
              <path d="M0,8.57V0H4.57V1.15H1.37V3.53h3V4.68h-3V8.57Z"/>
              <path d="M5.5,8.57V0H6.86V8.57Z"/>
              <path d="M8.22,8.57V0H9.9l2.5,6.38V0h1.29V8.57H12L9.52,2V8.57Z"/>
              </g></g>
            </svg>
          </label>
          `;
      }
    n++;
  });
}

function animarCss(htmlId, sacarClase, agregarClase) {
  let secciones = document.getElementsByClassName("seccion");

  Array.from(secciones).forEach((element) => {
    element.classList.remove(agregarClase);
  });

  document.getElementById(htmlId).classList.remove(sacarClase);
  void document.getElementById(htmlId).offsetWidth;
  document.getElementById(htmlId).classList.add(agregarClase);
  location.href = `#${htmlId}`;
}

// ToDo:
// Seleccionar automaticamente las direcciones mas alejadas para usarlas como inicio y fin de la ruta.
