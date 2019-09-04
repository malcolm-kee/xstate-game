export const preloadImages = (...imageSrcs: string[]) =>
  imageSrcs.forEach(src => {
    const img = new Image();
    img.src = src;
  });
