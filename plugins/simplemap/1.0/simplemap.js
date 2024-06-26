/*** SimpleMap v1.0
GitHub @arielbottero
*/
jQuery.extend({
	simpleMap : {
		target: null,
		map: null,
		markers: [],
		settings: {
			width: "100%",
			height: "100%",
			zoom: 12,
			click: null,
			clusters: {
				active: false,
				click: null,
				grid: 40,
				image: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
			},
			draggable: false,
			dragend: null
		},

		create: function(options) {
			$.extend(this.settings, options);
			this.target = $(options.target);
			this.target.width(this.settings.width).height(this.settings.height);

			this.map = new google.maps.Map(this.target[0], {
				zoom: this.settings.zoom,
				center: { lat: parseFloat(options.lat), lng: parseFloat(options.lng) }
			});

			return this;
		},

		addMarker: function(coords) {
			var $this = this;
			if(!Array.isArray(coords) && typeof(coords)=="object") { coords = [coords]; }

			$.each(coords, function(i, e) {
				var point = e;
				var lat = point.lat || point.x;
				var lng = point.lng || point.y;
				var position = {lat: parseFloat(lat), lng: parseFloat(lng)};
				var marker = new google.maps.Marker({
					map: $this.map,
					position: position,
					title: point.title || "lat:"+lat+", lng:"+lng,
					source: point,
					draggable: $this.settings.draggable
				});
				
				if(typeof $this.settings.click == "function") {
					marker.addListener("click", function() {
						$this.settings.click(point);
					});
				}

				if($this.settings.draggable && typeof $this.settings.dragend == "function") {
					marker.addListener("dragend", function() {
						$this.settings.dragend(marker);
					});
				}

				$this.markers.push(marker);
			});

			if(this.settings.clusters.active) { this.createClusters(); }

			return this;
		},

		clearMarkers: function(remove) {
			var $this = this;
			for(let i = 0; i < $this.markers.length; i++) {
				$this.markers[i].setMap(null);
			}
			if(remove) { $this.markers = []; }
		},

		createClusters: function() {
			var $this = this;
			var toClustered = [];
			for(mark in this.markers) {
				if(this.markers[mark].visible) {
					toClustered.push(this.markers[mark]);
				}
			}

			this.clusterer = new MarkerClusterer(this.map, toClustered, {
				zoomOnClick: false,
				imagePath: $this.settings.clusters.image,
				gridSize: $this.settings.clusters.grid
			});

			if(typeof $this.settings.clusters.click == "function") {
				google.maps.event.addListener($this.clusterer, "click", function (c) {
					$this.settings.clusters.click(c.getMarkers());
				});
			}

			return this;
		},

		updateClusters: function() {
			this.clusterer.clearMarkers();
			this.createClusters();
		},

		getBounds: function() {
			var bounds = new google.maps.LatLngBounds();
			for(var x = 0; x < this.markers.length; x++) {
				bounds.extend(this.markers[x].getPosition());
			}

			return bounds;
		},

		fitZoom: function() {
			this.map.fitBounds(this.getBounds());
			return this;
		},

		centerOn: function(coords) {
			var coords = (typeof coords!="string") ? coords : coords.split(",");
			this.map.setZoom(16);
			this.map.setCenter({lat:parseFloat(coords[0]), lng:parseFloat(coords[1])});
		},

		faMarker: function(classes) {
			var icon = document.createElement("i");
			icon.className = classes;
			document.body.appendChild(icon);
			var glyph	= window.getComputedStyle(icon,":before").getPropertyValue("content");
			var color	= window.getComputedStyle(icon).color;
			var size	= window.getComputedStyle(icon).fontSize || 20;
			document.body.removeChild(icon);
			size = parseInt(size);
		
			glyph = glyph.charCodeAt(1).toString(16);
		
			var canvas, ctx;
			canvas = document.createElement("canvas");
			canvas.width = canvas.height = size;
			ctx = canvas.getContext("2d");
			ctx.fillStyle = color;
		
			ctx.font = size+"px Font Awesome 5 Pro";
			ctx.fillText(String.fromCharCode(parseInt(glyph, 16)), 0, size*.8);
			return canvas.toDataURL();
		},

		addresscoords: function(address, after) {
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({"address":address}, function(results, status) {
				after(results, status);
			});
		}
	}
});