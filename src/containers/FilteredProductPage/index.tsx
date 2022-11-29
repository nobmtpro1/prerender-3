import {
  find,
  findIndex,
  get,
  isArray,
  isEmpty,
  isNull,
  isUndefined,
  join,
  map,
  reduce,
} from 'lodash';
import React, { lazy, memo, useEffect, useMemo, useRef, useState } from 'react';
import Select from 'react-dropdown-select';
import { Helmet } from 'react-helmet-async';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import SundoraLogo from '../../../src/assets/images/sundora-logo.png';
import { GET_ALL_PRODUCT, GET_FILTER_BOX_PRODUCT, SEO_DESCRIPTION } from '../../config';
import { isMobile } from '../../DetectScreen';
import { fetchClient } from '../../redux/Helpers';
import * as action from '../../redux/product/actions';

import '../../components/BlockBlogs/block-blogs.scss';
import './styles.scss';

import { dataIcon, iconList, sortOptions } from './constants';

import BlockIcon from '../../components/BlockIcon';
import FilterProductBox from '../../components/FilterProductBox';
import useMainColor from '../../utils/customHooks/useMainColor';
const BlockCarousel = lazy(() => import('../../components/BlockCarousel'));
const Footer = lazy(() => import('../../components/Footer'));
const BlockProduct = lazy(() => import('../../components/BlockProduct'));
const BlockSpotlight = lazy(() => import('../../components/BlockSpotlight'));
const BlockVideo = lazy(() => import('../../components/BlockVideo'));
const BlockCountDown = lazy(() => import('../../components/BlockCountDown'));
const BlockBlogs = lazy(() => import('../../components/BlockBlogs'));
const Picture = lazy(() => import('../../components/Picture'));
const BlockInstagram = lazy(() => import('../../components/BlockInstagram'));
const BlockQuestionnaire = lazy(() => import('../../components/BlockQuestionnaire'));
const BlockTitle = lazy(() => import('../../components/BlockTitle'));
const BlockAllBrands = lazy(() => import('../../components/BlockAllBrands'));
const BlockPdf = lazy(() => import('../../components/BlockPdf'));

