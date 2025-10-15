import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/config'; // Adjust path based on your existing firebase config

// Base API service
class ApiService {
  static async getCollection(collectionName, conditions = [], orderByField = null, limitCount = null) {
    try {
      let q = collection(db, collectionName);
      
      // Add conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value));
      });
      
      // Add ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }
      
      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      return data;
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error);
      throw error;
    }
  }

  static async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error('Document not found');
      }
    } catch (error) {
      console.error(`Error getting document ${docId}:`, error);
      throw error;
    }
  }

  static async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  static async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data };
    } catch (error) {
      console.error(`Error updating document ${docId}:`, error);
      throw error;
    }
  }
}

export default ApiService;