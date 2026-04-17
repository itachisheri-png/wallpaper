import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle, Download, Settings, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ImageCard } from '@/components/ImageCard';
import { PremiumModal } from '@/components/PremiumModal';
import { AdminPanel } from '@/components/AdminPanel';
import { AutumnBackground } from '@/components/AutumnBackground';
import { Pagination } from '@/components/Pagination';
import { searchImages, getPopularImages } from './services/imageService';
import { Image, Category } from './types';
import { Button } from '@/components/ui/button';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User,
  handleFirestoreError,
  OperationType
} from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  deleteDoc,
  getDocs
} from 'firebase/firestore';

export default function App() {
  const [images, setImages] = useState<Image[]>([]);
  const [adminImages, setAdminImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  const ADMIN_EMAIL = 'itachisheri@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Disable right-click globally
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              isPremium: false,
              role: currentUser.email === ADMIN_EMAIL ? 'admin' : 'user'
            });
          } else {
            setIsPremiumUser(userDoc.data().isPremium || false);
          }
        } catch (err) {
          console.error('Error syncing user:', err);
        }
      } else {
        setIsPremiumUser(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for Admin Images
  useEffect(() => {
    const q = collection(db, 'admin_images');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const imgs = snapshot.docs.map(doc => doc.data() as Image);
      setAdminImages(imgs);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'admin_images');
    });
    return () => unsubscribe();
  }, []);

  // Listen for User's Deleted Images
  useEffect(() => {
    if (!user) {
      setDeletedIds(new Set());
      return;
    }

    const q = collection(db, 'users', user.uid, 'deleted_images');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ids = new Set(snapshot.docs.map(doc => doc.id));
      setDeletedIds(ids);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/deleted_images`);
    });
    return () => unsubscribe();
  }, [user]);

  const fetchImages = useCallback(async (queryStr?: string, category?: Category) => {
    setLoading(true);
    setError(null);
    try {
      let results: Image[];
      if (queryStr) {
        results = await searchImages(queryStr);
      } else if (category && category !== 'All') {
        results = await searchImages(category.toLowerCase());
      } else {
        results = await getPopularImages();
      }

      const filteredAdmin = adminImages.filter(img => {
        if (deletedIds.has(img.id)) return false;
        if (queryStr) return img.title.toLowerCase().includes(queryStr.toLowerCase());
        if (category && category !== 'All') return img.title.toLowerCase().includes(category.toLowerCase());
        return true;
      });

      const finalResults = results.filter(img => {
        // Filter out deleted images AND images that are already in filteredAdmin by ID
        return !deletedIds.has(img.id) && !filteredAdmin.some(adminImg => adminImg.id === img.id);
      });
      setImages([...filteredAdmin, ...finalResults]);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [adminImages, deletedIds]);

  useEffect(() => {
    if (isAuthReady) {
      fetchImages(searchQuery, activeCategory);
    }
  }, [fetchImages, searchQuery, activeCategory, isAuthReady]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      // Log only non-cancellation errors to console to reduce noise
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error('Login failed:', err);
      }
      
      if (err.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked! Please allow popups in your browser settings.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Login window was closed. Please try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setAuthError('A login request is already pending.');
      } else {
        setAuthError('An error occurred during login. Please try again.');
      }
      
      // Auto-clear error after 6 seconds
      setTimeout(() => setAuthError(null), 6000);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('All');
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleAddAdminImage = async (newImage: Image) => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(db, 'admin_images', newImage.id), newImage);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `admin_images/${newImage.id}`);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!user) return;

    // If it's an admin image and user is admin, delete globally
    if (isAdmin && adminImages.some(img => img.id === id)) {
      try {
        await deleteDoc(doc(db, 'admin_images', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `admin_images/${id}`);
      }
    } else {
      // Otherwise, just hide it for this user
      try {
        await setDoc(doc(db, 'users', user.uid, 'deleted_images', id), {
          userId: user.uid,
          imageId: id,
          deletedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/deleted_images/${id}`);
      }
    }
  };

  const handleDownload = (image: Image) => {
    if (image.isPremium && !isPremiumUser) {
      setIsPremiumModalOpen(true);
      return;
    }

    fetch(image.url)
      .then(resp => resp.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${image.title.replace(/\s+/g, '-').toLowerCase()}-4k.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.open(image.url, '_blank');
      });
  };

  const handleUpgrade = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    
    try {
      await setDoc(doc(db, 'users', user.uid), { isPremium: true }, { merge: true });
      setIsPremiumUser(true);
      setIsPremiumModalOpen(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <div className="min-h-screen text-white selection:bg-indigo-500/30">
      <div className="atmosphere" />
      <AutumnBackground />
      
      <div className="relative z-10">
        <Navbar
          onSearch={handleSearch}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          isPremiumUser={isPremiumUser}
          isAdmin={isAdmin}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpgrade={() => setIsPremiumModalOpen(true)}
        />

        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
            >
              <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-xl text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{authError}</p>
                <button onClick={() => setAuthError(null)} className="ml-auto text-red-400/50 hover:text-red-400">
                  <Settings className="h-4 w-4 rotate-45" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Navigation / Back Button if searching */}
          {(searchQuery || activeCategory !== 'All') && (
            <div className="mb-6">
              <Button 
                variant="ghost" 
                onClick={() => handleCategoryChange('All')}
                className="text-zinc-400 hover:text-white hover:bg-zinc-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Popular
              </Button>
            </div>
          )}

          {/* Hero Section */}
          {!searchQuery && activeCategory === 'All' && (
            <div className="mb-20 text-center relative py-12">
              <div className="absolute inset-0 z-[-1] opacity-30">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex justify-center mb-6">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 border border-zinc-800 rounded-full bg-zinc-950/50 backdrop-blur-sm">
                    Premium Quality Selection
                  </span>
                </div>
                
                <h1 className="text-5xl font-extrabold tracking-tighter sm:text-8xl mb-8 leading-[0.9]">
                  Ultra HD <br />
                  <span className="bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent">
                    4K Vision
                  </span>
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto max-w-xl text-lg text-zinc-400 font-medium leading-relaxed"
                >
                  Curating the most breathtaking high-resolution masterpieces <br />
                  <span className="italic-serif text-zinc-500">for those who appreciate pure clarity.</span>
                </motion.p>

                <div className="mt-12 flex justify-center gap-4">
                  {isAdmin && (
                    <Button 
                      onClick={() => setIsAdminOpen(true)}
                      className="bg-white text-black hover:bg-zinc-200 font-bold h-12 px-8 rounded-full transition-all hover:scale-105"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Admin Control
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Status Messages */}
          {loading && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <p className="text-zinc-500 font-medium">Discovering high-res masterpieces...</p>
            </div>
          )}

          {error && (
            <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <p className="text-zinc-300">{error}</p>
              <Button onClick={() => fetchImages(searchQuery, activeCategory)} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Image Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {images.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((image) => (
                    <motion.div 
                      key={image.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ImageCard
                        image={image}
                        onDownload={handleDownload}
                        onDelete={handleDeleteImage}
                        isPremiumUser={isPremiumUser}
                        isAdmin={isAdmin}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(images.length / itemsPerPage)}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}

          {/* Empty State */}
          {!loading && !error && images.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <p className="text-xl text-zinc-400">No 4K images found for "{searchQuery || activeCategory}".</p>
              <Button 
                variant="link" 
                className="mt-2 text-indigo-400"
                onClick={() => handleCategoryChange('All')}
              >
                Browse popular images
              </Button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-16">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Download className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">4K Vision</span>
            </div>
            <p className="text-zinc-500 max-w-md mx-auto mb-8">
              Your ultimate source for high-resolution 4K Ultra HD wallpapers and photography.
            </p>
            <div className="flex justify-center gap-8 text-sm font-medium text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
            </div>
            <p className="mt-12 text-xs text-zinc-600">
              © 2026 4K Vision. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onConfirm={handleUpgrade}
      />

      {isAdminOpen && (
        <AdminPanel
          onAddImage={handleAddAdminImage}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
