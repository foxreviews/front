# 🎯 Instructions de Mise en Œuvre - Stripe Integration

## Pour le développeur Backend

Voici ce qui a été implémenté côté frontend et ce que vous devez faire côté backend.

---

## ✅ Ce qui est déjà fait (Frontend)

### 1. Pages créées
- ✅ **`/upgrade`** : Page de présentation du plan Premium (20€ HT/mois)
- ✅ **`/payment-success`** : Page de confirmation après paiement réussi
- ✅ **Modification de `/register`** : Redirige automatiquement vers `/upgrade` après inscription

### 2. Services et Hooks
- ✅ **`stripeService`** : Gère les appels API vers votre backend
- ✅ **`useStripe()`** : Hook React pour faciliter l'utilisation

### 3. Composants
- ✅ **`<PremiumBadge />`** : Badge à afficher pour les comptes Premium
- ✅ **`<StripePortalButton />`** : Bouton pour accéder au portail de gestion Stripe

---

## 🔧 Ce que vous devez implémenter (Backend)

### 1. Endpoint : Créer une session Checkout

**URL :** `POST /api/billing/create-checkout-session/`

**Headers requis :**
```
Authorization: Token <user_token>
Content-Type: application/json
```

**Body (envoyé par le frontend) :**
```json
{
  "success_url": "https://votre-domaine.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://votre-domaine.com/upgrade?payment=cancelled"
}
```

**Réponse attendue (200) :**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "session_id": "cs_test_..."
}
```

**Code Python exemple :**
```python
import stripe
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    success_url = request.data.get('success_url')
    cancel_url = request.data.get('cancel_url')
    
    # Récupérer ou créer le customer Stripe
    user = request.user
    entreprise = user.entreprise
    
    if not entreprise.stripe_customer_id:
        customer = stripe.Customer.create(
            email=user.email,
            name=entreprise.nom
        )
        entreprise.stripe_customer_id = customer.id
        entreprise.save()
    
    # Créer la session
    session = stripe.checkout.Session.create(
        customer=entreprise.stripe_customer_id,
        payment_method_types=['card'],
        line_items=[{
            'price': settings.STRIPE_PRICE_ID,  # Prix 20€/mois
            'quantity': 1,
        }],
        mode='subscription',
        success_url=success_url,
        cancel_url=cancel_url,
    )
    
    return Response({
        'checkout_url': session.url,
        'session_id': session.id
    })
```

---

### 2. Endpoint : Créer une session Portail Client

**URL :** `POST /api/billing/create-portal-session/`

**Headers requis :**
```
Authorization: Token <user_token>
Content-Type: application/json
```

**Body (envoyé par le frontend) :**
```json
{
  "return_url": "https://votre-domaine.com/client/billing"
}
```

**Réponse attendue (200) :**
```json
{
  "portal_url": "https://billing.stripe.com/p/session/test_..."
}
```

**Code Python exemple :**
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_portal_session(request):
    return_url = request.data.get('return_url')
    entreprise = request.user.entreprise
    
    if not entreprise.stripe_customer_id:
        return Response(
            {'error': 'Aucun abonnement Stripe trouvé'},
            status=400
        )
    
    session = stripe.billing_portal.Session.create(
        customer=entreprise.stripe_customer_id,
        return_url=return_url,
    )
    
    return Response({
        'portal_url': session.url
    })
```

---

### 3. Endpoint : Liste des abonnements

**URL :** `GET /api/billing/api/subscriptions/`

**Headers requis :**
```
Authorization: Token <user_token>
```

**Réponse attendue (200) :**
```json
[
  {
    "id": "uuid",
    "entreprise": "uuid",
    "entreprise_nom": "Ma Société",
    "stripe_customer_id": "cus_xxx",
    "stripe_subscription_id": "sub_xxx",
    "status": "active",
    "current_period_start": "2024-01-01T00:00:00Z",
    "current_period_end": "2024-02-01T00:00:00Z",
    "cancel_at_period_end": false,
    "amount": 2000,
    "currency": "eur",
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### 4. Webhooks Stripe

**URL :** `POST /api/webhooks/stripe/`

**Events à gérer :**

#### a. `checkout.session.completed`
Appelé quand le paiement est validé.

**Action :**
1. Créer un objet `Subscription` dans votre BDD
2. Envoyer un email de confirmation

#### b. `invoice.payment_succeeded`
Appelé quand un paiement récurrent réussit.

**Action :**
1. Créer une `Invoice` dans votre BDD
2. Envoyer un email avec la facture PDF

#### c. `invoice.payment_failed`
Appelé quand un paiement échoue.

**Action :**
1. Mettre à jour le statut de l'abonnement
2. Envoyer un email d'alerte

#### d. `customer.subscription.deleted`
Appelé quand l'abonnement est annulé.

**Action :**
1. Mettre à jour le statut dans la BDD
2. Envoyer un email de confirmation d'annulation

**Code Python exemple :**
```python
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    
    # Gérer les events
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)
    
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        handle_payment_succeeded(invoice)
    
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        handle_payment_failed(invoice)
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_deleted(subscription)
    
    return JsonResponse({'status': 'success'})
