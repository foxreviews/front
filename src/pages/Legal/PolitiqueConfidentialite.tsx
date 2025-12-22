import './Legal.css';

export function PolitiqueConfidentialite() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Politique de Confidentialité</h1>
        
        <p className="legal-intro">
          Dernière mise à jour : 22 décembre 2025
        </p>

        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            FOX-REVIEWS s'engage à protéger la confidentialité et la sécurité de vos données 
            personnelles. Cette politique explique comment nous collectons, utilisons, stockons 
            et protégeons vos informations conformément au Règlement Général sur la Protection 
            des Données (RGPD) et à la loi « Informatique et Libertés ».
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Responsable du traitement</h2>
          <p>
            <strong>FOX-REVIEWS SAS</strong><br />
            123 Avenue de la République<br />
            75011 Paris, France<br />
            Email : dpo@fox-reviews.fr<br />
            SIRET : 123 456 789 00010
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Données collectées</h2>
          
          <h3>3.1 Pour les visiteurs (non-inscrits)</h3>
          <ul>
            <li>Données de navigation (cookies, adresse IP, pages consultées)</li>
            <li>Données de recherche (termes recherchés, filtres appliqués)</li>
            <li>Données techniques (navigateur, système d'exploitation, résolution écran)</li>
          </ul>

          <h3>3.2 Pour les entreprises clientes (compte professionnel)</h3>
          <ul>
            <li><strong>Identification :</strong> Nom, prénom, email, téléphone</li>
            <li><strong>Entreprise :</strong> SIREN/SIRET, raison sociale, adresse, secteur d'activité</li>
            <li><strong>Connexion :</strong> Login, mot de passe (crypté)</li>
            <li><strong>Facturation :</strong> Coordonnées de facturation, historique des paiements</li>
            <li><strong>Utilisation :</strong> Statistiques (vues, clics), avis uploadés, modifications du profil</li>
          </ul>

          <h3>3.3 Formulaire de contact</h3>
          <ul>
            <li>Nom, email, sujet, message</li>
            <li>Date et heure de soumission</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Finalités du traitement</h2>
          <p>Vos données sont collectées pour les finalités suivantes :</p>
          
          <h3>4.1 Visiteurs</h3>
          <ul>
            <li>Assurer le fonctionnement du site</li>
            <li>Améliorer l'expérience utilisateur</li>
            <li>Réaliser des statistiques de fréquentation</li>
            <li>Personnaliser le contenu (cookies)</li>
          </ul>

          <h3>4.2 Clients entreprises</h3>
          <ul>
            <li>Gérer votre compte et votre fiche entreprise</li>
            <li>Traiter vos abonnements et paiements</li>
            <li>Fournir les services de sponsorisation</li>
            <li>Vous envoyer des notifications importantes (factures, expirations)</li>
            <li>Analyser l'utilisation de nos services (statistiques)</li>
            <li>Assurer le support client</li>
          </ul>

          <h3>4.3 Marketing (avec consentement)</h3>
          <ul>
            <li>Newsletters et actualités</li>
            <li>Offres promotionnelles</li>
            <li>Enquêtes de satisfaction</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Base légale du traitement</h2>
          <p>Le traitement de vos données repose sur :</p>
          <ul>
            <li><strong>Exécution du contrat</strong> : gestion du compte, facturation, services</li>
            <li><strong>Consentement</strong> : cookies non-essentiels, marketing</li>
            <li><strong>Intérêt légitime</strong> : sécurité, amélioration du service, statistiques</li>
            <li><strong>Obligation légale</strong> : conservation des données de facturation</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>6. Destinataires des données</h2>
          <p>Vos données peuvent être transmises à :</p>
          <ul>
            <li><strong>Personnel autorisé</strong> : équipes techniques, support, comptabilité</li>
            <li><strong>Prestataires techniques</strong> : hébergement (OVH), paiement (Stripe), emails</li>
            <li><strong>Autorités</strong> : sur demande légale (police, justice, fiscalité)</li>
          </ul>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins commerciales.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Transfert hors UE</h2>
          <p>
            Certains prestataires peuvent être situés hors de l'Union Européenne. Dans ce cas, 
            nous veillons à ce que des garanties appropriées soient mises en place (clauses 
            contractuelles types, Privacy Shield, etc.).
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Durée de conservation</h2>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Type de données</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Compte client actif</td>
                <td>Pendant la durée de la relation contractuelle</td>
              </tr>
              <tr>
                <td>Compte client inactif</td>
                <td>3 ans après dernière activité</td>
              </tr>
              <tr>
                <td>Données de facturation</td>
                <td>10 ans (obligation légale)</td>
              </tr>
              <tr>
                <td>Cookies analytics</td>
                <td>13 mois maximum</td>
              </tr>
              <tr>
                <td>Logs de connexion</td>
                <td>1 an</td>
              </tr>
              <tr>
                <td>Formulaire de contact</td>
                <td>3 ans</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="legal-section">
          <h2>9. Sécurité des données</h2>
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :</p>
          <ul>
            <li>Chiffrement SSL/TLS pour toutes les communications</li>
            <li>Mots de passe cryptés (hachage bcrypt)</li>
            <li>Accès restreint aux données (principe du moindre privilège)</li>
            <li>Sauvegardes régulières et sécurisées</li>
            <li>Surveillance et journalisation des accès</li>
            <li>Mise à jour régulière des systèmes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>10. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          
          <h3>10.1 Droit d'accès</h3>
          <p>Vous pouvez demander une copie de toutes vos données personnelles.</p>

          <h3>10.2 Droit de rectification</h3>
          <p>Vous pouvez corriger vos données inexactes ou incomplètes.</p>

          <h3>10.3 Droit à l'effacement ("droit à l'oubli")</h3>
          <p>Vous pouvez demander la suppression de vos données dans certaines conditions.</p>

          <h3>10.4 Droit à la limitation du traitement</h3>
          <p>Vous pouvez demander de limiter l'utilisation de vos données.</p>

          <h3>10.5 Droit à la portabilité</h3>
          <p>Vous pouvez récupérer vos données dans un format structuré et réutilisable.</p>

          <h3>10.6 Droit d'opposition</h3>
          <p>Vous pouvez vous opposer au traitement de vos données (marketing, profilage).</p>

          <h3>10.7 Droit de retirer votre consentement</h3>
          <p>Vous pouvez retirer votre consentement à tout moment (cookies, newsletter).</p>

          <h3>10.8 Comment exercer vos droits ?</h3>
          <p>
            Pour exercer vos droits, contactez notre Délégué à la Protection des Données :
          </p>
          <ul>
            <li>Email : <strong>dpo@fox-reviews.fr</strong></li>
            <li>Courrier : FOX-REVIEWS SAS - DPO, 123 Avenue de la République, 75011 Paris</li>
          </ul>
          <p>
            Nous répondons dans un délai maximum de 1 mois. Une pièce d'identité peut être demandée 
            pour vérifier votre identité.
          </p>

          <h3>10.9 Droit de réclamation</h3>
          <p>
            Vous pouvez introduire une réclamation auprès de la CNIL :<br />
            <strong>Commission Nationale de l'Informatique et des Libertés</strong><br />
            3 Place de Fontenoy - TSA 80715<br />
            75334 Paris Cedex 07<br />
            Téléphone : 01 53 73 22 22<br />
            Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="legal-link">www.cnil.fr</a>
          </p>
        </section>

        <section className="legal-section">
          <h2>11. Cookies</h2>
          
          <h3>11.1 Types de cookies utilisés</h3>
          
          <h4>Cookies essentiels (obligatoires)</h4>
          <ul>
            <li>Authentification (session utilisateur)</li>
            <li>Sécurité (protection CSRF)</li>
            <li>Préférences de langue</li>
          </ul>

          <h4>Cookies analytics (avec consentement)</h4>
          <ul>
            <li>Google Analytics : statistiques de fréquentation</li>
            <li>Mesure d'audience anonyme</li>
          </ul>

          <h4>Cookies marketing (avec consentement)</h4>
          <ul>
            <li>Publicités ciblées</li>
            <li>Réseaux sociaux (Facebook Pixel, etc.)</li>
          </ul>

          <h3>11.2 Gestion des cookies</h3>
          <p>
            Vous pouvez gérer vos préférences de cookies via le bandeau de consentement ou dans 
            les paramètres de votre navigateur. Le refus de certains cookies peut limiter l'accès 
            à certaines fonctionnalités.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Mineurs</h2>
          <p>
            Nos services ne sont pas destinés aux mineurs de moins de 18 ans. Nous ne collectons 
            pas sciemment de données auprès de mineurs. Si vous êtes parent et constatez qu'un 
            mineur a créé un compte, contactez-nous pour le faire supprimer.
          </p>
        </section>

        <section className="legal-section">
          <h2>13. Modifications de cette politique</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité à tout moment. Les changements 
            importants seront notifiés par email aux clients. La date de dernière mise à jour est 
            indiquée en haut de ce document.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Contact</h2>
          <p>Pour toute question relative à la protection de vos données :</p>
          <ul>
            <li><strong>Délégué à la Protection des Données (DPO)</strong> : dpo@fox-reviews.fr</li>
            <li><strong>Service client</strong> : contact@fox-reviews.fr</li>
            <li><strong>Téléphone</strong> : +33 1 23 45 67 89</li>
            <li><a href="/contact" className="legal-link">Formulaire de contact</a></li>
          </ul>
        </section>

        <p className="legal-footer">
          <small>Politique de confidentialité en vigueur au 22 décembre 2025</small>
        </p>
      </div>
    </div>
  );
}
