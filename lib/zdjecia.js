	var poly;
  var uchwyt;
  var polyOptions;
  var marker_temp;
  var markeryArr = [];
  var dymek;


  //inicjalizacja zdjec
  function init_zdjecia() 
  {
    //wlaczanie wylaczanie kontrolek
    //nie jest zalogowany  
    if (!readCookie('uzytkownik'))
    {   	
			document.getElementById('przycisklogin').style.display = "block"; 
			document.getElementById('przycisklogout').style.display = "none"; 	
			document.getElementById('przyciskZdjecia').style.display = "none";
			document.getElementById('przyciskUsunZdjecia').style.display = "none";
			document.getElementById('przyciskEwid').style.display = "none";
    }
    //jest zalogowany
    else
    {   	
			document.getElementById('przycisklogin').style.display = "none"; 
			document.getElementById('przycisklogout').style.display = "block"; 	
			document.getElementById('przyciskZdjecia').style.display = "block";
			document.getElementById('przyciskUsunZdjecia').style.display = "block";  
			document.getElementById('przyciskEwid').style.display = "block";  	
    }
    exePrzycisku('przyciskPZ');
    wczytajZdjecia();
  }
  
    //czyta ciasteczko o nazwie name
	function readCookie(name)
	{
    var cookiename = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++)
    {
    	var c = ca[i];    	 
    	while (c.charAt(0)==' ') c = c.substring(1,c.length);
    	if (c.indexOf(cookiename) == 0) return c.substring(cookiename.length,c.length);
    }
    return null;
	}
  
  
  //wywala ciasteczka dotyczace dokumentu
  function wyloguj()
  {
  	var days = -1;
  	var date = new Date();
		date.setTime(date.getTime ()+(days*24*60*60*1000));
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) 
		{
    	var cookie = cookies[i];   	
    	var eqPos = cookie.indexOf("=");   	
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    	document.cookie = name + "=;";
   	}
   	//alert(window.location.toString()); lokalizacja pliku html
  	window.location.reload();	
  }
  
  //tworzy linie z markerem na poczatku 
  function dajesz_linie()
  {
  	klikable_mapa(false);
  	if (poly){ poly.setMap(null); }
  	        var polyOptions = 
        		{
    						strokeColor:    '#000066',
    						strokeWeight:   1,
    						strokeOpacity:  0.9,
    						fillColor:      '#CC00FF',
    						fillOpacity:    0.1
						}
  	poly = new google.maps.Polyline(polyOptions);
  	poly.setMap(mapa);
  	uchwyt = google.maps.event.addListener(mapa, 'click', addLatLng);  	
  }
   
  //zdarzenie - dodawanie markera i linii
  function addLatLng(event) {	
    var path = poly.getPath();
    path.push(event.latLng);
    //zostal postawiony pierwszy punkt
    if (path.length == 1)
    {
      var ikona = new google.maps.MarkerImage
      	(
      		"ikonki/blue_x.png", 
      		new google.maps.Size(32,32), 
      		new google.maps.Point(0,0), 
      		new google.maps.Point(16,16)
      	);
    	marker_temp = new google.maps.Marker
    	({
      	position: event.latLng,
      	icon: ikona,
      	title: '#' + path.getLength(),
      	map: mapa
    	});
  	}
  	//zostal postawiony drugi punkt
    if (path.length > 1)
    {
    		google.maps.event.removeListener(uchwyt);
    		//funkcja liczaca azymut
    		var heading = Math.round(google.maps.geometry.spherical.computeHeading(path.getAt(0), path.getAt(1)));
    		if (heading < 0){ heading = 360 + heading; }
    						
    		//zmiana ikonki markera tymczasowego
     		ikona = new google.maps.MarkerImage
     			(
     				"ikonki/"+heading+".png", 
     				new google.maps.Size(32,32), 
     				new google.maps.Point(0,0), 
     				new google.maps.Point(16,16)
     			);
      	marker_temp.setIcon(ikona);
      	upload(heading, "POINT(" + path.getAt(0).lng() + " " + path.getAt(0).lat() + ")");
    }
  }
  

	//wczytanie markerow/zdjec z bazy
	function wczytajZdjecia()
	{		
		jx.load('php/pgfot2xml.php', function(xml)
		{			
			var rekordy = xml.getElementsByTagName("rekord");
			for(var i=0; i<rekordy.length; i++)
			{
				var gid = rekordy[i].attributes.getNamedItem("gid").nodeValue;				
				var latlng = new google.maps.LatLng
					(
						rekordy[i].attributes.getNamedItem("lat").nodeValue,
						rekordy[i].attributes.getNamedItem("lon").nodeValue
					);				
     		ikona = new google.maps.MarkerImage
     			(
     				"ikonki/"+rekordy[i].attributes.getNamedItem("heading").nodeValue+".png", 
     				new google.maps.Size(32,32), 
     				new google.maps.Point(0,0), 
     				new google.maps.Point(16,16)
     			);     		
     		dodajMarker
     			(
     				'<p><img src="'+rekordy[i].attributes.getNamedItem("sciezka").nodeValue+'" width=400></p>', 
     				latlng, 
     				ikona
     			)	
			}
		},'xml','get');
	}
	
	
	//dodaje marker z dymkiem wg opcji
	function dodajMarker(nazwa, latlng, ikona)
	{
		var marker = new google.maps.Marker({position: latlng, map: mapa, icon: ikona});
		google.maps.event.addListener(marker, "click", function() 
			{
				if (dymek) dymek.close();
				dymek = new google.maps.InfoWindow({content: nazwa});
				dymek.open(mapa, marker);
			});
		markeryArr.push(marker);
		//usuwanie zdjecia
		google.maps.event.addListener(marker, "rightclick", function(markerKlik)
			{
				//zaznaczona opcja usun zdjecia
				if ((document.getElementById('przyciskUsunZdjecia').style.display != "none") && (document.getElementById('przyciskUsunZdjecia').className == "guzikKlik"))
				{
					document.getElementById("id_zdjecia").value = markeryArr.indexOf(marker, 0);
					document.getElementById("atr_zdjecia").value = nazwa;
					pokazConfirm();					
				}
			}
		)		
		return marker;
	}


  //funkcja czyszczaca tablice markerow
  function czyscMarkery()
  {
  	if (markeryArr)
  	{
  		for (i in markeryArr)
  		{
  			markeryArr[i].setMap(null);
  		}
  	}
  }
  
  
  //funkcja "po uploadzie zdjecia" stan jak po wgraniu strony 
  function afterUpload()
  {
  	zamknijUpload();
  	czyscMarkery();
  	wczytajZdjecia();
  }  
  
  
  //wyrzuca aktualne zdjecie z mapy i serwera
  function wywalZdjecie(id_zdjecia, atr_Zdjecia)
  { 	
  	var sciezka = atr_Zdjecia.substring(atr_Zdjecia.indexOf('"') + 1, atr_Zdjecia.indexOf('"', atr_Zdjecia.indexOf('"') + 1));
		markeryArr[id_zdjecia].setMap(null);
		//jquery wywoluje skrypt do usuwania zdjecia z bazy
		$.get('php/wywalZdjecie.php?sciezka='+sciezka);
		zamknijConfirm();
  }
  
