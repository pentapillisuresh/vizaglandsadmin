import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialProperties = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Downtown',
    description: 'Spacious apartment with modern amenities and great city views',
    propertyType: 'apartment',
    listingType: 'sale',
    price: 8500000,
    location: 'Downtown, Sector 15',
    city: 'Mumbai',
    state: 'Maharashtra',
    areaSqft: 1850,
    bedrooms: 3,
    bathrooms: 2,
    status: 'active',
    isFeatured: true,
    viewsCount: 342,
    agentId: 'agent1',
    images: ['https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security'],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    id: '2',
    title: 'Modern Villa with Garden',
    description: 'Beautiful villa with private garden and parking',
    propertyType: 'villa',
    listingType: 'sale',
    price: 15000000,
    location: 'Palm Grove',
    city: 'Bangalore',
    state: 'Karnataka',
    areaSqft: 3200,
    bedrooms: 4,
    bathrooms: 3,
    status: 'pending',
    isFeatured: false,
    viewsCount: 125,
    agentId: 'agent2',
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800'],
    amenities: ['Garden', 'Parking', 'Security'],
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString()
  }
];

const initialAgents = [
  {
    id: 'agent1',
    email: 'john.doe@realestate.com',
    fullName: 'John Doe',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2023-12-01').toISOString()
  },
  {
    id: 'agent2',
    email: 'jane.smith@realestate.com',
    fullName: 'Jane Smith',
    role: 'agent',
    isActive: true,
    createdAt: new Date('2024-01-05').toISOString()
  }
];

const initialUsers = [
  {
    id: 'user1',
    email: 'buyer1@email.com',
    fullName: 'Robert Johnson',
    phone: '+91 9876543210',
    isVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 'user2',
    email: 'buyer2@email.com',
    fullName: 'Sarah Williams',
    phone: '+91 9876543211',
    isVerified: false,
    isActive: true,
    createdAt: new Date('2024-02-05').toISOString()
  }
];

const initialLeads = [
  {
    id: 'lead1',
    propertyId: '1',
    userId: 'user1',
    assignedAgentId: 'agent1',
    message: 'Interested in scheduling a visit',
    status: 'new',
    priority: 'high',
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString()
  },
  {
    id: 'lead2',
    propertyId: '2',
    userId: 'user2',
    assignedAgentId: 'agent2',
    message: 'Looking for financing options',
    status: 'contacted',
    priority: 'medium',
    createdAt: new Date('2024-02-18').toISOString(),
    updatedAt: new Date('2024-02-18').toISOString()
  }
];

const initialPlans = [
  {
    id: 'plan1',
    name: 'Basic',
    description: 'Perfect for individual agents',
    price: 999,
    durationDays: 30,
    features: ['5 Property Listings', 'Basic Support', 'Standard Analytics'],
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'plan2',
    name: 'Professional',
    description: 'For growing agencies',
    price: 2499,
    durationDays: 30,
    features: ['20 Property Listings', 'Priority Support', 'Advanced Analytics', 'Featured Listings'],
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'plan3',
    name: 'Enterprise',
    description: 'For large real estate firms',
    price: 4999,
    durationDays: 30,
    features: ['Unlimited Listings', '24/7 Premium Support', 'Advanced Analytics', 'Featured Listings', 'Custom Branding'],
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString()
  }
];

const initialPayments = [
  {
    id: 'pay1',
    userId: 'agent1',
    planId: 'plan2',
    amount: 2499,
    status: 'completed',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN123456',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 'pay2',
    userId: 'agent2',
    planId: 'plan1',
    amount: 999,
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN123457',
    createdAt: new Date('2024-02-10').toISOString()
  }
];

const initialBanners = [
  {
    id: 'banner1',
    title: 'Summer Sale',
    imageUrl: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=1200',
    linkUrl: '/properties',
    position: 'home',
    isActive: true,
    displayOrder: 1,
    createdAt: new Date('2024-02-01').toISOString()
  }
];

