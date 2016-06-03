// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('cookie',['ngCookies']);
angular.module('starter', ['ionic','cookie'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider) {
   if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    } 
  $httpProvider.defaults.useXDomain = true;
  $stateProvider
    .state('pila_msn', {
      url: '/pila_msn',
      templateUrl: 'templates/pila_msn.html',
      controller: 'List_solicitudCrld'
    })
    .state('menu', {
      url: '/menu',
      templateUrl: 'templates/buscar.html',
      controller: 'BuscarCrld'      
    })
    .state('solicitud', {
      url: 'solicitud/:id_soli',
      templateUrl: 'templates/solicitud.html',
      controller:'PeticionCrtl'        
    })
    .state('app',{
      url:'/app',
      controller:'PeticionCrtl'
    })
    .state('login',{
      url:'/login',
      templateUrl:'templates/login.html',
      controller:'LoguearCrtl'
    })
    .state('opcion',{
      url:'/opcion',
      templateUrl:'templates/opcion.html',
    })
    ;
    

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
})

.controller('List_solicitudCrld',function($scope,$http,$cookies,$cookieStore){
  var id_vende = $cookies.id_vende;
  $scope.request = null;
  $scope.request = [];
  $http.defaults.useXDomain = true;
  $http({
    method: 'GET',
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {"key": "1234","show_solicitud":"all"},
    url: 'http://stratecsa.com/tesis/Controller/Route_solicitud.php'
   
   }).then(function(data, status, headers, config) {
      var data = data.data;
    
      if(typeof data[0] == 'object'){
       angular.forEach(data,function(key,val){
          $scope.request.push({"id":key.id_solicitud,"id_product":key.id_product,"color":key.color,"cant":key.cantidad,"est":key.estado,"fecha":key.fecha_solicitud,"talla":key.talla,"img":key.img_min});
       });
      }else if(data.id_solicitud > 0){
        $scope.request.push({"id":data.id_solicitud,"id_product":data.id_product,"color":data.color,"cant":data.cantidad,"est":data.estado,"fecha":data.fecha_solicitud,"talla":data.talla,"img":data.img_min});
      } 
    

    // this callback will be called asynchronously
    // when the response is available
   });
    $scope.acept_solici = function(item){
      $cookies.item = item;
      $http({
        method: 'GET',
        url: 'http://stratecsa.com/tesis/Controller/Route_peticion_cliente.php',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        params: {"id": item,"vende":id_vende,"key":"kfzas3453@#","canalizar":"si"}
      }).then(function(data, status, headers, config){
        
        var data = data.data;
     
      });
    };
 })

.controller('Solici_idCrtl', function($scope,$http, $stateParams) {
  $scope.prueba = "hola viejo";
 console.log($stateParams.id_soli);
})
.controller('PeticionCrtl',function($scope,$http,$cookies,$cookieStore,$stateParams,$location,$timeout,$state){
  var id_vende = $cookies.id_vende;
  $http.defaults.useXDomain = true;
  var solici = $cookies.item;
  var valida = false;
  $scope.createContact = function(cedu,nomb,apelli){
   $http({
        method: 'GET',
        url: 'http://stratecsa.com/tesis/Controller/Route_solicitud.php',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        params:{"registrar_cliente":"si","cedula":cedu,"nombre":nomb+" "+apelli,"id_solici":solici}
    }).then(function(data, status, headers, config){
        var data = data.data;
        var id = data.exito
        if(id){
          var id_solici = $cookies.item;
          $http({
            method: 'GET',
            url: 'http://stratecsa.com/tesis/Controller/Route_solicitud.php',
            headers: {
              "Content-Type": "application/json; charset=utf-8"
            },
            params:{"id_facturar":id_solici}
          }).then(function(data, status, headers, config){
            var data = data.data;
            if(data.exito){
                alert("La solicitud fue canalizada a la caja");
                $scope.modal.hide();
                $location.path("/pila_msn");
            }
          });
        }             
    });
  };

  $scope.Cancelar_solicitud = function(){
     $http({
        method: 'GET',
        url: 'http://stratecsa.com/tesis/Controller/Route_solicitud.php',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        params:{"id_cancelar":solici}
      }).then(function(data, status, headers, config){
        var data = data.data;
        if(data.exito){
   
           $state.go('pila_msn');
        }
          
      });
  };
})

.controller('BuscarCrld',function($scope,$http){
  $http.defaults.useXDomain = true;
  $scope.btn_buscar = function(){
    var id = $scope.id_product;
    $scope.produc = [];
    $scope.tallas = [];
    $http({
        method: 'POST',
        url: 'http://stratecsa.com/tesis/Controller/Route_solicitud.php',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        params: {"id_buscar":id}
    }).then(function(data, status, headers, config){
      var data = data.data;
      $scope.id = data.id;
      $scope.costo = data.costo;
      $scope.modelo = data.modelo;
      $scope.img = data.img;
      alert($scope.modelo);
      var talla = data.talla.split(',');
      var cant = data.cant.split(',');
      var cont = talla.length;
      for(var i = 0;i <= cont;i++){
        console.log(talla[i]);
        $scope.tallas.push({"talla":talla[i],"cant":cant[i]});
      }
    });
  }
})
.controller('LoguearCrtl',function($scope,$http,$location,$timeout,$cookies,$cookieStore){ 
  $scope.loguear = function(){
    var user = $scope.username;
    var pass = $scope.passw;
    $http({
        method: 'POST',
        url: 'http://stratecsa.com/tesis/Controller/Route_user.php',
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        data: {"user": user,"pass":pass,"key":"kfzas3453@#"}
    }).then(function(data, status, headers, config){
        var data = data.data;
        var id = data.exito
        if(id){
          var ide_vend = id.id;
          $cookies.id_vende = ide_vend,
          $timeout(function () {
            $location.path("/opcion");
            $scope.$apply();
          }, 0); 
          
        }  
    });
  }
})
.controller('ModalCrtl',function($scope,$http,$ionicModal){
  
  $ionicModal.fromTemplateUrl('modal_view', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
});
