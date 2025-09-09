import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';
import { AuthState, User } from '../../types';
import toast from 'react-hot-toast';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    // For demo viewer login, bypass Firebase and return mock user
    if (email === 'viewer@smarthome.demo' && password === 'Demo123!') {
      return {
        uid: 'demo-viewer-uid',
        email: 'viewer@smarthome.demo',
        displayName: 'Demo Viewer',
        photoURL: null,
        emailVerified: true,
      } as User;
    }
    
    // Normal Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified,
    } as User;
  }
);

export const signupWithEmail = createAsyncThunk(
  'auth/signupWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      photoURL: userCredential.user.photoURL,
      emailVerified: userCredential.user.emailVerified,
    } as User;
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      emailVerified: result.user.emailVerified,
    } as User;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
});

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login with email
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Welcome back!');
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        toast.error(state.error);
      })
      // Signup with email
      .addCase(signupWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Account created successfully!');
      })
      .addCase(signupWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
        toast.error(state.error);
      })
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Welcome!');
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Google login failed';
        toast.error(state.error);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        toast.success('Logged out successfully');
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;