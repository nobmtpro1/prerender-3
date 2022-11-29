import {
  map,
  isEmpty,
  get,
  isUndefined,
  find,
  reduce,
  isArray,
  isNull,
  findIndex,
} from 'lodash';
import React, { memo, useEffect, useState, useRef, lazy } from 'react';
import { isMobile } from '../../DetectScreen';
import '../../components/BlockBlogs/block-blogs.scss';
import './styles.scss';
import { Link, useLocation } from 'react-router-dom';
import BlockProduct from '../../components/BlockProduct';
import Select from 'react-dropdown-select';
import * as action from '../../redux/product/actions';
import * as homeAction from '../../redux/home/actions';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import BlockModal from '../../components/BlockModal';
import BlockCollectEmail from '../../components/BlockCollectEmail';
import Picture from '../../components/Picture';
import { fetchClient, fetchDynamicCMSPage } from '../../redux/Helpers';
import BlockQuestionnaire from '../../components/BlockQuestionnaire';
import { GET_ALL_PRODUCT, GET_FILTER_BOX_PRODUCT } from '../../config';
import { Helmet } from 'react-helmet-async';
import BlockTitle from '../../components/BlockTitle';
import BlockAllBrands from '../../components/BlockAllBrands';
import DotLoader from '../../components/DotLoader';
import Footer from '../../components/Footer';
import BlockIcon from '../../components/BlockIcon';
import FilterProductBox from '../../components/FilterProductBox';
import useMainColor from '../../utils/customHooks/useMainColor';

const BlockFormField = lazy(() => import('../../components/BlockFormField'));
const BlockCarousel = lazy(() => import('../../components/BlockCarousel'));
const BlockSpotlight = lazy(() => import('../../components/BlockSpotlight'));
const CountDownBlock = lazy(() => import('../../components/BlockCountDown'));
const BlockBlogs = lazy(() => import('../../components/BlockBlogs'));
const VideoBlock = lazy(() => import('../../components/BlockVideo'));
const BlockPdf = lazy(() => import('../../components/BlockPdf'));

