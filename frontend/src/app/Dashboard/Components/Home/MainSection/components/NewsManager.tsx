import React, { useState, useEffect, useCallback, ChangeEvent, FC, useMemo } from "react";
import { FaFacebook, FaWhatsapp, FaShareAlt } from "react-icons/fa";
import { Edit2, Trash2, Star, TrendingUp, EyeOff, Calendar, Tag, Eye, Newspaper } from "lucide-react";
import {
    NewsItem,
    useNewsBySection,
    useAddNews,
    useUpdateNews,
    useDeleteNews,
    useSetNewsFlags
} from "@/app/hooks/NewsApi";
import { compressImage } from "@/Utils/Utils";

const CATEGORIES = [
    { id: 'home', label: 'Home' },
    { id: 'india', label: 'India' },
    { id: 'sports', label: 'Sports' },
    { id: 'business', label: 'Business' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'lifestyle', label: 'Fashion' },
    { id: 'world', label: 'World' },
    { id: 'awards', label: 'Awards' },
] as const;

const WORLD_SUB_CATEGORIES = [
    "India", "Europe", "USA", "Africa", "Asia", "Middle East"
];

type NewsCategory = typeof CATEGORIES[number]['id'];

interface NewsManagerProps {
    section: 'news_management' | 'previous_news';
    initialDraft?: NewsItem | null;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    userAuthData: any;
    showNotification: (message: string, type: "success" | "error") => void;
}

