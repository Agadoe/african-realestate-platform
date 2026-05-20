import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMapPin, FiHeart, FiMaximize, FiDroplet, FiHome } from 'react-icons/fi';
import { useFavorites } from '../lib/hooks';
import { formatCurrency } from '../lib/hooks';

interface PropertyCardProps {
  property: {
    _id?: string;
    id?: string;
    title: string;
    price: number;
    location?: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    agent?: {
      name: string;
      rating: number;
    };
    status: string;
    image?: string;
    address?: {
      city: string;
      region: string;
    };
  };
  priority?: boolean;
}

export default function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const id = property._id || property.id || '';
  const { isFavorite, toggleFavorite } = useFavorites(id);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (id) toggleFavorite(id);
  };

  const location = property.location ||
    (property.address ? `${property.address.city}, ${property.address.region}` : 'Ghana');

  const imageUrl: string | undefined = typeof property.image === 'string' ? property.image : undefined;
  const hasValidImage = imageUrl && !imageError;

  return (
    <div className="card overflow-hidden h-full flex flex-col">
      <div className="relative h-64">
        {hasValidImage ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={priority}
          />
        ) : (
          <div className="bg-slate-200 dark:bg-slate-700 w-full h-full flex items-center justify-center">
            <FiHome className="text-slate-400 text-4xl" />
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200 z-10"
          aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart
            className={`w-5 h-5 ${isFavorite(id) ? 'text-red-500 fill-current' : 'text-slate-700 dark:text-slate-300'}`}
          />
        </button>

        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-slate-900 dark:text-white">
          {formatCurrency(property.price)}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-1">
            {property.title}
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full whitespace-nowrap">
            {property.status}
          </span>
        </div>

        <div className="flex items-center text-slate-600 dark:text-slate-400 mb-3">
          <FiMapPin className="mr-2 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-slate-600 dark:text-slate-400">
          <span className="flex items-center">
            <FiMaximize className="mr-1" />
            {property.bedrooms} beds
          </span>
          <span className="flex items-center">
            <FiDroplet className="mr-1" />
            {property.bathrooms} baths
          </span>
          <span className="flex items-center">
            <FiMaximize className="mr-1" />
            {property.area} m²
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          {property.agent ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {property.agent.rating}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {property.agent.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verified Agent
                </p>
              </div>
            </div>
          ) : (
            <div />
          )}
          <Link
            href={`/properties/${id}`}
            className="btn btn-primary text-sm px-4 py-2"
          >
            Inquire
          </Link>
        </div>
      </div>
    </div>
  );
}