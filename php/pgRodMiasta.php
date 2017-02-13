<?php
ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);

header('Content-type: iso-8859-2');
$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
if (!$conn) {
  echo "Wystapil blad podczas podlaczenia do bazy kolego.\n"; 
  exit;
}
$result = pg_query($conn, "SELECT DISTINCT miasto FROM ogrody ORDER BY miasto ASC");
if (!$result) {
  echo "zapytanie do bazy spierniczyles.\n";
  exit;
}
while ($row = pg_fetch_row($result)) {
  $row[0] = str_replace(array('ą','ś','ń','ó','ź','ż','ć','ę','ł'), array('Ą','Ś','Ń','Ó','Ź','Ż','Ć','Ę','Ł'), $row[0]);
  echo strtoupper($row[0]);

  echo "\n";
}
?>