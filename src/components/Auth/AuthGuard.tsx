import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          })
        );
      } else {
        // Only set user to null if we don't have a demo user
        const currentUser = store.getState().auth.user;
        if (!currentUser || currentUser.uid !== 'demo-viewer-uid') {
          dispatch(setUser(null));
        }
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading || !authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
