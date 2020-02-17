# OSLO Validator EU

Deze repository bevat de nieuwe versie van de OSLO Validator en bestaat nu uit 2 delen. Enerzijds is er het validatie-gedeelte waarvoor gesteund wordt op de [validator van Europa](https://www.itb.ec.europa.eu/docs/guides/latest/validatingRDF/index.html#). De frontend werd ontwikkeld door Informatie Vlaanderen en is nagenoeg dezelfde als bij de vorige versie, met als belangrijkste verschil dat er werd overgeschakeld naar Webcomponenten versie 3.

Het project kan opnieuw ook lokaal gebruikt worden. Aangezien er nu gebruik gemaakt wordt van Webcomponenten versie 3 moet de gebruiker wel over een geldig NPM token beschikken.

## Configuratie validator

De validator kan geconfigureerd worden met de applicatieprofielen waartegen gevalideerd kan worden. Om deze configuratie aan te passen moet de gebruiker navigeren naar volgende locatie:
```
Validator-Backend > resources > applicatieprofielen > config.properties
```

Meer informatie over de opties bij configuratie vind je opnieuw [hier](https://www.itb.ec.europa.eu/docs/guides/latest/validatingRDF/index.html#).

## Uitvoeren van het project

Indien je over een geldig NPM token beschikt, kan je het volledige project deployen door volgende stappen uit te voeren:
1. Plak het NPM-token in het `.env`-bestand na de tekst NPM_TOKEN=
1. Navigeer naar de map waarin het bestand `docker-compose.yml` staat en voer het commando `docker-compose up` uit. 

De validator is vervolgens beschikbaar op poort `8081`.
