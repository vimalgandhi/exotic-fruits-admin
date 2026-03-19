import { useState, useCallback } from 'react';
import { getAdminUsers, getAdminUserById, deleteAdminUser } from '@/lib/api';
import { logger } from '@/lib/logger';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  joinedDate: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page = 1, role = '', search = '') => {
    try {
      setLoading(true);
      const data = (await getAdminUsers(page, role, search)) as { data: User[] };
      setUsers(data.data ?? []);
      setError(null);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch users';
      logger.error('useAdminUsers/fetchUsers', message, err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (id: string) => {
    try {
      const data = (await getAdminUserById(id)) as { data: User };
      return data.data;
    } catch (err) {
      logger.error('useAdminUsers/getUser', `Failed to fetch user id=${id}`, err);
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch user');
    }
  }, []);

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteAdminUser(id);
        setUsers(users.filter((u) => u.id !== id));
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete user';
        logger.error('useAdminUsers/deleteUser', `Failed to delete user id=${id}`, err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [users]
  );

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUser,
    deleteUser,
  };
}