function BrandProductPage({ props }: any) {
  const dispatch = useDispatch();
  const stateProduct = useSelector((state: RootStateOrAny) => state.productReducer);
  const refFooter = useRef<any>(null);
  const [dataNav, setDataNav] = useState<any>([]);
  const [loading, setLoading] = useState<any>([]);
  const [dataFooter, setDataFooter] = useState<any>([]);
  const [dataCMS, setDataCMS] = useState<any>({});
  const [dataBody, setDataBody] = useState<any>([]);
  const [visibleModalEmail, setVisibleModalEmail] = useState<boolean>(false);
  const [dataFormField, setDataFormField] = useState<any>([]);
  const [timeStamp, setTimeStamp] = useState<any>('');
  const [paging, setPaging] = useState<any>({ next: '', loading: false });
  const [search, setSearch] = useState<any>([]);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const [filterData, setFilterData] = useState<any>(null);
  const [searchReady, setSearchReady] = useState<boolean>(false);

  const dataIcon = {
    value: {
      icons: [
        // {
        //   text: '100% AUTHENTIC',
        //   icon_image: {
        //     original: AuthPrimaryIcon,
        //     width: 29,
        //     height: 29,
        //     webp: AuthPrimaryIcon,
        //     mobile: AuthPrimaryIcon,
        //     alt: 'auth_icon.png',
        //   },
        // },
        // {
        //   text: 'FREE SHIPPING',
        //   icon_image: {
        //     original: freeShippingPrimaryIcon,
        //     width: 52,
        //     height: 27,
        //     webp: freeShippingPrimaryIcon,
        //     mobile: freeShippingPrimaryIcon,
        //     alt: 'free_shipping_icon.png',
        //   },
        // },
      ],
    },
  };

  const fetchDataProduct = async (isFetch: boolean, brandID: any = null) => {
    dispatch(action.getAllProduct([]));
    const params = new URLSearchParams(props.location.search);
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
    const brandsQueryString = '&brands=' + (brandID ? brandID : dataCMS?.brand?.id);
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
          return result;
        });
      }
      if (collectionsQuery) {
        collectionsQuery.split(',').map((item) => {
          const res = {
            type: 'other',
            value: item,
          };
          cloneSearch.push(res);
          return res;
        });
      }
      if (brandsQuery) {
        brandsQuery.split(',').map((item) => {
          const res = {
            type: 'brands',
            value: item,
          };
          cloneSearch.push(res);
          return res;
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

      setSearch(cloneSearch);
      setFilterSelection(cloneSearch);
    }

    const queryString = `${searchValue ? searchValue?.trim() : ''}${
      scentQueryString ? scentQueryString : ''
    }${sortQueryString ? sortQueryString.trim() : ''}${minQueryString ? minQueryString : ''}${
      maxQueryString ? maxQueryString : ''
    }${collectionsQueryString ? collectionsQueryString : ''}${
      brandsQueryString ? brandsQueryString : ''
    }${tagsQueryString ? tagsQueryString : ''}`;

    const options = {
      url: `${GET_ALL_PRODUCT}?search=${queryString}`,
      method: 'GET',
      body: null,
    };

    const pending = [fetchClient(options)];
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
    } catch (error) {
      // toastrError(error.message);
      // this.props.loadingPage(false);
      // setLoading(false);
    }
  };

  const fetchDataInit = async () => {
    // console.log(dataCMSProps);
    const slug = props.location.pathname ? props.location.pathname : undefined;
    if (isEmpty(dataNav) || slug || isEmpty(dataCMS) || isEmpty(dataFormField)) {
      const pending = [fetchDynamicCMSPage(`${props.location.pathname.substring(1)}`)];
      try {
        const results = await Promise.all(pending);
        const cmsData = results[0];
        const cmsDataBody = results[0]?.body.filter(
          (item: any) => item?.value?.visible != 'product',
        );
        const dataDynamicLinks = get(cmsData, 'dynamic_links');
        const optionsFilterBox = {
          url: `${GET_FILTER_BOX_PRODUCT}?fields=collections,scents,max_price&brands=${cmsData?.brand?.id}`,
          method: 'GET',
          body: null,
        };
        fetchClient(optionsFilterBox).then((res: any) => {
          setFilterData(res);
        });

        setDataFooter(dataDynamicLinks?.footer);
        setDataNav(dataDynamicLinks?.navigation);
        setDataBody(cmsDataBody);
        setDataFormField(cmsData?.form_fields);
        setDataCMS(cmsData);
        setTimeStamp(cmsData.timestamp);
        setLoading(false);
        fetchDataProduct(true, cmsData?.brand?.id);
        if (cmsData?.show_highlight_message && cmsData.highlight_message) {
          dispatch(homeAction.setGlobalHeaderMessage(cmsData.highlight_message));
        }
        if (!cmsData?.show_highlight_message) {
          dispatch(homeAction.setGlobalHeaderMessage(''));
        }
      } catch (error) {
        // toastrError(error.message);
        // this.props.loadingPage(false);
      }
    }
  };
  const handleSortProduct = (value: any) => {
    // const sortQuery = filter(sortOptions, (d) => d.value == value[0].value);

    const cloneSearch = [...search];
    const index = findIndex(search, (i: any) => i.type == 'sort');

    index == -1 ? cloneSearch.push(value[0]) : (cloneSearch[index] = value[0]);

    setSearch(cloneSearch);
  };

  const iconList = [
    {
      text: 'SECURE PAYMENT',
      icon_image: {
        original:
          'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.original.png',
        width: 43,
        height: 28,
        webp:
          'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.original.format-webp.webp',
        mobile:
          'https://s.sundora-stage.23c.se/media/images/secure_payment_icon.width-768.format-webp.webp',
        alt: 'secure_payment_icon.png',
      },
    },
    {
      text: 'FREE SHIPPING*',
      icon_image: {
        original:
          'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.original.png',
        width: 52,
        height: 27,
        webp:
          'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.original.format-webp.webp',
        mobile:
          'https://s.sundora-stage.23c.se/media/images/free_shipping_icon.width-768.format-webp.webp',
        alt: 'free_shipping_icon.png',
      },
    },
    {
      text: '100% AUTHENTIC',
      icon_image: {
        original: 'https://s.sundora-stage.23c.se/media/images/auth_icon.original.png',
        width: 29,
        height: 29,
        webp:
          'https://s.sundora-stage.23c.se/media/images/auth_icon.original.format-webp.webp',
        mobile:
          'https://s.sundora-stage.23c.se/media/images/auth_icon.width-768.format-webp.webp',
        alt: 'auth_icon.png',
      },
    },
    {
      text: 'OFFICIAL DISTRIBUTOR',
      icon_image: {
        original: 'https://s.sundora-stage.23c.se/media/images/offical_icon.original.png',
        width: 39,
        height: 33,
        webp:
          'https://s.sundora-stage.23c.se/media/images/offical_icon.original.format-webp.webp',
        mobile:
          'https://s.sundora-stage.23c.se/media/images/offical_icon.width-768.format-webp.webp',
        alt: 'offical_icon.png',
      },
    },
    {
      text: 'ON TIME DELIVERY',
      icon_image: {
        original: 'https://s.sundora-stage.23c.se/media/images/time_delivery.original.png',
        width: 36,
        height: 28,
        webp:
          'https://s.sundora-stage.23c.se/media/images/time_delivery.original.format-webp.webp',
        mobile:
          'https://s.sundora-stage.23c.se/media/images/time_delivery.width-768.format-webp.webp',
        alt: 'time_delivery.png',
      },
    },
  ];

  const sortOptions = [
    {
      value: '-id',
      title: 'Newest',
      type: 'sort',
    },
    {
      value: 'popular',
      title: 'Popular',
      type: 'sort',
    },
    {
      value: 'product_variants__price',
      title: 'Price (low to high)',
      type: 'sort',
    },
    {
      value: '-product_variants__price',
      title: 'Price (high to low)',
      type: 'sort',
    },
  ];

  // FILTER FEATURE
  const [priceRange, setPriceRange] = useState<any>({
    minPrice: '',
    maxPrice: '',
  });

  // const [otherSelect, setOtherSelect] = useState<any>([]);
  const [validateFilter, setValidateFilter] = useState<any>({
    minMax: '',
  });
  const [filterSelection, setFilterSelection] = useState<any>([]);
  // const history = useHistory();
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
    dispatch(action.filterProductSuccess([...stateProduct.productStore]));
    let searchFilterValue = {};
    map(filterSelection, (item: any) => {
      if (item.type == 'minMax') {
        if (item.filterData.minPrice) {
          searchFilterValue = Object.assign({
            ...searchFilterValue,
            filterMinPrice: item.filterData.minPrice,
          });
        }
        if (item.filterData.maxPrice) {
          searchFilterValue = Object.assign({
            ...searchFilterValue,
            filterMaxPrice: item.filterData.maxPrice,
          });
        }
      }
    });
    // let otherQuery = [];
    // otherQuery = [
    //   ...filterSelection
    //     .filter((item: any) => item.type == 'other')
    //     .map((i: any) => {
    //       if (i.type == 'other') {
    //         return parseInt(i.value);
    //       }
    //     }),
    // ];
    // const sortQuery = find(filterSelection, (d) => d.type == 'sort');
    // const searchValueQueryString =
    //   objectToQueryString(searchValue) +
    //   (otherQuery && otherQuery.length > 0
    //     ? `&other=${otherQuery.toString().replace(/,$/, '')}`
    //     : '') +
    //   (sortQuery ? '&sort=' + sortQuery.value : '');
    // props.history.push({
    //   search: searchValueQueryString,
    // });
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

    // index != -1 ? copyArr.splice(index, 1) : (copyArr = data);
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

    // indexSearch != -1 ? cloneArrSearch.splice(index, 1) : cloneArrSearch.push(data);
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
  }, []);

  const handleKeyPress = () => {
    setVisibleModalEmail(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);

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

    const searchValueQueryString = objectToQueryString(obj);
    props.history.push({
      search: searchValueQueryString,
    });
  }, [search]);

  useEffect(() => {
    if (!isEmpty(dataCMS) && searchReady) {
      setLoadingProduct(true);
      fetchDataProduct(false);
    }
  }, [props.match]);

  useEffect(() => {
    handleFilterProduct();
  }, [filterSelection]);

  const openFilterBox = () => {
    dispatch(action.toogleFilterBox(true));
  };

  let filteredboxQuantity = 0;
  const handelToggleModal = () => {
    setVisibleModalEmail(!visibleModalEmail);
  };

  const getBreadCrumb = (data: any): string => {
    let link = '/';
    const title = data?.meta?.parent.title;
    if (title.match(/brand/gi)) {
      link = '/brands/all';
    }
    return link;
  };

  useEffect(() => {
    let obj = {};

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

  const locationState: any = useLocation();
  useMainColor(dataCMS, locationState.search);

  return (
    <div className="site-allProductPage">
      {loading ? <DotLoader /> : ''}
      <Helmet>
        <meta property="og:title" content={`${dataCMS?.title} page | Sundora`} />
        <meta property="og:description" content={`${dataCMS?.title} page | Sundora`} />
        <title>{`${dataCMS?.title ?? 'Filter'} page | Sundora`}</title>
        <meta name="description" content={`${dataCMS?.title} page | Sundora`} />
      </Helmet>
      {/* <Banner /> */}

      {dataCMS?.featured_image ? (
        <div
          className={`banner-all-product ${dataCMS?.fullwidth ? '' : 'container m-0-auto'}`}
        >
          <Picture data={dataCMS?.featured_image} />
        </div>
      ) : (
        ''
      )}
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
                  <li>
                    {/* <Link to={props.match.params.brand ? props.match.params.brand : '/'}> */}
                    <a href={getBreadCrumb(dataCMS)}>{dataCMS?.meta?.parent.title}</a>
                    {/* </Link> */}
                  </li>
                  <li>{dataCMS?.title}</li>
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
                  <li>
                    <a href={getBreadCrumb(dataCMS)}>{dataCMS?.meta?.parent.title}</a>
                  </li>
                  <li>{dataCMS?.title}</li>
                </ul>
              </div>
            ) : (
              ''
            )}
          </div>
        )}
        {find(dataCMS?.body, (item: any) => item.type == 'filtered_products') ? (
          ''
        ) : (
          <main className="blk-filter-results">
            <div className="row">
              <div className="col-lg-3 col-md-12 col-12">
                <section className="sidebar-left">
                  <FilterProductBox
                    brandID={dataCMS?.brand?.id}
                    dataOther={filterData?.collections}
                    dataScents={filterData?.scents}
                    maxPrice={filterData?.max_price}
                    dataBrands={dataCMS?.brands}
                    handleSortProduct={handleSortProduct}
                    filterSelection={filterSelection}
                    handleRemovePriceFilter={handleRemovePriceFilter}
                    handleRemoveOtherFilter={handleRemoveOtherFilter}
                    handleRemoveScentFilter={handleRemoveScentFilter}
                    handleRemoveBrandsFilter={handleRemoveBrandsFilter}
                    handleClearFilter={handleClearFilter}
                    handleFilterProduct={handleFilterProduct}
                    priceRange={priceRange}
                    handleChange={handleChange}
                    handleBlurPrice={handleBlurPrice}
                    validateFilter={validateFilter}
                    handleCheckOther={handleCheckOther}
                    handleCheckBrand={handleCheckBrand}
                    handleCheckScent={handleCheckScent}
                    setPriceRange={setPriceRange}
                    customFilter={dataCMS?.custom_filter_data}
                    handleCheckTags={handleCheckTags}
                    handleRemoveTagsFilter={handleRemoveTagsFilter}
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
                {stateProduct.allProduct && stateProduct.allProduct.length > 0 ? (
                  !loading ? (
                    <div style={{ marginBottom: '3em' }} className="animated faster fade-in">
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
                  ) : (
                    ''
                  )
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
              </div>
            </div>
          </main>
        )}
      </div>
      <div style={{ paddingBottom: '0' }}>
        {map(dataBody, (item: any, index: any) => {
          switch (item.type) {
            case 'carousel':
              return (
                <div style={{ marginTop: '1rem' }}>
                  <BlockCarousel
                    slides={item && item.value ? item?.value.slides : []}
                    key={index}
                    dragOrAuto={false}
                    maxWidth={item && item?.value?.max_width ? item?.value?.max_width : ''}
                    maxHeight={item && item?.value?.max_height ? item?.value?.max_height : ''}
                  />
                </div>
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
              return <CountDownBlock data={item?.value} key={index} timestamp={timeStamp} />;
            case 'video':
              return (
                <VideoBlock
                  data={item?.value}
                  title={item?.value?.title || ''}
                  showReadmore={true}
                  key={index}
                />
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
            case 'filtered_products':
              filteredboxQuantity++;
              return filteredboxQuantity <= 1 ? (
                <div className="container" key={index}>
                  <main className="blk-filter-results">
                    <div className="row">
                      <div className="col-lg-3 col-md-12 col-12">
                        <section className="sidebar-left">
                          <FilterProductBox
                            brandID={dataCMS?.brand?.id}
                            dataOther={filterData?.collections}
                            dataScents={filterData?.scents}
                            priceRange={priceRange}
                            maxPrice={filterData?.max_price}
                            // dataBrands={dataCMS?.all_brands}
                            handleSortProduct={handleSortProduct}
                            filterSelection={filterSelection}
                            handleRemovePriceFilter={handleRemovePriceFilter}
                            handleRemoveOtherFilter={handleRemoveOtherFilter}
                            handleRemoveScentFilter={handleRemoveScentFilter}
                            handleRemoveBrandsFilter={handleRemoveBrandsFilter}
                            handleClearFilter={handleClearFilter}
                            handleFilterProduct={handleFilterProduct}
                            handleChange={handleChange}
                            handleBlurPrice={handleBlurPrice}
                            validateFilter={validateFilter}
                            handleCheckOther={handleCheckOther}
                            handleCheckBrand={handleCheckBrand}
                            handleCheckScent={handleCheckScent}
                            setPriceRange={setPriceRange}
                            customFilter={dataCMS?.custom_filter_data}
                            handleCheckTags={handleCheckTags}
                            handleRemoveTagsFilter={handleRemoveTagsFilter}
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
                        {stateProduct.allProduct && stateProduct.allProduct.length > 0 ? (
                          !loading ? (
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
                          ) : (
                            ''
                          )
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
                      </div>
                    </div>
                  </main>
                </div>
              ) : (
                <></>
              );
            case 'bloglist':
              return <BlockBlogs blogList={item?.value} title="Sundora Blogs" key={index} />;
            case 'form':
              return item?.value?.modal == 'True' ? (
                <BlockModal
                  isOpen={visibleModalEmail}
                  minWidth="36%"
                  maskBg={false}
                  onKeyPress={() => handleKeyPress()}
                  onClickAway={() => handelToggleModal()}
                  key={index}
                >
                  <BlockCollectEmail
                    content={item?.value}
                    formField={dataFormField}
                    url={dataCMS?.meta?.html_url}
                    closeModal={handelToggleModal}
                  />
                </BlockModal>
              ) : (
                <BlockFormField
                  content={item?.value}
                  formField={dataFormField}
                  url={dataCMS?.meta?.html_url}
                  key={index}
                />
              );
            case 'recommended':
              return (
                <BlockProduct
                  productList={item?.value?.products}
                  title={item?.value?.headline}
                  key={index}
                />
              );
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
      <div
        // className={`main-content ${isSticky ? 'stick-icon' : ''}`}
        className="main-content"
      >
        <BlockIcon iconList={iconList} />
      </div>
      <div ref={refFooter}>
        <Footer data={dataFooter} />
      </div>
    </div>
  );
}

export default memo(BrandProductPage);
