export async function cleanLogoBackground(image) {
  if (!image || image.dataset.logoCleaned) return;
  image.dataset.logoCleaned = 'pending';
  if (!image.complete) await new Promise((resolve) => image.addEventListener('load', resolve, { once: true }));
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    const red = pixels.data[offset];
    const green = pixels.data[offset + 1];
    const blue = pixels.data[offset + 2];
    const neutral = Math.max(red, green, blue) - Math.min(red, green, blue) < 9;
    if (neutral && (red + green + blue) / 3 > 205) pixels.data[offset + 3] = 0;
  }
  context.putImageData(pixels, 0, 0);
  const cleanSource = canvas.toDataURL('image/png');
  image.src = cleanSource;
  image.dataset.logoCleaned = 'true';
  document.querySelector('link[rel="icon"]')?.setAttribute('href', cleanSource);
}
