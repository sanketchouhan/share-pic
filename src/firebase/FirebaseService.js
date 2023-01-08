import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  limit,
  startAfter,
  startAt,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import { auth, db, storage } from "./FirebaseConfig";

const provider = new GoogleAuthProvider();

export const signInWithGoogleService = () => {
  return signInWithPopup(auth, provider);
};

export const signOutService = () => {
  return signOut(auth);
};

export const getItem = (collectionPath, id) => {
  return getDoc(doc(db, collectionPath, id));
};

export const getAllItem = (collectionPath) => {
  return getDocs(collection(db, collectionPath));
};

export const getQueryItem = (collectionPath, property, operand, value) => {
  return getDocs(
    query(collection(db, collectionPath), where(property, operand, value))
  );
};

export const getQueryPaginatedItems = (
  collectionPath,
  property,
  operand,
  value,
  field,
  startIndex,
  noOfItems
) => {
  return getDocs(
    query(
      collection(db, collectionPath),
      where(property, operand, value),
      orderBy(field),
      startAt(startIndex),
      limit(noOfItems)
    )
  );
};

export const getAllPaginatedItems = (
  collectionPath,
  field,
  startIndex,
  noOfItems
) => {
  return getDocs(
    query(
      collection(db, collectionPath),
      orderBy(field),
      startAfter(startIndex),
      limit(noOfItems)
    )
  );
};

export const addItem = (collectionPath, payload) => {
  return addDoc(collection(db, collectionPath), payload);
};

export const setItem = (collectionPath, id, payload) => {
  return setDoc(doc(db, collectionPath, id), payload);
};

export const updateItem = (collectionPath, id, payload) => {
  return updateDoc(doc(db, collectionPath, id), payload);
};

export const deleteItem = (collectionPath, id) => {
  return deleteDoc(doc(db, collectionPath, id));
};

export const uploadImage = (filePath, payload) => {
  return uploadBytesResumable(ref(storage, filePath), payload);
};
