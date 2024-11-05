import CategoryList from "@/components/Category";
import ProductList from "@/components/ProductList";
import Slider from "@/components/Slider";

const HomePage = () => {
 

  return (
    <div>
      <Slider />
      
      <div className="mt-24">
        <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-12">Category</h1>
        <CategoryList />
      </div>
     
    </div>
  );
};

export default HomePage;
