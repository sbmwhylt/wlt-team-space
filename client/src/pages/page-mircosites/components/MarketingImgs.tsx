import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Trash2, ZoomIn, Images, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageData {
  url: string;
  alt: string;
}

interface MarketingImgs {
  brandAssets?: string[] | null;
  campaignsAndPromos?: string[] | null;
  socialContent?: string[] | null;
  participationContent?: string[] | null;
}

interface Microsite {
  marketingImgs?: MarketingImgs | null;
}

type SectionKey =
  | "brandAssets"
  | "campaignsAndPromos"
  | "socialContent"
  | "participationContent";

interface TabbedGalleryProps {
  microsite: Microsite;
  onDeleteImage?: (section: SectionKey, index: number) => void;
}

export default function TabbedGallery({ microsite, onDeleteImage }: TabbedGalleryProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const galleryData: Record<SectionKey, ImageData[]> = {
    brandAssets:
      microsite?.marketingImgs?.brandAssets?.map((url, i) => ({
        url,
        alt: `Brand Asset ${i + 1}`,
      })) || [],
    campaignsAndPromos:
      microsite?.marketingImgs?.campaignsAndPromos?.map((url, i) => ({
        url,
        alt: `Campaign ${i + 1}`,
      })) || [],
    socialContent:
      microsite?.marketingImgs?.socialContent?.map((url, i) => ({
        url,
        alt: `Social Content ${i + 1}`,
      })) || [],
    participationContent:
      microsite?.marketingImgs?.participationContent?.map((url, i) => ({
        url,
        alt: `Participation ${i + 1}`,
      })) || [],
  };

  const allTabs: { id: SectionKey; label: string }[] = [
    { id: "brandAssets", label: "Brand Assets" },
    { id: "campaignsAndPromos", label: "Campaigns & Promos" },
    { id: "socialContent", label: "Social Content" },
    { id: "participationContent", label: "Participation Content" },
  ];

  const tabs = allTabs.filter((tab) => galleryData[tab.id]?.length > 0);

  const [activeTab, setActiveTab] = useState<SectionKey | null>(
    tabs.length > 0 ? tabs[0].id : null,
  );

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeTab]);

  if (tabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <ImageOff className="w-10 h-10 opacity-40" />
        <p className="text-sm font-medium">No marketing images available</p>
      </div>
    );
  }

  const currentImages = activeTab ? galleryData[activeTab] : [];
  const currentImage = currentImages[carouselIndex];

  const handleTabChange = (id: SectionKey) => {
    setActiveTab(id);
    setCarouselIndex(0);
  };

  const goNext = () =>
    setCarouselIndex((prev) => (prev + 1) % currentImages.length);
  const goPrev = () =>
    setCarouselIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length,
    );

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const goNextPreview = () =>
    setPreviewIndex((prev) => (prev + 1) % currentImages.length);
  const goPrevPreview = () =>
    setPreviewIndex(
      (prev) => (prev - 1 + currentImages.length) % currentImages.length,
    );

  return (
    <div className="space-y-4">
      {/* Pill Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-semibold",
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500",
              )}
            >
              {galleryData[tab.id].length}
            </span>
          </button>
        ))}
      </div>

      {/* Main Carousel */}
      {currentImage && (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video group cursor-pointer">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-cover transition-all duration-300"
            onClick={() => openPreview(carouselIndex)}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all pointer-events-none" />

          {/* View all button */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
          >
            <Images className="w-3.5 h-3.5" />
            All images ({currentImages.length})
          </button>

          {/* Arrow nav */}
          {currentImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter badge */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/55 text-white text-xs px-3 py-1 rounded-full pointer-events-none">
            {carouselIndex + 1} / {currentImages.length}
          </div>
        </div>
      )}

      {/* Thumbnail Strip */}
      {currentImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {currentImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={cn(
                "flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                i === carouselIndex
                  ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                  : "border-transparent opacity-55 hover:opacity-90 hover:border-gray-300",
              )}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Images className="w-4 h-4 text-gray-500" />
              {tabs.find((t) => t.id === activeTab)?.label}
              <span className="text-sm font-normal text-gray-400">
                — {currentImages.length}{" "}
                {currentImages.length === 1 ? "image" : "images"}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[65vh] overflow-y-auto pr-1">
            {currentImages.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all" />

                {/* Hover action buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => {
                      openPreview(index);
                      setIsGalleryOpen(false);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition"
                    title="Preview"
                  >
                    <ZoomIn className="w-4 h-4 text-gray-700" />
                  </button>
                  {onDeleteImage && activeTab && (
                    <button
                      onClick={() => onDeleteImage(activeTab, index)}
                      className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Index badge */}
                <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-all">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-4 bg-black/95 border-none">
          <div className="relative flex items-center justify-center min-h-[55vh]">
            <img
              src={currentImages[previewIndex]?.url}
              alt={currentImages[previewIndex]?.alt}
              className="max-w-full max-h-[72vh] object-contain rounded-lg"
            />

            {currentImages.length > 1 && (
              <>
                <button
                  onClick={goPrevPreview}
                  className="absolute left-2 p-3 bg-white/15 hover:bg-white/30 text-white rounded-full transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={goNextPreview}
                  className="absolute right-2 p-3 bg-white/15 hover:bg-white/30 text-white rounded-full transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          <p className="text-center text-sm text-white/50 mt-2">
            {previewIndex + 1} of {currentImages.length}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
