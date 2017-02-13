<?php
ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);

//header('Content-type: text/txt');
header('Content-type: text/xml');
$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
if (!$conn) {
  echo "Wystapil blad podczas podlaczenia do bazy kolego.\n"; 
  exit;
}
switch ($_GET['rodzaj']){
	case "rod":
		$result = pg_query($conn, "SELECT '<polilinia nazwa=\"' || o.nazwa || '\" parcela=\"' || o.parcela || '\" miasto=\"' || o.miasto || '\" numer=\"' || d.numer || '\" powierzchnia=\"' || d.powierzchnia || 'm&#178;\" gid=\"' || d.gid ||'\">' || replace(replace(replace(replace(st_astext(ST_Transform(d.the_geom, 4326)), ' ', '\" lat=\"'), 'POLYGON((', '<punkt lon=\"'), ',', '\"/><punkt lon=\"'), '))', '\"/></polilinia>') FROM ogrody o INNER JOIN dzialki d ON o.gid=d.id_ogrodu WHERE d.id_ogrodu=".$_GET['id']);
	break;
	case "ogrod":
		$result = pg_query($conn, "SELECT '<polilinia nazwa=\"' || nazwa || '\" parcela=\"' || parcela || '\" miasto=\"' || miasto || '\" gid=\"' || gid ||'\">' || replace(replace(replace(replace(st_astext(ST_Transform(the_geom, 4326)), ' ', '\" lat=\"'), 'POLYGON((', '<punkt lon=\"'), ',', '\"/><punkt lon=\"'), '))', '\"/></polilinia>') FROM ogrody WHERE lower(miasto)='".$_GET['miasto']."' ORDER BY nazwa ASC, parcela ASC");
	break;
	case "adm":
		$result = pg_query($conn, "SELECT '<polilinia nazwa=\"' || \"NAZWA\" || '\" id=\"' || id || '\">' || replace(replace(replace(replace(st_astext(st_transform(st_setsrid(the_geom,2180),4326)), ' ', '\" lat=\"'), 'MULTIPOLYGON(((', '<punkt lon=\"'), ',', '\"/><punkt lon=\"'), ')))', '\"/></polilinia>') FROM gminy_sl WHERE lower(id)='".$_GET['miasto']."'");
	break;
	case "ewid":
		$result = pg_query($conn, "SELECT '<polilinia gid=\"' || gid ||  '\">' || replace(replace(replace(replace(st_astext(st_transform(st_setsrid(the_geom,2180),4326)), ' ', '\" lat=\"'), 'POLYGON((', '<punkt lon=\"'), ',', '\"/><punkt lon=\"'), '))', '\"/></polilinia>') FROM dzewid WHERE gid='".$_GET['id']."'");
	break;
	default:
		echo "nic poza ogrodkami i obrysami nie ma w bazie.\n";
		exit;
	break;		
}
if (!$result) {
  echo "zapytanie do bazy spierniczyles.\n";
  exit;
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<Dane>';

while ($row = pg_fetch_row($result)) {
  echo $row[0];
}
echo '</Dane>';
?>