import CardProduct from "@/components/CardProduct";
import product from "../../../public/grandairy-pack1.png";

const products = [
  {
    images: product.src,
    discount: 0.4,
    name: "Nutella Hazelnut Chocolate Spread | Jar 400g",
    price: 36000,
    productId: 1,
    id: 1,
  },
  {
    images: product.src,
    discount: null,
    name: "Nutella Hazelnut Chocolate Spread | Jar 400g",
    price: 36000,
    productId: 1,
    id: 1,
  },
  {
    images: product.src,
    discount: 0.4,
    name: "Nutella Hazelnut Chocolate Spread | Jar 400g",
    price: 36000,
    productId: 1,
    id: 1,
  },
  {
    images: product.src,
    discount: 0.4,
    name: "Nutella Hazelnut Chocolate Spread | Jar 400g",
    price: 36000,
    productId: 1,
    id: 1,
  },
  {
    images: product.src,
    discount: 0.4,
    name: "Nutella Hazelnut Chocolate Spread | Jar 400g",
    price: 36000,
    productId: 1,
    id: 1,
  },
];

const TodaysPick = () => {
  return (
    <div className="container flex flex-col gap-4 p-0 px-4">
      <div className="flex items-center gap-2">
        <svg className="h-[24px] w-[12px]">
          <rect className="h-full w-full" fill="#FF6100" />
        </svg>
        <p className="text-base font-medium">Today&apos;s Pick</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {products.map((product, index) => (
          <CardProduct
            key={index}
            images={product.images}
            discount={Number(product.discount)}
            name={product.name}
            price={product.price}
            productId={product.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TodaysPick;
