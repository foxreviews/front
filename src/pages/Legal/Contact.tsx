import { useState, type FormEvent } from 'react';
import './Legal.css';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMessage('Veuillez remplir tous les champs');
      setStatus('error');
      return;
    }

    if (!formData.email.includes('@')) {
      setErrorMessage('Veuillez entrer une adresse email valide');
      setStatus('error');
      return;
    }

    try {
      // TODO: Implémenter l'envoi via API
      // await apiClient.post('/contact/', formData);
      
      // Simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      setStatus('error');
    }
  };

  return (
    <div className="legal-container">
      <div className="legal-content contact-content">
        <h1 className="legal-title">Contactez-nous</h1>
        <p className="legal-subtitle">
          Une question, une suggestion ou besoin d'aide ? Nous sommes à votre écoute.
        </p>

        <div className="contact-grid">
          <div className="contact-info">
            <h2>Informations</h2>
            
            <div className="info-block">
              <div className="info-icon">📧</div>
              <div>
                <h3>Email</h3>
                <p>contact@fox-reviews.fr</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">📞</div>
              <div>
                <h3>Téléphone</h3>
                <p>+33 1 23 45 67 89</p>
                <small>Lundi - Vendredi, 9h - 18h</small>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">🏢</div>
              <div>
                <h3>Adresse</h3>
                <p>123 Avenue de la République<br />75011 Paris, France</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">⏱️</div>
              <div>
                <h3>Temps de réponse</h3>
                <p>Nous répondons généralement sous 24-48h</p>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Jean Dupont"
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@exemple.fr"
                  disabled={status === 'sending'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet *</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={status === 'sending'}
                >
                  <option value="">-- Sélectionnez un sujet --</option>
                  <option value="question">Question générale</option>
                  <option value="sponsorship">Sponsorisation</option>
                  <option value="technical">Problème technique</option>
                  <option value="billing">Facturation</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Votre message..."
                  disabled={status === 'sending'}
                />
              </div>

              {status === 'success' && (
                <div className="alert alert-success">
                  Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </div>
              )}

              {status === 'error' && errorMessage && (
                <div className="alert alert-error">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
