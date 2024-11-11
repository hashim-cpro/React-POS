import { Client, Account } from "appwrite";
import { ReturnApiKey } from "./Api.js";
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(ReturnApiKey); // Replace with your project ID

export const account = new Account(client);

export const login = async (email, password) => {
  try {
    const session = await account.createEmailSession(email, password);
    return { success: true, data: session };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const register = async (email, password, name) => {
  try {
    const user = await account.create("unique()", email, password, name);
    if (user) {
      const session = await login(email, password);
      return { success: true, data: { user, session: session.data } };
    }
    return { success: false, error: "Registration failed" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
