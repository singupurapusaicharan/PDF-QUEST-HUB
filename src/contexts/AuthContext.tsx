import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { getProfile, updateProfile as updateProfileAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authAction: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authAction, setAuthAction] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Firebase auth state changes
    // This handles session persistence automatically
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get profile from database
        try {
          const profile = await getProfile(firebaseUser.uid);
          
          if (profile) {
            // Use profile from database
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: profile.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
            };
            setUser(user);
            localStorage.setItem('pdf_quest_user', JSON.stringify(user));
          } else {
            // Create initial profile in database
            const user = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
            };
            
            // Save to database
            await updateProfileAPI(user.id, user.name, user.email);
            
            setUser(user);
            localStorage.setItem('pdf_quest_user', JSON.stringify(user));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          // Fallback to Firebase data
          const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
          };
          setUser(user);
          localStorage.setItem('pdf_quest_user', JSON.stringify(user));
        }
        
        // Get and store the Firebase ID token
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('pdf_quest_token', token);
      } else {
        setUser(null);
        localStorage.removeItem('pdf_quest_user');
        localStorage.removeItem('pdf_quest_token');
      }
      setLoading(false);
      setAuthAction(null);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, _password: string) => {
    setAuthAction('Signing you in...');
    // TODO: Implement email/password authentication with Firebase or your backend
    // For Firebase: import { signInWithEmailAndPassword } from 'firebase/auth';
    // await signInWithEmailAndPassword(auth, email, password);
    
    // For now, using mock implementation for email/password
    await new Promise(resolve => setTimeout(resolve, 800)); // Subtle delay
    const mockUser = { id: Date.now().toString(), email, name: email.split('@')[0] };
    localStorage.setItem('pdf_quest_user', JSON.stringify(mockUser));
    localStorage.setItem('pdf_quest_token', 'mock-jwt-token-' + Date.now());
    setUser(mockUser);
    setAuthAction(null);
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    setAuthAction('Creating your account...');
    // TODO: Implement email/password registration with Firebase or your backend
    // For Firebase: import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
    // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // if (name) await updateProfile(userCredential.user, { displayName: name });
    
    // For now, using mock implementation for email/password
    await new Promise(resolve => setTimeout(resolve, 800)); // Subtle delay
    const mockUser = { id: Date.now().toString(), email, name: name || email.split('@')[0] };
    localStorage.setItem('pdf_quest_user', JSON.stringify(mockUser));
    localStorage.setItem('pdf_quest_token', 'mock-jwt-token-' + Date.now());
    setUser(mockUser);
    setAuthAction(null);
  };

  const signOut = async () => {
    setAuthAction('Signing you out...');
    await new Promise(resolve => setTimeout(resolve, 600)); // Quick, subtle delay
    // Sign out from Firebase (this will trigger onAuthStateChanged)
    await firebaseSignOut(auth);
    localStorage.removeItem('pdf_quest_user');
    localStorage.removeItem('pdf_quest_token');
    setUser(null);
    setAuthAction(null);
  };

  const signInWithGoogle = async () => {
    setAuthAction('Connecting with Google...');
    try {
      // Sign in with Google using Firebase
      // The googleProvider is configured with prompt: 'select_account'
      // which forces Google to show account selection every time (no auto-login)
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Create user object
      const user = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
      };
      
      // Store user data
      localStorage.setItem('pdf_quest_user', JSON.stringify(user));
      
      // Get and store Firebase ID token
      const token = await firebaseUser.getIdToken();
      localStorage.setItem('pdf_quest_token', token);
      
      setUser(user);
      setAuthAction(null);
    } catch (error) {
      setAuthAction(null);
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authAction, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
