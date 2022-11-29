/* eslint-disable */
/**
 * Get the city and set the city input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getCity = (addressArray: any) => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'locality' === addressArray[i].types[0]) {
            city = addressArray[i].long_name;
            return city;
        }
    }
};
/**
 * Get the postal code and set the postal code input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getPostalCode = (addressArray: any) => {
    let postalcode = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'postal_code' === addressArray[i].types[0]) {
            postalcode = addressArray[i].long_name;
            return postalcode;
        }
    }
};
/**
 * Get the number street and set the number street input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getNumber = (addressArray: any) => {
    let number = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'street_number' === addressArray[i].types[0]) {
            number = addressArray[i].long_name;
            return number;
        }
    }
};
/**
 * Get the street and set the street input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getStreet = (addressArray: any) => {
    let streetName = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0] && 'route' === addressArray[i].types[0]) {
            streetName = addressArray[i].long_name;
            return streetName;
        }
    }
};
/**
 * Get the area and set the area input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getArea = (addressArray: any) => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
        if (addressArray[i].types[0]) {
            for (let j = 0; j < addressArray[i].types.length; j++) {
                if (
                    'sublocality_level_1' === addressArray[i].types[j] ||
                    'locality' === addressArray[i].types[j]
                ) {
                    area = addressArray[i].long_name;
                    return area;
                }
            }
        }
    }
};
/**
 * Get the address and set the address input value to the one selected
 *
 * @param addressArray
 * @return {string}
 */
export const getState = (addressArray: any) => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
        for (let i = 0; i < addressArray.length; i++) {
            if (
                addressArray[i].types[0] &&
                'administrative_area_level_1' === addressArray[i].types[0]
            ) {
                state = addressArray[i].long_name;
                return state;
            }
        }
    }
};
/* eslint-disable */
