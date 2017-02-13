<?php
ini_set('display_errors', 1); 
ini_set('log_errors', 1); 
ini_set('error_log', dirname(__FILE__) . '/error_log.txt'); 
error_reporting(E_ALL);

if (isset($_POST["uzytkownik"]) && isset($_POST["haslo"]) && $_POST["uzytkownik"] !=="" && $_POST["haslo"] !=="") 
{
		$conn = pg_connect("host=127.0.0.1 port=5432 dbname=PZD_ROD_Poznan user=postgres password=postgres");
		if (!$conn) 
		{
			  echo "Wystapil blad podczas podlaczenia do bazy kolego.\n"; 
			  exit;
		}
		
		$result = pg_query($conn, "SELECT uzytkownik, maslo, gid FROM uzytkownicy WHERE uzytkownik='".$_POST['uzytkownik']."' AND maslo='".$_POST['haslo']."'");
		if (!$result) 
		{
			  echo "zapytanie do bazy spierniczyles.\n";
			  exit;
		}
		if(pg_num_rows($result) > 0) 
		{
				$row = pg_fetch_row($result);
				$id = (int)$row[2];
				$pass = $row[1];
				$usr = $row[0];
				setcookie("uzytkownik", $usr, false, "/PZD", "");
				setcookie("haslo", md5($pass), false, "/PZD", "");
		}
		else 
		{
				$INC_DIR = $_SERVER["DOCUMENT_ROOT"]."/php/";  
				include ($INC_DIR."logout.php");
				logout();
				echo "Login i/lub haslo niepoprawne";
				exit;
		}		
		//echo "Witaj ".($_COOKIE["uzytkownik"]!="" ? $_COOKIE["uzytkownik"] : "Gosciu");
		pg_free_result($result);
    pg_close($conn);
    //header("Location: http://unimap.dyndns.biz/");
	header("Location: http://127.0.0.1/PZD/pzdgoogle.html");
} 
else 
{
		echo "Musisz wprowadzic nazwe uzytkownika i haslo";	
}
?> 