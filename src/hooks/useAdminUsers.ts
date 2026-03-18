import { useState, useCallback } from 'react';
import { getAdminUsers, getAdminUserById, deleteAdminUser } from '@/lib/api';

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
