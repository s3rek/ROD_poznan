        var mapa;
        var dymek = new google.maps.InfoWindow();
        var icon;
				var rodArr = [];
				var ogrArr = [];
				var geomMiasto;
				var gidArr = [];
				var aktROD;
				var aktOgr;
				var aktMiasto;
				var maptiler;
		var connect = "host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres";

     		//ODPALAMY MAPE
        function mapaStart()
        {
            var wspolrzedne = new google.maps.LatLng(50.2637945,18.9769091);
            var opcjeMapy =
            {
              zoom: 17,
              center: wspolrzedne,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              disableDefaultUI: true,
              disableDoubleClickZoom: true,
    					navigationControl: true,
    					navigationControlOptions:
    					{
        					position: google.maps.ControlPosition.TOP_RIGHT // kontrolka nawigacji w prawym, górnym rogu
    					},
    					mapTypeControl: true,
    					mapTypeControlOptions:
    					{
        					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        					mapTypeIds:
        					[
        						google.maps.MapTypeId.ROADMAP,
        						google.maps.MapTypeId.SATELLITE,
        						google.maps.MapTypeId.HYBRID,
        						google.maps.MapTypeId.TERRAIN
        					],
        					style: google.maps.MapTypeControlStyle.default,
        					position: google.maps.ControlPosition.left
    					},
    					scaleControl: true,
    					scaleControlOptions:
    					{
        					position: google.maps.ControlPosition.TOP_LEFT // kontrolka skali w lewym górnym rogu
    					}
            };
            
            fitMapToWindow();
            mapa = new google.maps.Map(document.getElementById("mapka"), opcjeMapy);


            //MARKER Z UNIMAPEM               			            
             var ikona1 = new google.maps.MarkerImage
      			(
      				"ikonki/unimap.PNG", 
      				new google.maps.Size(32,32), 
      				new google.maps.Point(0,0), 
      				new google.maps.Point(16,16)
      			);
      			     			
      			var marker = new google.maps.Marker
			    	({
			      	position: new google.maps.LatLng(50.2637945,18.9769091),
			      	icon: ikona1,
			      	//title: '<div><strong>&nbspUNIMAP</strong><br />ul. Kossutha 11<br />(032)782 26 40<br /><a href="http://www.unimap.pl">www.unimap.pl</a></div>',
			      	map: mapa
			    	});		    	
			    	google.maps.event.addListener(marker,"click",function()
    				{
        			dymek.setContent('<div><strong>&nbspUNIMAP</strong><br />ul. Kossutha 11<br />(032)782 26 40<br /><a href="http://www.unimap.pl">www.unimap.pl</a></div>');
        			dymek.open(mapa,marker);
    				});
            
            //var marker = dodajMarker({position: new google.maps.LatLng(50.2637945,18.9769091), title: '<div><strong>&nbspUNIMAP</strong><br />ul. Kossutha 11<br />(032)782 26 40<br /><a href="http://www.unimap.pl">www.unimap.pl</a></div>', icon: ikona1});					  
					  
					  
					  
					  
					  
					  wczytajMiasta();
					  
					  
					  
					  init_zdjecia();
        }

        //MARKER PUNKTOWY Z DYMKIEM
        function dodajMarker(opcjeMarkera)
        {
        		opcjeMarkera.map = mapa;												
        		var marker = new google.maps.Marker(opcjeMarkera);
        		var wspolrzedne = marker.position;
        		var tytul = ' ' + marker.title; 
        		tytul = (tytul.split("<br />"))[0];
        		var tytul = (marker.title.split("<br />"))[0];
        		google.maps.event.addListener(marker,"click",function()
    				{
        			dymek.setContent('<div style="background-color:#FFFF88; font-family:cursive;" font-size: 10px;" border:solid 3px black;">'+opcjeMarkera.title+'</div>');
        			dymek.open(mapa,marker);
    				});
    				document.getElementById('pasekBoczny').innerHTML+='<ul><a href="#" onclick="mapa.panTo(new google.maps.LatLng('+wspolrzedne.lat()+', '+wspolrzedne.lng()+')); return false;"> '+tytul+'</a></li>';
    				document.getElementById('pasekBoczny').innerHTML+='</br>';
    				return marker;
        }

				//WYLACZ ELEMENTY Z TABLICY
				function czyscArr(_arr)
				{
					if (_arr)
					{
						for (i in _arr)
						{
							_arr[i].setMap(null);
						}
					}
				}
				//POKAZ ELEMENTY Z TABLICY
				function pokazArr(_arr)
				{
					if (_arr)
					{
						for (i in _arr)
						{
							_arr[i].setMap(mapa);
						}
					}
				}
				//USUN ELEMENTY Z TABLICY
				function usunArr(_arr)
				{
					czyscArr(_arr);
					_arr.length=0;
				}
								
				
				//WCZYTYWANIE NAZW MIAST Z BAZY I DODAWANIE ICH DO LISTY
				function wczytajMiasta()
				{
					var txtFile = new XMLHttpRequest();
					txtFile.open('GET', 'php/pgRodMiasta.php', true);
					txtFile.onreadystatechange = function() 
					{
  					if (txtFile.readyState === 4) // Makes sure the document is ready to parse.
  					{  
    					if (txtFile.status === 200) // Makes sure it's found the file.
    					{  
      					var allText = txtFile.responseText;
      					var lines = allText.split("\n"); // Will separate each line into an array
      					for (var i in lines)
      					{		
      												 		
									document.getElementById('pasekBoczny').innerHTML+='<ul id="'+lines[i]+'" class="nazwaMiasta"><a onclick=wczytajOgrody(\"'+lines[i].replace(" ", "_")+'\")><font color=#9a0505 size="4"><b>&nbsp;'+lines[i]+'</b></font></a></ul>';				
      					}
    					}
  					}
					}
					txtFile.send(null);
				}
										
				
				
				//CZYSCI OGRODY Z DANEGO MIASTA
				function czyscMiasto(miasto)
				{
					console.log('czyszcze: ' + miasto)
					  var i;
					  var galazka=document.getElementById(miasto);				  
					  for (i=galazka.childNodes.length-1;i>=0;i--)
					  {
					  	if (galazka.childNodes[i].nodeName=='LI')
					  	{
					  		galazka.removeChild(galazka.childNodes[i])
					  	}
					  }		
					  usunArr(rodArr);
					  usunArr(ogrArr);
					  aktOgr = undefined;
					  if (geomMiasto !=undefined)
					  	{
					  		geomMiasto.setMap(null)
					  	}
					  gidArr.length=0;	  					
				}
				
				
        //WCZYTANIE OGRODOW Z PLIKU XML
        function wczytajOgrody(miasto)
				{
						//console.log(miasto);
						var latlng = {};
						//porzadek przed zaczytaniem miasta
						miasto = miasto.replace("_", " ")
						if (aktMiasto)
						{	
							czyscMiasto(aktMiasto);					
							if (aktMiasto == miasto)
							{
								aktMiasto = null;
								return;
							}										
						}
						aktMiasto=miasto;
						wczytajGranice(miasto);
						//alert(aktMiasto);
						
													//miasto.toLowerCase().split(' ').join('')
																	  					  
				    jx.load('php/pgkml2xml.php?rodzaj=ogrod&miasto='+miasto.toLowerCase(), function(xml)
				    {
				        var polilinie = xml.getElementsByTagName("polilinia");
				        for(var i=0; i<polilinie.length; i++)
				        {
							
				        		var gid = polilinie[i].attributes.getNamedItem("gid").value;
				        	  var nazwa = polilinie[i].attributes.getNamedItem("nazwa").value;
				        	  var parcela = polilinie[i].attributes.getNamedItem("parcela").value;
				            var punkty  = polilinie[i].getElementsByTagName("punkt");
				            var wierzcholki = [];
							//alert('poczatek');
													
							
				            for(var j=0; j<punkty.length; j++)
				            {
				                var lat     = parseFloat(punkty[j].attributes.getNamedItem("lat").value);
				                var lon     = parseFloat(punkty[j].attributes.getNamedItem("lon").value);
				               	
								console.log(j.toString() + " " +lat + "," + lon);								
								var latlng  = new google.maps.LatLng(lat,lon);
								
								//console.log(latlng + ' ' +j.toString() + " " + latlng.lat() + "," + latlng.lng());
				                wierzcholki.push(latlng);
					
				            }
							
							/*
                            console.log(wierzcholki);
							
							for (var s=0; s<wierzcholki.length; s++)
							{
								console.log(wierzcholki[s].lat() + "," + wierzcholki[s].lng());	
							}
											console.log('t2');	
								//alert('koniec');
							*/
								
							if (parcela == "-")
							{
										
				            	dodajOgrod(wierzcholki, nazwa, gid, miasto);
				          	}
				          	else
				          	{
				          		dodajOgrod(wierzcholki, nazwa+" ("+parcela+")", gid, miasto);
							
				          	}
				          		
				        }
				    },'xml','get');				    				    
				}
        //DODAJ OGROD
        function dodajOgrod(punkty, nazwa, id_ogrodu, miasto)
        {
			           	
        		var bounds = new google.maps.LatLngBounds();
        		var wspolrzedne;
        		

				
        		var polOptions1 = 
        		{
    						strokeColor:    '#00FF00',
    						strokeWeight:   3,
    						strokeOpacity:  0.7,
    						fillColor:      '#ADFF2F',
    						fillOpacity:    0.2,
    						zIndex: 100
						}
						var polOptions2 = 
						{
    						strokeColor:    '#00FF00',
    						strokeWeight:   3,
    						strokeOpacity:  0.7,
    						fillColor:      '#FFFF00',
    						fillOpacity:    0.3,
    						zIndex: 100					
						}
						var polOptions3 = 
						{
    						strokeColor:    '#FF0000',
    						strokeWeight:   4,
    						strokeOpacity:  0.7,
    						fillColor:      '#FF0000',
    						fillOpacity:    0,
    						zIndex: 100						
						}       			
           	var polilinia = new google.maps.Polygon(polOptions1);          	
        		
	
				// TU COŚ BYŁO NIE TAK !!!!!!!!

			polilinia.setPath(punkty);

				
           	ogrArr.push(polilinia);
			gidArr.push(id_ogrodu);
           	ogrArr[ogrArr.length-1].setMap(mapa);
           	
						//console.log(gidArr);
						//console.log(ogrArr);
			

           	
           	///////////////////////////////
           	//OGROD DO KLIKANIA LUB TEZ NIE
           	//jesli przycisk 'zdjecia' wcisniety to ustaw ogrod na nie klikajacy
           	klikable_el(ogrArr[ogrArr.length-1]);
           	///////////////////////////////     
	          	
					for(var i=0; i<punkty.length; i++)
    				{
						bounds.extend(punkty[i]);
						
    				}
    				wspolrzedne = bounds.getCenter();   
					
    				google.maps.event.addListener(polilinia, 'mouseover', function(myszNaOgr)
    				{ 
    					if (polilinia.fillOpacity != 0)
    					{
    						polilinia.setOptions(polOptions2);
    					}
    				});
					
    				google.maps.event.addListener(polilinia, 'mouseout', function(myszZOgr)
    				{
    					if (polilinia.fillOpacity != 0)
    					{
    						polilinia.setOptions(polOptions1);
    					}
    				});
					
    				google.maps.event.addListener(polilinia, 'rightclick', function(rklikOgr)
						{
							
								//var pole = google.maps.geometry.spherical.computeArea(polilinia.getPaths().getAt(0));
    						var tekst = '<table align="center" style="border: 0; border-collapse: collapse"><tr><td>Rodzinny Ogród Działkowy</td></tr><tr><td><strong>ROD&nbsp;'+nazwa+'</strong></td></tr></table>'																									//+ zdarzenie.latLng;
    						dymek.setContent(tekst);
    						dymek.setPosition(rklikOgr.latLng);
    						dymek.open(mapa);						  		
    				});
						
    				google.maps.event.addListener(polilinia, 'dblclick', function(dklikOgr)
    				{	   
    						if (aktOgr>=0){ ogrArr[aktOgr].setOptions(polOptions1); }  						 												  						  
							  aktOgr = ogrArr.indexOf(polilinia);								  						  								
							  polilinia.setOptions(polOptions3);
							  usunArr(rodArr);
							  
							  wczytajROD(id_ogrodu);
      							if (document.getElementById('przyciskPZ').className == 'guzikKlik')
        						{
							  dajeszPlan(id_ogrodu);
							}
							  mapa.fitBounds(bounds);    					    					
    				});  		

    				document.getElementById(miasto).innerHTML+=
    				'<li><a href="#" '+
    				'onclick="mapa.fitBounds(new google.maps.LatLngBounds('+
    				'new google.maps.LatLng('+bounds.getSouthWest().lat()+', '+bounds.getSouthWest().lng()+'), '+
    				'new google.maps.LatLng('+bounds.getNorthEast().lat()+', '+bounds.getNorthEast().lng()+'))); '+
    				'return false;">&nbsp;&nbsp;&nbsp;ROD&nbsp;'+nazwa+'</a></li>';

        }
			
				//WCZYTAJ POJEDYNCZY OGROD
				function wczytajROD(id_ogrodu)
				{
						//var gid = id_ogrodu;

				    jx.load('php/pgkml2xml.php?rodzaj=rod&id='+id_ogrodu, function(xml)
				    {
				        var polilinie = xml.getElementsByTagName("polilinia");
				        for(var i=0; i<polilinie.length; i++)
				        {
				        		var gid = polilinie[i].attributes.getNamedItem("gid").value
				        	  var dzialka = polilinie[i].attributes.getNamedItem("numer").value;
				        	  var powierzchnia = polilinie[i].attributes.getNamedItem("powierzchnia").value;
				            var punkty  = polilinie[i].getElementsByTagName("punkt");
				            var wierzcholki = [];
				            for(var j=0; j<punkty.length; j++)
				            {
				                var lat     = parseFloat(punkty[j].attributes.getNamedItem("lat").value);
				                var lon     = parseFloat(punkty[j].attributes.getNamedItem("lon").value);
				                var latlng  = new google.maps.LatLng(lat,lon);
				                wierzcholki.push(latlng);
				            }
				            dodajROD(wierzcholki, dzialka, powierzchnia, gid);
				        }
				    },'xml','get');					
				}
				
        //DODAJ ROD
        function dodajROD(punkty, dzialka, powierzchnia, id_dzialki)
        {
        		var bounds = new google.maps.LatLngBounds();
        		var wspolrzedne;
        		
        		
        		var polOptions1 = 
        		{
    						strokeColor:    '#000066',
    						strokeWeight:   1,
    						strokeOpacity:  0.9,
    						fillColor:      '#CC00FF',
    						fillOpacity:    0.1,
    						zIndex: 500
						}
						var polOptions2 = 
						{
    						strokeColor:    '#000000',
    						strokeWeight:   3,
    						strokeOpacity:  0.3,
    						fillColor:      '#FFFF00',
    						fillOpacity:    0.2,
    						zIndex: 500					
						}
						var polOptions3 = 
						{
    						strokeColor:    '#FF0000',
    						strokeWeight:   4,
    						strokeOpacity:  0.7,
    						fillColor:      '#FF0000',
    						fillOpacity:    0,
    						zIndex: 500					
						}          
						
           	var polilinia = new google.maps.Polygon(polOptions1);
           	polilinia.setPath(punkty);
           	rodArr.push(polilinia);
           	rodArr[rodArr.length-1].setMap(mapa);          	
						for(var i=0; i<punkty.length; i++)
    				{
								bounds.extend(punkty[i]);
    				}
    				wspolrzedne = bounds.getCenter();  				
    				google.maps.event.addListener(polilinia, 'mouseover', function(myszNaRod)
    				{
    					if (polilinia.fillOpacity != 0)
    					{
    						polilinia.setOptions(polOptions2);
    					}
    				});
    				google.maps.event.addListener(polilinia, 'mouseout', function(myszZRod)
    				{
    					if (polilinia.fillOpacity != 0)
    					{
    						polilinia.setOptions(polOptions1);
    					}
    				});
						google.maps.event.addListener(polilinia, 'rightclick', function(rKlikROD)
						{						
							var tekst = '<table><tr><td>Numer: </td><td><strong>'+dzialka+'</strong></td></tr><tr><td>Powierzchnia:&nbsp;</td><td><strong>'+powierzchnia+'</strong></td></tr></table>';																			
	    				dymek.setContent(tekst);
	    				dymek.setPosition(rKlikROD.latLng);
	    				dymek.open(mapa);
    				});
						google.maps.event.addListener(polilinia, 'dblclick', function(dKlikROD)
						{
							if (polilinia.fillOpacity == 0)
							{
								rodArr[aktROD].setOptions(polOptions1);
								aktROD = null;
							}
							else
							{
								try
								{
									rodArr[aktROD].setOptions(polOptions1);
								}
								catch(err){}
								finally
								{
								  aktROD = rodArr.indexOf(polilinia);
								  polilinia.setOptions(polOptions3);
								}		
							}		
						});   				
        }

				//WCZYTANIE GRANIC MIASTA
        function wczytajGranice(miasto)
				{
				    jx.load('php/pgkml2xml.php?rodzaj=adm&miasto='+miasto.toLowerCase(), function(xml)
				    {			    	  
				        var polilinie = xml.getElementsByTagName("polilinia");
				        for(var i=0; i<polilinie.length; i++)
				        {
				            var punkty  = polilinie[i].getElementsByTagName("punkt");
				            var wierzcholki = [];

				            for(var j=0; j<punkty.length; j++)
				            {
				                var lat     = parseFloat(punkty[j].attributes.getNamedItem("lat").value);
				                var lon     = parseFloat(punkty[j].attributes.getNamedItem("lon").value);
				                var latlng  = new google.maps.LatLng(lat,lon);
				                wierzcholki.push(latlng);
				            }

				            dodajGranice(wierzcholki);
				        }
				    },'xml','get');
				}

			  //DODANIE GRANICY
				function dodajGranice(wierzcholki)
				{
					var bounds = new google.maps.LatLngBounds();

				    geomMiasto = new google.maps.Polygon(
				        {
				            paths:          wierzcholki,
				            strokeColor:    '#000080',
				            strokeOpacity:  0.7,
				            strokeWeight:   3,
				            fillColor:      '#99CC33',
    						fillOpacity:    0.1,
				            map: mapa,
				            clickable:	false,
				            zIndex: 0
				        }
				    );
					

				    for(var i=0; i<wierzcholki.length; i++)
    				{
								bounds.extend(wierzcholki[i]);
    				}		    
						mapa.fitBounds(bounds);
						
				}


				function display_pz_onclick() 
				{
        		if (document.getElementById('display_pz').className == true)
        		{
	  						dajeszPlan(gidArr[aktOgr]);
        		}
        		else
        		{
           			try
								{
										mapa.overlayMapTypes.removeAt(0);
								}
								catch (err){}
        		}
				}
				
				
				function pokazGdzieJestes(location)
				{
				    //alert("Tu jesteś: " + '\n' + location.coords.latitude + ';' + location.coords.longitude + "; dokładnośc: " + location.coords.accuracy);
            mapa.panTo(new google.maps.LatLng(location.coords.latitude,location.coords.longitude));
    		}
				
				function tuJestes()
				{
            navigator.geolocation.getCurrentPosition(pokazGdzieJestes);

				}	