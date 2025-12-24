import './Legal.css';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <h1 className="legal-title">À propos de FOX-REVIEWS</h1>
        
        <section className="legal-section">
          <h2>Notre Mission</h2>
          <p>
            FOX-REVIEWS est une plateforme innovante d'annuaire professionnel qui révolutionne 
            la façon dont vous trouvez et évaluez les entreprises locales. Notre mission est de 
            fournir transparence et confiance grâce à nos avis décryptés certifiés 5★.
          </p>
        </section>

        <section className="legal-section">
          <h2>Qu'est-ce qu'un avis décrypté ?</h2>
          <p>
            Un avis décrypté est un avis authentique provenant de plateformes reconnues 
            (Google, Trustpilot, Facebook, Yelp) que nous analysons et synthétisons pour 
            garantir sa fiabilité. Chaque avis affiché sur notre plateforme :
          </p>
          <ul>
            <li>Provient d'une source vérifiée</li>
            <li>Est noté 5★ minimum</li>
            <li>A été analysé par notre algorithme de confiance</li>
            <li>Indique clairement sa source d'origine</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Notre Approche de Sponsorisation</h2>
          <p>
            Pour assurer la visibilité des meilleures entreprises, nous proposons un système 
            de sponsorisation transparent :
          </p>
          <ul>
            <li>Les entreprises sponsorisées sont clairement identifiées par un badge</li>
            <li>Maximum 5 résultats sponsorisés par page de recherche</li>
            <li>Rotation équitable des entreprises non-sponsorisées</li>
            <li>Aucune manipulation des avis ou de la notation</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>Pourquoi Nous Faire Confiance ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Transparence</h3>
              <p>Toutes les sources d'avis sont clairement indiquées</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Fiabilité</h3>
              <p>Seulement des avis authentiques de 5★</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Performance</h3>
              <p>Recherche rapide et résultats pertinents</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Précision</h3>
              <p>Filtrage par catégorie, sous-catégorie et ville</p>
            </div>
          </div>
        </section>

        <section className="legal-section">
          <h2>Contact</h2>
          <p>
            Vous avez des questions ? N'hésitez pas à nous contacter via notre{' '}
            <Link to="/contact" className="legal-link">formulaire de contact</Link> ou à consulter notre{' '}
            <Link to="/faq" className="legal-link">FAQ</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
