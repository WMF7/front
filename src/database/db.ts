import { openDB, DBSchema } from 'idb';
import { User, Order, Review } from '../types';

interface ShopDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  orders: {
    key: string;
    value: Order;
    indexes: { 'by-user': string };
  };
  reviews: {
    key: string;
    value: Review;
    indexes: { 'by-product': string };
  };
}

const dbPromise = openDB<ShopDB>('shop-db', 1, {
  upgrade(db) {
    // Users store
    const userStore = db.createObjectStore('users', { keyPath: 'id' });
    userStore.createIndex('by-email', 'email', { unique: true });

    // Orders store
    const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
    orderStore.createIndex('by-user', 'userId');

    // Reviews store
    const reviewStore = db.createObjectStore('reviews', { keyPath: 'id' });
    reviewStore.createIndex('by-product', 'productId');
  },
});

export const UserDB = {
  create: async (user: Omit<User, 'id'>) => {
    const db = await dbPromise;
    const id = crypto.randomUUID();
    const newUser = { ...user, id };
    await db.add('users', newUser);
    return newUser;
  },

  findByEmail: async (email: string) => {
    const db = await dbPromise;
    return await db.getFromIndex('users', 'by-email', email);
  },

  findById: async (id: string) => {
    const db = await dbPromise;
    return await db.get('users', id);
  },

  delete: async (id: string) => {
    const db = await dbPromise;
    await db.delete('users', id);
  }
};

export const OrderDB = {
  create: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const db = await dbPromise;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const newOrder = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now
    };
    await db.add('orders', newOrder);
    return newOrder;
  },

  findById: async (id: string) => {
    const db = await dbPromise;
    return await db.get('orders', id);
  },

  findByUser: async (userId: string) => {
    const db = await dbPromise;
    return await db.getAllFromIndex('orders', 'by-user', userId);
  },

  delete: async (id: string) => {
    const db = await dbPromise;
    await db.delete('orders', id);
  }
};

export const ReviewDB = {
  create: async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const db = await dbPromise;
    const id = crypto.randomUUID();
    const newReview = {
      ...review,
      id,
      createdAt: new Date().toISOString()
    };
    await db.add('reviews', newReview);
    return newReview;
  },

  findById: async (id: string) => {
    const db = await dbPromise;
    return await db.get('reviews', id);
  },

  findByProduct: async (productId: string) => {
    const db = await dbPromise;
    return await db.getAllFromIndex('reviews', 'by-product', productId);
  },

  delete: async (id: string) => {
    const db = await dbPromise;
    await db.delete('reviews', id);
  }
};

// Function to clean the database (for development/testing)
export const cleanDatabase = async () => {
  const db = await dbPromise;
  await db.clear('reviews');
  await db.clear('orders');
  await db.clear('users');
};