////////////////////////////// 
/////////////////////OKIENKA// 
//////////////////////////////
  
  
  //funkcja wywolujaca okienko z uploadem zdjecia i dodajaca wartosci <heading, punkt> do formy
  function upload(heading, punkt)
	{
		document.getElementById("heading").value = heading;
		document.getElementById("punkt").value = punkt;
		pokazUpload();
	}  
	
  //pokazuje okienko z uploadem
  function pokazUpload()
  {
  	var popup = document.getElementById('uploadokienko');
  	popup.style.display = "block";
  	document.getElementById('lightbox').style.display = "block"; 	
  }
  
  //zamyka okno z uploadem
  function zamknijUpload()
  {
  	klikable_mapa(true);
  	var popup = document.getElementById('uploadokienko');
  	popup.style.display = 'none';
  	document.getElementById('lightbox').style.display = "none";
  	//kasuje tymczasowy marker i kreske
  	if (marker_temp)
  	{
  		marker_temp.setMap(null);
  	}
  	if (poly)
  	{
  		poly.setMap(null);
  	}
  	try { google.maps.event.removeListener(uchwyt); }
		catch(err) { }
		document.getElementById("przyciskZdjecia").className = 'guzik';		
  }    


  //pokazuje okienko z pomoca
  function pokazOkienko()
  {
  	var pomoc = "1. Wybierz miasto z listy aby rozwinąć listę ogrodów w danym mieście." + '\n' + 
								"2. Wybierz ogród z listy aby przybliżyć widok do wybranego ogrodu." + '\n' + 
								"3. Kliknij prawym przyciskiem myszy w ogrodzie aby wyświetlić informacje o ogrodzie." + '\n' + 
								"4. Dwukrotne kliknięcie lewym przyciskiem myszy w ogrodzie powoduje wyświetlenie działek rodzinnych." + '\n' + 
								"5. Kliknij prawym przyciskiem myszy w działce aby wyświetlić informacje o działce." + '\n' +
								"6. Dwukrotne kliknięcie lewym przyciskiem myszy w działce powoduje przejście w tryb edycji działki." + '\n' +
								"7. Przyciskiem Wyświetl Plan można włączyć/wyłączyć wyświetlanie planu zagospodarowania (o ile jest dostępny)." + '\n' +
								"8. Istnieje możliwość wgrania zdjęć po zalogowaniu: " + '\n' +
								"---- uaktywnij przycisk 'Dodaj Zdjęcie';" + '\n' +
								"---- wskaż punkt na mapie, w którym zostało zrobione zdjęcie; " + '\n' +
								"---- wstaw drugi punkt wyznaczający kierunek, w którym zostało zrobione zdjęcie; " + '\n' +
								"---- wybierz zdjęcie z dysku (*.jpeg, *.jpg, *.gif); " + '\n' +
								"---- zaznaczając opcje 'Usuń Zdjęcie' możemy usuwać zdjęcia prawym przyciskiem myszy. " + '\n' +
								"9. Dwukrotne kliknięcie loga firmy UNIMAP powoduje włączenie/wyłączenie trybu pełno-ekranowego." + '\n\n';
								
  	var popup = document.getElementById('pomocokienko');
  	popup.appendChild(document.createTextNode(pomoc));
  	popup.style.display = "block";
  	document.getElementById('lightbox').style.display = "block";
  }
  
  
  //zamyka okno z pomoca
  function zamknijOkno()
  {
  	var popup = document.getElementById('pomocokienko');
  	popup.removeChild(popup.childNodes[7]);
  	popup.style.display = 'none';
  	document.getElementById('lightbox').style.display = "none";
  } 


  //pokazuje okienko z loginem
  function pokazLogowanie()
  {
  	var popup = document.getElementById('loginokienko');
  	popup.style.display = "block";
  	document.getElementById('lightbox').style.display = "block"; 	
  }
  

  //zamyka okno z loginem
  function zamknijLogowanie()
  {
  	var popup = document.getElementById('loginokienko');
  	popup.style.display = 'none';
  	document.getElementById('lightbox').style.display = "none";
  }  
  
  //pokazuje okienko z confirm
  function pokazConfirm()
  {
  	var popup = document.getElementById('confirmokienko');
  	popup.style.display = "block";
  	document.getElementById('lightbox').style.display = "block"; 	
  } 
  
  //zamyka okno z confirm
  function zamknijConfirm()
  {
  	var popup = document.getElementById('confirmokienko');
  	popup.style.display = 'none';
  	document.getElementById('lightbox').style.display = "none";
  }

