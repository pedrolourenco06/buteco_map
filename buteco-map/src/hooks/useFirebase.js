// src/hooks/useFirebase.js
// Encapsula toda a lógica de autenticação e checklist de visitas.
// Retorna: { user, visitedMap, login, logout, toggleVisited }

import { useState, useEffect, useCallback } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const provider = new GoogleAuthProvider();

export function useFirebase() {
  const [user,       setUser]       = useState(null);   // firebase User | null
  const [visitedMap, setVisitedMap] = useState({});     // { [barId]: true }
  const [loading,    setLoading]    = useState(true);   // aguardando onAuthStateChanged

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Guarda o unsubscribe do onSnapshot para limpeza
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Limpa listener anterior caso usuário mude
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setVisitedMap({});
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      // Garante que o documento do usuário existe no Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(
        userRef,
        {
          displayName: firebaseUser.displayName ?? '',
          email:       firebaseUser.email       ?? '',
          photoURL:    firebaseUser.photoURL    ?? '',
          visited:     {},
        },
        { merge: true }   // não sobrescreve campos existentes
      );

      // Escuta mudanças em tempo real no checklist
      unsubscribeDoc = onSnapshot(userRef, (snap) => {
        const data = snap.data() ?? {};
        setVisitedMap(data.visited ?? {});
        setLoading(false);
      });
    });

    // Cleanup ao desmontar
    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  // ── Login / Logout ─────────────────────────────────────────────────────────
  const login = useCallback(async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error('Erro no login:', err);
      // Poderia expor um estado de erro aqui se necessário
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  }, []);

  // ── Toggle visitado ────────────────────────────────────────────────────────
  const toggleVisited = useCallback(async (barId) => {
    if (!user) {
      // Componente consumidor decide como mostrar esse aviso
      return { error: 'unauthenticated' };
    }

    const key       = String(barId);
    const isVisited = !!visitedMap[key];
    const userRef   = doc(db, 'users', user.uid);

    try {
      await updateDoc(userRef, { [`visited.${key}`]: !isVisited });
    } catch (err) {
      console.error('Erro ao atualizar checklist:', err);
      return { error: err.message };
    }

    return { ok: true };
  }, [user, visitedMap]);

  // ── API pública ────────────────────────────────────────────────────────────
  return {
    user,           // firebase User ou null
    visitedMap,     // { "1": true, "5": true, ... }
    loading,        // true enquanto o auth ainda não respondeu
    login,
    logout,
    toggleVisited,
  };
}
