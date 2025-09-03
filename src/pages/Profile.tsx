import React, { useEffect, useState, useMemo } from 'react';
import { getProfile, updateProfile } from '../api/auth';
import { toast } from 'react-toastify';
import { Loader2, Pencil, Save, X, RefreshCcw } from 'lucide-react';

interface ProfileData {
  hospitalName: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

const fieldOrder: (keyof ProfileData)[] = ['hospitalName','email','address','phoneNumber'];

const Label: React.FC<{children: React.ReactNode; htmlFor?: string}> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-xs font-semibold tracking-wide uppercase text-gray-500 mb-2">{children}</label>
);

const InputWrap: React.FC<{ changed?: boolean; children: React.ReactNode }> = ({ changed, children }) => (
  <div className={`relative group ${changed ? 'after:absolute after:-right-2 after:-top-2 after:w-3 after:h-3 after:bg-amber-500 after:rounded-full after:ring-2 after:ring-white' : ''}`}>{children}</div>
);

const Skeleton: React.FC<{ className?: string }> = ({ className }) => <div className={`animate-pulse rounded-md bg-gray-200/40 dark:bg-gray-700/40 ${className}`} />;

const Profile: React.FC = () => {
  const [original, setOriginal] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [reloading, setReloading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      setOriginal(res.data);
      setForm(res.data);
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to load profile');
    } finally { setLoading(false); }
  };

  const reloadFresh = async () => {
    setReloading(true);
    await load();
    setReloading(false);
    toast.success('Profile refreshed');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; setForm(f => ({ ...f, [name]: value }));
  };

  const changedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    if (!original) return map;
    fieldOrder.forEach(f => { map[f] = (form as any)[f] !== (original as any)[f]; });
    return map;
  }, [form, original]);

  const changedCount = useMemo(() => Object.values(changedMap).filter(Boolean).length, [changedMap]);

  const onSave = async () => {
    if (!original) return;
    const payload: any = {};
    fieldOrder.forEach(k => { if (changedMap[k]) payload[k] = (form as any)[k]; });
    if (!Object.keys(payload).length) { toast.info('No changes'); return; }
    try {
      setSaving(true);
      const res = await updateProfile(payload);
      setOriginal(res.data);
      setForm(res.data);
      setEditing(false);
      toast.success('Profile updated');
    } catch (e: any) { toast.error(e.response?.data?.error || 'Update failed'); } finally { setSaving(false); }
  };

  const cancel = () => { setForm(original || {}); setEditing(false); };

  const initials = useMemo(() => {
    const name = form.hospitalName || original?.hospitalName || '';
    return name.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
  }, [form, original]);

  return (
    <div className="relative">
      {/* Hero gradient background */}
      <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 rounded-b-[2.5rem]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {loading ? <Skeleton className="w-10 h-10" /> : initials || 'CK'}
            </div>
            <div className="text-white drop-shadow-sm">
              <h1 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
                {loading ? <Skeleton className="h-8 w-64" /> : (form.hospitalName || '—')}
                {!loading && !editing && (
                  <button onClick={() => setEditing(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition" title="Edit profile">
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </h1>
              <p className="mt-1 text-emerald-100 text-sm">Organization Profile & Settings</p>
              {changedCount > 0 && editing && (
                <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-amber-200 bg-amber-500/20 px-3 py-1 rounded-full">
                  {changedCount} change{changedCount>1 && 's'} unsaved
                </p>
              )}
            </div>
          </div>
          <div className="ml-auto flex gap-3">
            <button onClick={reloadFresh} disabled={loading || reloading} className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 disabled:opacity-50 backdrop-blur border border-white/20">
              {reloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
            </button>
            {editing && (
              <>
                <button onClick={cancel} disabled={saving} className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 disabled:opacity-50 backdrop-blur border border-white/20">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={onSave} disabled={saving} className="h-10 px-5 inline-flex items-center gap-2 rounded-xl bg-emerald-200 text-emerald-900 text-sm font-semibold hover:bg-white disabled:opacity-50 shadow">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving' : 'Save'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column summary */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-2xl border border-white/40 dark:border-gray-700 shadow p-6">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-sm tracking-wide uppercase">Summary</h2>
              <ul className="text-sm space-y-3">
                <li className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-800 truncate max-w-[160px] text-right">{loading ? '...' : original?.email || '—'}</span></li>
                <li className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium text-gray-800">{loading ? '...' : original?.phoneNumber || '—'}</span></li>
                <li className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium text-gray-800">{original?.createdAt ? new Date(original.createdAt).toLocaleDateString() : '—'}</span></li>
                <li className="flex justify-between"><span className="text-gray-500">Updated</span><span className="font-medium text-gray-800">{original?.updatedAt ? new Date(original.updatedAt).toLocaleDateString() : '—'}</span></li>
              </ul>
              {!editing && !loading && (
                <button onClick={() => setEditing(true)} className="mt-6 w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-600 hover:to-emerald-500 shadow">
                  Edit Profile
                </button>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full" />
              <div className="absolute -left-10 bottom-0 w-32 h-32 bg-emerald-400/5 rounded-full" />
              <h3 className="font-semibold mb-2 text-sm tracking-wide uppercase text-emerald-300">Tip</h3>
              <p className="text-sm leading-relaxed text-emerald-50/90">Keep your contact information up to date so patients and staff can always reach you.</p>
            </div>
          </div>

          {/* Right column form */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur rounded-2xl border border-white/40 dark:border-gray-700 shadow px-8 py-10">
              {loading && (
                <div className="space-y-6">
                  <Skeleton className="h-5 w-40" />
                  <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-32 w-full md:col-span-2" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              )}

              {!loading && (
                <form className="space-y-10" onSubmit={e => { e.preventDefault(); onSave(); }}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label htmlFor="hospitalName">Hospital Name</Label>
                      <InputWrap changed={changedMap.hospitalName && editing}>
                        <input id="hospitalName" name="hospitalName" disabled={!editing} value={form.hospitalName || ''} onChange={onChange}
                          className={`w-full h-12 px-4 rounded-xl border text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed ${editing ? 'hover:border-gray-400' : ''}`} />
                      </InputWrap>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <InputWrap changed={changedMap.email && editing}>
                        <input id="email" name="email" type="email" disabled={!editing} value={form.email || ''} onChange={onChange}
                          className={`w-full h-12 px-4 rounded-xl border text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed ${editing ? 'hover:border-gray-400' : ''}`} />
                      </InputWrap>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <InputWrap changed={changedMap.address && editing}>
                        <textarea id="address" name="address" disabled={!editing} value={form.address || ''} onChange={onChange}
                          className={`w-full min-h-[120px] px-4 py-3 rounded-xl border text-sm leading-relaxed bg-white/60 dark:bg-gray-800/60 backdrop-blur transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none disabled:opacity-70 disabled:cursor-not-allowed ${editing ? 'hover:border-gray-400' : ''}`}/>
                      </InputWrap>
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <InputWrap changed={changedMap.phoneNumber && editing}>
                        <input id="phoneNumber" name="phoneNumber" disabled={!editing} value={form.phoneNumber || ''} onChange={onChange}
                          className={`w-full h-12 px-4 rounded-xl border text-sm bg-white/60 dark:bg-gray-800/60 backdrop-blur transition focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed ${editing ? 'hover:border-gray-400' : ''}`} />
                      </InputWrap>
                    </div>
                  </div>

                  {editing && (
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button type="button" onClick={cancel} disabled={saving} className="h-11 px-6 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 hover:bg-white disabled:opacity-50">
                        Cancel
                      </button>
                      <button type="submit" disabled={saving} className="h-11 px-7 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 shadow disabled:opacity-50 flex items-center gap-2">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Audit / meta */}
            {!loading && original && (
              <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur rounded-2xl border border-white/40 dark:border-gray-700 shadow p-6 text-xs text-gray-500 flex flex-wrap gap-x-8 gap-y-3">
                <div><span className="font-semibold text-gray-700 dark:text-gray-200">Created</span><br />{original.createdAt ? new Date(original.createdAt).toLocaleString() : '—'}</div>
                <div><span className="font-semibold text-gray-700 dark:text-gray-200">Last Updated</span><br />{original.updatedAt ? new Date(original.updatedAt).toLocaleString() : '—'}</div>
                <div><span className="font-semibold text-gray-700 dark:text-gray-200">Unsaved Changes</span><br />{changedCount}</div>
                <div><span className="font-semibold text-gray-700 dark:text-gray-200">Mode</span><br />{editing ? 'Editing' : 'View'}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