const initialSettings = {
  siteName: 'Real Estate Admin',
  siteLogo: 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=200',
  contactEmail: 'admin@realestate.com',
  contactPhone: '+1234567890'
};

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('agents');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('plans');
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('banners');
    return saved ? JSON.parse(saved) : initialBanners;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('activityLogs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('activityLogs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const logActivity = (action, entityType, entityId, details = {}) => {
    const log = {
      id: generateId(),
      adminUserId: 'current-admin',
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString()
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const addProperty = (property) => {
    const newProperty = { ...property, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), viewsCount: 0 };
    setProperties(prev => [newProperty, ...prev]);
    logActivity('CREATE', 'property', newProperty.id, { title: property.title });
    return newProperty;
  };

  const updateProperty = (id, updates) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    logActivity('UPDATE', 'property', id, updates);
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    logActivity('DELETE', 'property', id);
  };

  const addAgent = (agent) => {
    const newAgent = { ...agent, id: generateId(), createdAt: new Date().toISOString() };
    setAgents(prev => [newAgent, ...prev]);
    logActivity('CREATE', 'agent', newAgent.id, { fullName: agent.fullName });
    return newAgent;
  };

  const updateAgent = (id, updates) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    logActivity('UPDATE', 'agent', id, updates);
  };

  const deleteAgent = (id) => {
    setAgents(prev => prev.filter(a => a.id !== id));
    logActivity('DELETE', 'agent', id);
  };

  const addUser = (user) => {
    const newUser = { ...user, id: generateId(), createdAt: new Date().toISOString() };
    setUsers(prev => [newUser, ...prev]);
    logActivity('CREATE', 'user', newUser.id, { fullName: user.fullName });
    return newUser;
  };

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logActivity('UPDATE', 'user', id, updates);
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    logActivity('DELETE', 'user', id);
  };

  const addLead = (lead) => {
    const newLead = { ...lead, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setLeads(prev => [newLead, ...prev]);
    logActivity('CREATE', 'lead', newLead.id);
    return newLead;
  };

  const updateLead = (id, updates) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l));
    logActivity('UPDATE', 'lead', id, updates);
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    logActivity('DELETE', 'lead', id);
  };

  const addPlan = (plan) => {
    const newPlan = { ...plan, id: generateId(), createdAt: new Date().toISOString() };
    setPlans(prev => [newPlan, ...prev]);
    logActivity('CREATE', 'plan', newPlan.id, { name: plan.name });
    return newPlan;
  };

  const updatePlan = (id, updates) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('UPDATE', 'plan', id, updates);
  };

  const deletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    logActivity('DELETE', 'plan', id);
  };

  const addPayment = (payment) => {
    const newPayment = { ...payment, id: generateId(), createdAt: new Date().toISOString() };
    setPayments(prev => [newPayment, ...prev]);
    logActivity('CREATE', 'payment', newPayment.id);
    return newPayment;
  };

  const updatePayment = (id, updates) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    logActivity('UPDATE', 'payment', id, updates);
  };

  const addBanner = (banner) => {
    const newBanner = { ...banner, id: generateId(), createdAt: new Date().toISOString() };
    setBanners(prev => [newBanner, ...prev]);
    logActivity('CREATE', 'banner', newBanner.id, { title: banner.title });
    return newBanner;
  };

  const updateBanner = (id, updates) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    logActivity('UPDATE', 'banner', id, updates);
  };

  const deleteBanner = (id) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    logActivity('DELETE', 'banner', id);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logActivity('UPDATE', 'settings', 'global', newSettings);
  };

  const value = {
    properties,
    agents,
    users,
    leads,
    plans,
    payments,
    banners,
    settings,
    activityLogs,
    addProperty,
    updateProperty,
    deleteProperty,
    addAgent,
    updateAgent,
    deleteAgent,
    addUser,
    updateUser,
    deleteUser,
    addLead,
    updateLead,
    deleteLead,
    addPlan,
    updatePlan,
    deletePlan,
    addPayment,
    updatePayment,
    addBanner,
    updateBanner,
    deleteBanner,
    updateSettings
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
