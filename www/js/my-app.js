  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/',
        url: 'index.html',
      },
  
      {
        path: '/about/',
        url: 'about.html',
      },
      {
        path: '/panel/',
        url: 'panel.html',   // va sin barras
      },
      {
        path: '/registro/',
        url: 'registrarse.html',
      },
      {
        path: '/firstlog/',
        url: 'firstlog.html',
      },
      {
        path: '/iniciar/',
        url: 'iniciar.html',
      },
      {
        path: '/miembarazo/',
        url: 'miembarazo.html',
      },
      {
        path: '/midiario/',
        url: 'midiario.html',
      },
      {
        path: '/datos/',
        url: 'datosP.html',
      },
      {
        path: '/nombres/',
        url: 'nombres.html',
      },
      {
        path: '/esenciales/',
        url: 'esenciales.html',
      },


    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

var db, refUsuarios, refTiposUsuarios;  // JORGE
var email, nombre; // JORGE 


// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    
    fnMostrarError("Device is ready!");
});



// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    fnMostrarError(e);


    // JORGE - AGREGO LAS VARIABLES PARA CONEXION A BASE DE DATOS
    // LO HAGO ACA, PARA QUE QUEDE DISPONIBLE EN TODAS LAS PANTALLAS
    /* seteo variables de BD */
  db = firebase.firestore();
  refUsuarios = db.collection("USUARIOS");
  refTiposUsuarios= db.collection("TIPOS_USUARIOS");


})



/*Option 2. Using live 'page:init' event handlers for each page*/
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

    //$$('#registro').on('click', fnSetEmail)  // JORGE

    $$('#registro').on('click', fnRegistro)
})

$$(document).on('page:init', '.page[data-name="iniciar"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

    $$('#inicio').on('click', fnLogIn)
})

$$(document).on('page:init', '.page[data-name="iniciar"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

    $$('#guardarDatos').on('click', fnGuarD) //function no declarada aun
})

$$(document).on('page:init', '.page[data-name="firstlog"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

  var calendarDefault = app.calendar.create({
    inputEl: '#periodo',
    closeOnSelect: true,
    locale: 'en-GB',
    dateFormat: "dd/mm/yyyy",
    on: {
      closed: function () {
        console.log('Calendar opened');
        fnCalculo();
      }
    }
  });

  $$('#calcular').on('click', fnCalculo)
     
})


/*$$(document).on('page:init', '.page[data-name="panel"]', function(e){
    //Inicio Panel
    console.log(e);
})*/


/** FUNCIONES PROPIAS **/
/*
function fnSetEmail() {
    var elMail = $$('#email').val(); //recupero el valor del input mail

    //lo seteo en el panel del menu
    $$('#labelEmail').text(elMail);
  }
*/


/** funccion de registro - falta la base de datos **/

function fnRegistro() {

    var elMail = $$('#email').val(); // es un input... uso val!
    var laClave = $$('#password').val(); // es un input... uso val!

    email = elMail;

    var huboError = 0;

    firebase.auth().createUserWithEmailAndPassword(elMail, laClave)          
      .catch(function(error) {       
        // Handle Errors here.
        huboError = 1;
        var errorCode = error.code;
        var errorMessage = error.message; 
        
        fnMostrarError(errorCode);
        fnMostrarError(errorMessage);
      })
      .then(function(){
          if(huboError == 0){
            // alert('OK');
            // lo seteo en el panel.... contenedor lblEmail
            // $$('#lblEmail').text(elMail);   // es una etiqueta html. Text va sin formato
            //  mainView.router.navigate("/datospersonales/");
            

            // registro al usuario en la base de datos.....
            // el email es la clave en la coleccion usuarios
            // dentro del usuario guardo como el dato, su nombre
            nombre = $$('#nombre').val();
            apellido = $$('#apellido').val();
            var datos = {
                nombre: nombre,
                apellido: apellido,
                tipoUsuario: "VIS"
            }
            refUsuarios.doc(email).set(datos).then(function(){ 
                // aca está el usuario registrado en AUTH y en la base de datos.
                // entonces lo direcciono a otra pantalla: /firstlog/
                //alert('registro ok');
                mainView.router.navigate("/firstlog/");
// usuario:
// dd@dd.com 
// clave: 123456
            });
            

          }
      });
}



