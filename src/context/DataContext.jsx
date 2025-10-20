import { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("users");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "user1",
            fullName: "Robert Johnson",
            email: "buyer1@email.com",
            phone: "+91 9876543210",
            role: "customer",
            isVerified: true,
            isActive: true,
            isDocsVerified: true,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 5,
            propertiesAdded: 1,
            createdAt: new Date("2024-01-20").toISOString(),
          },
          {
            id: "user2",
            fullName: "Sarah Williams",
            email: "buyer2@email.com",
            phone: "+91 9876543211",
            role: "customer",
            isVerified: false,
            isActive: true,
            isDocsVerified: false,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 3,
            propertiesAdded: 1,
            createdAt: new Date("2024-02-15").toISOString(),
          },
        ];
  });

  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem("agents");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "agent1",
            fullName: "Agent Smith",
            email: "agent@email.com",
            phone: "+91 9876543220",
            role: "agent",
            isVerified: true,
            isActive: true,
            isDocsVerified: true,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 10,
            propertiesAdded: 2,
            createdAt: new Date("2024-01-10").toISOString(),
          },
          {
            id: "agent2",
            fullName: "Jessica Davis",
            email: "agent2@email.com",
            phone: "+91 9876543221",
            role: "agent",
            isVerified: false,
            isActive: true,
            isDocsVerified: false,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 8,
            propertiesAdded: 1,
            createdAt: new Date("2024-02-05").toISOString(),
          },
        ];
  });

  const [builders, setBuilders] = useState(() => {
    const saved = localStorage.getItem("builders");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "builder1",
            fullName: "Elite Builders",
            email: "builder@email.com",
            phone: "+91 9876543230",
            role: "builder",
            isVerified: true,
            isActive: true,
            isDocsVerified: true,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 20,
            propertiesAdded: 2,
            createdAt: new Date("2024-01-05").toISOString(),
          },
          {
            id: "builder2",
            fullName: "Skyline Constructions",
            email: "builder2@email.com",
            phone: "+91 9876543231",
            role: "builder",
            isVerified: false,
            isActive: true,
            isDocsVerified: false,
            aadharDoc:
              "https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=400",
            proofDoc:
              "https://images.pexels.com/photos/8112177/pexels-photo-8112177.jpeg?auto=compress&cs=tinysrgb&w=400",
            canAddProperty: true,
            propertyLimit: 15,
            propertiesAdded: 1,
            createdAt: new Date("2024-03-01").toISOString(),
          },
        ];
  });

  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem("properties");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "prop1",
            title: "Luxury 3BHK Apartment in Downtown",
            description:
              "Spacious apartment with modern amenities and great city views",
            propertyType: "residential",
            propertySubtype: "apartment",
            listingType: "sell",
            price: 8500000,
            city: "Mumbai",
            locality: "Downtown",
            subLocality: "Sector 15",
            facing: "north",
            photos: [
              "https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg",
            ],
            status: "pending",
            postedBy: "agent",
            userId: "agent1",
            viewsCount: 45,
            isFeatured: false,
            createdAt: new Date("2024-03-10").toISOString(),
            updatedAt: new Date("2024-03-10").toISOString(),
          },
          {
            id: "prop2",
            title: "Modern 2BHK Villa with Garden",
            description: "Beautiful villa with spacious garden and parking",
            propertyType: "residential",
            propertySubtype: "villa",
            listingType: "sell",
            price: 12000000,
            city: "Delhi",
            locality: "Green Valley",
            subLocality: "Phase 2",
            facing: "east",
            photos: [
              "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
            ],
            status: "approved",
            postedBy: "agent",
            userId: "agent1",
            viewsCount: 120,
            isFeatured: true,
            createdAt: new Date("2024-02-15").toISOString(),
            updatedAt: new Date("2024-02-15").toISOString(),
          },
          {
            id: "prop3",
            title: "Commercial Space in Business District",
            description:
              "Prime location commercial property suitable for offices",
            propertyType: "commercial",
            propertySubtype: "office",
            listingType: "rent",
            price: 150000,
            city: "Bangalore",
            locality: "MG Road",
            subLocality: "Block A",
            facing: "south",
            photos: [
              "https://images.pexels.com/photos/380768/pexels-photo-380768.jpeg",
            ],
            status: "pending",
            postedBy: "builder",
            userId: "builder1",
            viewsCount: 89,
            isFeatured: false,
            createdAt: new Date("2024-03-08").toISOString(),
            updatedAt: new Date("2024-03-08").toISOString(),
          },
          {
            id: "prop4",
            title: "Cozy 1BHK Apartment",
            description: "Perfect for bachelors or small families",
            propertyType: "residential",
            propertySubtype: "apartment",
            listingType: "rent",
            price: 25000,
            city: "Pune",
            locality: "Koregaon Park",
            subLocality: "Lane 5",
            facing: "west",
            photos: [
              "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
            ],
            status: "approved",
            postedBy: "customer",
            userId: "user2",
            viewsCount: 67,
            isFeatured: false,
            createdAt: new Date("2024-03-05").toISOString(),
            updatedAt: new Date("2024-03-05").toISOString(),
          },
          {
            id: "prop5",
            title: "Luxury Penthouse with Sea View",
            description: "Stunning penthouse with panoramic sea views",
            propertyType: "residential",
            propertySubtype: "penthouse",
            listingType: "sell",
            price: 25000000,
            city: "Mumbai",
            locality: "Worli",
            subLocality: "Sea Face",
            facing: "west",
            photos: [
              "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
            ],
            status: "rejected",
            postedBy: "builder",
            userId: "builder1",
            viewsCount: 234,
            isFeatured: false,
            createdAt: new Date("2024-03-01").toISOString(),
            updatedAt: new Date("2024-03-01").toISOString(),
          },
          {
            id: "prop6",
            title: "Spacious 4BHK Independent House",
            description: "Independent house with large parking and garden area",
            propertyType: "residential",
            propertySubtype: "house",
            listingType: "sell",
            price: 18500000,
            city: "Chennai",
            locality: "Anna Nagar",
            subLocality: "West Extension",
            facing: "north",
            photos: [
              "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg",
            ],
            status: "approved",
            postedBy: "builder",
            userId: "builder2",
            viewsCount: 156,
            isFeatured: true,
            createdAt: new Date("2024-02-20").toISOString(),
            updatedAt: new Date("2024-02-20").toISOString(),
          },
          {
            id: "prop7",
            title: "Studio Apartment Near Metro",
            description:
              "Compact and efficient studio with easy metro access",
            propertyType: "residential",
            propertySubtype: "apartment",
            listingType: "rent",
            price: 18000,
            city: "Delhi",
            locality: "Rajouri Garden",
            subLocality: "Block C",
            facing: "east",
            photos: [
              "https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg",
            ],
            status: "pending",
            postedBy: "customer",
            userId: "user1",
            viewsCount: 34,
            isFeatured: false,
            createdAt: new Date("2024-03-12").toISOString(),
            updatedAt: new Date("2024-03-12").toISOString(),
          },
          {
            id: "prop8",
            title: "Retail Shop in Prime Location",
            description: "High footfall area perfect for retail business",
            propertyType: "commercial",
            propertySubtype: "shop",
            listingType: "rent",
            price: 85000,
            city: "Mumbai",
            locality: "Linking Road",
            subLocality: "Bandra West",
            facing: "north",
            photos: [
              "https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg",
            ],
            status: "pending",
            postedBy: "agent",
            userId: "agent2",
            viewsCount: 98,
            isFeatured: false,
            createdAt: new Date("2024-03-11").toISOString(),
            updatedAt: new Date("2024-03-11").toISOString(),
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("agents", JSON.stringify(agents));
    localStorage.setItem("builders", JSON.stringify(builders));
    localStorage.setItem("properties", JSON.stringify(properties));
  }, [users, agents, builders, properties]);

  const updatePropertyStatus = (id, status) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const updatePropertyPermission = (id, userType, canAdd, limit) => {
    if (userType === "customer") {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, canAddProperty: canAdd, propertyLimit: limit } : u
        )
      );
    } else if (userType === "agent") {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, canAddProperty: canAdd, propertyLimit: limit } : a
        )
      );
    } else if (userType === "builder") {
      setBuilders((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, canAddProperty: canAdd, propertyLimit: limit } : b
        )
      );
    }
  };

  const updateDocsVerification = (id, userType, isDocsVerified) => {
    if (userType === "customer") {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isDocsVerified } : u))
      );
    } else if (userType === "agent") {
      setAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isDocsVerified } : a))
      );
    } else if (userType === "builder") {
      setBuilders((prev) =>
        prev.map((b) => (b.id === id ? { ...b, isDocsVerified } : b))
      );
    }
  };

  const addProperty = (property) => {
    const newProperty = {
      ...property,
      id: `prop${Date.now()}`,
      status: "pending",
      viewsCount: 0,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProperties((prev) => [newProperty, ...prev]);
    return newProperty.id;
  };

  const updateProperty = (id, updatedData) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updatedData, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        users,
        agents,
        builders,
        properties,
        updatePropertyStatus,
        updatePropertyPermission,
        updateDocsVerification,
        addProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
