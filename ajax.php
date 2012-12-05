<?php
/*
 * Cours AJAX
 *
 * License: http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html
 * Author:  Fraçois Merciol/2009
 * Web:     http://info.merciol.fr
 */

{
  $xml = trim (file_get_contents ("php://input"));

  $requette = new DOMDocument ("1.0", "utf8");
  $requette->loadXML ($xml);
  $racineRequete = $requette->documentElement;
  $info = $racineRequete->getAttribute ("info");
  $nom = trim ($racineRequete->getElementsByTagName ("personne")->item (0)->nodeValue);
  $texte = trim ($racineRequete->getElementsByTagName ("tache")->item (0)->nodeValue);
  $periode = trim($racineRequete->getElementsByTagName("periode")->item(0)->nodeValue);
  $lieu = trim($racineRequete->getElementsByTagName("lieu")->item(0)->nodeValue);

  sleep (mt_rand (1, 10));

  header("Content-Type: application/xml");

  $reponse = new DOMDocument ("1.0", "utf8");
  $racineReponse = $reponse->createElement ("reponse");
  $reponse->appendChild ($racineReponse);

  if ($info == "nouvelle")
    $racineReponse->setAttribute ("action", "cree");
  else
    $racineReponse->setAttribute ("action", "supprime");

  $racineReponse->appendChild ($reponse->createElement ("personne", $nom));
  $racineReponse->appendChild ($reponse->createElement ("tache", $texte));
  $racineReponse->appendChild($reponse->createElement("periode", $periode));
  $racineReponse->appendChild($reponse->createElement("lieu", $lieu));

  $reponse->formatOutput = true;
  $reponse->save("php://output") . "\n";
}
?>
