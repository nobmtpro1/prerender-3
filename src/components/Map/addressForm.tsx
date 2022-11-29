import React, { createRef, memo, useEffect, useState } from 'react';
import Geocode from 'react-geocode';
import { GOOGLE_MAP_API } from '../../config';
import { RootStateOrAny, useSelector } from 'react-redux';
import { map } from 'lodash';
import AdaptiveInput from '../CheckoutForm/AdaptiveInput';
import { getCity, getArea, getStreet, getNumber, getPostalCode, getState } from './utils';

function addressForm(props: any): JSX.Element {
  const authState = useSelector((state: RootStateOrAny) => state.userReducer);
  const [state, setState] = useState<any>({
    address: '',
    area: '',
    building_or_block: '',
    state: '',
    street: '',
    number: '',
    city: '',
    street2: '',
    postal_code: '',
    additional_info: '',
    mapPosition: {
      lat: 23.7919546,
      lng: 90.4079771,
    },
    markerPosition: {
      lat: 23.7919546,
      lng: 90.4079771,
    },
  });

  const [houseNumberAndStreet, setHouseNumberAndStreet] = useState<any>(
    `${props.stateProps.number} ${props.stateProps.street}`,
  );

  useEffect(() => {
    if (houseNumberAndStreet == '') {
      return;
    }
    const words: any = houseNumberAndStreet?.trim()?.split(' ');
    let indexSplit: any = 1;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (parseInt(word)) {
        indexSplit = i + 1;
        break;
      }
    }
    setState({
      ...state,
      number: words?.splice(0, indexSplit).join(' ') || '',
      street: words.join(' ') || '',
    });
  }, [houseNumberAndStreet]);

  const postalCodeRef = createRef<any>();
  const areaRef = createRef<any>();
  const houseNumberAndStreetRef = createRef<any>();
  const cityRef = createRef<any>();

  const [validateForm, setValidateForm] = useState<any>({
    postal_code: '',
    area: '',
    houseNumberAndStreet: '',
    city: '',
  });

  useEffect(() => {
    Geocode.setApiKey(GOOGLE_MAP_API);
    Geocode.enableDebug();

    Geocode.fromLatLng(state.mapPosition.lat, state.mapPosition.lng).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = getCity(addressArray),
          area = getArea(addressArray),
          state = getState(addressArray),
          street = getStreet(addressArray),
          number = getNumber(addressArray),
          postal_code = getPostalCode(addressArray);
        // console.log('city', city, area, state, street);
        // console.log(address);
        setState((prevState: any) => ({
          ...prevState,
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : '',
          street: street ? street : '',
          number: number ? number : '',
          postal_code: postal_code ? postal_code : '',
          markerPosition: {
            lat: lat,
            lng: lng,
          },
          mapPosition: {
            lat: lat,
            lng: lng,
          },
        }));
      },
      (error) => {
        console.error(error);
      },
    );
  }, []);

  const onChange = (event: any) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    setState(() => ({
      id: props.stateProps.id ? props.stateProps.id : null,
      address: props.stateProps.address || '',
      area: props.stateProps?.area || '',
      building_or_block: props.stateProps?.building_or_block || '',
      city: props.stateProps.city || '',
      state: props.stateProps.stateRes || '',
      street: props.stateProps.street || '',
      number: props.stateProps.number || '',
      postal_code: props.stateProps.postal_code || '',
      additional_info: props.stateProps?.additional_info || '',
      markerPosition: {
        lat: props.stateProps.newLat,
        lng: props.stateProps.newLng,
      },
      mapPosition: {
        lat: props.stateProps.newLat,
        lng: props.stateProps.newLng,
      },
    }));

    setHouseNumberAndStreet(`${props.stateProps.number} ${props.stateProps.street}`);
  }, [props.stateProps]);

  const checkValidInput = (value: any, ref: any, message: any) => {
    const wordCount =
      value && value.trim().replace(/\s+/g, ' ').length > 0
        ? value.trim().replace(/\s+/g, ' ').length
        : 0;

    if (wordCount === 0) {
      ref.current.focus();
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return message;
    }
  };

  const checkValidForm = () => {
    const validPostalCode = checkValidInput(
      state?.postal_code,
      postalCodeRef,
      'Please enter post code!',
    );
    const validArea = checkValidInput(state?.area, postalCodeRef, 'Please enter area!');
    const validCity = checkValidInput(state?.city, cityRef, 'Please enter city!');
    const validHouseNumberAndStreet = checkValidInput(
      houseNumberAndStreet,
      houseNumberAndStreetRef,
      'Please enter house number and street name!',
    );
    setValidateForm({
      ...validateForm,
      ...{
        area: validArea,
        postal_code: validPostalCode,
        houseNumberAndStreet: validHouseNumberAndStreet,
        city: validCity,
      },
    });
    if (validPostalCode || validArea || validHouseNumberAndStreet || validCity) {
      return true;
    } else {
      return false;
    }
  };

  const updateAddress = () => {
    if (!checkValidForm()) {
      props.handleClickUpdateAddress(props.id, state);
    }
  };

  const confirmAddress = () => {
    if (!checkValidForm()) {
      props.handleClickConfirmAddress(state);
    }
  };

  return (
    <>
      <div className="form-group">
        {map(props?.type ? authState?.address[props?.type] : '', (item, index) => {
          return (
            <button
              key={index}
              onClick={() => props.handleClickAddressItem(item)}
              className={`address-info ${
                item.id == props.id || item.id === props?.selectedAddressId ? 'active' : ''
              }`}
            >
              {/* EDIT Lorem ipsum adres 123 */}
              {item?.address}
            </button>
          );
        })}
        <button className="btn-add-address" onClick={() => props.handleClickAddAddress()}>
          + ADD ANOTHER ADDRESS
        </button>
      </div>
      {/* {props.center.lat !== undefined ? ( */}

      {props.showFormAddress ? (
        <section className="wrapper-content-map">
          <div>
            <div className="form-group">
              <AdaptiveInput
                type="text"
                for="houseNumberAndStreet"
                name="houseNumberAndStreet"
                label="Enter house number and street name"
                value={houseNumberAndStreet}
                handleChange={(e: any) => setHouseNumberAndStreet(e.target.value)}
                refName={houseNumberAndStreetRef}
                validate={true}
                validateContent={validateForm.houseNumberAndStreet}
              />
            </div>

            <div className="form-group">
              <AdaptiveInput
                type="text"
                for="city"
                name="city"
                label="Enter city"
                value={state.city || ''}
                handleChange={onChange}
                refName={cityRef}
                validate={true}
                validateContent={validateForm.city}
              />
            </div>
            <div className="form-group">
              <AdaptiveInput
                type="text"
                for="area"
                name="area"
                label="Enter Area"
                value={state.area || ''}
                handleChange={onChange}
                refName={areaRef}
                validate={true}
                validateContent={validateForm.area}
              />
            </div>
            <div className="form-group">
              <AdaptiveInput
                type="text"
                for="postal_code"
                name="postal_code"
                label="Enter postal code"
                value={state.postal_code || ''}
                handleChange={onChange}
                // required={true}
                refName={postalCodeRef}
                validate={true}
                validateContent={validateForm.postal_code}
              />
            </div>
            <div className="form-group">
              <AdaptiveInput
                type="text"
                for="additional_info"
                name="additional_info"
                label="Additional Information"
                value={state.additional_info || ''}
                handleChange={onChange}
              />
            </div>

            <div className="form-group">
              <div className="submit-box">
                {props.isAllowDelete && props.isUpdate ? (
                  <button onClick={() => props.handleDeleteAddress(props.id)}>
                    DELETE ADDRESS
                  </button>
                ) : (
                  ''
                )}
                {props.isUpdate && props.fromCheckOut ? (
                  <button onClick={updateAddress}>CONFIRM ADDRESS</button>
                ) : props.isUpdate && !props.fromCheckOut ? (
                  <button onClick={updateAddress}>EDIT ADDRESS</button>
                ) : (
                  <button onClick={confirmAddress}>CONFIRM ADDRESS</button>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        ''
      )}
    </>
  );
}
export default memo(addressForm);
