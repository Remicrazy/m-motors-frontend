import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useState } from 'react';

const schema = z.object({
  nom: z.string().min(1, 'Nom requis'),
  prenom: z.string().min(1, 'Prénom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(10, 'Téléphone invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
});
type Form = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: Form) => {
    setError('');
    try {
      await authService.register(data);
      navigate('/mon-espace');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Créer mon compte</h1>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: 'nom', label: 'Nom', type: 'text' },
            { name: 'prenom', label: 'Prénom', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'telephone', label: 'Téléphone', type: 'tel' },
            { name: 'password', label: 'Mot de passe (min. 8 caractères)', type: 'password' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input {...register(name as any)} type={type}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors[name as keyof Form] && (
                <p className="text-red-500 text-xs mt-1">{errors[name as keyof Form]?.message}</p>
              )}
            </div>
          ))}

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors">
            {isSubmitting ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Déjà un compte ? <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
