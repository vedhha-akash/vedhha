import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistContextType {
  liked: Set<string>;
  wishlisted: Set<string>;
  toggleLike: (name: string) => void;
  toggleWishlist: (name: string) => void;
}

const WishlistContext = createContext<WishlistContextType>({
  liked: new Set(),
  wishlisted: new Set(),
  toggleLike: () => {},
  toggleWishlist: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("vedhha_liked") || "[]")); } catch { return new Set(); }
  });
  const [wishlisted, setWishlisted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("vedhha_wishlisted") || "[]")); } catch { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem("vedhha_liked", JSON.stringify([...liked]));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem("vedhha_wishlisted", JSON.stringify([...wishlisted]));
  }, [wishlisted]);

  function toggleLike(name: string) {
    setLiked(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  }
  function toggleWishlist(name: string) {
    setWishlisted(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  }

  return (
    <WishlistContext.Provider value={{ liked, wishlisted, toggleLike, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() { return useContext(WishlistContext); }
