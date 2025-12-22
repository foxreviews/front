import './Legal.css';

export function MentionsLegales() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">Mentions Légales</h1>
        
        <section className="legal-section">
          <h2>1. Informations légales</h2>
          
          <h3>Éditeur du site</h3>
          <p>
            <strong>FOX-REVIEWS</strong><br />
            Société par Actions Simplifiée (SAS)<br />
            Capital social : 10 000 €<br />
            SIRET : 123 456 789 00010<br />
            RCS Paris B 123 456 789
          </p>

          <p>
            <strong>Siège social :</strong><br />
            123 Avenue de la République<br />
            75011 Paris, France
          </p>

          <p>
            <strong>Contact :</strong><br />
            Email : contact@fox-reviews.fr<br />
            Téléphone : +33 1 23 45 67 89
          </p>

          <h3>Directeur de la publication</h3>
          <p>Jean Dupont, Président de FOX-REVIEWS SAS</p>

          <h3>Hébergement</h3>
          <p>
            Ce site est hébergé par :<br />
            <strong>OVH</strong><br />
            2 rue Kellermann<br />
            59100 Roubaix, France<br />
            Téléphone : 1007
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos, vidéos, structure, graphisme) 
            est la propriété exclusive de FOX-REVIEWS, sauf mentions contraires. Toute reproduction, 
            distribution, modification, adaptation, retransmission ou publication, même partielle, 
            est strictement interdite sans l'autorisation écrite préalable de FOX-REVIEWS.
          </p>
          <p>
            Les marques, logos et signes distinctifs reproduits sur ce site sont la propriété de 
            FOX-REVIEWS ou font l'objet d'une autorisation d'utilisation. Toute reproduction non 
            autorisée constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants 
            du Code de la propriété intellectuelle.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Données personnelles</h2>
          <p>
            FOX-REVIEWS s'engage à protéger la confidentialité des données personnelles collectées 
            sur son site. Pour plus d'informations, veuillez consulter notre{' '}
            <a href="/politique-confidentialite" className="legal-link">
              Politique de confidentialité
            </a>.
          </p>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification, 
            de suppression et de portabilité de vos données personnelles.
          </p>
          <p>
            Pour exercer ces droits, contactez-nous à : <strong>dpo@fox-reviews.fr</strong>
          </p>
        </section>

        <section className="legal-section">
          <h2>4. Cookies</h2>
          <p>
            Ce site utilise des cookies pour améliorer l'expérience utilisateur, réaliser des 
            statistiques de visite et personnaliser le contenu. En poursuivant votre navigation, 
            vous acceptez l'utilisation de cookies conformément à notre politique.
          </p>
          <p>
            Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.
          </p>
        </section>

        <section className="legal-section">
          <h2>5. Responsabilité</h2>
          <p>
            FOX-REVIEWS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
            sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité 
            des informations mises à disposition.
          </p>
          <p>
            FOX-REVIEWS ne saurait être tenu responsable des erreurs, d'une absence de disponibilité 
            des informations et des services, ou de la présence de virus sur son site.
          </p>
          <p>
            Les avis décryptés publiés proviennent de sources tierces (Google, Trustpilot, Facebook, Yelp). 
            Bien que nous vérifions leur authenticité, FOX-REVIEWS ne peut être tenu responsable de leur 
            contenu exact. La source originale est toujours indiquée pour permettre la vérification.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Liens hypertextes</h2>
          <p>
            Ce site peut contenir des liens vers des sites tiers. FOX-REVIEWS n'exerce aucun contrôle 
            sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>
          <p>
            La mise en place d'un lien hypertexte vers le site FOX-REVIEWS nécessite une autorisation 
            préalable écrite.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. En cas de litige, 
            et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
          </p>
        </section>

        <section className="legal-section">
          <h2>8. Contact</h2>
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par email : contact@fox-reviews.fr</li>
            <li>Par téléphone : +33 1 23 45 67 89</li>
            <li>Par courrier : FOX-REVIEWS SAS, 123 Avenue de la République, 75011 Paris</li>
            <li>Via notre <a href="/contact" className="legal-link">formulaire de contact</a></li>
          </ul>
        </section>

        <p className="legal-footer">
          <small>Dernière mise à jour : 22 décembre 2025</small>
        </p>
      </div>
    </div>
  );
}
