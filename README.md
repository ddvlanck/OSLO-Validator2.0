# OSLO Validator EU

Deze repository bevat de nieuwe versie van de OSLO Validator en bestaat nu uit 2 delen. Enerzijds is er het validatie-gedeelte waarvoor gesteund wordt op de [validator van Europa](https://www.itb.ec.europa.eu/docs/guides/latest/validatingRDF/index.html#). De frontend werd ontwikkeld door Informatie Vlaanderen en is nagenoeg dezelfde als bij de vorige versie, met als belangrijkste verschil dat er werd overgeschakeld naar Webcomponenten versie 3.

Het project kan opnieuw ook lokaal gebruikt worden (zie verder). 

## Configuratie validator

De validator kan geconfigureerd worden met de applicatieprofielen waartegen gevalideerd kan worden. Om deze configuratie aan te passen moet de gebruiker navigeren naar volgende locatie:
```
Validator-Backend > resources > applicatieprofielen > config.properties
```

Meer informatie over de opties bij configuratie vind je opnieuw [hier](https://www.itb.ec.europa.eu/docs/guides/latest/validatingRDF/index.html#).

## Uitvoeren van het project

In deze versie werd gewerkt met Webcomponenten versie 3 (frontend). Dit betekent dat je over een geldig NPM token dient te beschikken om de frontend te builden en te gebruiken. Indien je echter niet over zo'n token beschikt kan je alsnog je data laten valideren.

### 1. Ik beschik over een geldig NPM token

Indien je over een geldig NPM token beschikt, kan je het volledige project deployen door volgende stappen uit te voeren:
1. Plak het NPM-token in het `.env`-bestand na de tekst NPM_TOKEN=
1. Navigeer naar de map waarin het bestand `docker-compose.yml` staat en voer het commando `docker-compose up` uit. 

De validator is vervolgens beschikbaar op poort `8081`.

### 2. Ik beschik niet over een geldig NPM token

Indien je niet over een geldig NPM token beschikt dan heb je voldoende aan `Validator-Backend`. Navigeer naar deze map en voer volgende commando's uit:
```
> docker build -t validator-eu .
> docker run -d -p 8080:8080 --name validator validator-eu
```

De tag-naam (`-t`) en containernaam (`--name`) kunnen steeds zelf gekozen worden. Om gebruik te maken van de validator moet je volgende URL raadplegen: `http://localhost:8080/shacl/applicatieprofielen/upload`
