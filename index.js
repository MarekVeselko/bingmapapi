
  var zipCodes = "";
  
  let postCode="";  
  document.getElementById("post-code").addEventListener("change",function(){
   postCode = String(document.getElementById("post-code").value).toLowerCase();  
  })

  function loadMapScenario() {
    zipCodes=postCode;
      var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(51.507, -0.127),
        zoom: 10,
      });
      
  
       Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
          var searchManager = new Microsoft.Maps.Search.SearchManager(map);
          var geocodeRequest = {
              where: zipCodes,
              callback: function (geocodeResult) {
                  if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                      map.setView({ bounds: geocodeResult.results[0].bestView });
                      map.setView({ zoom: 14 });
                      var geoDataRequestOptions = {
                          entityType: 'Postcode2',
                          getAllPolygons: true
                      };
                      //Use the GeoData API manager to get the boundary of New York City
                      Microsoft.Maps.SpatialDataService.GeoDataAPIManager.getBoundary(geocodeResult.results[0].location, geoDataRequestOptions, map, function (data) {
                          if (data.results && data.results.length > 0) {
                              map.entities.push(data.results[0].Polygons);
                          }
                      }, null, function errCallback(networkStatus, statusMessage) {
                          console.log(networkStatus);
                          console.log(statusMessage);
                      });
                  }
              },
          };
          searchManager.geocode(geocodeRequest);
      });
       
  }
  
  
  document.querySelector("button").addEventListener("click",function(){
      loadMapScenario();
    })

document.addEventListener("keyup",function(e) {
    let keyCode = e.keyCode || e.which; 
    if(keyCode == 13){ 
        loadMapScenario();
    }
});