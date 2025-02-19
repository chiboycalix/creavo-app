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
    <div>
      <h1>Popular Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
