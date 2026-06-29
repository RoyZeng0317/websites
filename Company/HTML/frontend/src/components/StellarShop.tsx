import { Timestamp, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import {
    ShoppingCart, X, Plus, Minus, Trash2,
    Package, ExternalLink, Search, FileText, AlertCircle,
} from 'lucide-react';
import { db, isFirebaseReady } from '../lib/firebase';

interface ShopProduct {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    specs: string[];
    inStock: boolean;
    datasheetUrl?: string;
    createdAt: Timestamp;
}

interface CartItem {
    productId: string;
    quantity: number;
}

interface StellarShopProps {
    className?: string;
}

export default function StellarShop({ className }: StellarShopProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [category, setCategory] = useState('全部');
    const [products, setProducts] = useState<ShopProduct[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseReady) { setLoading(false); return; }
        const q = query(collection(db, 'shop_products'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, snap => {
            setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as ShopProduct)));
            setLoading(false);
        }, () => setLoading(false));
        return unsub;
    }, []);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(products.map(p => p.category))).filter(Boolean).sort();
        return ['全部', ...cats];
    }, [products]);

    const filtered = useMemo(() => products.filter(p => {
        const matchCat = category === '全部' || p.category === category;
        const q = search.toLowerCase();
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchCat && matchSearch;
    }), [products, category, search]);

    function addToCart(productId: string) {
        setCart(c => {
            const existing = c.find(i => i.productId === productId);
            if (existing) return c.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i);
            return [...c, { productId, quantity: 1 }];
        });
    }

    function updateQty(productId: string, delta: number) {
        setCart(c => c.map(i => i.productId === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
    }

    function removeFromCart(productId: string) {
        setCart(c => c.filter(i => i.productId !== productId));
    }

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const cartWithProducts = cart
        .map(item => ({ ...item, product: products.find(p => p.id === item.productId) }))
        .filter(i => i.product);

    if (!isFirebaseReady) {
        return (
            <div className="bg-gray-950 text-gray-100 min-h-screen flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Firebase 尚未設定</h2>
                    <p className="text-sm text-gray-400">
                        請在 <code className="text-cyan-400">src/.env</code> 填入 Firebase 專案設定值後重新建置。
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-gray-950 text-gray-100 min-h-screen ${className ?? ''}`}>

            {/* Header */}
            <section className="relative overflow-hidden py-20 px-6 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-gray-950 to-indigo-900/20 pointer-events-none" />
                <div className="relative max-w-2xl mx-auto">
                    <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
                        Stellarix Electronics
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        零件<span className="text-cyan-400">商店</span>
                    </h1>
                    <p className="text-gray-400 text-base leading-relaxed">
                        瀏覽我們的電子元件目錄，加入詢價清單後一鍵提交需求。
                    </p>
                </div>
            </section>

            {/* Sticky filter bar */}
            <div className="sticky top-16 z-30 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 px-6 py-3">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

                    {/* Category tabs */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    category === cat
                                        ? 'bg-cyan-500 text-gray-950'
                                        : 'bg-gray-800 text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 items-center w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="搜尋元件…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-cyan-600 transition-colors w-full sm:w-48"
                            />
                        </div>

                        {/* Cart button */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-4 py-2 rounded-xl text-sm transition-colors flex-shrink-0"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            詢價清單
                            {totalItems > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <section className="py-10 px-6 max-w-6xl mx-auto pb-24">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Package className="w-12 h-12 text-gray-700" />
                        <p className="text-gray-500 text-sm">找不到符合的元件</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(product => {
                            const inCart = cart.find(i => i.productId === product.id);
                            return (
                                <div
                                    key={product.id}
                                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:border-cyan-800 transition-colors duration-300 group"
                                >
                                    {/* Image */}
                                    <div className="h-44 bg-gray-800 overflow-hidden">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-10 h-10 text-gray-700" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col gap-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-cyan-400 bg-cyan-900/30 px-2.5 py-1 rounded-full">
                                                {product.category}
                                            </span>
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                                product.inStock
                                                    ? 'text-green-400 bg-green-900/30'
                                                    : 'text-gray-500 bg-gray-800'
                                            }`}>
                                                {product.inStock ? '現貨' : '洽詢'}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-100 mb-1">{product.name}</h3>
                                            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{product.description}</p>
                                        </div>

                                        {product.specs?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.specs.slice(0, 4).map((spec, i) => (
                                                    <span key={i} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-md">
                                                        {spec}
                                                    </span>
                                                ))}
                                                {product.specs.length > 4 && (
                                                    <span className="text-xs text-gray-600 px-2 py-0.5">
                                                        +{product.specs.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex-1" />

                                        <div className="flex items-center gap-2 pt-1">
                                            {product.datasheetUrl && (
                                                <a
                                                    href={product.datasheetUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-cyan-400 transition-colors"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    規格書
                                                </a>
                                            )}
                                            <div className="flex-1" />
                                            {inCart ? (
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQty(product.id, -1)}
                                                        className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-medium w-6 text-center">{inCart.quantity}</span>
                                                    <button
                                                        onClick={() => updateQty(product.id, 1)}
                                                        className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => addToCart(product.id)}
                                                    disabled={!product.inStock}
                                                    className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 disabled:text-gray-500 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    {product.inStock ? '加入清單' : '無庫存'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Cart sidebar */}
            {cartOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setCartOpen(false)} />
                    <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-gray-950 border-l border-gray-800 z-50 flex flex-col shadow-2xl">

                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                            <div className="flex items-center gap-2.5">
                                <ShoppingCart className="w-5 h-5 text-cyan-400" />
                                <h2 className="font-bold">詢價清單</h2>
                                {totalItems > 0 && (
                                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-full">
                                        {totalItems} 件
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="text-gray-500 hover:text-gray-100 transition-colors p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                            {cartWithProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                    <ShoppingCart className="w-12 h-12 text-gray-700" />
                                    <p className="text-gray-500 text-sm">清單為空，請加入元件</p>
                                </div>
                            ) : (
                                cartWithProducts.map(({ productId, quantity, product }) => (
                                    <div key={productId} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                                            {product!.imageUrl ? (
                                                <img src={product!.imageUrl} alt={product!.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-gray-700" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-100 truncate">{product!.name}</p>
                                            <p className="text-xs text-cyan-400 mt-0.5">{product!.category}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQty(productId, -1)}
                                                    className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-medium w-5 text-center">{quantity}</span>
                                                <button
                                                    onClick={() => updateQty(productId, 1)}
                                                    className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(productId)}
                                                    className="ml-auto text-gray-600 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cartWithProducts.length > 0 && (
                            <div className="px-6 py-5 border-t border-gray-800 flex flex-col gap-3">
                                <p className="text-xs text-gray-500">
                                    共 {cart.length} 種元件，合計 {totalItems} 件
                                </p>
                                <a
                                    href="/order"
                                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    前往提交詢價單
                                </a>
                                <button
                                    onClick={() => setCart([])}
                                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    清空清單
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
