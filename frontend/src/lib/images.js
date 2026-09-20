const WIDTHS = [480, 768, 1200, 1600, 1920];

export function optimizedUnsplash(url, { width = 1200, quality = 70 } = {}) {
  if (!url || typeof url !== 'string') {
    return { src: '', srcSet: '', sizes: '100vw' };
  }

  if (!url.includes('images.unsplash.com')) {
    return { src: url, srcSet: '', sizes: '100vw' };
  }

  const base = url.split('?')[0];
  const src = `${base}?auto=format&fit=crop&w=${width}&q=${quality}`;
  const srcSet = WIDTHS
    .map((w) => `${base}?auto=format&fit=crop&w=${w}&q=${quality} ${w}w`)
    .join(', ');

  return { src, srcSet, sizes: '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 1200px' };
}

export function propertyImage(property) {
  return property?.image || property?.images?.[0]?.url || property?.primary_image || '';
}

export function compressImageFile(file, { maxDim = 1600, quality = 0.82 } = {}) {
  if (!(file instanceof File) || !file.type.startsWith('image/')) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = image;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const name = file.name.replace(/\.\w+$/, '.jpg');
          resolve(new File([blob], name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    image.src = objectUrl;
  });
}
