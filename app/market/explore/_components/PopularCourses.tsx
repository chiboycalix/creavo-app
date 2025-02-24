import OtherCard from "./OtherCard";
import { useMarketContext } from "@/context/MarketContext";
import ProductCard from "./ProductCard";


interface PopularCoursesProps {
    courses: any;
    item: any;
    handleToggleSave: (id: any) => void;
    isSaved: boolean;
}

const PopularCourses: React.FC<PopularCoursesProps> = ({
    courses,
    item,
    handleToggleSave,
    isSaved,
}) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      <h1>Popular Courses</h1>
      <div className="flex flex-wrap gap-4">
        {courses?.map((item: any) => (
          <ProductCard
            key={item.id}
            product={item}
            isSaved={isSaved}
            handleToggleSave={handleToggleSave}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularCourses;
