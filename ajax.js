/*
 * Cours AJAX
 *
 * License: http://www.cecill.info/licences/Licence_CeCILL-B_V1-fr.html
 * Author:  Fraçois Merciol/2009
 * Web:     http://info.merciol.fr
 */

// ========================================
// Pour comparer des noms sans tenir compte des espaces
function trim (str) { 
    return str.replace(/^\s+/g,'').replace(/\s+$/g,'') 
}

// ========================================
// Créer la structure HTML :
// <li onclick="selectionneTache ("texte")">texte</li>
//function creerTache (texte) {
//    var liHtml = document.createElement ("li");
//    liHtml.appendChild (document.createTextNode (texte));
//    liHtml.setAttribute ("onClick", "selectionneTache (\""+texte+"\")")
//    return liHtml;
//}
function creerTache (texte, periode, lieu) {
    var liHtml = document.createElement ("li");
	var img1 = document.createElement("img");
	img1.src = periode + ".png";
	var img2 = document.createElement("img");
	img2.src = lieu + ".png";
	liHtml.appendChild(img1);
	liHtml.appendChild(img2);
    liHtml.appendChild (document.createTextNode (texte));
    liHtml.setAttribute ("onClick", "selectionneTache (\""+texte+"\", \""+periode+"\", \""+lieu+"\")");
    return liHtml;
}

// ========================================
// Créer la structure HTML :
// <li onclick="selectionneNom ("nom")">nom
//  <ul class="tache">
//    <li onclick="selectionneTache ("texte")">texte</li>
//  </ul>
// </li>
//
// !!! Attention !!!
//
// <li>texte</li> est équivalent à <li><TextNode textContent="texte"/></li>
function creerPersonne (nom, texte, periode, lieu) {
    var liHtml = document.createElement ("li");
    liHtml.appendChild (document.createTextNode (nom));
    liHtml.setAttribute ("onClick", "selectionneNom (\""+nom+"\")")

    var ulHtml = document.createElement ("ul");
    ulHtml.appendChild (creerTache (texte, periode, lieu));
    ulHtml.className = "tache";

    liHtml.appendChild (ulHtml);
    return liHtml;
}


// ========================================
// Retrouve la liste des personnes dans le document
// <div id="taches">
//   <ul class="personne">
//     ...
//   </ul>
// </div>
function getPersonnes () {
    for (var listePersonnes = document.getElementById ("taches").firstChild;
	 listePersonnes;
	 listePersonnes = listePersonnes.nextSibling) {

	if (listePersonnes.nodeName.toLowerCase () == "ul")
	    return listePersonnes;
    }
}

// ========================================
// Retrouve une personne dans une liste
// <ul class="personne">
//   <li onclick="selectionneNom ("nom")">
//     nom
//     <ul class="tache">
//       ...
//     </ul>
//   </li>
//   ...
// </ul>
//
// !!! Attention !!!
//
// <li>nom</li> est équivalent à <li><TextNode textContent="nom"/></li>
function getPersonne (personnes, nom) {
    for (var personne = personnes.firstChild; personne; personne = personne.nextSibling) { 
	if (personne.nodeName.toLowerCase () != "li")
	    continue;
	for (var attribut = personne.firstChild; attribut; attribut = attribut.nextSibling)
	    if (attribut.nodeName.toLowerCase () == "#text" &&
		nom == trim (attribut.data))
		return personne;
    }
}

// ========================================
// Retrouve la liste de tâches dans une personne
// <li onclick="selectionneNom ("nom")">
//   nom
//   <ul class="tache">
//     ...
//   </ul>
// </li>
function getTaches (personne) {
    for (var attribut = personne.firstChild;
	 attribut;
	 attribut = attribut.nextSibling)
	if (attribut.nodeName.toLowerCase () == "ul")
	    return attribut;
}

// ========================================
// Retrouve une tâche dans une liste
// <ul class="tache">
//   <li onclick="selectionneTache ("texte")">texte</li>
//   ...
// </ul>
function getTache (taches, texte) {
    for (var tache = taches.firstChild;
	 tache;
	 tache = tache.nextSibling)
	for (var texteEtudie = tache.firstChild;
	     texteEtudie;
	     texteEtudie = texteEtudie.nextSibling)
	    if (texteEtudie.nodeName.toLowerCase () == "#text")
		if (texte == trim (texteEtudie.data))
		    return tache;
}

