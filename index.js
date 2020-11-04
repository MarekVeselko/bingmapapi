function loadMapScenario() {
    var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(51.516, -0.077),
        zoom: 10
    });
    var zipCodes = ['w10', 'w2', 'w11', 'w6', 'se16', 'e9'];
    var geoDataRequestOptions = {
        entityType: 'Postcode2',
        getAllPolygons: true
    };
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
    
}