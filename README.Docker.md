### Construire et exécuter votre application

Lorsque vous êtes prêt, démarrez votre application en exécutant :
`docker compose up --build`.

Votre application sera disponible à l'adresse http://localhost:3000.

### Déployer votre application dans le cloud

Tout d'abord, construisez votre image, par exemple : `docker build -t monapp .`.
Si votre cloud utilise une architecture CPU différente de celle de votre machine de développement (par exemple, vous êtes sur un Mac M1 et votre fournisseur cloud utilise amd64), vous devrez construire l'image pour cette plateforme, par exemple :
`docker build --platform=linux/amd64 -t monapp .`.

Ensuite, poussez l'image vers votre registre, par exemple : `docker push monregistre.com/monapp`.

Consultez la documentation [démarrage rapide de Docker](https://docs.docker.com/go/get-started-sharing/) pour plus de détails sur la construction et le push des images.

### Références
* [Guide Node.js de Docker](https://docs.docker.com/language/nodejs/)