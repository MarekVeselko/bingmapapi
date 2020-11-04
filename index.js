
  var zipCodes = [""];


  function loadMapScenario() {
      var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
      
  
  
  
       Microsoft.Maps.loadModule(['Microsoft.Maps.SpatialDataService', 'Microsoft.Maps.Search'], function () {
          var searchManager = new Microsoft.Maps.Search.SearchManager(map);
          var geocodeRequest = {
              where: zipCodes[zipCodes.length-1],
              callback: function (geocodeResult) {
                  if (geocodeResult && geocodeResult.results && geocodeResult.results.length > 0) {
                      map.setView({ bounds: geocodeResult.results[0].bestView });
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
  
  let postCode="";
      
  document.getElementById("post-code").addEventListener("change",function(){
  postCode = String(document.getElementById("post-code").value).toLowerCase();  
  })
  
  document.querySelector("button").addEventListener("click",function(){
      zipCodes.push(postCode);
      console.log = (zipCodes[zipCodes.length -1]);
      loadMapScenario();
    })