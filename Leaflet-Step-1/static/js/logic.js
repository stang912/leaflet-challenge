
var myMap = L.map("map", {
    center: [39.4217487,-116.0398421],
    zoom: 4
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY 
  }).addTo(myMap);


var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "black",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // set different color from magnitude
    function getColor(magnitude) {
    switch (true) {
    case magnitude > 5:
      return "#E74C3C";
    case magnitude > 4:
      return "#E67E22";
    case magnitude > 3:
      return "#F5B041";
    case magnitude > 2:
      return "#FFD775";
    case magnitude > 1:
      return "#D9F08F";
    default:
      return "#B5F295";
    }
  }
  // set radiuss from magnitude
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }
    // GeoJSON layer
    L.geoJson(data, {
      // Maken cricles
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
      // cirecle style
      style: styleInfo,
      // popup for each marker
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
      }
    }).addTo(myMap);
  
  
    // legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML = [
            `<div style="background:#B5F295">0-1</div>`,
            `<div style="background:#D9F08F">1-2</div>`,
            `<div style="background:#FFD775">2-3</div>`,
            `<div style="background:#F5B041">3-4</div>`,
            `<div style="background:#E67E22">4-5</div>`,
            `<div style="background:#E74C3C">5+</div>`,
        ]   
        return div;
      };
    // Add the legend to the map
    legend.addTo(myMap);
    
  });

