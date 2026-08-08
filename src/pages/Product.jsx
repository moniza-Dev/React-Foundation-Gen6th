import { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductDetailComponent from "../components/products/ProductDetailComponent";
import RTKProductComponent from "../components/products/RTKProductComponent";
import { useGetProductByUuidQuery } from "../services/productApi";

export default function Product() {
  const { uuid } = useParams();
  console.log(`==> uuid: ${uuid}`);
  const { data } = useGetProductByUuidQuery(uuid);

  // const { name, description, thumbnail, priceOut } = data;
  return (
    <section>
      {/* RTK CRUD */}
      <RTKProductComponent />

      <ProductDetailComponent
        title={data?.name}
        description={data?.description}
        thumbnail={data?.thumbnail}
        price={data?.priceOut}
      />
    </section>
  );
}
