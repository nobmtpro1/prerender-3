export const metaUpdate = (data: any) => {
  try {
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogImageSecureUrl = document.querySelector('meta[property="og:image:secure_url"]');

    const titleTag = document.querySelector('title');

    description?.setAttribute('content', `${data.title ?? 'Product'} | Sundora`);
    ogTitle?.setAttribute('content', `${data.title ?? 'Product'} | Sundora`);
    ogDescription?.setAttribute('content', `${data.title ?? 'Product'} | Sundora`);
    ogImage?.setAttribute('content', data.image);
    ogImageSecureUrl?.setAttribute('content', data.image);

    if (titleTag) {
      titleTag.innerHTML = `${data.title ?? 'Product'} | Sundora`;
    }
  } catch (error) {
    // console.log(error);
  }
};