```

---

## 🔐 Configuration Stripe

### 1. Créer le produit Premium

Dans votre dashboard Stripe :

1. Aller sur **Products** → **Add product**
2. Remplir :
   - **Name :** Plan Premium FOX-Reviews
   - **Description :** Sponsoring + Rotations dynamiques + Avis personnalisés + Statistiques
3. Ajouter un prix :
   - **Price :** 20.00 EUR
   - **Billing :** Recurring
   - **Interval :** Monthly
   - **Tax :** HT (Hors Taxe)
4. Copier le **Price ID** (ex: `price_xxx`)

### 2. Configurer les webhooks

1. Aller sur **Developers** → **Webhooks**
2. Cliquer sur **Add endpoint**
3. Remplir :
   - **Endpoint URL :** `https://votre-domaine.com/api/webhooks/stripe/`
   - **Events to send :**
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Copier le **Signing secret** (ex: `whsec_xxx`)

### 3. Variables d'environnement

Ajouter dans votre fichier `.env` :

```env
STRIPE_SECRET_KEY=sk_test_xxx  # Clé secrète Stripe
STRIPE_WEBHOOK_SECRET=whsec_xxx  # Secret webhook
STRIPE_PRICE_ID=price_xxx  # ID du prix 20€/mois
```

---

## 📋 Checklist d'implémentation

### Backend
- [ ] Installer `stripe` package Python (`pip install stripe`)
- [ ] Créer endpoint `create-checkout-session`
- [ ] Créer endpoint `create-portal-session`
- [ ] Créer endpoint `list subscriptions`
- [ ] Implémenter webhook handler
- [ ] Créer modèles `Subscription` et `Invoice`
- [ ] Implémenter emails de confirmation
- [ ] Ajouter tests unitaires

### Stripe
- [ ] Créer produit "Plan Premium" (20€/mois)
- [ ] Configurer les webhooks
- [ ] Tester avec cartes de test
- [ ] Configurer Customer Portal
- [ ] Vérifier les templates d'emails

### Base de données
- [ ] Ajouter champ `stripe_customer_id` à `Entreprise`
- [ ] Créer table `Subscription`
- [ ] Créer table `Invoice`
- [ ] Migrations Django

### Tests
- [ ] Tester création de session checkout
- [ ] Tester portail client
- [ ] Tester webhooks en local (Stripe CLI)
- [ ] Tester avec cartes de test
- [ ] Tester annulation d'abonnement

---

## 🧪 Tests avec Stripe CLI

### Installation
```bash
# macOS / Linux
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe
```

### Tester les webhooks localement
```bash
# Se connecter
stripe login

# Forward webhooks vers localhost
stripe listen --forward-to localhost:8000/api/webhooks/stripe/

# Dans un autre terminal, trigger un event
stripe trigger checkout.session.completed
```

### Cartes de test

```
Succès:              4242 4242 4242 4242
Refusée:             4000 0000 0000 0002
Insufficient funds:  4000 0000 0000 9995
3D Secure:           4000 0027 6000 3184

Date: N'importe quelle date future
CVC: N'importe quel 3 chiffres
```

---

## 📞 Points de contact

Si vous avez des questions sur l'implémentation :

1. **Documentation Stripe :**
   - [Checkout](https://stripe.com/docs/payments/checkout)
   - [Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
   - [Webhooks](https://stripe.com/docs/webhooks)

2. **Documentation du projet :**
   - `STRIPE_INTEGRATION_FRONTEND.md` - Détails techniques
   - `BACKEND_API_REFERENCE.md` - Exemples de code backend
   - `STRIPE_SETUP_GUIDE.md` - Guide d'utilisation

3. **Tester l'intégration :**
   - Frontend : Utiliser `npm run dev`
   - Backend : Utiliser Stripe CLI pour simuler webhooks

---

## 🚀 Ordre de mise en œuvre recommandé

1. **Jour 1 : Configuration Stripe**
   - Créer le produit Premium (20€/mois)
   - Configurer les webhooks
   - Tester avec Stripe CLI

2. **Jour 2 : Backend API**
   - Créer endpoint checkout session
   - Créer endpoint portal session
   - Créer endpoint liste abonnements

3. **Jour 3 : Webhooks**
   - Implémenter le handler de webhooks
   - Tester chaque event
   - Implémenter les emails

4. **Jour 4 : Tests**
   - Tester le flux complet
   - Tester avec cartes de test
   - Vérifier les emails

5. **Jour 5 : Production**
   - Passer en mode production Stripe
   - Déployer le backend
   - Monitorer les premiers paiements

---

## ✅ Validation finale

Avant de passer en production, vérifier :

- [ ] Tous les endpoints API fonctionnent
- [ ] Les webhooks sont reçus et traités
- [ ] Les emails sont envoyés correctement
- [ ] Le Customer Portal fonctionne
- [ ] Les factures PDF sont générées
- [ ] L'annulation d'abonnement fonctionne
- [ ] Les variables d'environnement sont configurées
- [ ] HTTPS est activé en production

---

**Bonne implémentation ! 🚀**

Le frontend est 100% prêt et n'attend que votre backend pour fonctionner.
