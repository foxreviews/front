# Backend API - Exemples de réponses attendues

Ce document décrit les réponses attendues des endpoints backend pour l'intégration Stripe.

## Endpoints requis

### 1. Création de session Checkout

**Endpoint:** `POST /api/billing/create-checkout-session/`

**Request:**
```json
{
  "success_url": "https://foxreviews.com/payment-success?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://foxreviews.com/upgrade?payment=cancelled"
}
```

**Response (200):**
```json
{
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_xxx...",
  "session_id": "cs_test_xxx..."
}
```

**Response (400):**
```json
{
  "error": "URLs invalides ou manquantes"
}
```

**Response (401):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Exemple d'implémentation Django:**
```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import stripe

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """
    Crée une session Stripe Checkout pour l'abonnement Premium (20€ HT/mois)
    """
    success_url = request.data.get('success_url')
    cancel_url = request.data.get('cancel_url')
    
    if not success_url or not cancel_url:
        return Response(
            {'error': 'success_url et cancel_url sont requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Récupérer ou créer le client Stripe
        user = request.user
        entreprise = user.entreprise
        
        if not entreprise.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=entreprise.nom,
                metadata={
                    'entreprise_id': str(entreprise.id),
                    'user_id': str(user.id)
                }
            )
            entreprise.stripe_customer_id = customer.id
            entreprise.save()
        
        # Créer la session Checkout
        checkout_session = stripe.checkout.Session.create(
            customer=entreprise.stripe_customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': settings.STRIPE_PRICE_ID,  # Prix 20€ HT/mois
                'quantity': 1,
            }],
            mode='subscription',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'entreprise_id': str(entreprise.id),
                'user_id': str(user.id)
            }
        )
        
        return Response({
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        })
        
    except stripe.error.StripeError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
```

---

### 2. Création de session Portal

**Endpoint:** `POST /api/billing/create-portal-session/`

**Request:**
```json
{
  "return_url": "https://foxreviews.com/client/billing"
}
```

**Response (200):**
```json
{
  "portal_url": "https://billing.stripe.com/p/session/test_xxx..."
}
```

**Response (400):**
```json
{
  "error": "Aucun client Stripe trouvé pour cet utilisateur"
}
```

