"use client";

import { useForm } from "react-hook-form";
import {
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import type { Product, PriceListItem, Category } from "@/types";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import ImageUpload from "@/components/ui/ImageUpload";
import PriceListManager from "@/components/products/PriceListManager";
import SeoSection from "@/components/products/SeoSection";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  originCountry?: string;
  foodType?: string;
  stockStatus?: "In Stock" | "Out Stock" | "Out of Stock";
  status: "Active" | "Inactive";
  featured?: boolean;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoAlt?: string;
  seoIndex?: boolean;
  seoFollow?: boolean;
  seoCanonical?: string;
  seoSchemaJson?: string;
};

export default function ProductForm({
  product,
  categories,
  onSubmit,
  isLoading,
}: any) {
  const router = useRouter();
  const [pricingExpanded, setPricingExpanded] = useState(true);
  const [imageValue, setImageValue] = useState<File | string | null>(
    product?.images?.[0] || null,
  );
  const [priceList, setPriceList] = useState<PriceListItem[]>(
    Array.isArray(product?.pricelist) ? product.pricelist : [],
  );
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<ProductFormValues>({
    mode: "onChange",
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      categoryId: product?.categoryId ?? "",
      originCountry: product?.originCountry ?? "",
      foodType: product?.foodType ?? "",
      stockStatus:
        (product?.stockStatus as ProductFormValues["stockStatus"]) ??
        "In Stock",
      status: product?.status ?? "Active",
      featured: product?.featured ?? false,
      seoMetaTitle: product?.seo?.metaTitle ?? "",
      seoMetaDescription: product?.seo?.metaDescription ?? "",
      seoAlt: product?.seo?.seoAlt ?? "",
      seoIndex: product?.seo?.index ?? true,
      seoFollow: product?.seo?.follow ?? true,
      seoCanonical: product?.seo?.canonical ?? "",
      seoSchemaJson: product?.seo?.schemaJson ?? "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    // Auto-generate slug from name when product is new
    if (!product && nameValue) {
      setValue("slug", slugify(nameValue));
    }
  }, [nameValue, product, setValue]);

  const handleFormSubmit = async (values: ProductFormValues) => {
    setSubmissionError(null);
    setImageError(null);

    // Validate image for new products
    if (!product && !imageValue) {
      setImageError("Product image is required");
      toast.error("Please upload a product image");
      return;
    }

    // Validate at least one unit size in price list
    if (!priceList || priceList.length === 0) {
      setSubmissionError("At least one unit size with pricing is required");
      toast.error("Please add at least one unit size before saving");
      return;
    }

    console.log(`Received category_id: ${values.categoryId}`);
    
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("slug", values.slug);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId);
    formData.append("originCountry", values.originCountry || "");
    formData.append("foodType", values.foodType || "");
    formData.append("stockStatus", values.stockStatus || "");
    formData.append("status", values.status);
    formData.append("featured", values.featured ? "true" : "false");
    formData.append("pricelist", JSON.stringify(priceList));
    // SEO fields
    formData.append("seoMetaTitle", values.seoMetaTitle || "");
    formData.append("seoMetaDescription", values.seoMetaDescription || "");
    formData.append("seoAlt", values.seoAlt || "");
    formData.append("seoIndex", values.seoIndex ? "true" : "false");
    formData.append("seoFollow", values.seoFollow ? "true" : "false");
    formData.append("seoCanonical", values.seoCanonical || "");
    formData.append("seoSchemaJson", values.seoSchemaJson || "");
    // Always append image if present and is File
    if (imageValue && imageValue instanceof File) {
      formData.append("image", imageValue);
    }

    try {
      await onSubmit(formData as any);
    } catch (err: any) {
      console.error("ProductForm submission error:", err);
      let errorMessage = "Failed to save product";

      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setSubmissionError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Validation Errors Summary */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 flex gap-3 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">
              Please fix the following errors:
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.entries(errors).map(([field, error]: any) => (
                <li key={field}>• {error?.message || `${field} is invalid`}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-red-400 hover:text-red-600 flex-shrink-0 text-xs font-medium whitespace-nowrap"
          >
            Scroll up
          </button>
        </div>
      )}

      {/* Error Alert */}
      {submissionError && (
        <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4 flex gap-3 shadow-sm">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
            <p className="text-sm text-red-700">{submissionError}</p>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionError(null)}
            className="text-red-400 hover:text-red-600 flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 md:p-6 space-y-4">
        <h2 className="text-base font-semibold text-gray-900">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            required
            placeholder="e.g. Dragon Fruit"
            error={errors.name?.message}
            {...register("name", { 
              required: "Product name is required",
              minLength: { value: 1, message: "Product name is required" }
            })}
          />
          <Input
            label="Slug"
            required
            placeholder="e.g. dragon-fruit"
            error={errors.slug?.message}
            {...register("slug", { 
              required: "Slug is required",
              minLength: { value: 1, message: "Slug is required" }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={3}
            className={`block w-full px-3 py-2 border rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
              errors.description
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white"
            }`}
            placeholder="Describe the product..."
            {...register("description", { 
              required: "Description is required",
              minLength: { value: 1, message: "Description is required" }
            })}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                errors.categoryId
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
              {...register("categoryId", { 
                required: "Category is required" 
              })}
            >
              <option value="">Select category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>  
            <select
              className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.status
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
              {...register("status", { 
                required: "Status is required",
                validate: (val) => ["Active", "Inactive"].includes(val) || "Invalid status value"
              })}
            >
              <option value="">Select status...</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              className={`block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                errors.stockStatus
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
              {...register("stockStatus")}
            >
              <option value="">Select stock status...</option>
              <option value="In Stock">In Stock</option>
              <option value="Out Stock">Out Stock</option>
            </select>
            {errors.stockStatus && (
              <p className="mt-1 text-sm text-red-600">
                {errors.stockStatus.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Origin Country"
            placeholder="e.g. Thailand"
            {...register("originCountry")}
          />
          <Input
            label="Food Type"
            placeholder="e.g. Regular, Organic, Premium"
            {...register("foodType")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image {!product && <span className="text-red-500">*</span>}
          </label>
          <ImageUpload
            value={imageValue instanceof File ? imageValue : (typeof imageValue === 'string' ? imageValue : null)}
            onChange={(file: any) => {
              setImageValue(file instanceof File ? file : null);
              setImageError(null);
            }}
            preview
          />
          {imageError && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {imageError}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            {...register("featured")}
          />
          <label
            htmlFor="featured"
            className="text-sm font-medium text-gray-700"
          >
            Featured product
          </label>
        </div>
      </div>

      {/* Price List / Unit Sizes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          type="button"
          className="w-full flex items-center justify-between p-6 text-left"
          onClick={() => setPricingExpanded((v) => !v)}
        >
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Unit Sizes &amp; Pricing
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Add multiple unit sizes (e.g. 400g, 500g, 600g) with individual
              pricing and discounts
            </p>
          </div>
          {pricingExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
          )}
        </button>

        {pricingExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100 pt-4">
            <PriceListManager items={priceList} onChange={setPriceList} />
          </div>
        )}
      </div>

      {/* Advanced SEO */}
      <SeoSection register={register} errors={errors} />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isSubmitted && Object.keys(errors).length > 0}
          className={isSubmitted && Object.keys(errors).length > 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Save className="h-4 w-4 mr-2" />
          {product ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
