import { CreditCard, CheckCircle, Star, MapPin, RefreshCcw } from "lucide-react";

export default function SponsorshipCTA() {
   
    return (
        <section
            className="bg-gradient-to-b from-gray-50 to-white py-20 px-6 lg:px-24"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Texte + avantages à gauche */}
                <div className="space-y-6 text-left">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#26354e]">
                       <span className="text-orange-500">Boostez la visibilité de votre entreprise</span> en tête des résultats locaux
                    </h1>
                    <p className="text-gray-700 text-base lg:text-lg leading-relaxed max-w-md">
                        Chaque jour, des milliers d’internautes recherchent un professionnel fiable dans leur ville.
                        Avec la sponsorisation <span className="text-orange-500">Fox-Reviews</span>, votre entreprise apparaît en priorité, avant les résultats standards,
                        avec un avis 5 étoiles décrypté, une mise en avant visuelle claire et une rotation équitable.
                    </p>
                    <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-orange-500" /> Position prioritaire garantie (Top résultats sponsorisés)
                        </li>
                        <li className="flex items-center gap-3">
                            <RefreshCcw className="w-5 h-5 text-orange-500" /> Rotation automatique équitable
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-orange-500" /> Visibilité locale ciblée (catégorie + ville)
                        </li>
                        <li className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-orange-500" />Avis 5★ décrypté par IA
                        </li>
                        <li className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-orange-500" /> Abonnement simple, sans engagement
                        </li>
                        <li className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-orange-500" /> Label Sponsorisé officiel
                        </li>
                    </ul>
                </div>

                {/* Image + CTA + compteur à droite */}
                <div className="space-y-6 text-center lg:text-center">
                    <img
                        src="/assets/Sponsorship.png"
                        alt="Votre entreprise ici - Résultat sponsorisé"
                        className="rounded-lg shadow-lg mx-auto py-10"
                    />

                    <button 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg flex items-center justify-center gap-3 transition-colors mx-auto cursor-pointer">
                        <CreditCard className="w-5 h-5" />
                        Passer en résultat sponsorisé
                    </button>
                </div>
            </div>
        </section>
    );
}