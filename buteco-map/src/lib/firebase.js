// src/lib/firebase.js
// Instâncias únicas do Firebase — importe daqui, nunca reinicialize

import { initializeApp } from 'firebase/app';
import { getAuth }        from 'firebase/auth';
import { getFirestore }   from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            'AIzaSyCRKIYPAxmJRuz9SGhgeoyM69LKtxpKesw',
  authDomain:        'buteco-map.firebaseapp.com',
  projectId:         'buteco-map',
  storageBucket:     'buteco-map.firebasestorage.app',
  messagingSenderId: '328577355632',
  appId:             '1:328577355632:web:ff98cba450caa08fd889b5',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
