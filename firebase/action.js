import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, getDocs, collection, addDoc, doc, deleteDoc, query, where, updateDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default class FirebaseAction {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async save(obj) {
    addDoc(collection(db, this.collectionName), obj);
  }

  async findAll() {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }

  async findBy(key, value) {
    const q = query(collection(db, this.collectionName), where(key, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }

  async deleteById(id) {
    deleteDoc(doc(db, this.collectionName, id));
  }

  async updateById(id, updatedFields) {
    const documentRef = doc(db, this.collectionName, id);
    await updateDoc(documentRef, updatedFields);
  }

}
