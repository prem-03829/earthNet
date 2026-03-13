import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: {
    name: 'Arjun Mehra',
    email: 'arjun.mehra@example.com',
    role: 'citizen',
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    joined: 'January 2024',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcSooiWL5QJfcdvtCF5pXx7Rc-7f2WYGLJI7HXEAicDBhcfQLs1ulmlkuNyIIC4dhW4vuYUyHtnlGta_twTWhWzzvHbryg_kpmQVU94RYrrBAV6sZjdjR-UrYr6wPxo70oxs0OAVUywhYqYNwvWiUP9R54mpGwNOzTQ6MQeLZwfPV0YaPpdambOaQKYOOQLHRFZQ4A8CNw9tNOsD6eyD-OxTR9RnqXWdVqZHv8wphYU7e8WRnD2Htr4NoPLifdjBUGJq0s2U9nohw',
    impactScore: 450,
  },
  setUser: (user) => set({ user }),
  updateLocation: (location, city) => set((state) => ({ 
    user: { ...state.user, location, city } 
  })),
  logout: () => set({ user: null }),
}));
