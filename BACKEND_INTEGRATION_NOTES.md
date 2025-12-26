# 🔄 Notes d'Intégration Backend

## ⚠️ Différences système actuel vs implémentation

### Système Backend Actuel (Code fourni)

Le backend implémente un système de **sponsorisation par ProLocalisation** :

- **Prix** : 99€/mois par ProLocalisation
- **Concept** : Sponsoriser une localisation spécifique (sous-catégorie + ville)
- **Limite** : Max 5 sponsors par triplet (sous_categorie, ville, entreprise)
- **Endpoint** : `POST /billing/create-checkout-session/`
- **Paramètres requis** :
  ```json
  {
    "pro_localisation_id": "uuid",
    "duration_months": 1,
    "success_url": "url",
    "cancel_url": "url"
  }
  ```

### Implémentation Frontend Créée

J'ai créé un système de **plan Premium général** :

- **Prix** : 20€/mois pour l'entreprise (général)
- **Concept** : Abonnement Premium pour l'entreprise entière
- **Avantages** : Sponsoring + Rotations + Avis personnalisés + Stats
- **Page** : `/upgrade` après inscription
- **Non lié** : Pas de ProLocalisation spécifique

---

## 🎯 Solutions proposées

### Option 1 : Backend pour Plan Premium Général (RECOMMANDÉ)

Créer de nouveaux endpoints backend pour le plan Premium général :

```python
# Dans foxreviews/billing/views.py

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_premium_checkout_session(request):
    """
    Crée une session Stripe Checkout pour le plan Premium général (20€/mois).
    Pour l'entreprise entière, pas lié à une ProLocalisation.
    """
    success_url = request.data.get("success_url")
    cancel_url = request.data.get("cancel_url")
    
    if not all([success_url, cancel_url]):
        return Response(
            {"error": "Paramètres manquants"}, 
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        # Récupérer l'entreprise de l'utilisateur
        entreprise = request.user.entreprise  # À adapter selon votre modèle
        
        # Créer ou récupérer le Stripe Customer
        customer = get_or_create_stripe_customer(entreprise)
        
        # Créer la session Checkout pour le plan Premium
        checkout_session = stripe.checkout.Session.create(
            customer=customer.id,
            mode="subscription",
            line_items=[{
                "price": settings.STRIPE_PREMIUM_PRICE_ID,  # Prix 20€/mois
                "quantity": 1,
            }],
            metadata={
                "entreprise_id": str(entreprise.id),
                "plan_type": "premium",
            },
            success_url=success_url,
            cancel_url=cancel_url,
            subscription_data={
                "metadata": {
                    "entreprise_id": str(entreprise.id),
                    "plan_type": "premium",
                }
            },
        )
        
        return Response({
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id,
        })
    
    except stripe.error.StripeError as e:
        logger.exception(f"Stripe error: {e}")
        return Response(
            {"error": f"Erreur Stripe: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_premium_subscriptions(request):
    """
    Liste les abonnements Premium de l'utilisateur.
    """
    try:
        entreprise = request.user.entreprise
        
        # Récupérer les abonnements Premium (non liés à ProLocalisation)
        subscriptions = Subscription.objects.filter(
            entreprise=entreprise,
            pro_localisation__isnull=True,  # Plan Premium général
        ).order_by('-created_at')
        
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.exception(f"Erreur: {e}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
```

**URLs à ajouter :**
```python
# config/urls.py
urlpatterns = [
    path('billing/premium/create-checkout/', 
         create_premium_checkout_session, 
         name='premium-checkout'),
    
    path('billing/premium/subscriptions/', 
         list_premium_subscriptions, 
         name='premium-subscriptions'),
]
```

**Configuration Stripe :**
```python
# settings.py
STRIPE_PREMIUM_PRICE_ID = env('STRIPE_PREMIUM_PRICE_ID')  # price_xxx pour 20€/mois
STRIPE_SPONSORSHIP_PRICE_ID = env('STRIPE_SPONSORSHIP_PRICE_ID')  # price_xxx pour 99€/mois
```

