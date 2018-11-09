var markers = [];
var map;
var myObj;
var http;
var map;
var marker;

//admin_map
 function loadMap() {

    for (i in myObj)
    markers.push(new google.maps.Marker({
       position: new google.maps.LatLng(myObj[i].lat, myObj[i].lng),
       map: map,
       title:myObj[i].lat + ", " + myObj[i].lng
    }));
    for (i in markers) {
      markers[i].setMap(map);
    }
 }

//placeDetails.html
 function loadMap_placeDetails() {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(myObj.lat, myObj.lng),
                map: map,
                draggable:true,
                title:myObj.title
            });
            marker.setMap(map);
            var center = new google.maps.LatLng(myObj.lat, myObj.lng);
            map.panTo(center);

            google.maps.event.addListener(marker,'mouseup',function() {
            var coor = marker.getPosition();
            document.getElementById("lat").innerText = coor.lat();
            document.getElementById("lng").innerText = coor.lng();
            });
    }

    function reCenter() {
        var coor = marker.getPosition();
        var center = new google.maps.LatLng(coor.lat(), coor.lng());
        map.panTo(center);
    }



    load();
    function load() {
      http = new XMLHttpRequest();
      http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200 && this.responseText) {
              myObj = JSON.parse(this.responseText);
              document.getElementById("id").innerText = myObj.id;
              document.getElementById("title").innerText = myObj.title;
              document.getElementById("description").innerText = myObj.description;
              document.getElementById("address").innerText = myObj.address;
              document.getElementById("type").innerText = myObj.type;
              document.getElementById("created").innerText = myObj.createdAt;
              document.getElementById("updated").innerText = myObj.updatedAt;
              document.getElementById("lat").innerText = myObj.lat;
              document.getElementById("lng").innerText = myObj.lng;
          }
      };
      http.open("GET", "http://localhost:9000/api/places/" + findGetParameter("id"), true);
      http.send();
      }

    function findGetParameter(parameterName) {
      var result = null,
      tmp = [];
      location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
  }

      function update() {
          http.open("PUT", "http://localhost:9000/api/places/" + myObj.id, true);
          http.setRequestHeader("Content-Type", "application/json");
          var json = JSON.stringify({ "title": myObj.title, "address": myObj.address, "type": myObj.type,
                                    "description": myObj.description, "lat":(String(marker.getPosition().lat())).slice(0, (String(marker.getPosition().lat())).indexOf(".") + 9),
                                    "lng":(String(marker.getPosition().lng())).slice(0, (String(marker.getPosition().lng())).indexOf(".") + 9)});
          http.send(json);
          alert("Done!" + json);
    }

    function del() {
        http.open("DELETE", "http://localhost:9000/api/places/" + myObj.id, true);
        http.send();
        window.location.href="http://localhost:8080/Coordinates/admin_map.html";
        alert("Done!");
    }

//createPlace
  function loadMarker() {
            var center = map.getCenter();
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(center.lat(), center.lng()),
                map: map,
                draggable:true,
                title:"New Place"
            });
            marker.setMap(map);

            var coor = marker.getPosition();
            document.getElementById("lat").innerText = coor.lat();
            document.getElementById("lng").innerText = coor.lng();

            google.maps.event.addListener(marker,'mouseup',function() {
            var coor = marker.getPosition();
            document.getElementById("lat").innerText = coor.lat();
            document.getElementById("lng").innerText = coor.lng();
            });

            var addingButton = document.getElementById("lMark");
            addingButton.classList.add("disabled");
                addingButton.onclick = null;

            var createButton = document.getElementById("creat");
            createButton.classList.remove("disabled");
            createButton.classList.add("active");
         }

    function create() {
          http = new XMLHttpRequest();

          http.open("POST", "http://localhost:9000/api/places/", true);
          http.setRequestHeader("Content-Type", "application/json");
          var json = JSON.stringify({ "title": document.getElementById("title").value, "address": document.getElementById("address").value, "type": document.getElementById("type").value,
                                    "description": document.getElementById("description").value, "lat":(String(marker.getPosition().lat())).slice(0, (String(marker.getPosition().lat())).indexOf(".") + 9),
                                    "lng":(String(marker.getPosition().lng())).slice(0, (String(marker.getPosition().lng())).indexOf(".") + 9)});
          http.send(json);
          http.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200 && this.responseText) {
            window.location.href="http://localhost:8080/Coordinates/admin_map.html";
            }
        }
        alert(json);
      }
