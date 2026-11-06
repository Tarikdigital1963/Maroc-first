# Relais sécurisé Maroc First → Zapier

Ce dossier contient le relais serveur à déployer sur Cloudflare Workers. Le webhook Zapier n'est jamais placé dans le JavaScript public du site.

## Configuration nécessaire

1. Créer un Worker Cloudflare et publier le contenu de `worker.js`.
2. Créer un widget Cloudflare Turnstile pour le domaine `tarikdigital1963.github.io`.
3. Dans les variables/secrets du Worker, définir :
   - `ZAPIER_HOOK_URL` : URL Catch Hook Zapier (secret, ne pas publier).
   - `TURNSTILE_SECRET` : clé secrète Turnstile.
4. Conserver la clé publique Turnstile (site key) pour la partie visible du site.
5. Après déploiement, noter l'URL du Worker et la site key. Le formulaire du site pourra alors appeler le Worker avec une preuve Turnstile.

## Protection

- Le webhook Zapier reste dans un secret serveur.
- Le Worker n'accepte que l'origine GitHub Pages de Maroc First.
- Les requêtes doivent être POST et inclure un jeton Turnstile valide.
- Les articles transmis sont marqués `pending_manual_review`. Ce relais ne publie rien directement.

Important : le contrôle d'origine seul n'est pas une authentification. La vérification Turnstile côté serveur est donc obligatoire. Ne pas retirer cette vérification et ne jamais committer les valeurs secrètes dans GitHub.
