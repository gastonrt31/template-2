import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User, Stage, StageNumber } from '@/types';

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Collection reference
const USERS_COLLECTION = 'users';

// Create a new user
export const createUser = async (userData: Omit<User, 'id' | 'stages' | 'createdAt' | 'qrCode'>) => {
  try {
    const userDoc = {
      ...userData,
      stages: {
        '1': { status: 'PENDING' },
        '2': { status: 'PENDING' },
        '3': { status: 'PENDING' }
      },
      qrCode: JSON.stringify(userData), // We'll encode this data in QR
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userDoc);
    return { id: docRef.id, ...userDoc };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Update stage status
export const updateStageStatus = async (
  userId: string,
  stageNumber: StageNumber,
  status: Stage['status']
) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      [`stages.${stageNumber}.status`]: status,
      [`stages.${stageNumber}.scanTime`]: status === 'CHECK' ? new Date().toISOString() : null
    });
  } catch (error) {
    console.error('Error updating stage status:', error);
    throw error;
  }
};

// Subscribe to users changes
export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
    callback(users);
  });
};
