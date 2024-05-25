export default function getMonth(mouthNumber: number) {
    let mouthName = "";
    switch (mouthNumber) {
        case 0:
            mouthName = "Janeiro";
          break;
        case 1:
            mouthName = "Fevereiro";
          break;
        case 2:
            mouthName = "Março";
          break;
        case 3:
            mouthName = "Abril";
          break;
        case 4:
            mouthName = "Maio";
          break;
        case 5:
            mouthName = "Junho";
          break;
        case 6:
            mouthName = "Julho";
          break;
        case 7:
            mouthName = "Agosto";
          break;
        case 8:
            mouthName = "Setembro";
          break;
        case 9:
            mouthName = "Outubro";
          break;
        case 10:
            mouthName = "Novembro";
          break;
        case 11:
            mouthName = "Dezembro";
          break;
      
        default:
          break;
      }
    return mouthName;
}