/** funccion de Login - falta la base de datos **/
function fnLogIn() {

alert("Bienvenido");


    var emailLog = $$('#emailLogin').val();
    var claveLog = $$('#passwordLogin').val();
       
    email = emailLog;
//Se declara la variable huboError (bandera)
    var huboError = 0;

console.log('datos: ' + emailLog + '/' + claveLog);
        
    firebase.auth().signInWithEmailAndPassword(emailLog, claveLog)
        .catch(function(error){
//Si hubo algun error, ponemos un valor referenciable en la variable huboError
            huboError = 1;
            var errorCode = error.code;
            var errorMessage = error.message;
            fnMostrarError(errorMessage);
            fnMostrarError(errorCode);
        })
        
        .then(function(){   
//En caso de que esté correcto el inicio de sesión y no haya errores, se dirige a la siguiente página
            if(huboError == 0){

                tipoUsuario = "";

                // recuperar el tipo de usuario segun el email logueado....
                // REF: https://firebase.google.com/docs/firestore/query-data/get-data
                // TITULO: Obtén un documento
                
                refUsuarios.doc(email).get().then(function(doc) {
                      if (doc.exists) {
                          //console.log("Document data:", doc.data());
                          //console.log("Tipo de Usuario: " + doc.data().tipo );
                          tipoUsuario = doc.data().tipoUsuario;
// tengo que sacar los href de los botones y direccionarlos 
// solo si corresponde y esta bien el login en este caso
                          if ( tipoUsuario == "VIS" ) {
                              mainView.router.navigate("/firstlog/");
                          }
                          if ( tipoUsuario == "ADM" ) {
                              mainView.router.navigate("/panel_admin/");
                          }
                          


                      } else {
                          // doc.data() will be undefined in this case
                          //console.log("No such document!");
                      }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });


            }

        });
}


//funcion para calcular la fecha del parto

function fnCalculo(){


  var fech = $$('#periodo').val(); //recuperando la fecha dada por el usuario

  var diasSum = 1000 * 60 * 60 * 24 * 280;  //convertir en milisegundos 280 dias


  console.log('fech vale ' + fech );

  fechParse = Date.parse(fech)

  console.log('fech vale parse ' + fechParse );

  //var fechaDeParto = fech.getTime() + diasSum;

  fechaDeParto = fechParse + diasSum;

  console.log('fech parto ' + fechaDeParto );

/*
unix_timestamp = fechaDeParto
// Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds.
//var date = new Date(unix_timestamp * 1000);
var date = new Date(unix_timestamp * 1);
// Hours part from the timestamp
var hours = date.getHours();
// Minutes part from the timestamp
var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


  var year = date.getFullYear();
  var month = date.getMonth();
  var dateN = date.getDate();

console.log(year + ' - ' + month + ' - ' + dateN);


fechaDeParto=dateN+'/'+month+'/'+year;
*/
    var options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric"
    };


    var dateFP = new Date(fechaDeParto * 1);
  var year = dateFP.getFullYear();
  var month = dateFP.getMonth();
  var dateN = dateFP.getDate();

console.log(year + ' - ' + month + ' - ' + dateN);

var fechaDeParto = new Date(fechaDeParto).toLocaleDateString("es-ES", options);
console.log('to locale ' + fechaDeParto)


  $$('#resultado').html(fechaDeParto);  //agregar a un input para luego guardar en la base de datos
}



function fnMostrarError(txt) {
  if (mostrarErrores == 1) {
      console.log("ERROR: " + txt);
  }
}
function mostrarErrores(txt) {
  
  console.log("ERROR: " + txt);
}





