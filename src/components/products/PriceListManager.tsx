'use client';

import { useState } from 'react';
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react';
import type { PriceListItem } from '@/types';
import { calculateAfterDiscountPrice } from '@/lib/utils/productUtils';
import Input from '@/components/ui/input';

interface PriceListManagerProps {
  items: PriceListItem[];
  onChange: (items: PriceListItem[]) => void;
}

const EMPTY_ITEM: Omit<PriceListItem, 'unitId' | 'createdon' | 'updatedon'> = {
  unitName: '',
  unitPrice: 0,
  discountType: 'Percentage',
  discount: '0',
  afterDiscountPrice: 0,
  isactive: true,
};

export default function PriceListManager({ items, onChange }: PriceListManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Partial<PriceListItem> | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PriceListItem>>({ ...EMPTY_ITEM });

  const buildItem = (partial: Partial<PriceListItem>): PriceListItem => {
    const unitPrice = partial.unitPrice ?? 0;
    const discountType = partial.discountType ?? 'Percentage';
    const discount = partial.discount ?? '0';
    const afterDiscountPrice = calculateAfterDiscountPrice(unitPrice, discountType, discount);
    const now = new Date().toISOString();
    return {
      unitId: partial.unitId ?? Date.now(),
      unitName: partial.unitName ?? '',
      unitPrice,
      discountType,
      discount,
      afterDiscountPrice,
      isactive: partial.isactive ?? true,
      createdon: partial.createdon ?? now,
      updatedon: now,
    };
  };

  const handleAdd = () => {
    if (!newItem.unitName?.trim()) return;
    const item = buildItem(newItem);
    onChange([...items, item]);
    setNewItem({ ...EMPTY_ITEM });
    setAddingNew(false);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editItem) return;
    const original = items[editingIndex];
    const updated = buildItem({ ...original, ...editItem });
    const updatedList = items.map((it, idx) => (idx === editingIndex ? updated : it));
    onChange(updatedList);
    setEditingIndex(null);
    setEditItem(null);
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditItem({ ...items[index] });
    setAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditItem(null);
  };

  const handlePriceChange = (
    setter: (val: Partial<PriceListItem>) => void,
    current: Partial<PriceListItem>,
    key: keyof PriceListItem,
    value: string | number | boolean
  ) => {
    const next = { ...current, [key]: value };
    const unitPrice = Number(next.unitPrice) || 0;
    const discountType = (next.discountType as 'Percentage' | 'Fixed') ?? 'Percentage';
    const discount = String(next.discount ?? '0');
    const afterDiscountPrice = calculateAfterDiscountPrice(unitPrice, discountType, discount);
    setter({ ...next, afterDiscountPrice });
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && !addingNew && (
        <p className="text-sm text-gray-500">No unit sizes added yet.</p>
      )}

      {items.map((item, index) => (
        <div key={item.unitId} className="border border-gray-200 rounded-lg p-4">
          {editingIndex === index ? (
            <ItemEditor
              value={editItem ?? {}}
              onChange={(key, val) =>
                handlePriceChange(setEditItem, editItem ?? {}, key, val)
              }
              onSave={handleSaveEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-medium text-gray-900 text-sm">{item.unitName}</span>
                <span className="text-sm text-gray-700">₹{item.unitPrice.toFixed(2)}</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                  {item.discountType === 'Percentage'
                    ? `${item.discount}% off`
                    : `₹${item.discount} off`}
                </span>
                <span className="text-sm font-medium text-green-700">
                  → ₹{item.afterDiscountPrice.toFixed(2)}
                </span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    item.isactive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.isactive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => handleStartEdit(index)}
                  aria-label="Edit unit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  onClick={() => handleDelete(index)}
                  aria-label="Remove unit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {addingNew && (
        <div className="border border-dashed border-green-300 rounded-lg p-4 bg-green-50">
          <p className="text-xs font-medium text-green-700 mb-3">New Unit Size</p>
          <ItemEditor
            value={newItem}
            onChange={(key, val) =>
              handlePriceChange(setNewItem, newItem, key, val)
            }
            onSave={handleAdd}
            onCancel={() => {
              setAddingNew(false);
              setNewItem({ ...EMPTY_ITEM });
            }}
          />
        </div>
      )}

      {!addingNew && (
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-green-700 hover:text-green-800 font-medium"
          onClick={() => {
            setAddingNew(true);
            setEditingIndex(null);
            setEditItem(null);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Unit Size
        </button>
      )}
    </div>
  );
}

interface ItemEditorProps {
  value: Partial<PriceListItem>;
  onChange: (key: keyof PriceListItem, val: string | number | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

function ItemEditor({ value, onChange, onSave, onCancel }: ItemEditorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Input
          label="Unit Name"
          placeholder="e.g. 400g"
          value={value.unitName ?? ''}
          onChange={(e) => onChange('unitName', e.target.value)}
        />
        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={value.unitPrice ?? ''}
          onChange={(e) => onChange('unitPrice', parseFloat(e.target.value) || 0)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={value.discountType ?? 'Percentage'}
            onChange={(e) => onChange('discountType', e.target.value as 'Percentage' | 'Fixed')}
          >
            <option value="Percentage">Percentage (%)</option>
            <option value="Fixed">Fixed (₹)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
        <Input
          label={`Discount (${value.discountType === 'Fixed' ? 'amount' : '%'})`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          value={value.discount ?? ''}
          onChange={(e) => onChange('discount', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            After Discount Price
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-medium text-green-700">
            ₹{(value.afterDiscountPrice ?? 0).toFixed(2)}
          </div>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <input
            type="checkbox"
            id={`isactive-${value.unitId ?? 'new'}`}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            checked={value.isactive ?? true}
            onChange={(e) => onChange('isactive', e.target.checked)}
          />
          <label
            htmlFor={`isactive-${value.unitId ?? 'new'}`}
            className="text-sm font-medium text-gray-700"
          >
            Active
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
          onClick={onSave}
        >
          <Check className="h-3.5 w-3.5" />
          Save
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
