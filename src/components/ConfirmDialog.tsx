'use client'

import { BaseModal } from './BaseModal'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isDangerous?: boolean
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmDialogProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded bg-gray-200 px-4 py-2 text-navy-600 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`rounded px-4 py-2 text-white transition-colors ${
            isDangerous
              ? 'btn-danger'
              : 'btn-primary'
          }`}
        >
          Confirm
        </button>
      </div>
    </BaseModal>
  )
}
