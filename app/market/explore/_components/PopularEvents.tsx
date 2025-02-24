import ProductCard from "./ProductCard";

interface PopularEventsProps {
  events: any;
  item: any;
  handleToggleSave: (id: any) => void;
  isSaved: boolean;
}

const PopularEvents: React.FC<PopularEventsProps> = ({
  events,
  item,
  handleToggleSave,
  isSaved,
}) => {
  return (
    <div className="flex flex-col flex-wrap gap-4 justify-start">
      <h1>Popular Events</h1>
      <div className="flex flex-wrap gap-4">
        {events?.map((item: any) => (
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

export default PopularEvents;
