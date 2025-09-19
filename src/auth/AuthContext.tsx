import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";


// kimlik bilgileri şimdilik cihazda tutuluyor daha sonra Supabase/Firebase e geçirilecek.
type User = { id: string; email: string; username: string };
type StoredUser = User & { passwordHash: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => null,
  signUp: async () => null,
  signOut: async () => {},
});

const USERS_KEY = "auth_users_v1";
const SESSION_KEY = "auth_session_v1";

async function hash(pw: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pw);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await AsyncStorage.getItem(SESSION_KEY);
        const usersRaw = await AsyncStorage.getItem(USERS_KEY);
        const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
        if (session) {
          const found = users.find((u) => u.id === session);
          if (found)
            setUser({
              id: found.id,
              email: found.email,
              username: found.username,
            });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signUp = async (username: string, email: string, password: string) => {
    const usersRaw = await AsyncStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return "Bu e-posta zaten kayıtlı.";
    }
    if (password.length < 6) return "Şifre en az 6 karakter olmalı.";
    const passwordHash = await hash(password);
    const newUser: StoredUser = {
      id: String(Date.now()),
      email: email.trim(),
      username: username.trim() || email.split("@")[0],
      passwordHash,
    };
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, newUser.id);
    setUser({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });
    return null;
  };

  const signIn = async (email: string, password: string) => {
    const usersRaw = await AsyncStorage.getItem(USERS_KEY);
    const users: StoredUser[] = usersRaw ? JSON.parse(usersRaw) : [];
    const u = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return "Kullanıcı bulunamadı.";
    const ok = (await hash(password)) === u.passwordHash;
    if (!ok) return "Şifre hatalı.";
    await AsyncStorage.setItem(SESSION_KEY, u.id);
    setUser({ id: u.id, email: u.email, username: u.username });
    return null;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