// ========================================
// Ajoute une tâche dans une personne
// Crée la personne si besoin
function ajouteTache (nom, texte, periode, lieu) {
    if (!nom || ! texte)
	return;
    var personnes = getPersonnes ();
    var personne = getPersonne (personnes, nom);
    if (!personne) {
	// ajout de la personne ET de la tâche
	personnes.appendChild (creerPersonne (nom, texte, periode, lieu));
	setTache (nom, texte, "nouvelle", periode, lieu);
	return;
    }
    var taches = getTaches (personne);
    var tache = getTache (taches, texte);
    if (tache)
	return;
    // ajout à une personne existante
    taches.appendChild (creerTache (texte, periode,lieu ));
    setTache (nom, texte, "nouvelle", periode, lieu);
}

// ========================================
// Supprime une tâche dans une personne
// Supprime la personne si besoin
function supprimeTache (nom, texte) {
    if (!nom || ! texte)
	return;
    var personnes = getPersonnes ();
    var personne = getPersonne (personnes, nom);
    if (!personne)
	return;
    var taches = getTaches (personne);
    var tache = getTache (taches, texte);
    if (!tache)
	return;
    taches.removeChild (tache);
    if (taches.childNodes.length < 1)
	personnes.removeChild (personne);
}

// ========================================
// Change la classe CSS d'une tâche
// <li onclick="selectionneTache ("texte")" class="etat">texte</li>
function setTache (nom, texte, etat, periode, lieu) {
    if (!nom || ! texte)
	return;
    var personne = getPersonne (getPersonnes (), nom);
    if (!personne)
	return;
    var tache = getTache (getTaches (personne), texte);
    if (!tache)
	return;
    tache.className = etat;
    if (etat == "active")
	return;
    var xml =
	"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+
	"<requete info=\""+etat+"\">\n"+
	"  <personne>"+nom+"</personne>\n"+
	"  <tache>"+texte+"</tache>\n"+
	"  <lieu>"+lieu+"</lieu>\n"+
	"  <periode>"+periode+"</periode>\n"+
	"</requete>\n";

    envoie (window.location.protocol+"//"+window.location.hostname+":"+window.location.port,
	    window.location.pathname.substr (0,window.location.pathname.lastIndexOf ("/"))+"/ajax.php",
	    xml);
}

// ========================================
// Fonctions Ajax

function envoie (serveur, uri, xml) {

    this.document.forms.requete.xmlEnvoye.value = xml;
    var xmlRecu = this.document.forms.reponse.xmlRecu;
    xmlRecu.value = "";

    var requete = new XMLHttpRequest ();
    requete.open ("POST", serveur+uri, true); // "asynchrone" est a "true"
    requete.setRequestHeader ("Method", "POST " + uri + " HTTP/1.0");
    requete.setRequestHeader ("Content-Type", "application/xml");
    requete.onreadystatechange = function () {
	recoie (requete, xmlRecu);
    }
    requete.send (xml);
    delete requete;
}

function recoie (requete, xmlRecu) {
    if (requete.readyState != 4)
	// la fonction est appellée à plusieurs étapes
	return;
    if (requete.status != 200)
	return;
    xmlRecu.value = requete.responseText;
    var json;
    eval ("json=" + xml2json (str2xml (xmlRecu.value), "  "));
    var action = json ["reponse"]["@action"];
    var nom =  json ["reponse"]["personne"];
    var texte =  json ["reponse"]["tache"];
    var periode =  json ["reponse"]["periode"];
    var lieu =  json ["reponse"]["lieu"];
    if (action == "cree")
	setTache (nom, texte, "active", periode, lieu);
    else if (action == "supprime")
	supprimeTache (nom, texte);
}

// ========================================
// Fonctions Javascript appelées dans le document

//function ajoute () {
//    ajouteTache (trim (this.document.forms.formulaire.nom.value),
//		 trim (this.document.forms.formulaire.texte.value));
//}
function ajoute () {
	var inputs = document.getElementsByTagName('input'),
	inputsLength = inputs.length;
	var lieu ;
	var periode ;

	for (var i = 0 ; i < inputsLength ; i++) {
		if (inputs[i].type == 'radio' && inputs[i].checked) {
			if ( inputs[i].name == 'lieu' ) {
				lieu = inputs[i].value ;
			}
			else {
				periode = inputs[i].value ;
			}
		}
	}

    ajouteTache (trim (this.document.forms.formulaire["nom"].value), trim(this.document.forms.formulaire.texte.value), periode, lieu);

}

function supprime () {
    supprimeTache (trim (this.document.forms.formulaire.nom.value),
		   trim (this.document.forms.formulaire.texte.value));
}

function fait () {
    setTache (trim (this.document.forms.formulaire.nom.value),
	      trim (this.document.forms.formulaire.texte.value),
	      "faite");
}

function selectionneNom (nom) {
    this.document.forms.formulaire.nom.value = nom;
}

function selectionneTache (texte) {
    this.document.forms.formulaire.texte.value = texte;
}

// ========================================
