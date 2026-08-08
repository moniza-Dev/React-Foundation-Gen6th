import { useParams, useSearchParams } from "react-router";
import {
  useAddNewProductMutation,
  useDeleteProductByUUIDMutation,
  useUpdateProductByUUIDMutation,
} from "../../services/productApi";

export default function RTKProductComponent() {
  // create product
  const [createProductRequest, { data }] = useAddNewProductMutation();
  // update product by uuid
  const [updateProductRequest, { data: updateProductResponse }] =
    useUpdateProductByUUIDMutation();
  // delete product by uuid
  const [deleteProductRequest, { data: deleteProductResponse }] =
    useDeleteProductByUUIDMutation();

  // mock create Product
  const newProduct = {
    name: "Sokcheat-Dell XPS 13 Plus 9320",
    description:
      "Ultra-slim premium laptop with a 13.4-inch InfinityEdge OLED display, ideal for professionals and students who need portability without sacrificing performance.",
    computerSpec: {
      processor: "Intel Core i7-1360P (12-core, up to 5.0GHz)",
      ram: "16GB LPDDR5",
      storage: "512GB PCIe NVMe SSD",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Home",
      screenSize: "13.4-inch OLED 3.5K Touch",
      battery: "55Wh, up to 12 hours",
    },
    stockQuantity: 24,
    priceIn: 950,
    priceOut: 1199,
    discount: 5,
    color: [
      {
        color: "Platinum Silver",
        images: [
          "https://cdn.example.com/products/xps13/silver-1.jpg",
          "https://cdn.example.com/products/xps13/silver-2.jpg",
        ],
      },
      {
        color: "Graphite",
        images: ["https://cdn.example.com/products/xps13/graphite-1.jpg"],
      },
    ],
    thumbnail: "https://m.media-amazon.com/images/I/710EGJBdIML.jpg",
    warranty: "1 Year International Warranty",
    availability: true,
    images: [
      "https://cdn.example.com/products/xps13/full-1.jpg",
      "https://cdn.example.com/products/xps13/full-2.jpg",
      "https://cdn.example.com/products/xps13/full-3.jpg",
    ],
    categoryUuid: "6c0444d4-cf54-425b-839f-f17181cf42ed",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
  };

  // mock update Product
  const updateProduct = {
    name: "Sokcheat1001-Dell XPS 13 Plus 9320",
    description:
      "Ultra-slim premium laptop with a 13.4-inch InfinityEdge OLED display, ideal for professionals and students who need portability without sacrificing performance.",
    stockQuantity: 24,
    priceIn: 950,
    priceOut: 1199,
    discount: 5,
    color: [
      {
        color: "Platinum Silver",
        images: [
          "https://cdn.example.com/products/xps13/silver-1.jpg",
          "https://cdn.example.com/products/xps13/silver-2.jpg",
        ],
      },
      {
        color: "Graphite",
        images: ["https://cdn.example.com/products/xps13/graphite-1.jpg"],
      },
    ],
    thumbnail: "https://m.media-amazon.com/images/I/710EGJBdIML.jpg",
    warranty: "1 Year International Warranty",
    availability: true,
    images: [
      "https://cdn.example.com/products/xps13/full-1.jpg",
      "https://cdn.example.com/products/xps13/full-2.jpg",
      "https://cdn.example.com/products/xps13/full-3.jpg",
    ],
    categoryUuid: "6c0444d4-cf54-425b-839f-f17181cf42ed",
    supplierUuid: "a34496d2-370e-4332-8c6d-b4a6bc069bf1",
    brandUuid: "8f2e3bcb-bb0b-45a1-b9bc-1d43f08f0ddb",
  };

  const {uuid} = useParams();
  // create product function
  async function createProductFunc() {
    createProductRequest({
      createProduct: newProduct
    });
  }

  // update product by uuid function
  async function updateProductFunc() {
    updateProductRequest({
      updateProduct: updateProduct,
      uuid: uuid,
    });
  }

  // delete product by uuid function
  async function deleteProductFunc() {
    deleteProductRequest({
      uuid: uuid,
    });
  }

  return (
    <div className="flex gap-4">
      {/* create product */}
      <button
        className="border p-4 rounded bg-green-500 text-white"
        onClick={() => createProductFunc()}
      >
        Create Product
      </button>

      {/* update product by uuid */}
      <button
        className="border p-4 rounded bg-yellow-500 text-white"
        onClick={() => updateProductFunc()}
      >
        Update Product
      </button>

      {/* delete product by uuid */}
      <button
        className="border p-4 rounded bg-red-500 text-white"
        onClick={() => deleteProductFunc()}
      >
        Delete Product
      </button>
    </div>
  );
}
