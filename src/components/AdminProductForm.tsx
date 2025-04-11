import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

// Type definitions
type BilingualText = {
  en: string;
  mr: string;
};

type ProductFormData = {
  name: BilingualText;
  description: BilingualText;
  benefits: BilingualText[];
  price: string;
  discountedPrice: string;
  category: string;
  image: string;
};

type Product = {
  _id?: string;
  name: BilingualText;
  description: BilingualText;
  benefits: BilingualText[];
  price: number;
  discountedPrice: number;  // Only number type now
  category: string;
  image: string;
};

type AdminProductFormProps = {
  product?: Product | null;
  onCancel: () => void;
  onSubmit: (data: Product) => void;
};

type BilingualFields = {
  [K in keyof ProductFormData]: ProductFormData[K] extends BilingualText ? K : never;
}[keyof ProductFormData];

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onCancel, onSubmit }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: { en: '', mr: '' },
    description: { en: '', mr: '' },
    benefits: [{ en: '', mr: '' }],
    price: '',
    discountedPrice: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || { en: '', mr: '' },
        description: product.description || { en: '', mr: '' },
        benefits: product.benefits?.length ? product.benefits : [{ en: '', mr: '' }],
        price: product.price.toString(),
        discountedPrice: product.discountedPrice?.toString() || '',
        category: product.category || '',
        image: product.image || '',
      });
    }
  }, [product]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [field, lang] = name.split('.') as [BilingualFields, keyof BilingualText];
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBenefitChange = (index: number, lang: keyof BilingualText, value: string) => {
    const updatedBenefits = [...formData.benefits];
    updatedBenefits[index][lang] = value;
    setFormData((prev) => ({ ...prev, benefits: updatedBenefits }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { en: '', mr: '' }],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (Number(formData.discountedPrice) > Number(formData.price)) {
      alert(t('admin.products.validation.number'));
      return;
    }

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        // Fix: Always provide a number for discountedPrice (0 if empty)
        discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : 0,
      };

      // Pass the data to parent component's onSubmit handler
      onSubmit(payload);
    } catch (err) {
      console.error(err);
      alert('Error preparing product data.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-semibold">
        {product ? t('admin.products.edit') : t('admin.products.addNew')}
      </h2>

      {/* Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">{t('admin.products.fields.nameEn')}</label>
          <input
            type="text"
            name="name.en"
            value={formData.name.en}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('admin.products.fields.nameMr')}</label>
          <input
            type="text"
            name="name.mr"
            value={formData.name.mr}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Description */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">{t('admin.products.fields.descriptionEn')}</label>
          <textarea
            name="description.en"
            value={formData.description.en}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('admin.products.fields.descriptionMr')}</label>
          <textarea
            name="description.mr"
            value={formData.description.mr}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className="block font-medium mb-2">{t('admin.products.fields.benefits')}</label>
        <div className="space-y-2">
          {formData.benefits.map((b, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t('admin.products.form.benefitPlaceholderEn')}
                value={b.en}
                onChange={(e) => handleBenefitChange(index, 'en', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder={t('admin.products.form.benefitPlaceholderMr')}
                value={b.mr}
                onChange={(e) => handleBenefitChange(index, 'mr', e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBenefit}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          + {t('admin.products.form.addBenefit')}
        </button>
      </div>

      {/* Price & Discounted Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">{t('admin.products.originalPrice')}</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">{t('admin.products.discountedPrice')}</label>
          <input
            type="number"
            name="discountedPrice"
            value={formData.discountedPrice}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block font-medium mb-1">{t('admin.products.fields.category')}</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">{t('admin.products.form.categoryPlaceholder')}</option>
          <option value="fertilizers">{t('products.categories.fertilizers')}</option>
          <option value="seeds">{t('products.categories.seeds')}</option>
          <option value="Insecticide">{t('products.categories.Insecticide')}</option>
          <option value="fungicide">{t('products.categories.fungicide')}</option>
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label className="block font-medium mb-1">{t('admin.products.form.image')}</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Cancel & Submit Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400 transition"
        >
          {t('admin.products.form.cancel')}
        </button>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {t('admin.products.form.save')}
        </button>
      </div>
    </form>
  );
};

export default AdminProductForm;