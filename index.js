
  var zipCodes = "";
  
  let postCode="";  
  document.getElementById("searchBox").addEventListener("change",function(){
   postCode = String(document.getElementById("searchBox").value).toLowerCase();  
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


/////////////////////////

function showClear() {
	document.getElementById("clearButton").style.display = "block";
}

function clearSearch() {
	var input = document.getElementById("searchBox");
	input.value = "";
	document.getElementById("clearButton").style.display = "none";	
}

function showError(message) {
	var error = document.getElementById("errorMessage");
	error.innerText = message;
	error.style.display = "block";
	
	setTimeout(function(){
		error.style.display = "none";
	}, 10000)
}

function enterSearch(e) {
	if (e.keyCode == 13){
		findAddress();	
	}
}

function findAddress(SecondFind) {
  var Text = document.getElementById("searchBox").value;
	
	if (Text === "") {
		showError("Please enter an address");
		return;
	}
	
	var Container = "";			
			
	if (SecondFind !== undefined){
		 Container = SecondFind;
	} 
	
var Key = "PA49-XH36-BE52-ZM32",
    IsMiddleware = false,
    Origin = "",
    Countries = "GBR",
    Limit = "10",
    Language = "en-gb",  
		url = 'https://services.postcodeanywhere.co.uk/Capture/Interactive/Find/v1.10/json3.ws';
var params = '';
    params += "&Key=" + encodeURIComponent(Key);
    params += "&Text=" + encodeURIComponent(Text);
    params += "&IsMiddleware=" + encodeURIComponent(IsMiddleware);
    params += "&Container=" + encodeURIComponent(Container);
    params += "&Origin=" + encodeURIComponent(Origin);
    params += "&Countries=" + encodeURIComponent(Countries);
    params += "&Limit=" + encodeURIComponent(Limit);
    params += "&Language=" + encodeURIComponent(Language);
var http = new XMLHttpRequest();
http.open('POST', url, true);
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
http.onreadystatechange = function() {
  if (http.readyState == 4 && http.status == 200) {
      var response = JSON.parse(http.responseText);
      if (response.Items.length == 1 && typeof(response.Items[0].Error) != "undefined") {
         showError(response.Items[0].Description);
      }
      else {
        if (response.Items.length == 0)
            showError("Sorry, there were no results");

        else {
					var resultBox = document.getElementById("result");
					
					if (resultBox.childNodes.length > 0) {
						var selectBox = document.getElementById("mySelect");
						selectBox.parentNode.removeChild(selectBox)
					}
							
          var resultArea = document.getElementById("result");
          var list = document.createElement("select");
              list.id = "selectList";
              list.setAttribute("id", "mySelect");
              resultArea.appendChild(list);
					
					var defaultOption = document.createElement("option");
					 defaultOption.text = "Select Address";
					defaultOption.setAttribute("value", "");
					defaultOption.setAttribute("selected", "selected");
					list.appendChild(defaultOption);

          for (var i = 0; i < response.Items.length; i++){  	
            var option = document.createElement("option"); 
            option.setAttribute("value", response.Items[i].Id)
            option.text = response.Items[i].Text + " " + response.Items[i].Description;
						option.setAttribute("class", response.Items[i].Type)
																												
            list.appendChild(option);
          }
					selectAddress(Key);				          
        }
    }
  }
}
	http.send(params);
};  

function selectAddress(Key){
		var resultList = document.getElementById("result");
	
		if (resultList.childNodes.length > 0) {		
				var elem = document.getElementById("mySelect");
					
				//IE fix
							elem.onchange = function (e) {
								
								var target = e.target[e.target.selectedIndex];
								
								if (target.text === "Select Address") {
									return;
								}		

								if (target.className === "Address"){
									retrieveAddress(Key, target.value);
								}
								
								else {
								  findAddress(target.value)
								}							
						};				
					}
};

function retrieveAddress(Key, Id){
	var Field1Format = "";
	var url = 'https://services.postcodeanywhere.co.uk/Capture/Interactive/Retrieve/v1.00/json3.ws';
	var params = '';
			params += "&Key=" + encodeURIComponent(Key);
			params += "&Id=" + encodeURIComponent(Id);
			params += "&Field1Format=" + encodeURIComponent(Field1Format);
   
var http = new XMLHttpRequest();
http.open('POST', url, true);
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
http.onreadystatechange = function() {
  if (http.readyState == 4 && http.status == 200) {
      var response = JSON.parse(http.responseText);

      if (response.Items.length == 1 && typeof(response.Items[0].Error) != "undefined") {
        showError(response.Items[0].Description);
      }
      else {
        if (response.Items.length == 0)
            showError("Sorry, there were no results");
        else {           
					var res = response.Items[0];
					var resBox = document.getElementById("output");
					resBox.innerText = res.Label;			
				  document.getElementById("output").style.display = "block";
					document.getElementById("seperator").style.display = "block";
       }
    }
  }
}
	http.send(params); 
}