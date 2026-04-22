import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Grid layout for 5 images
  const renderGrid = () => {
    if (displayImages.length === 1) {
      return (
        <div className="rounded-xl overflow-hidden h-[400px]">
          <img
            src={displayImages[0]}
            alt={title}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowAllPhotos(true)}
          />
        </div>
      );
    }

    if (displayImages.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden h-[400px]">
          {displayImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} ${i + 1}`}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
              onClick={() => { setCurrentIndex(i); setShowAllPhotos(true); }}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[400px]">
        {/* Main large image */}
        <div className="col-span-2 row-span-2">
          <img
            src={displayImages[0]}
            alt={title}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
            onClick={() => { setCurrentIndex(0); setShowAllPhotos(true); }}
          />
        </div>
        {displayImages.slice(1, 5).map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img}
              alt={`${title} ${i + 2}`}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
              onClick={() => { setCurrentIndex(i + 1); setShowAllPhotos(true); }}
            />
            {i === 3 && displayImages.length > 5 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium hover:bg-black/60 transition-colors"
              >
                <Grid3X3 size={20} className="mr-2" />
                +{displayImages.length - 5} fotos
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderGrid()}

      {/* Full Screen Gallery Modal */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
            <span className="text-white text-sm">
              {currentIndex + 1} / {displayImages.length}
            </span>
            <div className="w-10" />
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center relative">
            <button
              onClick={handlePrev}
              className="absolute left-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <img
              src={displayImages[currentIndex]}
              alt={`${title} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            <button
              onClick={handleNext}
              className="absolute right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="p-4 bg-black/80">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === currentIndex ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
