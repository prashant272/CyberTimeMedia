"use client";
import React, { useState, useEffect, useCallback, FC } from "react";
import { API } from "@/Utils/Utils";
import { FaUserPlus, FaUsers, FaTrash, FaUserCircle, FaEnvelope, FaIdBadge, FaLock, FaSync } from "react-icons/fa";

interface UserManagerProps {
    isSuperAdmin: boolean;
    showNotification: (message: string, type: "success" | "error") => void;
}

const UserManager: FC<UserManagerProps> = ({ isSuperAdmin, showNotification }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'ADMIN', designation: '', ProfilePicture: '' });
    const [userProfilePreview, setUserProfilePreview] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        if (!isSuperAdmin) return;
        setUsersLoading(true);
        try {
            const res = await API.get(`/auth/all`);
            if (res.data.success) setUsers(res.data.users);
        } catch (err: any) {
            console.error("Fetch users error:", err);
        } finally {
            setUsersLoading(false);
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await API.post(`/auth/create`, userForm);
            if (res.data.success) {
                showNotification("User created successfully", "success");
                setUserForm({ name: '', email: '', password: '', role: 'ADMIN', designation: '', ProfilePicture: '' });
                setUserProfilePreview(null);
                fetchUsers();
            } else {
                showNotification(res.data.msg, "error");
            }
        } catch (err: any) {
            showNotification(err.response?.data?.msg || "Error creating user", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            const res = await API.put(`/auth/update/${id}`, { isActive: !currentStatus });
            if (res.data.success) {
                showNotification("User status updated", "success");
                fetchUsers();
            }
        } catch (err: any) {
            showNotification(err.response?.data?.msg || "Error updating user", "error");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await API.delete(`/auth/${id}`);
            if (res.data.success) {
                showNotification("User deleted", "success");
                fetchUsers();
            }
        } catch (err: any) {
            showNotification(err.response?.data?.msg || "Error deleting user", "error");
        }
    };

    const handleUserProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showNotification("Please select an image file", "error");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showNotification("Image too large (max 2MB)", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setUserForm(prev => ({ ...prev, ProfilePicture: dataUrl }));
            setUserProfilePreview(dataUrl);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    if (!isSuperAdmin) return null;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8 shrink-0 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-500/10" />
                <div className="relative space-y-2 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-4 justify-center md:justify-start">
                        <FaUsers className="text-blue-600" /> User Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                        Control access levels and manage team members for the platform.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                {/* Creation Form */}
                <div className="xl:col-span-5 bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 h-full">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/40">
                                <FaUserPlus />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create Member</h2>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                                    <div className="relative">
                                        <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold placeholder-gray-400"
                                            placeholder="Enter name"
                                            value={userForm.name}
                                            onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold placeholder-gray-400"
                                            placeholder="Email"
                                            value={userForm.email}
                                            onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold placeholder-gray-400"
                                            placeholder="Password"
                                            value={userForm.password}
                                            onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Access Role</label>
                                    <select
                                        className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-black text-gray-600 dark:text-gray-300"
                                        value={userForm.role}
                                        onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                                    >
                                        <option value="ADMIN">Administrator</option>
                                        <option value="USER">Editor</option>
                                        <option value="VIEWER">Viewer Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 ml-1 text-center block">Designation</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all text-sm font-bold placeholder-gray-400 text-center"
                                    value={userForm.designation}
                                    onChange={e => setUserForm({ ...userForm, designation: e.target.value })}
                                    placeholder="e.g. Senior News Editor"
                                />
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 group/upload hover:border-blue-500 transition-all">
                                <input
                                    id="user-profile-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleUserProfilePicChange}
                                />
                                <div
                                    className="flex flex-col items-center justify-center cursor-pointer gap-4"
                                    onClick={() => document.getElementById("user-profile-upload")?.click()}
                                >
                                    {userProfilePreview ? (
                                        <div className="relative group/preview scale-110">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                                                <img
                                                    src={userProfilePreview}
                                                    alt="Profile Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all opacity-0 group-hover/preview:opacity-100 scale-75 group-hover/preview:scale-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setUserForm(prev => ({ ...prev, ProfilePicture: '' }));
                                                    setUserProfilePreview(null);
                                                }}
                                            >✕</button>
                                        </div>
                                    ) : (
                                        <div className="text-center space-y-3">
                                            <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-4xl shadow-inner group-hover/upload:scale-110 transition-transform">
                                                👤
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 dark:text-white">Profile Photo</p>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">PNG or JPG up to 2MB</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSync className="animate-spin text-lg" /> Creating...
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="text-lg" /> Create User Access
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Users List */}
                <div className="xl:col-span-7 bg-white dark:bg-gray-900 rounded-[3rem] p-8 md:p-10 shadow-xl border border-gray-100 dark:border-gray-800 h-full">
                    <div className="space-y-8 h-full flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/40">
                                    <FaUsers />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Active Team</h2>
                            </div>
                            <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-700">
                                Total Members: {users.length}
                            </div>
                        </div>

                        {usersLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-6">
                                <div className="w-16 h-16 border-4 border-emerald-50 dark:border-emerald-900/20 rounded-full" />
                                <div className="absolute w-16 h-16 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin" />
                                <p className="text-sm font-black uppercase tracking-widest text-gray-400">Syncing Team Data</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-auto -mx-10 px-10">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-gray-50 dark:border-gray-800">
                                            <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Team Member</th>
                                            <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Designation</th>
                                            <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                            <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                            <th className="py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {users.map(u => (
                                            <tr key={u._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                                            {u.ProfilePicture ? (
                                                                <img src={u.ProfilePicture} alt={u.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xl font-black text-blue-600">
                                                                    {u.name.charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-black text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">{u.name}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 truncate mt-0.5">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <div className="text-xs font-bold text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl inline-block">
                                                        {u.designation || "Content Editor"}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl inline-block ${u.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                                                            u.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-800'
                                                        }`}>
                                                        {u.role}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <button
                                                        onClick={() => handleToggleUserStatus(u._id, u.isActive)}
                                                        disabled={u.role === 'SUPER_ADMIN'}
                                                        className={`w-full max-w-[100px] mx-auto py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${u.isActive
                                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95'
                                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-rose-500 hover:text-white active:scale-95'
                                                            }`}
                                                    >
                                                        {u.isActive ? "Active" : "Paused"}
                                                    </button>
                                                </td>
                                                <td className="py-6 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-900/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm disabled:opacity-20"
                                                        disabled={u.role === 'SUPER_ADMIN'}
                                                        title="Delete Account"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;
