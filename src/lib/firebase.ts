import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot, query, where, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

// Allow overriding via environment variables for deployments like Vercel
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfigData.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigData.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigData.projectId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfigData.appId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigData.storageBucket || '',
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigData.messagingSenderId || '',
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigData.measurementId || '',
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || firebaseConfigData.firestoreDatabaseId,
};

const app = initializeApp(firebaseConfig as any);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged };
export type { User };

// Helper to handle Firestore errors as per instructions
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const user = auth.currentUser;
  
  // Safely extract only primitive values from auth info to avoid circular references
  const authInfo = {
    userId: user?.uid ? String(user.uid) : undefined,
    email: user?.email ? String(user.email) : undefined,
    emailVerified: user?.emailVerified ?? undefined,
    isAnonymous: user?.isAnonymous ?? undefined,
    tenantId: user?.tenantId ? String(user.tenantId) : undefined,
    providerInfo: user?.providerData.map(provider => ({
      providerId: String(provider.providerId),
      displayName: provider.displayName ? String(provider.displayName) : null,
      email: provider.email ? String(provider.email) : null,
      photoUrl: provider.photoURL ? String(provider.photoURL) : null
    })) || []
  };

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo,
    operationType,
    path
  };

  // Safe stringify to handle any unexpected circular references
  const safeStringify = (obj: any): string => {
    const cache = new Set();
    return JSON.stringify(obj, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return '[Circular]';
        cache.add(value);
      }
      return value;
    });
  };

  let serialized: string;
  try {
    serialized = safeStringify(errInfo);
  } catch (e) {
    serialized = JSON.stringify({
      error: errInfo.error,
      operationType: errInfo.operationType,
      path: errInfo.path,
      message: 'Failed to fully serialize error info'
    });
  }

  console.error('Firestore Error: ', serialized);
  throw new Error(serialized);
}
