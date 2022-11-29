import axios from 'axios';
import { GET_PRODUCT_FILTER } from '../../config';
import { updateProductToBag, getProductToBag } from '../Helpers/index';

interface dataResponse {
  data: any;
}

export async function checkoutProductService(data: any): Promise<dataResponse> {
  return await updateProductToBag(data);
}

export async function deleteCheckoutProductService(data: any): Promise<dataResponse> {
  return await updateProductToBag(data);
}

export async function getCheckoutProductService(): Promise<dataResponse> {
  return await getProductToBag();
}

export async function sortAllProductService(data: any): Promise<dataResponse> {
  return await updateProductToBag(data);
}

export async function filterProductService(data: any): Promise<dataResponse> {
  return await axios.get(GET_PRODUCT_FILTER + data.id, {
    params: {
      collections: data?.collections,
      scents: data?.scents,
    },
  });
}
