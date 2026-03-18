'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .optional()
    .or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactForm = z.infer<typeof contactSchema>

const CONTACT_INFO = [
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'hello@exoticfruits.in',
    href: 'mailto:hello@exoticfruits.in',
  },
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    value: '+91 98765 43210',
    href: 'tel:+919876543210',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Address',
    value: '12, Fruit Market Lane, Bandra West, Mumbai — 400 050',
    href: null,
  },
]

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Message sent! We'll get back to you within 24 hours.")
    reset()
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-blue-900 py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Get in <span className="text-gold">Touch</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            Have a question, feedback, or just want to say hi? We&#39;d love to
            hear from you.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-navy">Contact Info</h2>
              {CONTACT_INFO.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="mt-0.5 text-navy hover:text-gold"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="mt-0.5 text-navy">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-navy">Business Hours</p>
                <p className="mt-1 text-sm text-gray-600">
                  Monday – Saturday: 9 AM – 6 PM IST
                </p>
                <p className="text-sm text-gray-600">Sunday: Closed</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-2xl font-bold text-navy">
                  Send a Message
                </h2>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5"
                  noValidate
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Arjun Mehta"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-error">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="arjun@example.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-error">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone (optional)
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="9876543210"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-error">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Subject <span className="text-error">*</span>
                      </label>
                      <input
                        {...register('subject')}
                        type="text"
                        placeholder="Order enquiry"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-error">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
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
                      'Sending…'
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
