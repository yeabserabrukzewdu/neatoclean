import React, { useState, useEffect } from 'react';
import { useLanguage, useBooking } from '../App';
import { HOURLY_RATE_AED, ADDITIONAL_SERVICES, SERVICE_TRANSLATIONS } from '../constants';
import { ServiceRequest, DashboardMetrics } from '../types';
import { CheckIcon, SparkleIcon, UserIcon, ClockIcon, CalculatorIcon, ArrowLeftIcon } from '../components/icons';
import { supabase } from '../supabaseClient';

const AdminPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { setPage } = useBooking();
  const [hourlyRate, setHourlyRate] = useState(HOURLY_RATE_AED);
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'requests'>('requests');
  const [metrics, setMetrics] = useState<DashboardMetrics>({
      totalRevenue: 0,
      activeBookings: 0,
      avgOrderValue: 0,
      cleanersOnline: 8
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
      
      const totalRev = data?.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0) || 0;
      const active = data?.filter((r: any) => r.status === 'pending' || r.status === 'confirmed').length || 0;
      setMetrics({
          totalRevenue: totalRev,
          activeBookings: active,
          avgOrderValue: data?.length ? Math.round(totalRev / data.length) : 0,
          cleanersOnline: 12
      });
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
    } catch (err) {
      alert('Update failed');
    }
  };

  const getTranslatedService = (key: string) => SERVICE_TRANSLATIONS[key]?.[language] || key;

  return (
    <div className="min-h-screen pt-32 pb-32 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setPage('home')} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all text-slate-500 hover:text-brand-500">
              <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180" />
            </button>
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Control Center</h1>
                <p className="text-slate-500 font-medium text-sm">Property Management & Live Inquiries</p>
            </div>
          </div>
          
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-800">
            {(['overview', 'pricing', 'requests'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-black transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Projected Revenue', value: `${metrics.totalRevenue} AED`, icon: CalculatorIcon, color: 'text-brand-500' },
                  { label: 'Live Inquiries', value: metrics.activeBookings, icon: ClockIcon, color: 'text-amber-500' },
                  { label: 'Avg. Lead Value', value: `${metrics.avgOrderValue} AED`, icon: SparkleIcon, color: 'text-indigo-500' },
                  { label: 'Staff Dispatch', value: metrics.cleanersOnline, icon: UserIcon, color: 'text-emerald-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 group hover:shadow-xl transition-all">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                       <stat.icon className="w-7 h-7" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-10 animate-fade-in">
             <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Standard Rate Architecture</h2>
                  <div className="px-4 py-2 bg-brand-500/10 text-brand-500 rounded-full text-xs font-black">LIVE CALCULATOR SYNCED</div>
                </div>
                
                <div className="max-w-md">
                   <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Global Hourly Rate (AED)</label>
                   <div className="flex items-center gap-4">
                      <input 
                        type="number" 
                        value={hourlyRate} 
                        onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 font-black text-xl text-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all"
                      />
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase transition-all active:scale-95 shadow-lg">Save</button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
            <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center">
               <h2 className="text-2xl font-black uppercase tracking-tight">Lead Submission Log</h2>
               <div className="flex gap-2">
                  <button onClick={fetchInquiries} className="p-2 text-slate-400 hover:text-brand-500 transition-colors">
                     <ClockIcon className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black text-slate-500">{requests.length} TOTAL INQUIRIES</span>
               </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-8 py-6">Inquiry ID</th>
                    <th className="px-8 py-6">Client / Address</th>
                    <th className="px-8 py-6">Property</th>
                    <th className="px-8 py-6">Schedule</th>
                    <th className="px-8 py-6">Est. Total</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {requests.map((req) => (
                    <tr key={req.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-8 py-6 text-xs font-black text-brand-500">#{req.id.toString().slice(-4).toUpperCase()}</td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-slate-900 dark:text-white mb-1">{req.client_name}</div>
                        <div className="text-[10px] text-slate-500 font-medium line-clamp-1">{req.address}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">{req.service_type}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-black">{req.property}</div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-black">{req.date}</div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase">{req.time}</div>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white">{req.total} AED</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          req.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' :
                          req.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2">
                           <button onClick={() => updateRequestStatus(req.id, 'confirmed')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-indigo-500 transition-colors">
                             <CheckIcon className="w-4 h-4" />
                           </button>
                           <button onClick={() => updateRequestStatus(req.id, 'completed')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-500 transition-colors">
                             <SparkleIcon className="w-4 h-4" />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;