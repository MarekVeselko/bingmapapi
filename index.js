
  function loadMapScenario() {
    
      var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(51.482, -0.177),
        zoom: 14,
      });
      
      let addressName = "";
      var pinLocation = "";

      //Create an array of locations to get the boundaries of
      var zipCodes = ["SW10 0AA","SW10"];
      var zipCodes2 = ["SW10 9"];
      
      var geoDataRequestOptions = {
      entityType: 'Postcode2',
      getAllPolygons: true
          };
      var geoDataRequestOptions2 = {
          entityType: 'Postcode3',
          getAllPolygons: true
            };

          function bingMapOnClick(e) {
            if (e.targetType == "map") {
                //Get map unit x,y
                var point = new Microsoft.Maps.Point(e.getX(), e.getY());
                //Convert map point to location
                var location = e.target.tryPixelToLocation(point);   
                //Print x y
                console.log(location.longitude);
                console.log(location.latitude);
                pinLocation=new Microsoft.Maps.Location(location.latitude, location.longitude);
            }  

            // var pin = new Microsoft.Maps.Pushpin(pinLocation, {
            //   icon:"icon/location-red.png",
            //   visible: false    
            // });
            //   map.entities.push(pin);
            
              Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                var reverseGeocodeRequestOptions = {
                    location: pinLocation,
                    callback: function (answer, userData) {
                        document.getElementById('printoutPanel').innerHTML =
                            answer.address.postalCode;

                            addressName=answer.address.formattedAddress;
                    }
                };
                searchManager.reverseGeocode(reverseGeocodeRequestOptions);
            });

        };

        //Hardcoded pins
        pinsVisibility = true;
        function showPins(){
        var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(51.481491100821316, -0.18713758169192518), {
          color: "red",
          enableHoverStyle:true,
          visibility:pinsVisibility   
        });
          map.entities.push(pin);
        var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(51.4848144065551, -0.18955155882353303), {
          color:"blue",  
          enableHoverStyle:true,
            visibility:true    
        });
        map.entities.push(pin);
        var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(51.48150029279991, -0.18162515116436184), {
          color:"black",
          enableHoverStyle:true,
          visibility:true    
      });
      map.entities.push(pin);
      var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(51.48613379771426, -0.18511427992365714), {
        color:"green",
        enableHoverStyle:true,
        visibility:true    
    });
    map.entities.push(pin);
    var pin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(51.48375986674305, -0.18200844259763427), {
      color:"orange",
      enableHoverStyle:true,
      visibility:pinsVisibility    
    });
    map.entities.push(pin);
    console.log(pinsVisibility)
  }
  if(pinsVisibility){
    showPins();
  }
  function deletePins(){
    for (var i = map.entities.getLength() - 1; i >= 0; i--) {
      var pushpin = map.entities.get(i);
      if (pushpin instanceof Microsoft.Maps.Pushpin) {
          map.entities.removeAt(i);
      }
  }}
   
              
          Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {
            Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(zipCodes, geoDataRequestOptions, map, function (data) {
              if (data.results && data.results.length > 0) {
                    map.entities.push(data.results[0].Polygons);
                }
            }, null, function errCallback(callbackState, networkStatus, statusMessage) {
                console.log(callbackState);
                console.log(networkStatus);
                console.log(statusMessage);
            });
      });
      Microsoft.Maps.loadModule('Microsoft.Maps.SpatialDataService', function () {
        Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(zipCodes2, geoDataRequestOptions2, map, function (data) {
          if (data.results && data.results.length > 0) {
                map.entities.push(data.results[0].Polygons);
            }
        }, null, function errCallback(callbackState, networkStatus, statusMessage) {
            console.log(callbackState);
            console.log(networkStatus);
            console.log(statusMessage);
        });
  });

      Microsoft.Maps.Events.addHandler(map, 'click', bingMapOnClick);
      


      document.getElementById("clear-pins-btn").addEventListener("click",function(){
        if(pinsVisibility){
          pinsVisibility=false;
          deletePins();
          document.getElementById("clear-pins-btn").innerHTML = "Show pins"
        }else{
          pinsVisibility=true;
          showPins();
          document.getElementById("clear-pins-btn").innerHTML = "Hide pins"
        } 
})}
        
      


document.getElementById("result").addEventListener("click",function(){
    if (zipCodes!=="" && classNameOfAddress!=="Postcode"){
    loadMapScenario();
    document.getElementById("mySelect").setAttribute("size","1");
}else{null}
})

document.addEventListener("keydown",function(){
  findAddress();
})



///////////////////////// PIN ICON


// window.addEventListener("click",function(e){


//   let img = document.createElement("img");
//   img.setAttribute("src", "icon/pin-icon.png");
//   img.setAttribute("alt","pin-icon");
//   img.style.position="absolute";
//   img.style.top= e.pageY + "px";
//   img.style.left= e.pageX + "px";
//   img.style.width = "3rem";
//   console.log(img);
//   document.body.appendChild(img);
// })