const NewsManager: FC<NewsManagerProps> = ({
    section,
    initialDraft,
    canCreate,
    canUpdate,
    canDelete,
    userAuthData,
    showNotification
}) => {
    const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('india');
    const [page, setPage] = useState(1);
    const limit = 20;

    // Only fetch news list if we are in 'previous_news' section or editing
    const shouldFetchList = section === 'previous_news';
    const { data: newsData, loading: fetchLoading, error: fetchError, refetch } = useNewsBySection(
        selectedCategory,
        true,
        page,
        shouldFetchList ? limit : 1
    );

    const { mutate: addNews, loading: addLoading } = useAddNews();
    const { mutate: updateNews, loading: updateLoading } = useUpdateNews(selectedCategory);
    const { mutate: deleteNews } = useDeleteNews(selectedCategory);
    const { mutate: setFlags, loading: flagsLoading } = useSetNewsFlags(selectedCategory);

    const [editingSlug, setEditingSlug] = useState<string | null>(null);
    const [formState, setFormState] = useState<Partial<NewsItem>>({
        title: "",
        slug: "",
        category: "India",
        content: "",
        tags: [],
        status: "draft",
        targetLink: "",
        nominationLink: "",
        isLatest: false,
        isTrending: false,
    });

    const [tagsInput, setTagsInput] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showImage, setShowImage] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

    const resetForm = useCallback(() => {
        setFormState({
            title: "",
            slug: "",
            category: selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1),
            content: "",
            tags: [],
            status: "draft",
            targetLink: "",
            nominationLink: "",
            isLatest: false,
            isTrending: false,
        });
        setImagePreview(null);
        setShowImage(false);
        setEditingSlug(null);
        setTagsInput("");
    }, [selectedCategory]);

    useEffect(() => {
        if (initialDraft) {
            const rawCategory = initialDraft.category?.toLowerCase() || 'india';
            const matchedCat = CATEGORIES.find(c => c.id === rawCategory)?.id || 'india';
            setSelectedCategory(matchedCat as NewsCategory);
            setFormState({
                ...initialDraft,
                status: initialDraft.status || 'draft',
                category: matchedCat.charAt(0).toUpperCase() + matchedCat.slice(1),
                isLatest: initialDraft.isLatest || false,
                isTrending: initialDraft.isTrending || false,
            });
            setEditingSlug(initialDraft.slug);
            setTagsInput(initialDraft.tags?.join(", ") || "");
            setImagePreview(initialDraft.image || null);
            setShowImage(!!initialDraft.image);
            window.scrollTo({ top: 120, behavior: "smooth" });
        }
    }, [initialDraft]);

    const generateSlug = (title: string) =>
        title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();

    const handleChange = useCallback(
        (field: keyof NewsItem) =>
            (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const value = e.target.value;
                setFormState((prev) => {
                    const updated = { ...prev, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
                    if (field === "title" && !editingSlug) {
                        updated.slug = generateSlug(value as string);
                    }
                    return updated;
                });
            },
        [editingSlug]
    );

    const handleTagsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setTagsInput(val);
        const tags = val.split(",").map((t) => t.trim()).filter(Boolean);
        setFormState((prev) => ({ ...prev, tags }));
    }, []);

    const handleImageChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showNotification("Please select an image file", "error");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // Increased limit as we compress
                showNotification("Image too large (max 10MB)", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                const dataUrl = event.target?.result as string;

                // Compress image before setting to state
                const optimizedDataUrl = await compressImage(dataUrl, 1200, 0.6) as string;

                setFormState((prev) => ({ ...prev, image: optimizedDataUrl }));
                setImagePreview(optimizedDataUrl);
                setShowImage(true);
            };
            reader.readAsDataURL(file);
            e.target.value = "";
        },
        [showNotification]
    );

    const handleAdd = useCallback(async () => {
        if (!canCreate) {
            showNotification("No permission to create articles", "error");
            return;
        }
        if (!formState.title || !formState.slug || !formState.content) {
            showNotification("Title, Slug and Content are required", "error");
            return;
        }
        try {
            const authorName = userAuthData?.name || "Time Cyber Media";
            const currentUserId = userAuthData?.userId || userAuthData?._id || userAuthData?.id;

            await addNews({
                ...formState,
                section: selectedCategory,
                author: authorName,
                authorId: currentUserId || null,
                tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
                publishedAt: new Date().toISOString(),
            } as NewsItem & { section: string });
            showNotification(`Article created by ${authorName}`, "success");
            resetForm();
            refetch();
        } catch (err: any) {
            showNotification(err.message || "Failed to create article", "error");
        }
    }, [canCreate, formState, addNews, selectedCategory, resetForm, refetch, showNotification, userAuthData, tagsInput]);

    const startEdit = useCallback(
        (item: NewsItem) => {
            if (!canUpdate) {
                showNotification("No permission to edit articles", "error");
                return;
            }
            setEditingSlug(item.slug);
            setFormState({ ...item });
            setTagsInput(item.tags?.join(", ") || "");
            setImagePreview(item.image || null);
            setShowImage(!!item.image);
            window.scrollTo({ top: 120, behavior: "smooth" });
        },
        [canUpdate, showNotification]
    );

    const handleUpdate = useCallback(async () => {
        if (!canUpdate || !editingSlug) return;
        try {
            const authorName = userAuthData?.name || "Time Cyber Media";
            const currentUserId = userAuthData?.userId || userAuthData?._id || userAuthData?.id;

            await updateNews({
                slug: editingSlug,
                news: {
                    ...formState,
                    author: authorName,
                    authorId: currentUserId || null,
                    tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean)
                },
            });
            showNotification("Article updated", "success");
            resetForm();
            refetch();
        } catch (err: any) {
            showNotification(err.message || "Update failed", "error");
        }
    }, [canUpdate, editingSlug, formState, updateNews, resetForm, refetch, showNotification, userAuthData, tagsInput]);

    const handleDelete = useCallback(
        async (slug: string) => {
            if (!canDelete) {
                showNotification("No permission to delete articles", "error");
                return;
            }
            if (!confirm("Delete this article permanently?")) return;
            try {
                await deleteNews({ slug });
                showNotification("Article deleted", "success");
                refetch();
            } catch (err: any) {
                showNotification(err.message || "Delete failed", "error");
            }
        },
        [canDelete, deleteNews, refetch, showNotification]
    );

    const handleToggleFlag = useCallback(
        async (slug: string, field: "isLatest" | "isTrending" | "isHidden", newValue: boolean) => {
            if (flagsLoading) return;
            try {
                await setFlags({ slug, [field]: newValue });
                showNotification(
                    `Article ${newValue ? "marked as" : "removed from"} ${field === "isLatest" ? "Latest" : field === "isTrending" ? "Trending" : "Hidden"
                    }`,
                    "success"
                );
                refetch();
            } catch (err: any) {
                showNotification(err.message || "Failed to update flag", "error");
            }
        },
        [setFlags, flagsLoading, showNotification, refetch]
    );

    const filteredAndSortedItems = useMemo<NewsItem[]>(() => {
        let result = [...(newsData ?? [])];

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (item) =>
                    item.title.toLowerCase().includes(q) ||
                    item.content.toLowerCase().includes(q) ||
                    item.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        if (filterStatus !== "all") {
            result = result.filter((item) => item.status === filterStatus);
        }

        if (sortBy === "newest") {
            result.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
        } else if (sortBy === "oldest") {
            result.sort((a, b) => new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime());
        } else if (sortBy === "title") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [newsData, searchQuery, filterStatus, sortBy]);

    const getShareLink = (item: Partial<NewsItem>, platform: 'facebook' | 'whatsapp') => {
        if (!item.slug) return "#";
        const siteUrl = "https://www.timecybermedia.com";
        const sectionSlug = selectedCategory.toLowerCase();
        const categorySlug = (item.category || selectedCategory).toLowerCase().replace(/\s+/g, '-');
        const fullUrl = `${siteUrl}/Pages/${sectionSlug}/${categorySlug}/${item.slug}`;
        const shareText = `${item.title} | View more news on Time Cyber Media:`;

        if (platform === 'facebook') {
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
        }
        if (platform === 'whatsapp') {
            return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + fullUrl)}`;
        }
        return "#";
    };

    const isEditing = editingSlug !== null;

    return (
        <div className="space-y-8 font-['Outfit']">
            {section === 'previous_news' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Select Category to View News:</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${selectedCategory === cat.id
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                                    }`}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setPage(1); // Reset page on category change
                                }}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {(section === 'news_management' || isEditing) && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <span className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center"><Edit2 size={20} className="text-amber-600" /></span> Edit Article
                                </>
                            ) : (
                                <>
                                    <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600">+</span> Create Article
                                </>
                            )}
                        </h2>
                        {isEditing && (
                            <button onClick={resetForm} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 transition-colors">X</button>
                        )}
                    </div>

                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                    value={formState.title ?? ""}
                                    onChange={handleChange("title")}
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Slug <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-mono text-sm"
                                    value={formState.slug ?? ""}
                                    onChange={handleChange("slug")}
                                    placeholder="article-slug"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white appearance-none"
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        const newCat = e.target.value as NewsCategory;
                                        setSelectedCategory(newCat);
                                        setFormState(prev => ({
                                            ...prev,
                                            category: newCat.charAt(0).toUpperCase() + newCat.slice(1)
                                        }));
                                    }}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sub-category</label>
                                {selectedCategory === 'world' ? (
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white appearance-none"
                                        value={formState.subCategory ?? ""}
                                        onChange={handleChange("subCategory")}
                                    >
                                        <option value="">Select Sub-Region</option>
                                        {WORLD_SUB_CATEGORIES.map(sub => (
                                            <option key={sub} value={sub}>{sub}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                        value={formState.subCategory ?? ""}
                                        onChange={handleChange("subCategory")}
                                        placeholder="Optional sub-category"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                <select
                                    value={formState.status ?? "draft"}
                                    onChange={handleChange("status")}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white appearance-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3 flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={formState.isLatest || false}
                                        onChange={(e) => setFormState(prev => ({...prev, isLatest: e.target.checked}))}
                                    />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"><Star size={16} className="text-yellow-500"/> Latest News</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={formState.isTrending || false}
                                        onChange={(e) => setFormState(prev => ({...prev, isTrending: e.target.checked}))}
                                    />
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1"><TrendingUp size={16} className="text-orange-500"/> Trending News</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 lg:col-span-1 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden group hover:border-blue-500/50 transition-colors">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                                <div
                                    className="h-full min-h-[140px] flex flex-col items-center justify-center p-4 cursor-pointer relative"
                                    onClick={() => document.getElementById("file-upload")?.click()}
                                >
                                    {showImage || imagePreview || formState.image ? (
                                        <div className="absolute inset-0 group">
                                            <img
                                                src={imagePreview || formState.image || ""}
                                                alt="Preview"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormState((prev) => ({ ...prev, image: "" }));
                                                        setImagePreview(null);
                                                        setShowImage(false);
                                                    }}
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-2 text-gray-400">
                                            <p className="text-xs font-bold uppercase tracking-widest">Click to upload</p>
                                            <p className="text-[10px]">PNG, JPG, max 10MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Summary</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white resize-none"
                                    value={formState.summary ?? ""}
                                    onChange={handleChange("summary")}
                                    rows={2}
                                    placeholder="Write a catchy summary for previews..."
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content <span className="text-red-500">*</span></label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white font-serif"
                                    value={formState.content ?? ""}
                                    onChange={handleChange("content")}
                                    rows={12}
                                    placeholder="Write article content here..."
                                />
                            </div>

                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">#</span>
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                                        value={tagsInput}
                                        onChange={handleTagsChange}
                                        placeholder="comma, separated, tags"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap gap-4 border-t border-gray-100 dark:border-gray-700 pt-8">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={handleUpdate} 
                                        disabled={!canUpdate || updateLoading}
                                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex-1 md:flex-none disabled:opacity-50 flex justify-center items-center gap-2"
                                    >
                                        {updateLoading ? (
                                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
                                        ) : "Update Article"}
                                    </button>
                                    <button onClick={resetForm} className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex-1 md:flex-none">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleAdd}
                                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
                                    disabled={!canCreate || addLoading}
                                >
                                    {addLoading ? (
                                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</>
                                    ) : "Create Article"}
                                </button>
                            )}
                        </div>

                        {formState.slug && (
                            <div className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-3 font-bold text-blue-700 dark:text-blue-400 text-sm">
                                    <FaShareAlt className="text-lg" /> Share this article
                                </div>
                                <div className="flex gap-3 w-full md:w-auto">
                                    <a
                                        href={getShareLink(formState, 'facebook')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1877F2] text-white text-xs font-bold rounded-lg hover:brightness-110 shadow-md shadow-blue-500/20 transition-all"
                                    ><FaFacebook /> Facebook</a>
                                    <a
                                        href={getShareLink(formState, 'whatsapp')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#25D366] text-white text-xs font-bold rounded-lg hover:brightness-110 shadow-md shadow-emerald-500/20 transition-all"
                                    ><FaWhatsapp /> WhatsApp</a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {section === 'previous_news' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 transition-all hover:bg-white dark:hover:bg-gray-900 hover:shadow-xl hover:shadow-blue-500/5 group">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                                <span className="w-2 h-8 bg-blue-600 rounded-full group-hover:h-10 transition-all" />
                                Previous News <span className="text-gray-400 font-medium">({newsData?.length || 0})</span>
                            </h2>
                            <p className="text-sm text-gray-500 font-medium ml-5">Managing {selectedCategory} archives</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative group/search w-full md:w-64">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/search:text-blue-500 transition-colors pointer-events-none">&#128269;</span>
                                <input
                                    type="text"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm font-medium placeholder-gray-400"
                                    placeholder="Search archive..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                                <select
                                    className="bg-transparent px-3 py-1.5 text-xs font-black uppercase tracking-widest text-gray-500 focus:text-blue-600 outline-none cursor-pointer"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                >
                                    <option value="all">All</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                                <select
                                    className="bg-transparent px-3 py-1.5 text-xs font-black uppercase tracking-widest text-gray-500 focus:text-blue-600 outline-none cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                                title={viewMode === 'grid' ? 'LIST' : 'GRID'}
                            >
                                {viewMode === 'grid' ? 'LIST' : 'GRID'}
                            </button>
                        </div>
                    </div>

                    {fetchLoading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-blue-50 dark:border-blue-900/20 rounded-full" />
                                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Loading News</h3>
                                <p className="text-sm text-gray-500">Retrieving from the vault...</p>
                            </div>
                        </div>
                    ) : filteredAndSortedItems.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-900/20 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem] p-24 text-center space-y-6">
                            <span className="text-8xl block grayscale opacity-20 transform hover:scale-110 transition-transform cursor-pointer">&#128194;</span>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Nothing to show</h3>
                                <p className="text-gray-500 max-w-xs mx-auto text-sm font-medium leading-relaxed">Try adjusting your filters or use different keywords to find what you're looking for.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                                : "space-y-6 max-w-5xl mx-auto"
                            }>
                                {filteredAndSortedItems.map((item) => (
                                    <article
                                        key={item.slug}
                                        className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex ${viewMode === "list" ? "flex-row" : "flex-col"}`}
                                    >
                                        {/* Image */}
                                        <div className={`relative overflow-hidden flex-shrink-0 ${viewMode === "list" ? "w-52 h-full" : "aspect-video w-full"}`}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full min-h-[120px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
                                                    <Newspaper size={32} strokeWidth={1.5} />
                                                    <span className="text-xs font-medium">No Image</span>
                                                </div>
                                            )}
                                            {/* Status badge */}
                                            <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${item.status === 'published' ? 'bg-emerald-500 text-white' : item.status === 'archived' ? 'bg-gray-500 text-white' : 'bg-amber-400 text-white'}`}>
                                                {item.status || 'draft'}
                                            </div>
                                            {/* Active flags overlay */}
                                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                {item.isLatest && <span className="bg-yellow-400 text-yellow-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Latest</span>}
                                                {item.isTrending && <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Trending</span>}
                                                {item.isHidden && <span className="bg-gray-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Hidden</span>}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex flex-col flex-1 gap-3">
                                            {/* Category + Date */}
                                            <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Tag size={11} />
                                                    {item.category || selectedCategory}
                                                </span>
                                                {item.publishedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={11} />
                                                        {new Date(item.publishedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                                                {item.title}
                                            </h3>

                                            {/* Action bar */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all active:scale-95"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={13} />
                                                    Edit
                                                </button>
                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(item.slug)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition-all active:scale-95"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={13} />
                                                    Del
                                                </button>

                                                {/* Flag buttons */}
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <button
                                                        onClick={() => handleToggleFlag(item.slug, 'isLatest', !item.isLatest)}
                                                        disabled={!canUpdate || flagsLoading}
                                                        className={`p-1.5 rounded-lg transition-all ${item.isLatest ? 'bg-yellow-400 text-yellow-900' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'}`}
                                                        title="Toggle Latest"
                                                    >
                                                        <Star size={14} fill={item.isLatest ? 'currentColor' : 'none'} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleFlag(item.slug, 'isTrending', !item.isTrending)}
                                                        disabled={!canUpdate || flagsLoading}
                                                        className={`p-1.5 rounded-lg transition-all ${item.isTrending ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30'}`}
                                                        title="Toggle Trending"
                                                    >
                                                        <TrendingUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleFlag(item.slug, 'isHidden', !item.isHidden)}
                                                        disabled={!canUpdate || flagsLoading}
                                                        className={`p-1.5 rounded-lg transition-all ${item.isHidden ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                                        title="Toggle Hidden"
                                                    >
                                                        <EyeOff size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="flex justify-center items-center gap-10 py-16">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || fetchLoading}
                                    className="w-16 h-16 flex items-center justify-center rounded-[2rem] bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl disabled:opacity-20 disabled:scale-90 transition-all hover:border-blue-600 group"
                                >
                                    <span className="text-2xl group-hover:-translate-x-1.5 transition-transform">&larr;</span>
                                </button>

                                <div className="text-center">
                                    <div className="text-4xl font-black text-gray-900 dark:text-white tracking-widest">{page}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Archive Page</div>
                                </div>

                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={filteredAndSortedItems.length < limit || fetchLoading}
                                    className="w-16 h-16 flex items-center justify-center rounded-[2rem] bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 shadow-xl disabled:opacity-20 disabled:scale-90 transition-all hover:border-blue-600 group"
                                >
                                    <span className="text-2xl group-hover:translate-x-1.5 transition-transform">&rarr;</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default NewsManager;
