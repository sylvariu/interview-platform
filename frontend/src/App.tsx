import {useEffect} from 'react'
import {useAuthStore} from "./store/auth.store.ts";
import {BrowserRouter} from "react-router-dom";
import {Navigation} from "./components/Navigation.tsx";
import {AppRouter} from "./router/AppRouter.tsx";
import {useNotesStore} from "./store/notes.store.ts";
import {NotesModal} from "./components/notes/NotesModal.tsx";
import {NotesFloatingButton} from "./components/notes/NotesButton.tsx";

const App: React.FC = () => {
  const checkAuth = useAuthStore(s => s.checkAuth)
  const isLoading = useAuthStore(s => s.isLoading);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { isOpenNotes } = useNotesStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
      return <div>Loading app...</div>;
  }

  return (
      <BrowserRouter>
        <Navigation />
        <AppRouter />

        {isAuthenticated && (
            <>
                <NotesFloatingButton />
                {isOpenNotes && <NotesModal />}
            </>
        )}
      </BrowserRouter>
  );
};

export default App;