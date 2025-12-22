import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/assets/hero-fox.png',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const siteName = 'FOX-REVIEWS';
  const fullTitle = `${title} | ${siteName}`;
  const currentUrl = url || window.location.href;
  const imageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  return (
    <Helmet>
      {/* Métadonnées de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Article spécifique */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Robots */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Liens alternatifs pour les langues (futur) */}
      <link rel="alternate" hrefLang="fr" href={currentUrl} />

      {/* Schema.org pour Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebSite',
          name: fullTitle,
          description: description,
          url: currentUrl,
          image: imageUrl,
          ...(author && { author: { '@type': 'Person', name: author } }),
          ...(publishedTime && { datePublished: publishedTime }),
          ...(modifiedTime && { dateModified: modifiedTime }),
        })}
      </script>
    </Helmet>
  );
}

// Composants SEO pré-configurés pour des pages spécifiques

export function HomeSEO() {
  return (
    <SEO
      title="Annuaire Pro 5★ - Trouvez les meilleurs professionnels près de chez vous"
      description="Découvrez les meilleurs professionnels avec des avis 5★ certifiés. Plombiers, électriciens, artisans... Trouvez le pro qu'il vous faut près de chez vous !"
      keywords="annuaire professionnel, avis 5 étoiles, artisans, plombier, électricien, services locaux, avis décryptés"
    />
  );
}

export function SearchSEO({ 
  categorie, 
  ville 
}: { 
  categorie?: string; 
  ville?: string 
}) {
  const title = [categorie, ville].filter(Boolean).join(' à ') || 'Recherche';
  const description = `Trouvez les meilleurs ${categorie || 'professionnels'}${ville ? ` à ${ville}` : ''} avec des avis 5★ certifiés. Comparez et choisissez le pro idéal.`;

  return (
    <SEO
      title={title}
      description={description}
      keywords={`${categorie || 'professionnel'}, ${ville || 'France'}, avis, recommandation`}
    />
  );
}

export function ProDetailSEO({
  nom,
  categorie,
  ville,
  description,
}: {
  nom: string;
  categorie: string;
  ville: string;
  description?: string;
}) {
  return (
    <SEO
      title={`${nom} - ${categorie} à ${ville}`}
      description={
        description ||
        `Découvrez ${nom}, ${categorie} à ${ville}. Avis 5★ certifiés, coordonnées et informations pratiques.`
      }
      keywords={`${nom}, ${categorie}, ${ville}, avis, contact, professionnel`}
      type="profile"
    />
  );
}

export function CategorieSEO({ nom, description }: { nom: string; description?: string }) {
  return (
    <SEO
      title={nom}
      description={
        description ||
        `Trouvez les meilleurs ${nom} près de chez vous. Avis 5★ certifiés, comparaison et sélection des meilleurs professionnels.`
      }
      keywords={`${nom}, professionnels, avis, annuaire`}
    />
  );
}

export function VilleSEO({ nom, description }: { nom: string; description?: string }) {
  return (
    <SEO
      title={`Professionnels à ${nom}`}
      description={
        description ||
        `Découvrez les meilleurs professionnels à ${nom}. Avis 5★ certifiés pour tous vos besoins : plomberie, électricité, artisanat et plus encore.`
      }
      keywords={`professionnels ${nom}, artisans ${nom}, services ${nom}`}
    />
  );
}
