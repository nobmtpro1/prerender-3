import axios from 'axios';
import { useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { GET_PAGE_CMS_HOME_PAGE_URL } from '../../config';
import { setGlobalConfigAction } from '../../redux/globalConfig/actions';

function useGlobalConfig() {
  const dispatch = useDispatch();
  const userReducer = useSelector((state: RootStateOrAny) => state.userReducer);

  const user: any = userReducer?.user;

  useEffect(() => {
    axios
      .get(GET_PAGE_CMS_HOME_PAGE_URL + 'welcome')
      .then((res: any) => {
        dispatch(
          setGlobalConfigAction({
            logo:
              user && res.data.basic_settings?.logo_logged
                ? res.data.basic_settings?.logo_logged
                : res.data.basic_settings?.logo,
          }),
        );
      })
      .catch();
  }, [user]);

  return [];
}

export default useGlobalConfig;
