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

interface EditableItem {
  unitName: string;
  unitType: 'Kg' | 'Gm' | 'Ltr' | 'Ml' | 'Pc';
  unitPrice: number;
  discountType: 'Percentage' | 'Fixed';
  discount: string;
  afterDiscountPrice: number;
  status: 'active' | 'inactive';
}

const EMPTY_ITEM: EditableItem = {
  unitName: '',
  unitType: 'Kg',
  unitPrice: 0,
  discountType: 'Percentage',
  discount: '0',
  afterDiscountPrice: 0,
  status: 'active',
};

// Helper to parse combined unitSize like "400Kg" into { unitName, unitType }
const parseUnitSize = (unitSize: string): { unitName: string; unitType: 'Kg' | 'Gm' | 'Ltr' | 'Ml' | 'Pc' } => {
  const match = unitSize.match(/^(\d+(?:\.\d+)?)(Kg|Gm|Ltr|Ml|Pc)$/);
  if (match) {
    return { unitName: match[1], unitType: match[2] as any };
  }
  // If parse fails, try to extract type from end
  const types = ['Kg', 'Gm', 'Ltr', 'Ml', 'Pc'];
  for (const type of types) {
    if (unitSize.endsWith(type)) {
      return { unitName: unitSize.slice(0, -type.length), unitType: type as any };
    }
  }
  return { unitName: unitSize, unitType: 'Kg' };
};

// Helper to combine unitName and unitType into "400Kg"
const combineUnitSize = (unitName: string, unitType: string): string => {
  return `${unitName}${unitType}`;
};

// Validation helper
const validatePriceItem = (item: Partial<EditableItem>): { isValid: boolean; error?: string } => {
  const unitName = String(item.unitName ?? '').trim();
  const unitPrice = Number(item.unitPrice ?? 0);
  const discount = Number(item.discount ?? 0);

  if (!unitName) {
    return { isValid: false, error: 'Unit value is required' };
  }

  if (unitPrice <= 0) {
    return { isValid: false, error: 'Unit price must be greater than 0' };
  }

  if (discount < 0) {
    return { isValid: false, error: 'Discount cannot be negative' };
  }

  return { isValid: true };
};

