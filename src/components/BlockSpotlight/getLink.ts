/* eslint-disable */
export function getLink(data: any) {
    let link = '';
    if (data?.link) {
        if (data?.link?.link_type === 'internal') {
            link = data?.link?.relative_url;
        } else {
            link = data?.link?.full_url;
        }
        return link;
    } else if (data?.product) {
        link = `/brand/${data?.product?.brand_page?.page_ptr?.handle}/${data?.product.handle}`;
        return link;
    } else {
        link = '/';
        return link;
    }
}
/* eslint-disable */