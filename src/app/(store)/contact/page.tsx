'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { sanitizeInput } from '@/lib/security'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[1-9]\d{9,14}$/.test(val),
      'Please enter a valid phone number'
    ),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@exoticfruits.com',
    href: 'mailto:hello@exoticfruits.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123, Fruit Market Lane, Mumbai, Maharashtra 400001',
    href: null,
  },
]

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    try {
      // Sanitize inputs before sending
      const sanitized = {
        name: sanitizeInput(data.name),
        email: sanitizeInput(data.email),
        phone: data.phone ? sanitizeInput(data.phone) : '',
        subject: sanitizeInput(data.subject),
        message: sanitizeInput(data.message),
      }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log('Contact form submitted:', sanitized)
      toast.success('Message sent! We will get back to you within 24 hours.')
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-blue-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-300">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-navy">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-error">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  {...register('subject')}
                  type="text"
                  placeholder="Order enquiry, product availability..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-error">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-error">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-3 font-semibold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-6 text-2xl font-bold text-navy">
                Get in Touch
              </h2>
              <div className="space-y-4">
                {CONTACT_INFO.map((info) => (
                  <div key={info.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/10">
                      <info.icon size={20} className="text-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {info.label}
                      </p>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="font-medium text-navy hover:text-gold"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="font-medium text-navy">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Clock size={20} className="text-gold" />
                <h3 className="font-bold text-navy">Business Hours</h3>
              </div>
              <div className="space-y-2">
                {BUSINESS_HOURS.map((bh) => (
                  <div key={bh.day} className="flex justify-between text-sm">
                    <span className="text-gray-600">{bh.day}</span>
                    <span className="font-medium text-navy">{bh.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gold/30 bg-gold/5 p-6">
              <p className="text-sm font-medium text-navy">
                💡 <strong>Quick Tip:</strong> For order-related queries, please
                have your order number ready. We typically respond within 24
                business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
