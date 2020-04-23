  
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
        url: '/panel.html/',
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
        path: '/miperfil/',
        url: 'miperfil.html',
      },

    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    
    fnMostrarError("Device is ready!");
});



// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    fnMostrarError(e);
})



/*Option 2. Using live 'page:init' event handlers for each page*/
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

    $$('#registro').on('click', fnSetEmail)

    $$('#registro').on('click', fnRegistro)
})

$$(document).on('page:init', '.page[data-name="iniciar"]', function (e) {
    // Inicio Panel
    fnMostrarError(e);

    $$('#inicio').on('click', fnLogIn)
})


/*$$(document).on('page:init', '.page[data-name="panel"]', function(e){
    //Inicio Panel
    console.log(e);
})*/


/** FUNCIONES PROPIAS **/

function fnSetEmail() {
    var elMail = $$('#email').val(); //recupero el valor del input mail

    //lo seteo en el panel del menu
    $$('#labelEmail').text(elMail);
  }



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
            $$('#lblEmail').text(elMail);   // es una etiqueta html. Text va sin formato
            mainView.router.navigate("/datospersonales/");
          }
      });
}



/** funccion de Login - falta la base de datos **/
function fnLogIn() {


    var emailLog = $$('#emailLogin').val();
    var claveLog = $$('#passwordLogin').val();
       
//Se declara la variable huboError (bandera)
    var huboError = 0;
        
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
                          tipoUsuario = doc.data().tipo;

                          if ( tipoUsuario == "VIS" ) {
                              mainView.router.navigate("/panel/");
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



function fnMostrarError(txt) {
  if (mostrarErrores == 1) {
      console.log("ERROR: " + txt);
  }
}
function mostrarErrores(txt) {
  
  console.log("ERROR: " + txt);
}