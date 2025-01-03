import { useState, useCallback } from "react";
import UserDataService from "../services/userDataService";

export const useUserData = (userId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeUser = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);
      try {
        const result = await UserDataService.initializeUserData(
          userId,
          userData
        );
        if (!result.success) {
          throw new Error(result.error);
        }
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const syncData = useCallback(
    async (collectionId, data) => {
      setLoading(true);
      setError(null);
      try {
        return await UserDataService.syncUserData(userId, collectionId, data);
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const getData = useCallback(
    async (collectionId) => {
      setLoading(true);
      setError(null);
      try {
        const result = await UserDataService.getUserData(collectionId, userId);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    initializeUser,
    syncData,
    getData,
    loading,
    error,
  };
};
