"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  {
    icon: <Mail size={20} />,
    label: "Email",
    value: "hello@exoticfruits.in",
    href: "mailto:hello@exoticfruits.in",
  },
  {
    icon: <Phone size={20} />,
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: <MapPin size={20} />,
    label: "Address",
    value: "12, Fruit Market Lane, Bandra West, Mumbai — 400 050",
    href: null,
  },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    reset();
  };

  return (
    <div>
      {/* Main Contact Section */}
      <section className="min-h-screen bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-16 lg:gap-20 lg:grid-cols-2 items-center">
            {/* Left Side - Contact Info */}
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-3 text-gray-200">
                Contact Us
              </h1>
              <div className="w-24 h-1.5 bg-gold-500 mb-8 rounded-full"></div>

              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-12">
                Tell us about your project and we&#39;ll contact you soon
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gold-500 uppercase tracking-wider mb-4">
                    Connect With Us
                  </h3>
                  <div className="space-y-4">
                    {CONTACT_INFO.map((info) => (
                      <div key={info.label} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-gold-500 text-navy-800 flex-shrink-0">
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-xs text-gold-400 uppercase tracking-wide">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a
                              href={info.href}
                              className="text-white hover:text-gold-500 transition-colors font-medium"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-white font-medium">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/20 pt-8">
                  <p className="text-sm text-gold-400 uppercase tracking-wide font-bold mb-4">
                    📍 Business Hours
                  </p>
                  <p className="text-gray-300">
                    Monday – Saturday: 9 AM – 6 PM IST
                  </p>
                  <p className="text-gray-300">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-navy-700/50 backdrop-blur rounded-2xl border border-white/10 p-8 md:p-10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-2">
                Send a Message
              </h2>
              <p className="text-gray-400 mb-8">
                Fill out the form below and we&#39;ll get back to you shortly.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    Name <span className="text-gold-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-navy-600/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-gold-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">
                      Email <span className="text-gold-500">*</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-navy-600/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                    />
                    {errors.email && (
                      <p className="mt-2 text-xs text-gold-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-medium">
                      Phone
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="9876543210"
                      className="w-full bg-navy-600/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-xs text-gold-400">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    Subject <span className="text-gold-500">*</span>
                  </label>
                  <input
                    {...register("subject")}
                    type="text"
                    placeholder="Order enquiry"
                    className="w-full bg-navy-600/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-xs text-gold-400">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">
                    Message <span className="text-gold-500">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="How can we help you?"
                    className="w-full bg-navy-600/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="mt-2 text-xs text-gold-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-navy-800 font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send size={18} className="inline mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-navy-600 mb-3">
            Why Contact Us?
          </h2>
          <div className="mx-auto mb-12 h-1 w-16 bg-gold-500 rounded-full"></div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="p-6">
              <p className="text-4xl mb-3">⚡</p>
              <h3 className="font-bold text-navy-600 mb-2">Quick Response</h3>
              <p className="text-sm text-gray-600">
                We respond to inquiries within 24 hours
              </p>
            </div>
            <div className="p-6">
              <p className="text-4xl mb-3">✅</p>
              <h3 className="font-bold text-navy-600 mb-2">Expert Team</h3>
              <p className="text-sm text-gray-600">
                Dedicated professionals ready to help
              </p>
            </div>
            <div className="p-6">
              <p className="text-4xl mb-3">🎯</p>
              <h3 className="font-bold text-navy-600 mb-2">Custom Solutions</h3>
              <p className="text-sm text-gray-600">
                Tailored to your specific needs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
