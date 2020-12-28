function loadMapScenario() {

  var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
    zoom: 15
  });

  let addressName = "";
  var pinLocation = "";


  Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
    var options = {
      maxResults: 4,
      map: map
    };
    var manager = new Microsoft.Maps.AutosuggestManager(options);
    manager.attachAutosuggest('#searchBox', '#searchBoxContainer', selectedSuggestion);
  });

  function selectedSuggestion(suggestionResult) {
    map.entities.clear();
    map.setView({
      bounds: suggestionResult.bestView
    });
    s
    document.getElementById('printoutPanel').innerHTML =
      'Suggestion: ' + suggestionResult.formattedSuggestion +
      '<br> Lat: ' + suggestionResult.location.latitude +
      '<br> Lon: ' + suggestionResult.location.longitude;
  }


  function findPostCode(callback) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
      var searchManager = new Microsoft.Maps.Search.SearchManager(map);
      var reverseGeocodeRequestOptions = {
        location: pinLocation,
        callback: function (answer, userData) {
          addressName = answer.address.addressLine;
          console.log(answer.address)
          callback();
        }
      };
      searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    });
  }

  function createPin() {
     pin = new Microsoft.Maps.Pushpin(pinLocation, {
      color: "red",
      title: addressName
    });
    map.entities.push(pin);
  }

  function bingMapOnClick(e) {
    if (e.targetType == "map") {

      var point = new Microsoft.Maps.Point(e.getX(), e.getY());
      //Convert map point to location
      var location = e.target.tryPixelToLocation(point);
      //Print x y
      console.log(location.longitude);
      console.log(location.latitude);
      pinLocation = new Microsoft.Maps.Location(location.latitude, location.longitude);
    }


    findPostCode(createPin);

  };
  pinsVisibility = true;





  Microsoft.Maps.Events.addHandler(map, 'click', bingMapOnClick);



  document.getElementById("delete-pins-btn").addEventListener("click", () => {
		for (var i = map.entities.getLength() - 1; i >= 0; i--) {
			var pushpin = map.entities.get(i);
			if (pushpin instanceof Microsoft.Maps.Pushpin) {
				map.entities.removeAt(i);
			}
    }
  });
}