////////////////////////////// 
////////////////PRZYCISKI///// 
//////////////////////////////
   
  //zmiany wlasciwosci guzikow
  //zmiana klasy
  
 	//czy przycisk jest uaktywniany?
  function exePrzycisku(id)
	{
		var klasa = document.getElementById(id).className;
		if (klasa == 'guzik') { document.getElementById(id).className = 'guzikKlik'; return true;}
		else { document.getElementById(id).className = 'guzik'; return false;}
			
	}
		
		
	//klikniecie przycisku "wyswietl plan"
	function dajPlan()
	{		
	console.log('Plan numer: ' + gidArr[aktOgr]);
		if (exePrzycisku('przyciskPZ'))
		{
			dajeszPlan(gidArr[aktOgr]);
		}
		else
		{
			mapa.overlayMapTypes.removeAt(0);
		}
	}
	
	
	//klikniecie przycisku "zdjecia"
	function dajZdjecia()
	{
		if (exePrzycisku('przyciskZdjecia'))
		{
			dajesz_linie()
		}
		else
		{
			zamknijUpload();
		}		
	}
  
	function usunZdjecia()
	{
		exePrzycisku('przyciskUsunZdjecia')
	}

////////////////////////////// 
/////////////////KLIKABLE///// 
//////////////////////////////
  	
  //wlaczenie i wylaczenie klikania dzialek/ogrodow
  function klikable_mapa(klik)
  { 	
  	var i;
  	for (i=0;i<ogrArr.length;i++)
  	{
  		ogrArr[i].setOptions( {clickable: klik} ); 		
  	}
		for (i=0;i<rodArr.length;i++)
		{
			rodArr[i].setOptions( {clickable: klik} );
		}
  }
  
  //wlaczanie i wylaczanie klikania elementu przy wlaczonym przycisku dodaj zdjecie
  function klikable_el(_element)
  {
		if (document.getElementById('przyciskZdjecia').className == 'guzikKlik') 
			{ _element.setOptions( {clickable: false} ); }
		else
			{ _element.setOptions( {clickable: true} ); }
  }
    
