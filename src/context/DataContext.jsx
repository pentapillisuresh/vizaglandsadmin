import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialProperties = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Downtown',
    description: 'Spacious apartment with modern amenities and great city views',
    propertyType: 'residential',
    propertySubtype: 'apartment',
    listingType: 'sell',
    price: 8500000,
    city: 'Mumbai',
    locality: 'Downtown',
    subLocality: 'Sector 15',
    photos: ['https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg'],
    status: 'active',
    postedBy: 'agent',
    userId: 'agent1',
    facing: 'north',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Commercial Office Space',
    description: 'Office space suitable for startups',
    propertyType: 'commercial',
    propertySubtype: 'office',
    listingType: 'rent',
    price: 25000,
    city: 'Hyderabad',
    locality: 'Hitech City',
    subLocality: 'Sector 2',
    photos: ['https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'],
    status: 'active',
    postedBy: 'builder',
    userId: 'builder1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '2BHK Flat for Sale',
    description: 'Nice flat posted by a customer',
    propertyType: 'residential',
    propertySubtype: 'flat',
    listingType: 'sell',
    price: 4500000,
    city: 'Vizag',
    locality: 'Gajuwaka',
    subLocality: 'Sector 3',
    photos: ['https://images.pexels.com/photos/1571450/pexels-photo-1571450.jpeg'],
    status: 'active',
    postedBy: 'customer',
    userId: 'user1', // 👈 must match customer id in Users.js
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


const initialAgents = [
  {
    id: 'agent1',
    email: 'john.doe@realestate.com',
    fullName: 'John Doe',
    phone: '+91 9876543210',
    role: 'agent',
    isActive: true,
    isVerified: true,
    createdAt: new Date('2023-12-01').toISOString()
  },
  {
    id: 'agent2',
    email: 'jane.smith@realestate.com',
    fullName: 'Jane Smith',
    phone: '+91 9876543211',
    role: 'agent',
    isActive: true,
    isVerified: true,
    createdAt: new Date('2024-01-05').toISOString()
  }
];

const initialBuilders = [
  {
    id: 'builder1',
    email: 'info@skylinebuilders.com',
    fullName: 'Skyline Builders',
    phone: '+91 9876543220',
    companyName: 'Skyline Builders Pvt Ltd',
    role: 'builder',
    isActive: true,
    isVerified: true,
    createdAt: new Date('2023-11-15').toISOString()
  },
  {
    id: 'builder2',
    email: 'contact@primeconstruction.com',
    fullName: 'Prime Construction',
    phone: '+91 9876543221',
    companyName: 'Prime Construction Co.',
    role: 'builder',
    isActive: true,
    isVerified: false,
    createdAt: new Date('2024-01-20').toISOString()
  }
];

const initialUsers = [
  {
    id: 'user1',
    email: 'buyer1@email.com',
    fullName: 'Robert Johnson',
    phone: '+91 9876543210',
    role: 'customer',
    isVerified: true,
    isActive: true,
    createdAt: new Date('2024-01-20').toISOString()
  },
  {
    id: 'user2',
    email: 'buyer2@email.com',
    fullName: 'Sarah Williams',
    phone: '+91 9876543211',
    role: 'customer',
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

const initialActivityLogs = [];

export const DataProvider = ({ children }) => {
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('agents');
    return saved ? JSON.parse(saved) : initialAgents;
  });

  const [builders, setBuilders] = useState(() => {
    const saved = localStorage.getItem('builders');
    return saved ? JSON.parse(saved) : initialBuilders;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('activityLogs');
    return saved ? JSON.parse(saved) : initialActivityLogs;
  });

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('builders', JSON.stringify(builders));
  }, [builders]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

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
    const newProperty = {
      ...property,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 0,
      status: 'active',
      isFeatured: false
    };
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
    const newAgent = { ...agent, id: generateId(), role: 'agent', createdAt: new Date().toISOString() };
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

  const addBuilder = (builder) => {
    const newBuilder = { ...builder, id: generateId(), role: 'builder', createdAt: new Date().toISOString() };
    setBuilders(prev => [newBuilder, ...prev]);
    logActivity('CREATE', 'builder', newBuilder.id, { fullName: builder.fullName });
    return newBuilder;
  };

  const updateBuilder = (id, updates) => {
    setBuilders(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    logActivity('UPDATE', 'builder', id, updates);
  };

  const deleteBuilder = (id) => {
    setBuilders(prev => prev.filter(b => b.id !== id));
    logActivity('DELETE', 'builder', id);
  };

  const addUser = (user) => {
    const newUser = { ...user, id: generateId(), role: 'customer', createdAt: new Date().toISOString() };
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

  const value = {
    properties,
    agents,
    builders,
    users,
    leads,
    activityLogs,
    addProperty,
    updateProperty,
    deleteProperty,
    addAgent,
    updateAgent,
    deleteAgent,
    addBuilder,
    updateBuilder,
    deleteBuilder,
    addUser,
    updateUser,
    deleteUser,
    addLead,
    updateLead,
    deleteLead
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
