'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { toast } from 'sonner'

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const { updateProfile, updatePassword } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileForm) => {
    try {
      await updateProfile(data as Record<string, unknown>)
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await updatePassword(data.currentPassword, data.newPassword)
      toast.success('Password changed successfully!')
      resetPassword()
    } catch {
      toast.error('Failed to change password. Please try again.')
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-navy-600">Settings</h1>

      {/* Profile Settings */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy-600">Profile Settings</h2>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              {...registerProfile('name')}
              className="input-field"
              placeholder="John Doe"
            />
            {profileErrors.name && (
              <p className="mt-1 text-xs text-error">
                {profileErrors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...registerProfile('email')}
              type="email"
              className="input-field"
              placeholder="john@example.com"
            />
            {profileErrors.email && (
              <p className="mt-1 text-xs text-error">
                {profileErrors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              {...registerProfile('phone')}
              type="tel"
              className="input-field"
              placeholder="9876543210"
            />
          </div>
          <button
            type="submit"
            disabled={profileSubmitting}
            className="btn-primary"
          >
            {profileSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Change Password */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy-600">Change Password</h2>
        <form
          onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              {...registerPassword('currentPassword')}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {passwordErrors.currentPassword && (
              <p className="mt-1 text-xs text-error">
                {passwordErrors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              {...registerPassword('newPassword')}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {passwordErrors.newPassword && (
              <p className="mt-1 text-xs text-error">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              {...registerPassword('confirmPassword')}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
            {passwordErrors.confirmPassword && (
              <p className="mt-1 text-xs text-error">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={passwordSubmitting}
            className="btn-primary"
          >
            {passwordSubmitting ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </section>

      {/* Notification Preferences */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy-600">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            { id: 'order-updates', label: 'Order updates and confirmations' },
            { id: 'promotions', label: 'Promotions and new arrivals' },
            { id: 'newsletter', label: 'Weekly newsletter' },
          ].map((pref) => (
            <label
              key={pref.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="checkbox"
                defaultChecked={pref.id === 'order-updates'}
                className="h-4 w-4 rounded accent-navy-600"
              />
              <span className="text-sm text-gray-700">{pref.label}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => toast.success('Preferences saved!')}
          className="btn-primary mt-4"
        >
          Save Preferences
        </button>
      </section>
    </div>
  )
}
