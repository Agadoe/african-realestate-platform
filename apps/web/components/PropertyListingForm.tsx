import { useState } from 'react';
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiPlus, FiX } from 'react-icons/fi';
import { propertyApi, uploadApi } from '../lib/api';

interface PropertyListingFormProps {
  onSubmit: (property: any) => void;
  onCancel: () => void;
}

interface UploadedImage {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

export default function PropertyListingForm({ onSubmit, onCancel }: PropertyListingFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'apartment',
    listingType: 'sale',
    price: '',
    currency: 'GHS',
    bedrooms: '',
    bathrooms: '',
    area: '',
    areaUnit: 'sqm',
    yearBuilt: '',
    condition: 'good',
    street: '',
    city: '',
    region: '',
    country: 'Ghana',
    features: [] as string[],
    amenities: [] as string[],
  });

  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(a => a !== amenity)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews = files.map(file => URL.createObjectURL(file));

      setImages(prev => [...prev, ...files]);
      setImagePreviews(prev => [...prev, ...newPreviews]);

      // Upload immediately — each file uploads as it's added
      let uploadCount = 0;
      files.forEach((file) => {
        setUploading(true);
        setUploadProgress(`Uploading image ${uploadCount + 1}...`);

        uploadApi.uploadImage(file)
          .then(result => {
            setUploadedImages(prev => {
              const updated = [...prev, result];
              setUploadProgress(`Uploaded ${updated.length} of ${images.length + files.length} images`);
              return updated;
            });
          })
          .catch(err => {
            console.error('Image upload failed:', err);
            setError(`Failed to upload image: ${file.name}. Please try again.`);
          })
          .finally(() => {
            uploadCount++;
            if (uploadCount >= files.length) {
              setUploading(false);
              setUploadProgress('');
            }
          });
      });
    }
  };

  const removeImage = async (index: number) => {
    const previewToRevoke = imagePreviews[index];

    // If image was uploaded, delete from Cloudinary
    if (uploadedImages[index]?.public_id) {
      try {
        await uploadApi.deleteImage(uploadedImages[index].public_id);
      } catch (err) {
        console.warn('Failed to delete image from Cloudinary:', err);
      }
    }

    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((_, i) => i !== index));

    // Revoke object URL to free memory
    URL.revokeObjectURL(previewToRevoke);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Build images array — only include successfully uploaded images
      const imagesPayload = uploadedImages.map(img => ({
        url: img.url,
        public_id: img.public_id,
        width: img.width,
        height: img.height,
      }));

      // Build the property payload matching backend schema
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear(),
        features: formData.features,
        amenities: formData.amenities,
        images: imagesPayload,
        address: {
          street: formData.street,
          city: formData.city,
          region: formData.region,
          country: formData.country,
        },
      };

      // Submit to real API
      const result = await propertyApi.createProperty(propertyData);

      onSubmit(result);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit property listing. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">List Your Property</h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <FiX className="text-slate-700 dark:text-slate-300" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {uploading && uploadProgress && (
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center">
          <svg className="animate-spin mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {uploadProgress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <FiHome className="mr-2" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Property Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input py-3 w-full"
                placeholder="e.g., Luxury 3-Bedroom Apartment"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                className="input py-3 w-full"
                value={formData.propertyType}
                onChange={handleInputChange}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
                <option value="penthouse">Penthouse</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="input py-3 w-full"
              placeholder="Describe your property in detail..."
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="price" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                required
                min="0"
                step="0.01"
                className="input py-3 w-full"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="input py-3 w-full"
                value={formData.currency}
                onChange={handleInputChange}
              >
                <option value="GHS">GHS (₵)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Listing Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['sale', 'rent', 'rent-to-own'] as const).map((type) => (
                <label key={type} className="flex items-center p-3 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input
                    type="radio"
                    name="listingType"
                    value={type}
                    className="mr-2"
                    checked={formData.listingType === type}
                    onChange={handleInputChange}
                  />
                  <span className="text-slate-700 dark:text-slate-300 capitalize">
                    {type.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Property Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bedrooms
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                className="input py-3 w-full"
                placeholder="Number of bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bathrooms
              </label>
              <input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                className="input py-3 w-full"
                placeholder="Number of bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                className="input py-3 w-full"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="area" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Area
              </label>
              <div className="flex">
                <input
                  id="area"
                  name="area"
                  type="number"
                  min="0"
                  className="input py-3 w-full rounded-r-none"
                  placeholder="Enter area"
                  value={formData.area}
                  onChange={handleInputChange}
                />
                <select
                  id="areaUnit"
                  name="areaUnit"
                  className="input py-3 rounded-l-none border-l-0"
                  value={formData.areaUnit}
                  onChange={handleInputChange}
                >
                  <option value="sqm">sqm</option>
                  <option value="sqft">sqft</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="yearBuilt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Year Built
              </label>
              <input
                id="yearBuilt"
                name="yearBuilt"
                type="number"
                min="1800"
                max={new Date().getFullYear()}
                className="input py-3 w-full"
                placeholder="Year built"
                value={formData.yearBuilt}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <FiMapPin className="mr-2" />
            Address
          </h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Street Address
              </label>
              <input
                id="street"
                name="street"
                type="text"
                required
                className="input py-3 w-full"
                placeholder="Street address"
                value={formData.street}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  className="input py-3 w-full"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Region
                </label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  required
                  className="input py-3 w-full"
                  placeholder="Region"
                  value={formData.region}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  required
                  className="input py-3 w-full"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features and Amenities */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Features and Amenities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Features
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="input py-3 w-full rounded-r-none"
                  placeholder="Add a feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-l-none"
                  onClick={addFeature}
                >
                  <FiPlus />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                  >
                    {feature}
                    <button
                      type="button"
                      className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                      onClick={() => removeFeature(feature)}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Amenities
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="input py-3 w-full rounded-r-none"
                  placeholder="Add an amenity"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary rounded-l-none"
                  onClick={addAmenity}
                >
                  <FiPlus />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                  >
                    {amenity}
                    <button
                      type="button"
                      className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      onClick={() => removeAmenity(amenity)}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Images — now with Cloudinary upload */}
        <div className="pb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <FiImage className="mr-2" />
            Property Images
          </h3>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading}
            />
            <label htmlFor="images" className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex flex-col items-center justify-center">
                <FiImage className="text-4xl text-slate-400 mb-2" />
                <p className="text-slate-600 dark:text-slate-400">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  PNG, JPG, GIF up to 10MB. Max 10 images.
                </p>
              </div>
            </label>
          </div>

          {uploadProgress && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 text-center">
              {uploadProgress}
            </div>
          )}

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {uploadedImages[index] && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Uploaded
                    </span>
                  )}
                  {uploading && !uploadedImages[index] && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full flex items-center">
                      <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading
                    </span>
                  )}
                  <button
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    onClick={() => removeImage(index)}
                    disabled={uploading}
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline px-6 py-3"
            disabled={loading || uploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-6 py-3 flex items-center"
            disabled={loading || uploading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              'List Property'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}