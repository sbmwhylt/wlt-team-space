import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageData {
  url: string;
  alt: string;
}

interface MarketingImgs {
  general?: string[] | null;
  redemption?: string[] | null;
  loadUp?: string[] | null;
  occasions?: string[] | null;
}

interface Microsite {
  marketingImgs?: MarketingImgs | null;
}

interface ImageCarouselProps {
  images: ImageData[];
  onImageClick: (index: number) => void;
}

interface TabbedGalleryProps {
  microsite: Microsite;
}

type SectionKey = "general" | "redemption" | "loadUp" | "occasions";

// Separate Gallery Component
function ImageCarousel({ images, onImageClick }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No images available</div>
    );
  }

  return (
    <div className="w-full mb-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Image Display - Clickable */}
        <div
          onClick={() => onImageClick(currentIndex)}
          className="relative w-full h-96 bg-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <ChevronLeft size={24} />
          </button>

          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {images.length}
          </span>

          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component with Tabs
export default function TabbedGallery({ microsite }: TabbedGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Process microsite data into gallery format
  const galleryData: Record<SectionKey, ImageData[]> = {
    general:
      microsite?.marketingImgs?.general?.map((url: string, index: number) => ({
        url,
        alt: `General ${index + 1}`,
      })) || [],
    redemption:
      microsite?.marketingImgs?.redemption?.map(
        (url: string, index: number) => ({
          url,
          alt: `Redemption ${index + 1}`,
        }),
      ) || [],
    loadUp:
      microsite?.marketingImgs?.loadUp?.map((url: string, index: number) => ({
        url,
        alt: `Load Up ${index + 1}`,
      })) || [],
    occasions:
      microsite?.marketingImgs?.occasions?.map(
        (url: string, index: number) => ({
          url,
          alt: `Occasions ${index + 1}`,
        }),
      ) || [],
  };

  // Define all possible tabs
  const allTabs: { id: SectionKey; label: string }[] = [
    { id: "general", label: "General" },
    { id: "redemption", label: "Redemption Stores" },
    { id: "loadUp", label: "Load Up Stores" },
    { id: "occasions", label: "Occasions" },
  ];

  // Filter tabs to only show sections with images
  const tabs = allTabs.filter((tab) => galleryData[tab.id]?.length > 0);

  // Set initial active tab to first available tab
  const [activeTab, setActiveTab] = useState<SectionKey | null>(
    tabs.length > 0 ? tabs[0].id : null,
  );

  // If no images at all, show message
  if (tabs.length === 0) {
    return (
      <div className="p-2">
        <div className="text-center text-gray-500 py-8">
          No marketing images available
        </div>
      </div>
    );
  }

  const currentImages = activeTab ? galleryData[activeTab] : [];

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const openPreview = (index: number) => {
    setModalImageIndex(index);
    setIsPreviewOpen(true);
  };

  const goToNextModal = () => {
    setModalImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const goToPrevModal = () => {
    setModalImageIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length,
    );
  };

  return (
    <div>
      {/* Tabs - Only show tabs with images */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-center border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery based on active tab */}
      <ImageCarousel images={currentImages} onImageClick={openModal} />

      {/* Modal Dialog with Grid Gallery */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl h-fit">
          <DialogHeader>
            <DialogTitle>
              {tabs.find((t) => t.id === activeTab)?.label} Gallery
            </DialogTitle>
          </DialogHeader>

          {/* Grid of Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[70vh] overflow-y-auto">
            {currentImages.map((img: ImageData, index: number) => (
              <button
                key={index}
                onClick={() => openPreview(index)}
                className="aspect-square overflow-hidden hover:opacity-80 transition cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl p-2">
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Main Image */}
            <div className="relative w-full flex-1 flex items-center justify-center">
              <img
                src={currentImages[modalImageIndex]?.url}
                alt={currentImages[modalImageIndex]?.alt}
                className="max-w-full max-h-full object-contain rounded"
              />

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevModal}
                className="absolute left-4 p-3 rounded-full bg-white hover:bg-gray-100 transition"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNextModal}
                className="absolute right-4 p-3 rounded-full bg-white hover:bg-gray-100 transition"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Image Counter */}
            <div className="text-sm text-gray-600 mt-2">
              {modalImageIndex + 1} / {currentImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
