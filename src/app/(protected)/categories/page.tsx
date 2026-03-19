'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';
import CategoryList from '@/components/categories/CategoryList';
import ConfirmDialog from '@/components/modals/confirm-dialog';

export default function CategoriesPage() {
  const { categories, isLoading, deleteCategory } = useCategories();
  const [confirmState, setConfirmState] = useState<{ isOpen: boolean; id?: string; name?: string; isDeleting: boolean }>({ isOpen: false, isDeleting: false });

  const handleDelete = async (id: string, name: string) => {
    setConfirmState({ isOpen: true, id, name, isDeleting: false });
  };
  const executeDelete = async () => {
    const { id, name } = confirmState;
    if (!id || !name) return;

    setConfirmState((prev) => ({ ...prev, isDeleting: true }));
    try {
      await deleteCategory(id);
      toast.success(`"${name}" deleted successfully`);
      setConfirmState({ isOpen: false, isDeleting: false });
    } catch {
      toast.error('Failed to delete category');
      setConfirmState({ isOpen: false, isDeleting: false });
    }
  };

  return (
    <>
      <CategoryList
        categories={categories}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Delete Category"
        message={`Are you sure you want to delete " ${confirmState.name} " ?`}
        onConfirm={executeDelete}
        onCancel={() => setConfirmState({ isOpen: false, isDeleting: false })}
        isLoading={confirmState.isDeleting}
      />
    </>
  );
}