function FilteredProductPage({ props, dataCMSProps }: any) {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const dispatch = useDispatch();
  const ref = useRef<any>(null);
  const stateProduct = useSelector((state: RootStateOrAny) => state.productReducer);
  const navState = useSelector((state: RootStateOrAny) => state.navReducer);

  const refFooter = useRef<any>(null);
  const [dataNav, setDataNav] = useState<any>([]);
  const [loadingProduct, setLoadingProduct] = useState<any>(true);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [dataCMS, setDataCMS] = useState<any>({});
  const [paging, setPaging] = useState<any>({ next: '', loading: false });
  const [search, setSearch] = useState<any>([]);
  const [timeStamp, setTimeStamp] = useState<any>('');
  const [filterData, setFilterData] = useState<any>(null);
  const [searchReady, setSearchReady] = useState<any>(false);
  const [isPerfume, setIsPerfume] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<any>({});

  const handleScroll = () => {
    if (ref && ref.current) {
      const offset = !isMobile
        ? window.pageYOffset + ref.current.clientHeight + 194
        : window.pageYOffset + ref.current.clientHeight + 194 + 186;
      const height = ref.current.getBoundingClientRect().top + ref.current.clientHeight;
      if (offset >= height) {
        ref.current.classList.add('stick-icon');
      } else {
        ref.current.classList.remove('stick-icon');
      }

      const scroller = ref;
      const footer = refFooter;
      const scroll_bot =
        scroller.current.getBoundingClientRect().top + scroller.current.clientHeight;
      const footer_top = footer.current.getBoundingClientRect().top;
      if (scroll_bot > footer_top) {
        ref.current.classList.remove('stick-icon');
        scroller.current.classList.add('on-footer');
      } else {
        scroller.current.classList.remove('on-footer');
        scroller.current.style.top = 'unset';
      }
    }
  };

  const fetchDataProduct = async (isFetch: boolean) => {
    const searchValue = params.get('search');
    const sortQuery = params.get('ordering');
    const minQuery = params.get('min_price');
    const maxQuery = params.get('max_price');
    const collectionsQuery = params.get('collections');
    const scentQuery = params.get('scents');
    const tagsQuery = params.get('tags_and');
    const brandsQuery = params.get('brands');

    const sortQueryString = sortQuery ? '&ordering=' + sortQuery : '';
    const minQueryString = minQuery ? '&min_price=' + minQuery : '';
    const maxQueryString = maxQuery ? '&max_price=' + maxQuery : '';
    const collectionsQueryString = collectionsQuery ? '&collections=' + collectionsQuery : '';
    const brandsQueryString = brandsQuery ? '&brands=' + brandsQuery : '';
    const scentQueryString = scentQuery ? '&scents=' + scentQuery : '';
    const tagsQueryString = tagsQuery ? '&tags_and=' + tagsQuery : '';

    if (isFetch) {
      const cloneSearch = [];
      if (sortQuery) {
        const sortData = find(sortOptions, (i) => i.value == sortQuery);
        cloneSearch.push(sortData);
      }
      if (minQuery || maxQuery) {
        const minMax = {
          type: 'minMax',
          value: `${minQuery ? minQuery : ''} - ${maxQuery ? maxQuery : ''}`,
          filterData: {
            minPrice: minQuery ? minQuery : '',
            maxPrice: maxQuery ? maxQuery : '',
          },
        };
        setPriceRange({
          minPrice: minQuery ? parseInt(minQuery) : '',
          maxPrice: maxQuery ? parseInt(maxQuery) : '',
        });
        cloneSearch.push(minMax);
      }
      if (scentQuery) {
        scentQuery.split(',').map((i) => {
          const result = {
            type: 'scent',
            value: i,
          };
          cloneSearch.push(result);
          // return result;
        });
      }

      if (tagsQuery) {
        tagsQuery.split(',').map((i) => {
          const result = {
            type: 'tags_and',
            value: i,
          };
          cloneSearch.push(result);
          // return result;
        });
      }

      if (collectionsQuery) {
        collectionsQuery.split(',').map((item) => {
          const res = {
            type: 'other',
            value: item,
          };
          cloneSearch.push(res);
          // return res;
        });
      }

      if (brandsQuery) {
        brandsQuery.split(',').map((item) => {
          const res = {
            type: 'brands',
            value: item,
          };
          cloneSearch.push(res);
          // return res;
        });
      }

      setSearch(cloneSearch);
      setFilterSelection(cloneSearch);
    }

    let queryString = `${searchValue ? searchValue.trim() : ''}${
      scentQueryString ? scentQueryString : ''
    }${sortQueryString ? sortQueryString.trim() : ''}${minQueryString ? minQueryString : ''}${
      maxQueryString ? maxQueryString : ''
    }
      ${collectionsQueryString ? collectionsQueryString : ''}${
      brandsQueryString ? brandsQueryString : ''
    }${tagsQueryString ? tagsQueryString : ''}`;

    queryString = queryString.trim();

    const options = {
      url: `${GET_ALL_PRODUCT}?search=${queryString}`,
      method: 'GET',
      body: null,
    };

    let pending: Array<any> = [];

    if (queryString?.length) pending = [fetchClient(options)];

    try {
      const results = await Promise.all(pending);

      const dataSearchResult = results[0];

      dataSearchResult?.results
        ? dispatch(action.getAllProduct(dataSearchResult.results))
        : '';

      setPaging({ next: dataSearchResult?.next, loading: false });
      setLoadingProduct(false);
      if (isFetch) {
        setSearchReady(true);
      }
    } catch (error) {}
  };

  const fetchDataInit = async () => {
    const slug = props.location.pathname ? props.location.pathname.substring(1) : undefined;
    if (isEmpty(dataNav) || slug || isEmpty(dataCMS) || isEmpty(filterData)) {
      setLoadingProduct(true);
      const queryStringFilterBox = `${
        dataCMSProps?.filters?.collection
          ? `&collections=${dataCMSProps?.filters?.collection}`
          : ''
      }${dataCMSProps?.filters?.scent ? `&scents=${dataCMSProps?.filters?.scent}` : ''}${
        dataCMSProps?.filters?.tags && dataCMSProps?.filters?.tags.length > 0
          ? `&tags_and=${join(dataCMSProps?.filters?.tags)}`
          : ''
      }`;
      const optionsFilterBox = {
        url: `${GET_FILTER_BOX_PRODUCT}?fields=collections,scents,max_price${queryStringFilterBox}`,
        method: 'GET',
        body: null,
      };
      const pending = [fetchClient(optionsFilterBox), fetchDataProduct(true)];
      try {
        const results = await Promise.all(pending);
        const cmsData = dataCMSProps;

        const cloneSearchFetch = [...search];

        if (cmsData?.filters?.scent) {
          const res = {
            type: 'scent',
            value: cmsData?.filters?.scent,
          };
          cloneSearchFetch.push(res);
        }
        if (cmsData?.filters?.collection) {
          const res = {
            type: 'other',
            value: cmsData?.filters?.collection.toLowerCase(),
          };
          cloneSearchFetch.push(res);
        }
        if (cmsData?.filters?.tags && cmsData?.filters?.tags.length > 0) {
          cmsData?.filters?.tags.map((i: any) => {
            cloneSearchFetch.push({ type: 'tags_and', value: i });
          });
        }

        const dataOptionFilter = results[0];
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        setTimeStamp(cmsData.timestamp);
        setFilterData(dataOptionFilter ? dataOptionFilter : {});
        setDataFooter(dataDynamicLinks?.footer);
        setDataNav(dataDynamicLinks?.navigation);
        setDataCMS(cmsData);
        setSearch(cloneSearchFetch);
        setFilterSelection(cloneSearchFetch);
      } catch (error) {}
    }
  };

  const handleSortProduct = (value: any) => {
    // const sortQuerya = filter(sortOptions, (d) => d.value == value[0].value);

    const cloneSearch = [...search];
    const index = findIndex(search, (i: any) => i.type == 'sort');

    index == -1 ? cloneSearch.push(value[0]) : (cloneSearch[index] = value[0]);

    setSearch(cloneSearch);
  };

  // FILTER FEATURE
  const [priceRange, setPriceRange] = useState<any>({
    minPrice: '',
    maxPrice: '',
  });

  const [validateFilter, setValidateFilter] = useState<any>({
    minMax: '',
  });

  const [filterSelection, setFilterSelection] = useState<any>([]);

  const handleChange = (event: any) => {
    const inputValue = event.target.value.replace(/[^0-9.-]+/g, '');
    setPriceRange({ ...priceRange, [event.currentTarget.name]: parseInt(inputValue) });
  };
  const handleRemovePriceFilter = () => {
    setPriceRange({
      minPrice: '',
      maxPrice: '',
    });
    // removeQuery('filterMinPrice');
    // removeQuery('filterMaxPrice');

    const cloneArr = [...filterSelection];
    const index = cloneArr.findIndex(function (e: any) {
      return e.type == 'minMax';
    });
    const cloneArrSearch = [...search];
    const indexSearch = cloneArr.findIndex(function (e: any) {
      return e.type == 'minMax';
    });

    cloneArrSearch.splice(indexSearch, 1);
    cloneArr.splice(index, 1);
    setSearch(cloneArrSearch);
    setFilterSelection(cloneArr);
    setValidateFilter({
      ...validateFilter,
      minMax: '',
    });
  };

  const handleBlurPrice = () => {
    if (
      priceRange.minPrice &&
      priceRange.maxPrice &&
      priceRange.minPrice > priceRange.maxPrice
    ) {
      setValidateFilter({
        ...validateFilter,
        minMax: 'Please enter an appropriate price range',
      });
    } else {
      const cloneArr = [...filterSelection];
      const cloneArrSearch = [...search];
      const minMax = {
        type: 'minMax',
        value: `${priceRange.minPrice} - ${priceRange.maxPrice}`,
        filterData: {
          minPrice: priceRange.minPrice,
          maxPrice: priceRange.maxPrice,
        },
      };
      const index = cloneArr.findIndex(function (e: any) {
        return e.type == minMax.type;
      });

      const indexSearch = cloneArrSearch.findIndex(function (e: any) {
        return e.type == minMax.type;
      });

      indexSearch != -1 ? (cloneArrSearch[indexSearch] = minMax) : cloneArrSearch.push(minMax);
      index != -1 ? (cloneArr[index] = minMax) : cloneArr.push(minMax);

      setFilterSelection(cloneArr);
      setSearch(cloneArrSearch);
      setValidateFilter({
        ...validateFilter,
        minMax: '',
      });
    }
  };

  useEffect(() => {
    if (!priceRange.minPrice && !priceRange.maxPrice) {
      const cloneArr = [...filterSelection];
      const index = cloneArr.findIndex(function (e: any) {
        return e.type == 'minMax';
      });

      cloneArr.splice(index, 1);
      setFilterSelection(cloneArr);
      setValidateFilter({
        ...validateFilter,
        minMax: '',
      });

      const cloneArrSearch = [...search];

      const indexSearch = cloneArrSearch.findIndex(function (e: any) {
        return e.type == 'minMax';
      });

      indexSearch != -1 ? cloneArrSearch.splice(index, 1) : '';
      setSearch(cloneArrSearch);
      return;
    }

    if (!priceRange.minPrice) {
      // removeQuery('filterMinPrice');
      setValidateFilter({
        ...validateFilter,
        minMax: '',
      });
    } else if (!priceRange.maxPrice) {
      // removeQuery('filterMaxPrice');
      setValidateFilter({
        ...validateFilter,
        minMax: '',
      });
    }
    if (priceRange.minPrice && priceRange.maxPrice) {
      handleBlurPrice();
    }
  }, [priceRange]);

  const objectToQueryString = (obj: any) => {
    const qs = reduce(
      obj,
      function (result, value, key) {
        if (!isNull(value) && !isUndefined(value)) {
          if (isArray(value)) {
            result += reduce(
              value,
              function (result1, value1) {
                if (!isNull(value1) && !isUndefined(value1)) {
                  result1 += key + '=' + value1 + '&';
                  return result1;
                } else {
                  return result1;
                }
              },
              '',
            );
          } else {
            result += key + '=' + value + '&';
          }
          return result;
        } else {
          return result;
        }
      },
      '',
    ).slice(0, -1);
    return qs;
  };

  const handleFilterProduct = async () => {
    let seachFilterValue = {};
    map(filterSelection, (item: any) => {
      if (item.type == 'minMax') {
        if (item.filterData.minPrice) {
          seachFilterValue = Object.assign({
            ...seachFilterValue,
            filterMinPrice: item.filterData.minPrice,
          });
        }
        if (item.filterData.maxPrice) {
          seachFilterValue = Object.assign({
            ...seachFilterValue,
            filterMaxPrice: item.filterData.maxPrice,
          });
        }
      }
    });
  };

  const handleCheckOther = (event: any) => {
    const copyArr = [...filterSelection];
    const data = {
      type: 'other',
      value: event?.target?.value,
      name: event?.target?.name,
    };

    const index = copyArr.findIndex(function (e: any) {
      return e.type == 'other';
    });

    if (index != -1) {
      if (copyArr[index].value == data.value) {
        copyArr.splice(index, 1);
      } else {
        copyArr.splice(index, 1);
        copyArr.push(data);
      }
    } else {
      copyArr.push(data);
    }

    const cloneArrSearch = [...search];

    const indexSearch = cloneArrSearch.findIndex(function (e: any) {
      return e.type == 'other';
    });

    if (indexSearch != -1) {
      if (cloneArrSearch[indexSearch].value == data.value) {
        cloneArrSearch.splice(indexSearch, 1);
      } else {
        cloneArrSearch.splice(indexSearch, 1);
        cloneArrSearch.push(data);
      }
    } else {
      cloneArrSearch.push(data);
    }

    setSearch(cloneArrSearch);

    setFilterSelection(copyArr);
  };

  const handleCheckBrand = (event: any) => {
    const copyArr = [...filterSelection];
    const data = {
      type: 'brands',
      value: event?.target?.value,
      name: event?.target?.name,
    };
    const index = copyArr.findIndex(function (e: any) {
      return e.value == data.value;
    });
    index != -1 ? copyArr.splice(index, 1) : copyArr.push(data);

    const cloneArrSearch = [...search];

    const indexSearch = cloneArrSearch.findIndex(function (e: any) {
      return e.value == event?.target?.value;
    });

    indexSearch != -1 ? cloneArrSearch.splice(index, 1) : cloneArrSearch.push(data);
    setSearch(cloneArrSearch);

    setFilterSelection(copyArr);
  };

  const handleCheckScent = (event: any) => {
    const copyArr = [...filterSelection];
    const data = {
      type: 'scent',
      value: event?.target?.value,
      name: event?.target?.name,
    };
    const index = copyArr.findIndex(function (e: any) {
      return e.value == data.value;
    });
    index != -1 ? copyArr.splice(index, 1) : copyArr.push(data);

    const cloneArrSearch = [...search];

    const indexSearch = cloneArrSearch.findIndex(function (e: any) {
      return e.value == event?.target?.value;
    });

    indexSearch != -1 ? cloneArrSearch.splice(index, 1) : cloneArrSearch.push(data);
    setSearch(cloneArrSearch);

    setFilterSelection(copyArr);
  };

  const handleCheckTags = (event: any) => {
    const copyArr = [...filterSelection];
    const data = {
      type: 'tags_and',
      value: event?.target?.value,
      name: event?.target?.name,
    };
    const index = copyArr.findIndex(function (e: any) {
      return e.value == data.value;
    });
    index != -1 ? copyArr.splice(index, 1) : copyArr.push(data);

    const cloneArrSearch = [...search];

    const indexSearch = cloneArrSearch.findIndex(function (e: any) {
      return e.value == event?.target?.value;
    });

    indexSearch != -1 ? cloneArrSearch.splice(index, 1) : cloneArrSearch.push(data);
    setSearch(cloneArrSearch);

    setFilterSelection(copyArr);
  };

  const handleRemoveOtherFilter = (value: any) => {
    const copyArr = [...filterSelection];
    const index = copyArr.findIndex(function (e: any) {
      return e.type == 'other' && e.value == value;
    });
    index != -1 ? copyArr.splice(index, 1) : '';
    const coppyArrSearch = [...search];
    const indexSearch = coppyArrSearch.findIndex(function (e: any) {
      return e.type == 'other' && e.value == value;
    });
    index != -1 ? coppyArrSearch.splice(indexSearch, 1) : '';
    setSearch(coppyArrSearch);
    setFilterSelection(copyArr);
  };

  const handleRemoveScentFilter = (value: any) => {
    const copyArr = [...filterSelection];
    const index = copyArr.findIndex(function (e: any) {
      return e.type == 'scent' && e.value == value;
    });
    index != -1 ? copyArr.splice(index, 1) : '';
    const coppyArrSearch = [...search];
    const indexSearch = coppyArrSearch.findIndex(function (e: any) {
      return e.type == 'scent' && e.value == value;
    });
    index != -1 ? coppyArrSearch.splice(indexSearch, 1) : '';
    setSearch(coppyArrSearch);
    setFilterSelection(copyArr);
  };

  const handleRemoveTagsFilter = (value: any) => {
    const copyArr = [...filterSelection];
    const index = copyArr.findIndex(function (e: any) {
      return e.type == 'tags_and' && e.value == value;
    });
    index != -1 ? copyArr.splice(index, 1) : '';
    const coppyArrSearch = [...search];
    const indexSearch = coppyArrSearch.findIndex(function (e: any) {
      return e.type == 'tags_and' && e.value == value;
    });
    index != -1 ? coppyArrSearch.splice(indexSearch, 1) : '';
    setSearch(coppyArrSearch);
    setFilterSelection(copyArr);
  };

  const handleRemoveBrandsFilter = (value: any) => {
    const copyArr = [...filterSelection];
    const index = copyArr.findIndex(function (e: any) {
      return e.type == 'brands' && e.value == value;
    });
    index != -1 ? copyArr.splice(index, 1) : '';
    const coppyArrSearch = [...search];
    const indexSearch = coppyArrSearch.findIndex(function (e: any) {
      return e.type == 'brands' && e.value == value;
    });
    index != -1 ? coppyArrSearch.splice(indexSearch, 1) : '';
    setSearch(coppyArrSearch);

    setFilterSelection(copyArr);
  };

  const handleClearFilter = () => {
    const copyArr = [...stateProduct.productStore];
    setPriceRange({
      minPrice: '',
      maxPrice: '',
    });
    setValidateFilter({ minMax: '' });
    setFilterSelection([]);
    setSearch([]);
    // removeQuery('filterMinPrice');
    // removeQuery('filterMaxPrice');
    dispatch(action.filterProductSuccess(copyArr));
  };

  const handleLoadmore = () => {
    const options = {
      url: paging.next,
      method: 'GET',
      body: null,
    };
    setPaging({ ...paging, loading: true });
    fetchClient(options).then((res) => {
      res?.results ? dispatch(action.loadMoreProduct(res.results)) : '';
      setPaging({ next: res.next, loading: false });
    });
  };
  useEffect(() => {
    fetchDataInit();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', () => handleScroll);
    };
  }, []);

  useEffect(() => {
    const searchValue = params.get('search');
    let obj = {};
    if (find(search, (i: any) => i?.type == 'search') || searchValue) {
      obj = Object.assign({
        ...obj,
        search:
          search.find((i: any) => i?.type == 'search')?.value?.trim() || searchValue?.trim(),
      });
    }

    if (search.find((i: any) => i?.type == 'sort')) {
      obj = Object.assign({
        ...obj,
        ordering: search.find((i: any) => i?.type == 'sort').value,
      });
    }
    if (search.find((i: any) => i?.type == 'minMax')) {
      const minPrice = search.find((i: any) => i?.type == 'minMax')?.filterData?.minPrice;
      const maxPrice = search.find((i: any) => i?.type == 'minMax')?.filterData?.maxPrice;
      if (minPrice) {
        obj = Object.assign({
          ...obj,
          min_price: search.find((i: any) => i?.type == 'minMax')?.filterData?.minPrice,
        });
      }

      if (maxPrice) {
        obj = Object.assign({
          ...obj,
          max_price: search.find((i: any) => i?.type == 'minMax')?.filterData?.maxPrice,
        });
      }
    }

    if (find(search, (i: any) => i?.type == 'other')) {
      let otherQuery = [];
      otherQuery = [
        ...search
          .filter((item: any) => item?.type == 'other')
          .map((i: any) => {
            if (i.type == 'other') {
              return i.value;
            }
          }),
      ];

      obj = Object.assign({
        ...obj,
        collections: otherQuery.toString().replace(/,$/, ''),
      });
    }

    if (find(search, (i: any) => i?.type == 'scent')) {
      let scentQuery = [];
      scentQuery = [
        ...search
          .filter((item: any) => item?.type == 'scent')
          .map((i: any) => {
            if (i.type == 'scent') {
              return i.value;
            }
          }),
      ];

      obj = Object.assign({
        ...obj,
        scents: scentQuery.toString().replace(/,$/, ''),
      });
    }

    if (find(search, (i: any) => i?.type == 'tags_and')) {
      let tagsQuery = [];
      tagsQuery = [
        ...search
          .filter((item: any) => item?.type == 'tags_and')
          .map((i: any) => {
            if (i.type == 'tags_and') {
              return i.value;
            }
          }),
      ];

      if (tagsQuery.includes('Perfume') || tagsQuery.includes('perfume')) setIsPerfume(true);

      obj = Object.assign({
        ...obj,
        tags_and: tagsQuery.toString().replace(/,$/, ''),
      });
    }

    if (find(search, (i: any) => i?.type == 'brands')) {
      let brandsQuery = [];
      brandsQuery = [
        ...search
          .filter((item: any) => item.type == 'brands')
          .map((i: any) => {
            if (i.type == 'brands') {
              return parseInt(i.value);
            }
          }),
      ];

      obj = Object.assign({
        ...obj,
        brands: brandsQuery.toString().replace(/,$/, ''),
      });
    }

    const seachValueQueryString = objectToQueryString(obj);
    props.history.push({
      search: seachValueQueryString,
    });
  }, [search]);

  useEffect(() => {
    if (searchReady) {
      setLoadingProduct(true);
      fetchDataProduct(false);
    }
  }, [props.location.search]);

  useEffect(() => {
    if (!isEmpty(navState?.basic_settings)) {
      const data = { ...metaData };
      setMetaData({ ...data, ...navState.basic_settings });
    }
  }, [navState]);

  useEffect(() => {
    handleFilterProduct();
  }, [filterSelection]);

  let filteredboxQuantity = 0;
  const openFilterBox = () => {
    dispatch(action.toogleFilterBox(true));
  };

  const seoTitle = dataCMS?.meta?.seo_title ? dataCMS.meta.seo_title : dataCMS?.title;
  const seoDes = dataCMS?.meta?.search_description
    ? dataCMS.meta.search_description
    : SEO_DESCRIPTION;

  const locationState: any = useLocation();
  useMainColor(dataCMS, locationState.search);

  return (
    <div className="site-FilteredProductPage">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDes} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDes} />
        <meta property="og:image" content={metaData?.og_image?.original || SundoraLogo} />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <meta name="revisit-after" content="3 month" />
      </Helmet>
      {dataCMS?.featured_image ? (
        <div
          className={`banner-all-product mb-5 ${
            dataCMS?.fullwidth ? '' : 'container m-0-auto'
          }`}
        >
          <Picture data={dataCMS?.featured_image} />
        </div>
      ) : (
        ''
      )}
      <div style={{ minHeight: '80vh' }}>
        <div className="container">
          {isMobile ? (
            <>
              <div className="block-icon-1">
                <BlockIcon iconList={dataIcon.value.icons} />
              </div>
              {dataCMS?.meta ? (
                <div className="breadcrumb">
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Search result</li>
                  </ul>
                </div>
              ) : (
                ''
              )}
            </>
          ) : (
            <div className="wrapper-breadcrumb">
              <div className="block-icon-1">
                <BlockIcon iconList={dataIcon.value.icons} />
              </div>
              {dataCMS?.meta ? (
                <div className="breadcrumb">
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>Filtered result</li>
                  </ul>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </div>
        <div style={{ paddingBottom: '0' }}>
          {map(dataCMS?.body, (item: any, index: any) => {
            switch (item.type) {
              case 'filtered_products':
                filteredboxQuantity++;
                return filteredboxQuantity <= 1 ? (
                  <div
                    className="container"
                    key={index}
                    style={{ margin: `${isMobile ? '1em auto 0' : '2em auto 0'}` }}
                  >
                    <main className="blk-filter-results">
                      <div className="row">
                        <div className="col-lg-3 col-md-12 col-12">
                          <section className="sidebar-left">
                            <FilterProductBox
                              isPerfume={isPerfume}
                              brandID={dataCMS?.brand?.id}
                              dataOther={filterData?.collections}
                              dataTags={filterData?.tags}
                              maxPrice={filterData?.max_price}
                              handleSortProduct={handleSortProduct}
                              filterSelection={filterSelection}
                              handleRemovePriceFilter={handleRemovePriceFilter}
                              handleRemoveOtherFilter={handleRemoveOtherFilter}
                              handleRemoveScentFilter={handleRemoveScentFilter}
                              handleRemoveTagsFilter={handleRemoveTagsFilter}
                              handleRemoveBrandsFilter={handleRemoveBrandsFilter}
                              handleClearFilter={handleClearFilter}
                              handleFilterProduct={handleFilterProduct}
                              priceRange={priceRange}
                              handleChange={handleChange}
                              handleBlurPrice={handleBlurPrice}
                              validateFilter={validateFilter}
                              handleCheckOther={handleCheckOther}
                              handleCheckBrand={handleCheckBrand}
                              dataScents={filterData?.scents}
                              dataBrands={dataCMS?.brands}
                              handleCheckScent={handleCheckScent}
                              handleCheckTags={handleCheckTags}
                              setPriceRange={setPriceRange}
                              customFilter={dataCMS?.custom_filter_data}
                            />
                          </section>
                        </div>
                        <div className="col-lg-9 col-md-12 col-12">
                          <section className="sort-box">
                            {isMobile ? (
                              <button className="btn-filter-mobile" onClick={openFilterBox}>
                                FILTERS
                              </button>
                            ) : (
                              ''
                            )}
                            <Select
                              placeholder="Sort by"
                              className="primary-select"
                              searchable={false}
                              labelField="title"
                              onChange={(value) => handleSortProduct(value)}
                              valueField="value"
                              options={sortOptions}
                              values={stateProduct.sortValue}
                            />
                          </section>
                          {!loadingProduct &&
                          stateProduct.allProduct &&
                          stateProduct.allProduct.length > 0 ? (
                            <div
                              style={{ marginBottom: '3em' }}
                              className="animated faster fade-in"
                            >
                              <BlockProduct productList={stateProduct.allProduct} title="" />
                              {paging.next ? (
                                <button
                                  className={`btn-loadmore ${paging.loading ? 'loading' : ''}`}
                                  onClick={handleLoadmore}
                                >
                                  {paging.loading ? (
                                    <div className="lds-roller">
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                      <div></div>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                  Load more
                                </button>
                              ) : (
                                ''
                              )}
                            </div>
                          ) : loadingProduct == true ? (
                            <div className="lds-roller product-loading">
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                              <div></div>
                            </div>
                          ) : (
                            <div>
                              <p className="loading-product not-found">
                                No products are matching your filters
                              </p>
                            </div>
                          )}
                          {/* {stateProduct.allProduct && stateProduct.allProduct.length > 0 ? (
                          <BlockProduct productList={stateProduct.allProduct} title="" />
                        ) : (
                          ''
                        )} */}
                        </div>
                      </div>
                    </main>
                  </div>
                ) : (
                  <></>
                );
              case 'carousel':
                return (
                  <BlockCarousel
                    slides={item && item.value ? item?.value.slides : []}
                    key={index}
                    dragOrAuto={false}
                    maxWidth={item && item.value ? item?.value.max_width : ''}
                  />
                );
              case 'spotlight':
                return (
                  <BlockSpotlight
                    headline={item?.value.headline}
                    items={item?.value.rows}
                    key={index}
                  />
                );
              case 'countdown':
                return <BlockCountDown data={item?.value} key={index} timestamp={timeStamp} />;
              case 'video':
                return (
                  <BlockVideo
                    data={item?.value}
                    title={item?.value?.title || ''}
                    showReadmore={true}
                    key={index}
                  />
                );
              case 'paragraph':
                return (
                  <div className="container" key={index}>
                    <div
                      className="content-block"
                      dangerouslySetInnerHTML={{ __html: item?.value?.text }}
                    ></div>
                  </div>
                );
              case 'title':
                return <BlockTitle key={index} title={item?.value?.title} />;
              case 'images':
                return (
                  <div className="container" key={index}>
                    <div className="images-box-default">
                      <div className="wrapper-img row-span">
                        <Picture data={item?.value?.images?.big} />
                      </div>
                      <div className="wrapper-img">
                        <Picture data={item?.value?.images?.top_left} />
                      </div>
                      <div className="wrapper-img">
                        <Picture data={item?.value?.images?.bottom_left} />
                      </div>
                    </div>
                  </div>
                );
              case 'icons':
                return <BlockIcon iconList={item.value?.icons || []} />;
              case 'product':
                return (
                  <BlockProduct
                    productList={item?.value.products}
                    title={item?.value?.headline}
                    key={index}
                  />
                );
              case 'bloglist':
                return <BlockBlogs blogList={item?.value} title="Sundora Blogs" key={index} />;
              case 'instagram':
                return <BlockInstagram widgetId={item?.value?.widget} key={index} />;
              case 'questionnaire':
                return <BlockQuestionnaire data={item?.value} key={index} />;
              case 'allbrands':
                return <BlockAllBrands data={item?.value} key={index} />;
              case 'pdf':
                return <BlockPdf data={item?.value} key={index} />;
              default:
                break;
            }
          })}
        </div>
      </div>
      <div
        // className={`main-content ${isSticky ? 'stick-icon' : ''}`}
        className="main-content"
        // ref={ref ? ref : ''}
      >
        <BlockIcon iconList={iconList} />
      </div>
      <div ref={refFooter}>
        <Footer data={dataFooter} />
      </div>
    </div>
  );
}

export default memo(FilteredProductPage);
