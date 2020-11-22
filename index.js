var zipCodes = "";
let classNameOfAddress = "";


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
		// showError("Please enter an address");
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
              list.setAttribute("size", "10");
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

            classNameOfAddress = option.className;

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
                                zipCodes=target.text;
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



/////////////////////////

  
  let postCode="";  
  document.getElementById("searchBox").addEventListener("change",function(){
   postCode = String(document.getElementById("searchBox").value).toLowerCase();  
  })



 
  function loadMapScenario() {
    
      var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        center: new Microsoft.Maps.Location(51.482, -0.177),
        zoom: 14,
      });
      
      let addressName = "";
      var pinLocation = "";
      //Create an array of locations to get the boundaries of
      var zipCodes = ["SW10 0AA"];
      var geoDataRequestOptions = {
      entityType: 'Postcode2',
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

            document.getElementById("myMap").addEventListener("click",function(){
              Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
                var searchManager = new Microsoft.Maps.Search.SearchManager(map);
                var reverseGeocodeRequestOptions = {
                    location: pinLocation,
                    callback: function (answer, userData) {
                        document.getElementById('printoutPanel').innerHTML =
                            answer.address.formattedAddress;
                            addressName=answer.address.formattedAddress;
                    }
                };
                searchManager.reverseGeocode(reverseGeocodeRequestOptions);
            });
          })


          var pin = new Microsoft.Maps.Pushpin(pinLocation, {
            icon:"icon/location.svg"      
          });
            map.entities.push(pin);
            console.log(pin); 
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
          // zipCodes="";
          Microsoft.Maps.Events.addHandler(map, 'click', bingMapOnClick);
      });

      document.getElementById("clear-pins-btn").addEventListener("click",function(){
          map.entities.pop();
          document.getElementById("printoutPanel").innerHTML = "";
      })
    } 


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



