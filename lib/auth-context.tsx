"use client";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "./firebase/client";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  firebaseReady: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      // Firebase pas encore configuré : l'app reste utilisable en mode invité local.
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signUp(email: string, password: string, displayName?: string) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase n'est pas configuré.");
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
  }

  async function signIn(email: string, password: string) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase n'est pas configuré.");
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }

  async function resetPassword(email: string) {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase n'est pas configuré.");
    await sendPasswordResetEmail(auth, email);
  }

  async function deleteAccount() {
    const auth = getFirebaseAuth();
    const db = getFirebaseDb();
    if (!auth?.currentUser) throw new Error("Aucun utilisateur connecté.");
    const uid = auth.currentUser.uid;

    if (db) {
      // Best-effort : supprime les données associées avant le compte lui-même.
      await Promise.allSettled([
        deleteDoc(doc(db, "users", uid)),
        deleteDoc(doc(db, "subscriptions", uid)),
        deleteDoc(doc(db, "push_subscriptions", uid)),
      ]);
    }
    await deleteUser(auth.currentUser);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        firebaseReady: isFirebaseConfigured,
        signUp,
        signIn,
        logout,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
