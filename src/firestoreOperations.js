import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from "firebase/firestore";
import { db } from './firebase'; 

const tasksCollection = collection(db, "tasks");

export const addTask = async (task) => {
  try {
    const docRef = await addDoc(tasksCollection, task);
    console.log("Task added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding task: ", e.message);
    throw e;
  }
};

export const fetchTasksByStatus = async (status) => {
  try {
    const q = query(tasksCollection, where("status", "==", status));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
  } catch (e) {
    console.error("Error fetching tasks by status: ", e.message);
    throw e;
  }
};

export const fetchTasks = async () => {
  try {
    const querySnapshot = await getDocs(tasksCollection);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
  } catch (e) {
    console.error("Error fetching tasks: ", e.message);
    throw e;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await deleteDoc(taskDoc);
    console.log("Task deleted with ID: ", taskId);
  } catch (e) {
    console.error("Error deleting task: ", e.message);
    throw e;
  }
};

export const updateTask = async (taskId, updatedData) => {
  try {
    const taskDoc = doc(db, "tasks", taskId);
    await updateDoc(taskDoc, updatedData);
    console.log("Task updated with ID: ", taskId);
  } catch (e) {
    console.error("Error updating task: ", e.message);
    throw e;
  }
};
