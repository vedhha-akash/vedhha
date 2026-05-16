import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useUser, useClerk } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import Shipping from "@/pages/Shipping";
import Reel from "@/pages/Reel";
import IntroPreview from "@/pages/IntroPreview";
import Founder from "@/pages/Founder";
import VedhhaIntro from "@/components/VedhhaIntro";
import HamburgerMenu from "@/components/HamburgerMenu";
import WhatsAppButton from "@/components/WhatsAppButton";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import AIChatWidget from "@/components/AIChatWidget";
import SearchPanel from "@/components/SearchPanel";
import WishlistDrawer from "@/components/WishlistDrawer";
import ProductModal from "@/components/ProductModal";
import { ThemeProvider } from "@/context/ThemeContext";
import { WishlistProvider, useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/data/products";

const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL as string | undefined;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

// Syncs Google sign-in (via Clerk) into our local customer system
function ClerkGoogleSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    // Only sync if not already set from a phone login
    const existing = localStorage.getItem("vedhha_user");
    const existingParsed = existing ? JSON.parse(existing) as { contact?: string } : null;
    // If already logged in via phone (contact is a 10-digit number), skip overwriting
    if (existingParsed?.contact && /^\d{10}$/.test(existingParsed.contact)) return;

    const name = user.fullName || user.firstName || email.split("@")[0];

    // Upsert to our DB and sync localStorage
    fetch("/api/customers/upsert-google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { name: string; notificationsEnabled: boolean };
        const vedhhaUser = { name: data.name, contact: email, notificationsEnabled: data.notificationsEnabled };
        localStorage.setItem("vedhha_user", JSON.stringify(vedhhaUser));
        localStorage.setItem("vedhha_notifications", data.notificationsEnabled ? "true" : "false");
      })
      .catch(() => {});
  }, [isSignedIn, user]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/vedhha-panel" component={Admin} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/reel" component={Reel} />
      <Route path="/intro" component={IntroPreview} />
      <Route path="/founder" component={Founder} />
      <Route path="/aakash-sharma" component={Founder} />
      <Route path="/eklavya" component={Founder} />
      <Route path="/sign-in/*?" component={() => (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <SignIn
            routing="path"
            path={`${basePath}/sign-in`}
            signUpUrl={`${basePath}/sign-up`}
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#c8832a",
                colorBackground: "#111111",
                colorInputBackground: "#1a1a1a",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#999999",
                borderRadius: "0px",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                card: "!bg-transparent !shadow-none",
                cardBox: "bg-[#111111] border border-white/10 w-[380px] max-w-full",
                headerTitle: "text-white font-display uppercase tracking-widest",
                headerSubtitle: "text-white/50",
                formButtonPrimary: "bg-[#c8832a] hover:bg-[#b8731a] text-black uppercase tracking-widest text-xs font-bold !rounded-none",
                footerActionLink: "text-[#c8832a]",
              },
            }}
          />
        </div>
      )} />
      <Route path="/sign-up/*?" component={() => (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <SignUp
            routing="path"
            path={`${basePath}/sign-up`}
            signInUrl={`${basePath}/sign-in`}
            fallbackRedirectUrl="/"
            appearance={{
              variables: {
                colorPrimary: "#c8832a",
                colorBackground: "#111111",
                colorInputBackground: "#1a1a1a",
                colorInputText: "#ffffff",
                colorText: "#ffffff",
                colorTextSecondary: "#999999",
                borderRadius: "0px",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                card: "!bg-transparent !shadow-none",
                cardBox: "bg-[#111111] border border-white/10 w-[380px] max-w-full",
                headerTitle: "text-white font-display uppercase tracking-widest",
                formButtonPrimary: "bg-[#c8832a] hover:bg-[#b8731a] text-black uppercase tracking-widest text-xs font-bold !rounded-none",
                footerActionLink: "text-[#c8832a]",
              },
            }}
          />
        </div>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function WishlistIcons() {
  const { liked, wishlisted } = useWishlist();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<"liked" | "wishlist">("liked");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  function openDrawer(tab: "liked" | "wishlist") {
    setDrawerTab(tab);
    setDrawerOpen(true);
  }

  return (
    <>
      <div className="fixed top-5 left-[128px] z-[90] flex flex-row gap-1">
        <button
          onClick={() => openDrawer("liked")}
          className="relative w-11 h-11 flex items-center justify-center bg-black/70 border border-white/15 backdrop-blur-md text-white/70 hover:text-primary hover:border-primary transition-colors"
          title="Liked Products"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={liked.size > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {liked.size > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {liked.size}
            </span>
          )}
        </button>
        <button
          onClick={() => openDrawer("wishlist")}
          className="relative w-11 h-11 flex items-center justify-center bg-black/70 border border-white/15 backdrop-blur-md text-white/70 hover:text-accent hover:border-accent transition-colors"
          title="Wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted.size > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="text-accent">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          {wishlisted.size > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              {wishlisted.size}
            </span>
          )}
        </button>
      </div>

      <WishlistDrawer
        open={drawerOpen}
        tab={drawerTab}
        onClose={() => setDrawerOpen(false)}
        onProduct={(p) => setPreviewProduct(p)}
      />
      <ProductModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </>
  );
}

function AppShell() {
  const [introComplete, setIntroComplete] = useState(false);
  const [location] = useLocation();
  const isAdmin = location === "/admin" || location === "/vedhha-panel";
  const isShipping = location === "/shipping";
  const isReel = location === "/reel";
  const isIntro = location === "/intro";
  const isFounder = location === "/founder" || location === "/aakash-sharma" || location === "/eklavya";

  return (
    <>
      <ClerkGoogleSync />
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && !introComplete && <VedhhaIntro onComplete={() => setIntroComplete(true)} />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <FlashSaleBanner />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <HamburgerMenu />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <SearchPanel />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <AIChatWidget />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <WhatsAppButton />}
      {!isAdmin && !isShipping && !isReel && !isIntro && !isFounder && introComplete && <WishlistIcons />}
      <Router />
      <Toaster />
    </>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      routerPush={(to) => window.history.pushState({}, "", stripBase(to))}
      routerReplace={(to) => window.history.replaceState({}, "", stripBase(to))}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <WishlistProvider>
              <WouterRouter base={basePath}>
                <AppShell />
              </WouterRouter>
            </WishlistProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