**Webhooks à adapter :**
```python
def _handle_checkout_completed(session):
    """Gérer le checkout selon le type de plan."""
    metadata = session.get("metadata", {})
    plan_type = metadata.get("plan_type", "sponsorship")
    
    if plan_type == "premium":
        _handle_premium_checkout(session)
    else:
        _handle_sponsorship_checkout(session)


def _handle_premium_checkout(session):
    """Créer l'abonnement Premium pour l'entreprise."""
    metadata = session.get("metadata", {})
    entreprise_id = metadata.get("entreprise_id")
    
    stripe_subscription_id = session.get("subscription")
    stripe_customer_id = session.get("customer")
    stripe_checkout_session_id = session.get("id")
    
    try:
        entreprise = Entreprise.objects.get(id=entreprise_id)
        stripe_sub = stripe.Subscription.retrieve(stripe_subscription_id)
        
        # Créer la Subscription pour le plan Premium (sans ProLocalisation)
        subscription = Subscription.objects.create(
            entreprise=entreprise,
            pro_localisation=None,  # Plan général, pas de ProLocalisation
            stripe_customer_id=stripe_customer_id,
            stripe_subscription_id=stripe_subscription_id,
            stripe_checkout_session_id=stripe_checkout_session_id,
            status=stripe_sub.get("status", "active"),
            current_period_start=timezone.datetime.fromtimestamp(
                stripe_sub["current_period_start"],
                tz=timezone.utc,
            ),
            current_period_end=timezone.datetime.fromtimestamp(
                stripe_sub["current_period_end"],
                tz=timezone.utc,
            ),
            amount=20.00,  # 20€/mois
            currency="eur",
            metadata=metadata,
        )
        
        # Activer les features Premium pour l'entreprise
        entreprise.is_premium = True
        entreprise.premium_since = timezone.now()
        entreprise.save(update_fields=["is_premium", "premium_since"])
        
        logger.info(f"Plan Premium activé: Subscription {subscription.id}")
        
        # Envoyer email de confirmation
        SubscriptionEmailService.send_subscription_confirmation(
            subscription,
            customer_portal_url=f"{settings.FRONTEND_URL}/client/billing"
        )
    
    except Exception as e:
        logger.exception(f"Erreur premium checkout: {e}")
```

---

### Option 2 : Adapter le Frontend au Système Existant

Modifier la page `/upgrade` pour qu'elle propose la sponsorisation d'une ProLocalisation :

**Changements nécessaires :**

1. **Page Upgrade** : Afficher la liste des ProLocalisations de l'utilisateur
2. **Sélection** : L'utilisateur choisit quelle localisation sponsoriser
3. **Prix** : Afficher 99€/mois (pas 20€)
4. **Checkout** : Envoyer `pro_localisation_id` + `duration_months`

**Inconvénient** : Ne correspond pas à votre demande initiale d'un "plan Premium après inscription"

---

## 📋 Mise à jour du frontend actuel

J'ai adapté le code frontend pour être compatible avec votre backend actuel :

### Changements effectués :

1. **Types** (`src/types/billing.ts`) :
   ```typescript
   export interface StripeCheckoutSessionRequest {
     pro_localisation_id: UUID;  // Ajouté
     duration_months?: number;    // Ajouté
     success_url: string;
     cancel_url: string;
   }
   ```

2. **Service** (`src/services/stripe.service.ts`) :
   - Endpoint portal : `create-portal-session/` → `create-customer-portal-session/`
   - Réponse portal : `data.url` → `data.portal_url` (mapping)

### Ce qui reste à faire :

**Si vous choisissez Option 1 (RECOMMANDÉ)** :
- [ ] Créer les endpoints backend pour le plan Premium
- [ ] Créer le produit Stripe à 20€/mois
- [ ] Adapter les webhooks pour gérer les deux types de plans
- [ ] Tester le flux complet

**Si vous choisissez Option 2** :
- [ ] Modifier la page `/upgrade` pour lister les ProLocalisations
- [ ] Adapter le prix de 20€ à 99€
- [ ] Adapter la description des avantages
- [ ] Gérer la sélection de ProLocalisation

---

## 🎯 Recommandation

Je recommande **l'Option 1** car :

✅ Correspond à votre demande initiale (plan Premium après inscription)  
✅ Prix plus accessible (20€ vs 99€)  
✅ Simplicité pour l'utilisateur (pas de sélection)  
✅ Permet d'avoir deux systèmes parallèles :
   - Plan Premium général (20€/mois)
   - Sponsorisation par localisation (99€/mois)

---

## 📝 Prochaines étapes

1. **Décider** quelle option vous préférez
2. **Si Option 1** : Je peux vous fournir le code backend complet
3. **Si Option 2** : Je peux adapter le frontend actuel
4. **Tester** avec Stripe en mode test
5. **Déployer** en production

---

Quelle option préférez-vous ?
