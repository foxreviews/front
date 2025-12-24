import { useState } from 'react';
import './Legal.css';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'avis' | 'sponsorship' | 'account';
}

const faqData: FAQItem[] = [
  // Général
  {
    id: 1,
    category: 'general',
    question: 'Qu\'est-ce que FOX-REVIEWS ?',
    answer: 'FOX-REVIEWS est un annuaire professionnel innovant qui vous aide à trouver les meilleures entreprises locales grâce à des avis décryptés certifiés 5★. Nous collectons, vérifions et synthétisons les avis provenant de sources fiables pour vous garantir transparence et confiance.'
  },
  {
    id: 2,
    category: 'general',
    question: 'Comment fonctionne la recherche ?',
    answer: 'Vous pouvez rechercher des professionnels par catégorie (plombier, électricien...), sous-catégorie, et ville. Notre système affiche les entreprises sponsorisées en premier (max 5), puis les résultats organiques en rotation automatique pour garantir l\'équité.'
  },
  {
    id: 3,
    category: 'general',
    question: 'Le service est-il gratuit ?',
    answer: 'Oui ! L\'utilisation de FOX-REVIEWS est 100% gratuite pour les visiteurs. Seules les entreprises qui souhaitent sponsoriser leur fiche payent un abonnement mensuel pour bénéficier d\'une visibilité prioritaire.'
  },
  
  // Avis
  {
    id: 4,
    category: 'avis',
    question: 'Qu\'est-ce qu\'un "avis décrypté" ?',
    answer: 'Un avis décrypté est un avis authentique provenant de plateformes reconnues (Google, Trustpilot, Facebook, Yelp) que nous analysons avec notre algorithme. Nous ne publions que les avis 5★ vérifiés, en indiquant clairement leur source d\'origine et leur score de confiance.'
  },
  {
    id: 5,
    category: 'avis',
    question: 'Pourquoi seulement des avis 5★ ?',
    answer: 'Notre mission est de mettre en avant l\'excellence. Nous ne publions que des avis 5★ pour garantir que vous trouvez les meilleurs professionnels. Cela encourage également les entreprises à maintenir un haut niveau de qualité de service.'
  },
  {
    id: 6,
    category: 'avis',
    question: 'D\'où proviennent les avis ?',
    answer: 'Nous collectons les avis depuis Google Reviews, Trustpilot, Facebook et Yelp. Chaque avis affiché mentionne clairement sa source d\'origine et un lien vers l\'avis original pour une transparence totale.'
  },
  {
    id: 7,
    category: 'avis',
    question: 'Les avis peuvent-ils être faux ?',
    answer: 'Non. Nous utilisons un système de vérification rigoureux avec un score de confiance pour chaque avis. Seuls les avis authentiques provenant de sources certifiées et ayant un score de confiance élevé sont publiés sur notre plateforme.'
  },

  // Sponsorisation
  {
    id: 8,
    category: 'sponsorship',
    question: 'Qu\'est-ce que la sponsorisation ?',
    answer: 'La sponsorisation permet à votre entreprise d\'apparaître en tête des résultats de recherche avec un badge "Sponsorisé". Cela augmente votre visibilité et génère plus de clics vers votre fiche, tout en restant transparent pour les utilisateurs.'
  },
  {
    id: 9,
    category: 'sponsorship',
    question: 'Combien coûte la sponsorisation ?',
    answer: 'Les tarifs de sponsorisation varient selon la catégorie et la ville. Connectez-vous à votre espace client ou contactez-nous pour obtenir un devis personnalisé adapté à vos besoins.'
  },
  {
    id: 10,
    category: 'sponsorship',
    question: 'Combien d\'entreprises sponsorisées par page ?',
    answer: 'Nous limitons à maximum 5 entreprises sponsorisées par page de résultats pour préserver l\'équité et garantir que les résultats organiques restent visibles.'
  },
  {
    id: 11,
    category: 'sponsorship',
    question: 'Comment fonctionne la rotation des résultats non-sponsorisés ?',
    answer: 'Les entreprises non-sponsorisées apparaissent en rotation automatique pour garantir une visibilité équitable. La position change régulièrement afin que chaque entreprise ait sa chance d\'être vue par les visiteurs.'
  },

  // Compte
  {
    id: 12,
    category: 'account',
    question: 'Comment créer un compte entreprise ?',
    answer: 'Cliquez sur "Connexion" puis "Créer un compte". Vous aurez besoin de votre SIREN/SIRET, d\'une adresse email professionnelle et de quelques informations sur votre entreprise. L\'inscription est gratuite et prend moins de 5 minutes.'
  },
  {
    id: 13,
    category: 'account',
    question: 'Puis-je modifier les informations de mon entreprise ?',
    answer: 'Oui ! Une fois connecté à votre espace client, accédez à "Gestion du profil" pour modifier vos informations (description, coordonnées, horaires, site web, etc.).'
  },
  {
    id: 14,
    category: 'account',
    question: 'Comment ajouter un avis à ma fiche ?',
    answer: 'Depuis votre espace client, allez dans "Avis de remplacement" et uploadez un avis 5★ provenant de Google, Trustpilot, Facebook ou Yelp. Nous vérifions l\'authenticité avant publication (généralement sous 24-48h).'
  },
  {
    id: 15,
    category: 'account',
    question: 'Que faire si j\'ai oublié mon mot de passe ?',
    answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Vous recevrez un email avec un lien pour réinitialiser votre mot de passe. Le lien est valide pendant 24 heures.'
  },
];

const categories = [
  { id: 'all', label: 'Toutes' },
  { id: 'general', label: 'Général' },
  { id: 'avis', label: 'Avis' },
  { id: 'sponsorship', label: 'Sponsorisation' },
  { id: 'account', label: 'Compte' },
];

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1])); // Première question ouverte par défaut

  const filteredFAQ = activeCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="legal-container">
      <div className="legal-content faq-content">
        <h1 className="legal-title">Questions Fréquentes</h1>
        <p className="legal-subtitle">
          Trouvez rapidement des réponses à vos questions
        </p>

        {/* Filtres par catégorie */}
        <div className="faq-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`faq-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Liste des questions */}
        <div className="faq-list">
          {filteredFAQ.map(item => (
            <div
              key={item.id}
              className={`faq-item ${openItems.has(item.id) ? 'open' : ''}`}
            >
              <button
                className="faq-question"
                onClick={() => toggleItem(item.id)}
              >
                <span>{item.question}</span>
                <svg
                  className="faq-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openItems.has(item.id) && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Contact */}
        <div className="faq-cta">
          <h2>Vous ne trouvez pas de réponse ?</h2>
          <p>Notre équipe est là pour vous aider</p>
          <Link to="/contact" className="btn btn-primary">
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}
