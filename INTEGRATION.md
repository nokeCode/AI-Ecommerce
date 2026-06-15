# Configuration Backend-Frontend

## Démarrage du projet

### 1. Backend (Node.js + Express + MongoDB)

#### Configuration
```bash
cd backend

# Copier le fichier .env.example et configurer les variables
cp .env.example .env

# Installer les dépendances
npm install
```

#### Variables d'environnement (backend/.env)
```
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=5000
```

#### Démarrage
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur démarre sur `http://localhost:5000`

### 2. Frontend (Next.js)

#### Configuration
```bash
cd frontend

# Copier le fichier .env.example et configurer les variables
cp .env.example .env.local

# Installer les dépendances
npm install
```

#### Variables d'environnement (frontend/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Démarrage
```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

L'application démarre sur `http://localhost:3000`

## Architecture API

### Endpoints disponibles

#### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit par ID

#### Recherche
- `POST /api/search` - Recherche sémantique
  - Body: `{ query: string }`

#### Commandes
- `POST /api/orders` - Créer une commande
  - Body: Détails de la commande
- `GET /api/orders/:id` - Récupérer une commande par ID

## Structure des Services (Frontend)

### Services disponibles
- `productService.ts` - Gestion des produits
- `searchService.ts` - Recherche sémantique
- `orderService.ts` - Gestion des commandes
- `apiClient.ts` - Client HTTP générique

### Utilisation
```typescript
import { getProducts, getProductById } from "@/services/productService";
import { semanticSearch } from "@/services/searchService";
import { createOrder, getOrderById } from "@/services/orderService";

// Exemples
const products = await getProducts();
const product = await getProductById("123");
const results = await semanticSearch("montre elegante");
const order = await createOrder(orderData);
```

## Points d'intégration

### Pages utilisant l'API
- `app/page.tsx` - Page d'accueil (charge featured products)
- `app/products/page.tsx` - Liste des produits (charge tous les produits)
- `app/product/[id]/page.tsx` - Détail produit (charge produit + produits liés)
- `components/SearchBar.tsx` - Recherche (utilise recherche sémantique)

### Fallback
Toutes les pages implémentent un fallback vers les données locales (`data/products.ts`) en cas d'erreur API, pour permettre le développement sans backend.

## Troubleshooting

### Erreur: Connection refused sur port 5000
- Assurez-vous que le backend est lancé: `npm run dev` dans le dossier `backend`

### Erreur: MongoDB connection failed
- Vérifiez que MongoDB est lancé
- Vérifiez la variable `MONGODB_URI` dans `backend/.env`

### Produits ne se chargent pas
- Vérifiez que `NEXT_PUBLIC_API_URL` est correct dans `frontend/.env.local`
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez les logs du backend
