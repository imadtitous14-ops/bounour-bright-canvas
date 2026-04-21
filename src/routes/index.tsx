import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useMemo, useCallback } from "react";
import { Search, ShoppingBag, X, Minus, Plus, Trash2, ArrowRight, MapPin, Phone, Mail, Star, Sun, Moon } from "lucide-react";
import { STORE, CATEGORIES, WILAYAS, fmt, getProducts, getBadgeVariant, type Product } from "@/lib/store-data";
import { useTheme } from "@/hooks/use-theme";
import logoImg from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: BounourTechShop,
  head: () => ({
    meta: [
      { title: "BounourTech — La Tech à Portée de Main" },
      { name: "description", content: "Smartphones, accessoires et gaming au meilleur rapport qualité-prix. Livraison partout en Algérie." },
    ],
  }),
});

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1a1a1a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888" font-family="sans-serif" font-size="28">BOUNOUR TECH</text></svg>`
  );

function BounourTechShop() {
  const PRODUCTS = useMemo(() => getProducts(), []);
  const heroProduct = useMemo(() => PRODUCTS.find(p => p.id === 5), [PRODUCTS]);
  const { theme, toggleTheme } = useTheme();

  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<(Product & { qty: number })[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQty, setModalQty] = useState(1);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderWilaya, setOrderWilaya] = useState("09 - Blida");
  const [orderAddress, setOrderAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [orderPayment, setOrderPayment] = useState<"dahabia" | "cib" | "cash">("cash");
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const productsRef = useRef<HTMLElement>(null);

  const filtered = useMemo(() => {
    if (!Array.isArray(PRODUCTS)) return [];
    const q = search.trim().toLowerCase();
    return PRODUCTS.filter(p => {
      if (!p) return false;
      const matchCat = activeCat === "all" || p.cat === activeCat;
      const name = (p.name ?? "").toLowerCase();
      const brand = (p.brand ?? "").toLowerCase();
      const specs = (p.specs ?? "").toLowerCase();
      const matchSearch = !q || name.includes(q) || brand.includes(q) || specs.includes(q);
      return matchCat && matchSearch;
    });
  }, [PRODUCTS, activeCat, search]);

  const isLoading = !Array.isArray(PRODUCTS) || PRODUCTS.length === 0;

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    setAddedToast(product.name);
    setTimeout(() => setAddedToast(null), 1800);
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const paymentLabels = { dahabia: "Dahabia", cib: "CIB", cash: "Paiement à la livraison" };

  const sendWhatsApp = useCallback(() => {
    if (!orderName.trim() || !orderPhone.trim()) return;
    let msg = `*طلب جديد — BOUNOURTECH*\n\n`;
    msg += `*الاسم:* ${orderName}\n*الهاتف:* ${orderPhone}\n*الولاية:* ${orderWilaya}\n`;
    if (orderAddress) msg += `*العنوان:* ${orderAddress}\n`;
    msg += `*طريقة الدفع:* ${paymentLabels[orderPayment]}\n`;
    if (orderNote) msg += `*ملاحظة:* ${orderNote}\n`;
    msg += `\n*المنتجات:*\n`;
    cart.forEach(i => { msg += `• ${i.name} × ${i.qty} = ${fmt(i.price * i.qty)} DA\n`; });
    msg += `\n*المجموع: ${fmt(cartTotal)} DA*`;
    window.open(`https://wa.me/213${STORE.phone.slice(1)}?text=${encodeURIComponent(msg)}`, "_blank");
  }, [orderName, orderPhone, orderWilaya, orderAddress, orderNote, orderPayment, cart, cartTotal]);

  const quickOrder = useCallback((product: Product) => {
    const msg = `مرحبا، أريد طلب:\n\n*${product.name}*\nالسعر: ${fmt(product.price)} DA\n\nمن فضلك أرسلي تفاصيل التوصيل.`;
    window.open(`https://wa.me/213${STORE.phone.slice(1)}?text=${encodeURIComponent(msg)}`, "_blank");
  }, []);

  const scrollToProducts = () => productsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const badgeClasses: Record<string, string> = {
    promo: "bg-danger text-primary-foreground",
    new: "bg-success text-primary-foreground",
    default: "bg-primary text-primary-foreground",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Toast */}
      {addedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg animate-[slide-up_0.3s_ease]">
          ✓ {addedToast.length > 22 ? addedToast.slice(0, 22) + "…" : addedToast} ajouté
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div
            className="font-display text-2xl tracking-widest cursor-pointer flex items-baseline gap-1 select-none"
            onClick={() => { setActiveCat("all"); setSearch(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          >
            BOUNOUR<span className="text-primary text-sm tracking-[5px]">TECH</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 border border-border rounded-full hover:border-primary transition-colors text-foreground"
              title={theme === "dark" ? "Mode clair" : "Mode sombre"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="relative border border-border rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium hover:border-primary hover:shadow-[0_0_12px_var(--accent-glow)] transition-all text-foreground"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-[clamp(48px,8vw,96px)] leading-[0.95] tracking-wide">
            LA TECH<span className="text-primary block drop-shadow-[0_0_20px_var(--accent-glow)]">À PORTÉE</span>DE MAIN
          </h1>
          <p className="mt-5 text-base text-muted-foreground max-w-[420px] leading-relaxed font-light">
            Smartphones, accessoires et gaming au meilleur rapport qualité-prix. Livraison partout en Algérie.
          </p>
          <div className="mt-7 flex gap-3 flex-wrap">
            <button
              className="bg-primary text-primary-foreground px-7 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-[0_4px_15px_var(--accent-glow)] hover:shadow-[0_6px_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all"
              onClick={scrollToProducts}
            >
              Voir les produits <ArrowRight className="w-4 h-4" />
            </button>
            <a
              className="border border-border px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:border-muted-foreground hover:bg-surface/50 transition-all text-foreground no-underline"
              href={`https://wa.me/213${STORE.phone.slice(1)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Nous contacter
            </a>
          </div>
          <div className="flex gap-8 mt-10">
            <div><div className="font-display text-3xl text-primary tracking-wide">221+</div><div className="text-xs text-muted-foreground uppercase tracking-wider">Produits</div></div>
            <div><div className="font-display text-3xl text-primary tracking-wide">48</div><div className="text-xs text-muted-foreground uppercase tracking-wider">Marques</div></div>
            <div><div className="font-display text-3xl text-primary tracking-wide">58</div><div className="text-xs text-muted-foreground uppercase tracking-wider">Wilayas</div></div>
          </div>
        </div>
        <div className="flex justify-center md:order-none order-first">
          <div className="bg-gradient-to-br from-surface to-card border border-border rounded-2xl p-10 w-full max-w-[380px] text-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle,var(--accent-glow)_0%,transparent_70%)] pointer-events-none" />
            <div className="text-7xl mb-4 drop-shadow-[0_8px_32px_var(--accent-glow)]">📱</div>
            {heroProduct && (
              <>
                <div className="font-display text-2xl tracking-wider">{heroProduct.name.toUpperCase()}</div>
                <div className="text-primary text-xl font-bold mt-2">{fmt(heroProduct.price)} DA</div>
                <div className="text-xs text-muted-foreground mt-1">{heroProduct.specs}</div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1280px] mx-auto px-6 pb-10" ref={productsRef}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                activeCat === c.id
                  ? "bg-primary border-primary text-primary-foreground font-semibold shadow-[0_4px_15px_var(--accent-glow)]"
                  : "bg-surface border-border text-muted-foreground hover:border-primary hover:text-foreground hover:shadow-[0_0_10px_var(--accent-glow)]"
              }`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-[1280px] mx-auto px-6 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-3xl tracking-wider">
            {activeCat === "all" ? "TOUS LES PRODUITS" : CATEGORIES.find(c => c.id === activeCat)?.name.toUpperCase()}
          </h2>
          <span className="text-sm text-muted-foreground">{filtered.length} produit{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        {isLoading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-2 animate-pulse">⏳</div>
            <div className="text-muted-foreground text-sm">Chargement…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-2 grayscale opacity-50">🔍</div>
            <div className="text-muted-foreground text-sm">Aucun produit trouvé</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p, idx) => (
              <div
                key={p.id}
                className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-all hover:border-primary hover:-translate-y-1 hover:shadow-[0_12px_40px_var(--accent-glow)] animate-[slide-up_0.4s_ease_backwards]"
                style={{ animationDelay: `${idx * 0.04}s` }}
              >
                <div
                  className="h-[220px] flex items-center justify-center text-6xl bg-transparent relative transition-colors"
                  onClick={() => { setSelectedProduct(p); setModalQty(1); }}
                >
                  {p.badge && (
                    <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow ${badgeClasses[getBadgeVariant(p.badge)]}`}>
                      {p.badge}
                    </span>
                  )}
                  <img
                    src={p.img && p.img.startsWith("http") ? p.img : FALLBACK_IMG}
                    alt={p.name}
                    className="w-full h-full object-contain p-3"
                    loading="lazy"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
                    }}
                  />
                </div>
                <div className="p-4" onClick={() => { setSelectedProduct(p); setModalQty(1); }}>
                  <div className="text-[11px] text-primary uppercase tracking-[1.5px] font-semibold">{p.brand}</div>
                  <div className="text-sm font-semibold mt-1 leading-tight">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-1.5 hidden sm:block">{p.specs}</div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-lg font-bold">{fmt(p.price)} DA</span>
                    {p.oldPrice && <span className="text-sm text-muted-foreground line-through">{fmt(p.oldPrice)} DA</span>}
                  </div>
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    className="flex-1 bg-surface border border-border py-2.5 rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-[0_4px_15px_var(--accent-glow)] transition-all"
                    onClick={e => { e.stopPropagation(); addToCart(p); }}
                  >
                    Ajouter au panier
                  </button>
                  <button
                    className="border border-border text-green-500 px-3 rounded-lg hover:bg-green-500/10 hover:border-green-500 transition-all"
                    onClick={e => { e.stopPropagation(); quickOrder(p); }}
                    title="Commander via WhatsApp"
                  >
                    <WhatsAppIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-[fade-in_0.2s]" onClick={() => setSelectedProduct(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto animate-[slide-up_0.3s] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="h-[280px] flex items-center justify-center text-[100px] bg-white relative">
              <button className="absolute top-4 right-4 bg-black/50 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-danger transition-colors" onClick={() => setSelectedProduct(null)}>
                <X className="w-5 h-5" />
              </button>
              {selectedProduct.badge && (
                <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow ${badgeClasses[getBadgeVariant(selectedProduct.badge)]}`}>
                  {selectedProduct.badge}
                </span>
              )}
              {selectedProduct.img ? <img src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full object-contain p-4" /> : <span className="text-6xl text-muted-foreground">📦</span>}
            </div>
            <div className="p-6">
              <div className="text-xs text-primary uppercase tracking-[2px] font-semibold">{selectedProduct.brand}</div>
              <div className="font-display text-3xl tracking-wide mt-1">{selectedProduct.name}</div>
              <div className="text-sm text-muted-foreground mt-2">{selectedProduct.specs}</div>
              <div className="flex gap-0.5 text-primary mt-3 items-center">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3" fill={i <= 4 ? "currentColor" : "none"} />)}
                <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <span className="text-2xl font-bold">{fmt(selectedProduct.price)} DA</span>
                {selectedProduct.oldPrice && <span className="text-base text-muted-foreground line-through">{fmt(selectedProduct.oldPrice)} DA</span>}
                {selectedProduct.oldPrice && (
                  <span className="text-sm text-success font-semibold bg-success/10 px-2 py-0.5 rounded">
                    -{Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="mt-5 text-sm text-muted-foreground leading-relaxed p-4 bg-surface rounded-xl border border-border">
                Produit original {selectedProduct.brand} disponible chez BounourTech. Garantie et livraison à domicile dans les 58 wilayas. Pour plus d'informations, n'hésitez pas à nous contacter via WhatsApp.
              </div>
              <div className="flex gap-2.5 mt-6">
                <div className="flex items-center border border-border rounded-lg overflow-hidden bg-surface">
                  <button className="w-9 h-10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setModalQty(q => Math.max(1, q - 1))}><Minus className="w-3.5 h-3.5" /></button>
                  <span className="w-10 text-center text-sm font-semibold">{modalQty}</span>
                  <button className="w-9 h-10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setModalQty(q => q + 1)}><Plus className="w-3.5 h-3.5" /></button>
                </div>
                <button
                  className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold shadow-[0_4px_15px_var(--accent-glow)] hover:shadow-[0_6px_20px_var(--accent-glow)] hover:-translate-y-0.5 transition-all"
                  onClick={() => { addToCart(selectedProduct, modalQty); setSelectedProduct(null); }}
                >
                  Ajouter — {fmt(selectedProduct.price * modalQty)} DA
                </button>
              </div>
              <button
                className="w-full mt-3 bg-green-600 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(37,211,102,0.3)] transition-all"
                onClick={() => quickOrder(selectedProduct)}
              >
                <WhatsAppIcon /> Commander directement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] animate-[fade-in_0.2s]" onClick={() => setCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-[min(420px,90vw)] bg-card border-l border-border z-[301] flex flex-col animate-[slide-right_0.3s_ease] shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
            <div className="p-5 border-b border-border flex justify-between items-center bg-surface">
              <h3 className="font-display text-2xl tracking-wider">PANIER ({cartCount})</h3>
              <button className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3 grayscale opacity-50">🛒</div>
                  <div className="text-muted-foreground text-sm">Votre panier est vide</div>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex gap-3.5 py-3.5 border-b border-border">
                  <div className="w-14 h-14 bg-surface rounded-lg flex items-center justify-center text-3xl shrink-0">{item.img}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-sm text-primary font-semibold mt-0.5">{fmt(item.price * item.qty)} DA</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button className="w-[26px] h-[26px] bg-surface border border-border rounded-md flex items-center justify-center hover:border-primary hover:text-primary transition-colors" onClick={() => updateQty(item.id, -1)}><Minus className="w-3.5 h-3.5" /></button>
                      <span className="text-sm font-semibold min-w-[18px] text-center">{item.qty}</span>
                      <button className="w-[26px] h-[26px] bg-surface border border-border rounded-md flex items-center justify-center hover:border-primary hover:text-primary transition-colors" onClick={() => updateQty(item.id, 1)}><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-danger transition-colors self-start mt-0.5" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-6 border-t border-border bg-surface overflow-y-auto max-h-[60vh]">
                <div className="flex justify-between text-sm text-muted-foreground mb-2"><span>Sous-total</span><span>{fmt(cartTotal)} DA</span></div>
                <div className="flex justify-between text-sm text-muted-foreground mb-2"><span>Livraison</span><span className="text-primary">À confirmer</span></div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-border"><span>Total</span><span className="text-primary">{fmt(cartTotal)} DA</span></div>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Nom complet *</label>
                    <input className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_var(--accent-glow)] transition-all text-foreground" placeholder="Votre nom" value={orderName} onChange={e => setOrderName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Téléphone *</label>
                    <input className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_var(--accent-glow)] transition-all text-foreground" placeholder="0X XX XX XX XX" value={orderPhone} onChange={e => setOrderPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Wilaya</label>
                    <select className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary transition-all cursor-pointer appearance-none text-foreground" value={orderWilaya} onChange={e => setOrderWilaya(e.target.value)}>
                      {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Adresse</label>
                    <input className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_var(--accent-glow)] transition-all text-foreground" placeholder="Rue, cité, commune…" value={orderAddress} onChange={e => setOrderAddress(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Note</label>
                    <textarea className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:shadow-[0_0_8px_var(--accent-glow)] transition-all resize-y min-h-[60px] text-foreground" placeholder="Instructions spéciales…" value={orderNote} onChange={e => setOrderNote(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Mode de paiement *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: "dahabia" as const, label: "Dahabia", icon: "💳" },
                        { value: "cib" as const, label: "CIB", icon: "🏦" },
                        { value: "cash" as const, label: "Cash", icon: "💵" },
                      ]).map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`flex flex-col items-center gap-1 py-3 rounded-lg border text-sm font-medium transition-all ${orderPayment === opt.value ? "border-primary bg-primary/10 text-primary shadow-[0_0_8px_var(--accent-glow)]" : "border-border bg-card text-muted-foreground hover:border-primary/50"}`}
                          onClick={() => setOrderPayment(opt.value)}
                        >
                          <span className="text-lg">{opt.icon}</span>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    className="w-full bg-green-600 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(37,211,102,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                    onClick={sendWhatsApp}
                    disabled={!orderName.trim() || !orderPhone.trim()}
                  >
                    <WhatsAppIcon /> Confirmer via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-10">
        <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="font-display text-2xl tracking-widest flex items-baseline gap-1">
              BOUNOUR<span className="text-primary text-sm tracking-[5px]">TECH</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[320px] mt-3">
              Votre destination tech à Blida. Smartphones, accessoires, gaming et plus encore. Produits originaux avec garantie. Livraison dans les 58 wilayas.
            </p>
          </div>
          <div>
            <div className="font-display text-lg tracking-wider mb-4 text-muted-foreground">CONTACT</div>
            <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all mb-2.5 no-underline" href={`tel:${STORE.phone}`}><Phone className="w-3.5 h-3.5" />{STORE.phone}</a>
            <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all mb-2.5 no-underline" href={`mailto:${STORE.email}`}><Mail className="w-3.5 h-3.5" />{STORE.email}</a>
            <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all mb-2.5 no-underline" href="https://g.co/kgs/eKjmiHm" target="_blank" rel="noopener noreferrer"><MapPin className="w-3.5 h-3.5" />{STORE.address}</a>
          </div>
          <div>
            <div className="font-display text-lg tracking-wider mb-4 text-muted-foreground">CATÉGORIES</div>
            {CATEGORIES.slice(1, 8).map(c => (
              <span key={c.id} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:translate-x-1 transition-all mb-2.5 cursor-pointer" onClick={() => { setActiveCat(c.id); scrollToProducts(); }}>{c.name}</span>
            ))}
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-6 py-5 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© 2025 BounourTech — Tous droits réservés</span>
          <div className="flex gap-3">
            <a className="hover:text-primary transition-colors no-underline text-muted-foreground" href={STORE.socials.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            <a className="hover:text-primary transition-colors no-underline text-muted-foreground" href={STORE.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="hover:text-primary transition-colors no-underline text-muted-foreground" href={STORE.socials.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
            <a className="hover:text-primary transition-colors no-underline text-muted-foreground" href={STORE.socials.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
