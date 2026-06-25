import { Link } from 'react-router-dom';
import { Car, Shield, Wrench, Phone } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Votre véhicule idéal vous attend</h1>
          <p className="text-xl text-gray-300 mb-10">
            Achat ou Location Longue Durée — M-Motors vous accompagne dans votre projet automobile.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/vehicules?type=ACHAT"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Véhicules à acheter
            </Link>
            <Link to="/vehicules?type=LOCATION"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Location LLD
            </Link>
          </div>
        </div>
      </section>

      {/* Services LLD */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Notre abonnement LLD inclut
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: 'Assurance tous risques', color: 'text-blue-500' },
              { icon: Phone, label: 'Assistance dépannage', color: 'text-green-500' },
              { icon: Wrench, label: 'Entretien & SAV', color: 'text-orange-500' },
              { icon: Car, label: 'Contrôle technique', color: 'text-purple-500' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <Icon size={40} className={`mx-auto mb-4 ${color}`} />
                <p className="font-semibold text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer ?</h2>
          <p className="text-blue-100 mb-8">Créez votre compte et déposez votre dossier en ligne en quelques minutes.</p>
          <Link to="/inscription"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Créer mon compte
          </Link>
        </div>
      </section>
    </div>
  );
}
