import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { isMobile } from '../../DetectScreen';
import axios from 'axios';
import routes from '../../routes/routeModel';
import { moneyFormater } from '../../redux/Helpers';
import { API_URL } from '../../config';

function SearchBox(props: any): JSX.Element {
  const ref = useRef<any>(null);
  const [openSearch, setOpenSearch] = useState<any>(false);
  const [searchValue, setSearchValue] = useState<any>('');
  const [pathName, setPathName] = useState<any>('');
  const [dataSearch, setDataSearch] = useState<any>([]);
  const [countDataSearch, setCountDataSearch] = useState<any>(0);
  const debounce = useRef<any>(null);
  const history = useHistory();

  const handleOpenSearch = () => {
    ref?.current?.focus();
    setOpenSearch(true);
  };
  const handleCloseSearch = () => {
    setOpenSearch(false);
  };
  const checkSearchPage = () => {
    if (pathName == '/product') {
      return true;
    }
    return false;
  };

  const handleSearch = (e: any) => {
    const url = `/product?search=${e.target.value}`;
    if (e.charCode == 13) {
      if (checkSearchPage()) {
        document.location.href = url;
      }
      history.push(url);
    }
  };

  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      if (searchValue != '') {
        axios
          .get(`${API_URL}/api/shopify/products/?search=${searchValue}`)
          .then((res: any) => {
            setCountDataSearch(res.data?.count);
            setDataSearch(res.data?.results?.slice(0, isMobile ? 3 : 5));
          })
          .catch((err: any) => {
            console.log(err);
          });
      } else {
        setCountDataSearch(0);
        setDataSearch([]);
      }
    }, 300);
  }, [searchValue]);

  const handleSearchByButton = () => {
    const url = `/product?search=${searchValue}`;
    if (checkSearchPage()) {
      document.location.href = url;
    }
    history.push(url);
    props.closeModalMobile();
  };

  useEffect(() => {
    setPathName(history.location.pathname);
  }, [history.location]);

  return (
    <div
      onBlur={(e) => {
        const currentTarget = e.currentTarget;
        setTimeout(() => {
          if (!currentTarget.contains(document.activeElement)) {
            handleCloseSearch();
          }
        }, 0);
      }}
    >
      <div className={`search-box ${openSearch ? 'open-seach-box' : ''}`}>
        <input
          type="text"
          placeholder="search product or brand"
          ref={ref}
          onFocus={(e) => e.stopPropagation()}
          onKeyPress={(e) => handleSearch(e)}
          onChange={handleChange}
        />
        {((!isMobile && openSearch) || isMobile) && dataSearch?.length > 0 && (
          <div className={`search-box-result`}>
            {dataSearch?.map((e: any, i: any) => (
              <a
                href={routes
                  ?.find((route: any) => route.name == 'Product Detail Page')
                  ?.path.replace(':IDBrand', e?.brand_page?.page_ptr?.handle)
                  .replace(':IDProduct', e?.handle)}
                className="search-box-result-item"
                key={i}
              >
                <img src={e?.images[0]?.url?.original} alt="" />
                <div className="search-box-result-item-name">{e?.name}</div>
                <div className="search-box-result-item-price">
                  <span>
                    {e?.product_variants?.length > 1 && 'from'}{' '}
                    {moneyFormater(e?.product_variants[0]?.price)}
                  </span>
                </div>
              </a>
            ))}

            <a href={`/product?search=${searchValue}`} className="search-box-result-all">
              Total Search ({countDataSearch})
            </a>
          </div>
        )}

        <button
          className="cursor-pointer"
          onClick={
            isMobile ? handleSearchByButton : openSearch ? handleCloseSearch : handleOpenSearch
          }
        >
          <i className="gg-search"></i>
        </button>
      </div>
    </div>
  );
}

export default SearchBox;
