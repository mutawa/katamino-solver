
String.prototype.hexToRgb = function() {
 
    const hex = this.replace("#", "");
  const arrBuff = new ArrayBuffer(4);
  const vw = new DataView(arrBuff);
  vw.setUint32(0, parseInt(hex, 16), false);
  var arrByte = new Uint8Array(arrBuff);

  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];

}

Array.prototype.shuffle = function() {
  let currentIndex = this.length;

  while(currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
  }
}