import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type RedirectToSearchProps = {
  queryKey: 'categorie' | 'sous_categorie' | 'ville';
  paramName?: string;
};

export default function RedirectToSearch({ queryKey, paramName = 'slug' }: RedirectToSearchProps) {
  const navigate = useNavigate();
  const params = useParams<Record<string, string | undefined>>();

  useEffect(() => {
    const value = params[paramName];
    if (!value) {
      navigate('/search', { replace: true });
      return;
    }

    const urlParams = new URLSearchParams();
    urlParams.set(queryKey, value);
    navigate(`/search?${urlParams.toString()}`, { replace: true });
  }, [navigate, params, paramName, queryKey]);

  return null;
}
