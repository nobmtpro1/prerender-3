import axios from 'axios';
import { GET_PAGE_ALL_BLOG_LIST, GET_PAGE_ALL_BLOG_LIST_FILTER_TAG } from '../../config';

interface dataResponse {
  data: any;
}

export async function fetchBlogList(): Promise<dataResponse> {
  return await axios.get(GET_PAGE_ALL_BLOG_LIST);
}

export async function fetchBlogListFilterTag(tagName: any): Promise<dataResponse> {
  return await axios.get(GET_PAGE_ALL_BLOG_LIST_FILTER_TAG, {
    params: {
      tag: tagName,
    },
  });
}
