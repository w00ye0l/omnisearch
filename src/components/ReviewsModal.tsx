"use client";

import { Review } from "@/lib/types/app.types";
import { useTranslation } from "@/lib/i18n/context";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReviewsModalProps {
  reviews: Review[];
  isOpen: boolean;
  onClose: () => void;
  appTitle: string;
}

export default function ReviewsModal({
  reviews,
  isOpen,
  onClose,
  appTitle,
}: ReviewsModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col p-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-white z-10 px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4 border-b flex-row items-start justify-between gap-4 space-y-0">
          <DialogTitle className="text-base md:text-xl font-bold text-gray-900 flex-1 min-w-0">
            {appTitle} - {t.detail.reviews} ({reviews.length})
          </DialogTitle>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 md:px-6 py-3 md:py-4 space-y-3 md:space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-2xl p-4 md:p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {review.userImage ? (
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-sm">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                      {review.userName}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs md:text-sm ${
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs md:text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {review.version && (
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {t.detail.version} {review.version}
                  </span>
                )}
              </div>

              {/* Review Title */}
              {review.title && (
                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 break-words">
                  {review.title}
                </h4>
              )}

              {/* Review Text */}
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-3 break-words whitespace-pre-wrap">
                {review.text}
              </p>

              {/* Thumbs Up (Play Store only) */}
              {review.thumbsUp !== undefined && review.thumbsUp > 0 && (
                <div className="flex items-center gap-1 text-xs md:text-sm text-gray-600">
                  <span>👍</span>
                  <span>
                    {review.thumbsUp} {t.detail.helpful}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