**Exemple d'implémentation Django:**
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_portal_session(request):
    """
    Crée une session Stripe Customer Portal
    Permet au client de gérer son abonnement, paiements, factures
    """
    return_url = request.data.get('return_url')
    
    if not return_url:
        return Response(
            {'error': 'return_url est requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = request.user
        entreprise = user.entreprise
        
        if not entreprise.stripe_customer_id:
            return Response(
                {'error': 'Aucun abonnement Stripe trouvé'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer la session Portal
        portal_session = stripe.billing_portal.Session.create(
            customer=entreprise.stripe_customer_id,
            return_url=return_url,
        )
        
        return Response({
            'portal_url': portal_session.url
        })
        
    except stripe.error.StripeError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
```

---

### 3. Liste des abonnements

**Endpoint:** `GET /api/billing/api/subscriptions/`

**Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "entreprise": "550e8400-e29b-41d4-a716-446655440001",
    "entreprise_nom": "Ma Super Entreprise",
    "stripe_customer_id": "cus_xxx",
    "stripe_subscription_id": "sub_xxx",
    "stripe_checkout_session_id": "cs_test_xxx",
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

**Exemple d'implémentation Django:**
```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class SubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour les abonnements
    Liste et détails des abonnements de l'utilisateur
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionSerializer
    
    def get_queryset(self):
        return Subscription.objects.filter(
            entreprise=self.request.user.entreprise
        ).order_by('-created_at')
```

---

### 4. Webhooks Stripe

**Endpoint:** `POST /api/webhooks/stripe/`

**Events à gérer:**

#### checkout.session.completed
```python
def handle_checkout_completed(session):
    """
    Appelé quand le paiement est réussi
    """
    entreprise_id = session.metadata.get('entreprise_id')
    
    # Créer ou mettre à jour l'abonnement
    subscription = Subscription.objects.create(
        entreprise_id=entreprise_id,
        stripe_subscription_id=session.subscription,
        stripe_checkout_session_id=session.id,
        status='active',
        # ... autres champs
    )
    
    # Envoyer email de confirmation
    send_subscription_confirmation_email(subscription)
```

#### invoice.payment_succeeded
```python
def handle_payment_succeeded(invoice):
    """
    Appelé quand un paiement récurrent réussit
    """
    # Créer la facture dans la base de données
    Invoice.objects.create(
        stripe_invoice_id=invoice.id,
        amount=invoice.amount_paid,
        status='paid',
        # ... autres champs
    )
    
    # Envoyer email avec facture
    send_payment_success_email(invoice)
```

#### invoice.payment_failed
```python
def handle_payment_failed(invoice):
    """
    Appelé quand un paiement échoue
    """
    # Mettre à jour le statut
    subscription = Subscription.objects.get(
        stripe_subscription_id=invoice.subscription
    )
    subscription.status = 'past_due'
    subscription.save()
    
    # Envoyer email d'alerte
    send_payment_failed_email(subscription)
```

#### customer.subscription.deleted
```python
def handle_subscription_deleted(subscription_stripe):
    """
    Appelé quand l'abonnement est annulé
    """
    subscription = Subscription.objects.get(
        stripe_subscription_id=subscription_stripe.id
    )
    subscription.status = 'canceled'
    subscription.ended_at = timezone.now()
    subscription.save()
    
    # Envoyer email de confirmation d'annulation
    send_subscription_canceled_email(subscription)
```

---

## Configuration Stripe

### 1. Créer le produit Premium

Dans le dashboard Stripe:

1. **Products** → **Add product**
2. Nom: "Plan Premium FOX-Reviews"
3. Description: "Sponsoring + Rotations dynamiques + Avis personnalisés"
4. **Pricing**:
   - Prix: 20.00 EUR
   - Type: Recurring
   - Billing period: Monthly
   - Taxe: HT (Add tax when applicable)

5. Copier le **Price ID** → `price_xxx`

### 2. Configurer les webhooks

1. **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://votre-domaine.com/api/webhooks/stripe/`
3. Events to send:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copier le **Webhook signing secret** → `whsec_xxx`

### 3. Variables d'environnement

```python
# settings.py
STRIPE_SECRET_KEY = env('STRIPE_SECRET_KEY')  # sk_xxx
STRIPE_WEBHOOK_SECRET = env('STRIPE_WEBHOOK_SECRET')  # whsec_xxx
STRIPE_PRICE_ID = env('STRIPE_PRICE_ID')  # price_xxx
```

---

## URLs Django

```python
# config/urls.py
from django.urls import path, include
from foxreviews.billing import views

urlpatterns = [
    # Stripe Checkout & Portal
    path('api/billing/create-checkout-session/', 
         views.create_checkout_session, 
         name='create-checkout-session'),
    
    path('api/billing/create-portal-session/', 
         views.create_portal_session, 
         name='create-portal-session'),
    
    # Abonnements API
    path('api/billing/api/', include('foxreviews.billing.urls')),
    
    # Webhooks
    path('api/webhooks/stripe/', 
         views.stripe_webhook, 
         name='stripe-webhook'),
]
```

---

## Modèles Django

### Subscription
```python
class Subscription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=255)
    stripe_subscription_id = models.CharField(max_length=255, unique=True)
    stripe_checkout_session_id = models.CharField(max_length=255, blank=True)
    
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('incomplete', 'Incomplete'),
    ])
    
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    cancel_at_period_end = models.BooleanField(default=False)
    
    amount = models.IntegerField()  # Centimes
    currency = models.CharField(max_length=3, default='eur')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def is_active(self):
        return self.status == 'active' and not self.cancel_at_period_end
```

---

## Tests

### Test de création de session checkout
```python
import pytest
from django.test import Client

@pytest.mark.django_db
def test_create_checkout_session(authenticated_client):
    response = authenticated_client.post('/api/billing/create-checkout-session/', {
        'success_url': 'https://example.com/success',
        'cancel_url': 'https://example.com/cancel'
    })
    
    assert response.status_code == 200
    assert 'checkout_url' in response.json()
    assert 'session_id' in response.json()
```

### Test de création de session portal
```python
@pytest.mark.django_db
def test_create_portal_session(authenticated_client_with_subscription):
    response = authenticated_client_with_subscription.post(
        '/api/billing/create-portal-session/', 
        {'return_url': 'https://example.com/billing'}
    )
    
    assert response.status_code == 200
    assert 'portal_url' in response.json()
```

---

## Checklist d'implémentation

- [ ] Créer les endpoints API
- [ ] Implémenter les webhooks
- [ ] Créer le produit Stripe (20€/mois)
- [ ] Configurer les webhooks Stripe
- [ ] Tester avec cartes de test
- [ ] Implémenter les emails de confirmation
- [ ] Tester le Customer Portal
- [ ] Vérifier la génération des factures
- [ ] Tester l'annulation d'abonnement
- [ ] Monitorer les logs Stripe

---

**✅ Backend prêt pour l'intégration Stripe !**
