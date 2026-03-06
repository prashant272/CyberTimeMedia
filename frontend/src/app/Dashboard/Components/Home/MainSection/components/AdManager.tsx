"use client";
import React, { useState, useCallback, ChangeEvent, FC } from "react";
import Image from "next/image";
import { baseURL, compressImage } from "@/Utils/Utils";
import { Ad, useAllAds, useAddAd } from "@/app/hooks/useAds";

interface AdManagerProps {
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    showNotification: (message: string, type: "success" | "error") => void;
}

const AdManager: FC<AdManagerProps> = ({
    canCreate,
    canUpdate,
    canDelete,
    showNotification
}) => {
    const { data: adsData, loading: adsLoading, refetch: refetchAds } = useAllAds();
    const { mutate: addAd, loading: addAdLoading } = useAddAd();

    const [editingAdId, setEditingAdId] = useState<string | null>(null);
    const [adFormState, setAdFormState] = useState<Partial<Ad>>({
        title: "",
        link: "",
        headerImageUrl: "",
        sidebarImageUrl: "",
        imageUrl: "",
        isActive: true,
    });

    const [adHeaderPreview, setAdHeaderPreview] = useState<string | null>(null);
    const [adSidebarPreview, setAdSidebarPreview] = useState<string | null>(null);

    const resetAdForm = useCallback(() => {
        setAdFormState({
            title: "",
            link: "",
            headerImageUrl: "",
            sidebarImageUrl: "",
            imageUrl: "",
            isActive: true,
        });
        setAdHeaderPreview(null);
        setAdSidebarPreview(null);
        setEditingAdId(null);
    }, []);

    const handleAdChange = useCallback(
        (field: keyof Ad) =>
            (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const value = field === "isActive" ? e.target.value === "true" : e.target.value;
                setAdFormState((prev) => ({ ...prev, [field]: value }));
            },
        []
    );

    const handleAdImageChange = useCallback(
        (type: 'header' | 'sidebar') => (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                showNotification("Please select an image file", "error");
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit (we compress it)
                showNotification("Image too large (max 10MB)", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                const dataUrl = event.target?.result as string;

                // Compress image to ~1200px width with 0.6 quality
                const optimizedDataUrl = await compressImage(dataUrl, 1200, 0.6) as string;

                if (type === 'header') {
                    setAdFormState((prev) => ({ ...prev, headerImageUrl: optimizedDataUrl }));
                    setAdHeaderPreview(optimizedDataUrl);
                } else {
                    setAdFormState((prev) => ({ ...prev, sidebarImageUrl: optimizedDataUrl }));
                    setAdSidebarPreview(optimizedDataUrl);
                }
            };
            reader.readAsDataURL(file);
            e.target.value = "";
        },
        [showNotification]
    );

    const handleAddAd = useCallback(async () => {
        if (!canCreate) {
            showNotification("No permission to create ads", "error");
            return;
        }
        if (!adFormState.title || !adFormState.link || (!adFormState.headerImageUrl && !adFormState.sidebarImageUrl)) {
            showNotification("Title, Link, and at least one image (Header or Sidebar) are required", "error");
            return;
        }
        try {
            await addAd(adFormState as Omit<Ad, "_id" | "createdAt" | "updatedAt">);
            showNotification("Ad created successfully", "success");
            resetAdForm();
            refetchAds();
        } catch (err: any) {
            showNotification(err.message || "Failed to create ad", "error");
        }
    }, [canCreate, adFormState, addAd, resetAdForm, refetchAds, showNotification]);

    const handleUpdateAd = useCallback(async () => {
        if (!canUpdate || !editingAdId) return;
        try {
            const response = await fetch(`${baseURL}/promotions/update/${editingAdId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adFormState),
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.msg);
            showNotification("Ad updated successfully", "success");
            resetAdForm();
            refetchAds();
        } catch (err: any) {
            showNotification(err.message || "Failed to update ad", "error");
        }
    }, [canUpdate, editingAdId, adFormState, resetAdForm, refetchAds, showNotification]);

    const handleDeleteAd = useCallback(
        async (id: string) => {
            if (!canDelete) {
                showNotification("No permission to delete ads", "error");
                return;
            }
            if (!confirm("Delete this ad permanently?")) return;
            try {
                const response = await fetch(`${baseURL}/promotions/delete/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                if (!data.success) throw new Error(data.msg);
                showNotification("Ad deleted successfully", "success");
                refetchAds();
            } catch (err: any) {
                showNotification(err.message || "Failed to delete ad", "error");
            }
        },
        [canDelete, refetchAds, showNotification]
    );

    const startEditAd = useCallback(
        (ad: Ad) => {
            if (!canUpdate) {
                showNotification("No permission to edit ads", "error");
                return;
            }
            setEditingAdId(ad._id!);
            setAdFormState({ ...ad });
            setAdHeaderPreview(ad.headerImageUrl || ad.imageUrl || null);
            setAdSidebarPreview(ad.sidebarImageUrl || (ad.placement === 'sidebar' ? ad.imageUrl : null));
            window.scrollTo({ top: 120, behavior: "smooth" });
        },
        [canUpdate, showNotification]
    );

    return (
        <div className="p-4 md:p-6">
            {(canCreate || canUpdate) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {editingAdId ? (
                                <>
                                    <span className="text-2xl">✏️</span> Edit Advertisement
                                </>
                            ) : (
                                <>
                                    <span className="text-2xl">📢</span> Create Advertisement
                                </>
                            )}
                        </h2>
                        {editingAdId && (
                            <button onClick={resetAdForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                <span className="text-xl">✕</span>
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ad Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={adFormState.title ?? ""}
                                onChange={handleAdChange("title")}
                                placeholder="Enter ad title..."
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Target Link <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={adFormState.link ?? ""}
                                onChange={handleAdChange("link")}
                                placeholder="https://example.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                            <select
                                value={adFormState.isActive ? "true" : "false"}
                                onChange={handleAdChange("isActive")}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Header / In-Article Image</label>
                            <input
                                id="ad-header-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAdImageChange('header')}
                            />
                            <div
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                onClick={() => document.getElementById("ad-header-upload")?.click()}
                            >
                                {adHeaderPreview || adFormState.headerImageUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={adHeaderPreview || adFormState.headerImageUrl || ""}
                                            alt="Preview"
                                            className="max-h-40 rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAdFormState((prev) => ({ ...prev, headerImageUrl: "" }));
                                                setAdHeaderPreview(null);
                                            }}
                                        >
                                            <span className="text-xs">Remove</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <span className="text-3xl block mb-2">📸</span>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <span>Upload Header Ad</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">1200x200 recommended</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sidebar Image</label>
                            <input
                                id="ad-sidebar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAdImageChange('sidebar')}
                            />
                            <div
                                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                onClick={() => document.getElementById("ad-sidebar-upload")?.click()}
                            >
                                {adSidebarPreview || adFormState.sidebarImageUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={adSidebarPreview || adFormState.sidebarImageUrl || ""}
                                            alt="Preview"
                                            className="max-h-40 rounded-lg object-contain"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAdFormState((prev) => ({ ...prev, sidebarImageUrl: "" }));
                                                setAdSidebarPreview(null);
                                            }}
                                        >
                                            <span className="text-xs">Remove</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 text-center">
                                        <span className="text-3xl block mb-2">📸</span>
                                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                            <span>Upload Sidebar Ad</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">300x600 recommended</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                        {editingAdId ? (
                            <>
                                <button onClick={handleUpdateAd} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canUpdate}>
                                    Update Advertisement
                                </button>
                                <button onClick={resetAdForm} className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors">
                                    Cancel Edit
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleAddAd}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!canCreate || addAdLoading}
                            >
                                {addAdLoading ? "Creating..." : "Create Advertisement"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advertisements ({adsData?.length || 0})</h2>
                </div>
                {adsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 grayscale brightness-90">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading ads...</p>
                    </div>
                ) : !adsData || adsData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-4">📢</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No advertisements found</h3>
                        <p className="text-gray-500 dark:text-gray-400">Create your first advertisement to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adsData.map((ad) => (
                            <article key={ad._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                    {ad.headerImageUrl || ad.imageUrl ? (
                                        <img src={ad.headerImageUrl || ad.imageUrl} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
                                    ) : ad.sidebarImageUrl ? (
                                        <img src={ad.sidebarImageUrl} alt={ad.title} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-orange-500/10" />
                                    )}
                                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ad.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                                            {ad.isActive ? "Active" : "Inactive"}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                                            {ad.headerImageUrl ? 'Header' : ad.sidebarImageUrl ? 'Sidebar' : (ad.placement || 'header')}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{ad.title}</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-4 line-clamp-1">
                                        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {ad.link}
                                        </a>
                                    </p>
                                    <div className="flex items-center justify-end border-t border-gray-100 dark:border-gray-700 pt-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditAd(ad)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                disabled={!canUpdate}
                                                title="Edit"
                                            >
                                                <span className="text-lg">✏️</span>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAd(ad._id!)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                disabled={!canDelete}
                                                title="Delete"
                                            >
                                                <span className="text-lg">🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdManager;
