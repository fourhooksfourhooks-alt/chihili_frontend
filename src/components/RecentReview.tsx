import { Star } from "lucide-react";

export default function RecentReviews() {
  const reviews = [
    {
      id: 1,
      author: "Risako M",
      date: "May 16, 2021",
      rating: 4,
      maxRating: 5,
      title: "Can't say enough good things",
      content: "I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me! The product quality is amazing, it looks and feel even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!"
    },
    {
      id: 2,
      author: "Risako M",
      date: "May 16, 2021",
      rating: 4,
      maxRating: 5,
      title: "Can't say enough good things",
      content: "I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me! The product quality is amazing, it looks and feel even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!"
    },
    {
      id: 3,
      author: "Risako M",
      date: "May 16, 2021",
      rating: 4,
      maxRating: 5,
      title: "Can't say enough good things",
      content: "I was really pleased with the overall shopping experience. My order even included a little personal, handwritten note, which delighted me! The product quality is amazing, it looks and feel even better than I had anticipated. Brilliant stuff! I would gladly recommend this store to my friends. And, now that I think of it... I actually have, many times!"
    }
  ];

  const StarRating = ({ rating, maxRating }: { rating: number; maxRating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-secondary min-h-screen">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Reviews</h2>
      
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-primary1">{review.author}</h3>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            
            {/* Rating */}
            <div className="mb-3">
              <StarRating rating={review.rating} maxRating={review.maxRating} />
            </div>
            
            {/* Review Title */}
            <h4 className="text-base font-semibold text-gray-900 mb-3">{review.title}</h4>
            
            {/* Review Content */}
            <p className="text-gray-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}