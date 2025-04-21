// hooks/useAuthListener.ts
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';

export function useAuthListener(callback?: (user: any) => void) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser && callback) callback(firebaseUser);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}