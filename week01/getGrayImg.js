const getGrayImage = url => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject && reject('url不存在')
      return null
    }

    let oImg = new Image()
    oImg.crossOrigin = "Anonymous";
    oImg.src = url

    oImg.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = oImg.width;
      canvas.height = oImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(oImg, 0, 0);
      const c = ctx.getImageData(0, 0, oImg.width, oImg.height);
      for (let i = 0; i < c.width * c.height * 4; i += 4) {
        let r = c.data[i];
        let g = c.data[i + 1];
        let b = c.data[i + 2];
        c.data[i] = c.data[i + 1] = c.data[i + 2] = ((r + g + b) / 3);
      }
      ctx.putImageData(c, 0, 0, 0, 0, c.width, c.height);
      let imgUrl = canvas.toDataURL();
      resolve && resolve(imgUrl)

    }
  })

}