export default function PriceListManager({ items, onChange }: PriceListManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Partial<EditableItem> | null>(null);
  const [addingNew, setAddingNew] = useState(true);
  const [newItem, setNewItem] = useState<EditableItem>({ ...EMPTY_ITEM });

  const buildItem = (partial: Partial<EditableItem>): PriceListItem => {
    const unitPrice = partial.unitPrice ?? 0;
    const discountType = (partial.discountType ?? 'Percentage') as 'Percentage' | 'Fixed';
    const discount = partial.discount ?? '0';
    const afterDiscountPrice = calculateAfterDiscountPrice(unitPrice, discountType, discount);
    const now = new Date().toISOString();
    const unitSize = combineUnitSize(partial.unitName ?? '', partial.unitType ?? 'Kg');
    return {
      unitId: Date.now(),
      unitSize,
      unitPrice,
      discountType,
      discount,
      afterDiscountPrice,
      status: (partial.status ?? 'active') as 'active' | 'inactive',
      createdon: now,
      updatedon: now,
    };
  };

  const handleAdd = () => {
    const validation = validatePriceItem(newItem);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }
    const item = buildItem(newItem as EditableItem);
    onChange([...items, item]);
    setNewItem({ ...EMPTY_ITEM });
    setAddingNew(false);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null || !editItem) return;
    
    const validation = validatePriceItem(editItem as EditableItem);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const original = items[editingIndex];
    const unitSize = combineUnitSize(editItem.unitName ?? '', editItem.unitType ?? 'Kg');
    const unitPrice = editItem.unitPrice ?? 0;
    const discountType = (editItem.discountType ?? 'Percentage') as 'Percentage' | 'Fixed';
    const discount = editItem.discount ?? '0';
    const afterDiscountPrice = calculateAfterDiscountPrice(unitPrice, discountType, discount);
    const updated: PriceListItem = {
      ...original,
      unitSize,
      unitPrice,
      discountType,
      discount,
      afterDiscountPrice,
      status: (editItem.status ?? 'active') as 'active' | 'inactive',
      updatedon: new Date().toISOString(),
    };
    const updatedList = items.map((it, idx) => (idx === editingIndex ? updated : it));
    onChange(updatedList);
    setEditingIndex(null);
    setEditItem(null);
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, idx) => idx !== index));
  };

  const handleStartEdit = (index: number) => {
    const item = items[index];
    const { unitName, unitType } = parseUnitSize(item.unitSize);
    setEditingIndex(index);
    setEditItem({
      unitName,
      unitType,
      unitPrice: item.unitPrice,
      discountType: item.discountType,
      discount: item.discount,
      afterDiscountPrice: item.afterDiscountPrice,
      status: item.status,
    });
    setAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditItem(null);
  };

  const handlePriceChange = (
    setter: (val: Partial<EditableItem>) => void,
    current: Partial<EditableItem>,
    key: keyof EditableItem,
    value: string | number | 'active' | 'inactive'
  ) => {
    const next = { ...current, [key]: value };
    const unitPrice = Number(next.unitPrice) || 0;
    const discountType = (next.discountType ?? 'Percentage') as 'Percentage' | 'Fixed';
    const discount = String(next.discount ?? '0');
    const afterDiscountPrice = calculateAfterDiscountPrice(unitPrice, discountType, discount);
    setter({ ...next, afterDiscountPrice });
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && !addingNew && (
        <p className="text-sm text-gray-500">No unit sizes added yet.</p>
      )}

      {items.map((item, index) => {
        const { unitName, unitType } = parseUnitSize(item.unitSize);
        return (
          <div key={item.unitId} className="border border-gray-200 rounded-lg p-4">
            {editingIndex === index ? (
              <ItemEditor
                value={editItem ?? EMPTY_ITEM}
                onChange={(key, val) =>
                  handlePriceChange(setEditItem, editItem ?? {}, key, val)
                }
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm">
                    {unitName} {unitType}
                  </span>
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
                      item.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {item.status === 'active' ? 'Active' : 'Inactive'}
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
        );
      })}

      {addingNew && (
        <div className="border border-dashed border-green-300 rounded-lg p-4 bg-green-50">
          <p className="text-xs font-medium text-green-700 mb-3">New Unit Size</p>
          <ItemEditor
            value={newItem}
            onChange={(key, val) =>
              handlePriceChange((v) => setNewItem(v as EditableItem), newItem, key, val)
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
  value: Partial<EditableItem>;
  onChange: (key: keyof EditableItem, val: string | number | 'active' | 'inactive') => void;
  onSave: () => void;
  onCancel: () => void;
}

function ItemEditor({ value, onChange, onSave, onCancel }: ItemEditorProps) {
  const [touched, setTouched] = useState(false);
  const item = { ...EMPTY_ITEM, ...value };
  const validation = validatePriceItem(item);
  const shouldShowError = touched && !validation.isValid;
  
  const handleChange = (key: keyof EditableItem, val: string | number | 'active' | 'inactive') => {
    setTouched(true);
    onChange(key, val);
  };
  
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Input
          label="Unit Value"
          placeholder="e.g. 400"
          value={item.unitName ?? ''}
          onChange={(e) => handleChange('unitName', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={item.unitType ?? 'Kg'}
            onChange={(e) => handleChange('unitType', e.target.value as any)}
          >
            <option value="Kg">Kilogram (Kg)</option>
            <option value="Gm">Gram (Gm)</option>
            <option value="Ltr">Liter (Ltr)</option>
            <option value="Ml">Milliliter (Ml)</option>
            <option value="Pc">Piece (Pc)</option>
          </select>
        </div>
        <Input
          label="Unit Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={item.unitPrice ?? ''}
          onChange={(e) => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            value={item.discountType ?? 'Percentage'}
            onChange={(e) => handleChange('discountType', e.target.value as any)}
          >
            <option value="Percentage">Percentage (%)</option>
            <option value="Fixed">Fixed (₹)</option>
          </select>
        </div>
        <Input
          label={`Discount (${item.discountType === 'Fixed' ? 'amount' : '%'})`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0"
          value={item.discount ?? ''}
          onChange={(e) => handleChange('discount', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            After Discount Price
          </label>
          <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-medium text-green-700">
            ₹{(item.afterDiscountPrice ?? 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={item.status ?? 'active'}
          onChange={(e) => handleChange('status', e.target.value as any)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {shouldShowError && (
        <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200">
          <p className="text-xs font-medium text-red-700">{validation.error}</p>
        </div>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          disabled={!validation.isValid}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-sm font-medium rounded-lg transition-colors ${
            validation.isValid
              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
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
