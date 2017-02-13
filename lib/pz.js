function dajeszPlan(id_ogrodu)
{
	try
	{
		mapa.overlayMapTypes.removeAt(0);
	}
	catch (err){}
	finally
	{	
var mapMinZoom = 15;
var mapMaxZoom = 20;

	maptiler = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) { 
        var proj = map.getProjection();
        var z2 = Math.pow(2, zoom);
        var tileXSize = 256 / z2;
        var tileYSize = 256 / z2;
        var tileBounds = new google.maps.LatLngBounds(
            proj.fromPointToLatLng(new google.maps.Point(coord.x * tileXSize, (coord.y + 1) * tileYSize)),
            proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * tileXSize, coord.y * tileYSize))
        );
        var y = coord.y;
        var x = coord.x >= 0 ? coord.x : z2 + coord.x
        if (mapBounds.intersects(tileBounds) && (mapMinZoom <= zoom) && (zoom <= mapMaxZoom))
		{
            return zoom + "/" + x + "/" + y + ".png";
			alert('aaaaa');
		}
        else
            return "http://www.maptiler.org/img/none.png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,

    opacity: 1.0
});
	
	
	
	
		mapa.overlayMapTypes.insertAt(0, maptiler);
	}
}

