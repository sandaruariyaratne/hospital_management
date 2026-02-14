// CategoryCard.jsx - Displays a single category card with icons

import { useNavigate } from 'react-router-dom';
import { Heart, Brain, Bone, Baby, Sparkles } from 'lucide-react';

function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/doctors/${category.category_id}`, {
      state: { categoryName: category.category_name }
    });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-gray-200 hover:border-blue-500 transform hover:-translate-y-1"
    >
      <div className="flex justify-center mb-4">
        <div className="bg-blue-100 rounded-full p-4">
          {getCategoryIcon(category.category_name)}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
        {category.category_name}
      </h3>
      <p className="text-gray-600 text-sm text-center mb-4">
        {category.description}
      </p>
      <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
        View Doctors →
      </button>
    </div>
  );
}

// Helper function to get icon based on category
function getCategoryIcon(categoryName) {
  const iconProps = { size: 40, className: "text-blue-600" };
  
  const icons = {
    'Cardiology': <Heart {...iconProps} />,
    'Neurology': <Brain {...iconProps} />,
    'Orthopedics': <Bone {...iconProps} />,
    'Pediatrics': <Baby {...iconProps} />,
    'Dermatology': <Sparkles {...iconProps} />,
  };
  
  return icons[categoryName] || <Heart {...iconProps} />;
}

export default CategoryCard;