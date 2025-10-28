
class CommonConstant {
  appStorage: any;
  constructor() { }
  public TOKEN: string = 'accessToken';
  public REFRESHTOKEN: string = 'refreshToken';
  public THEME:string='adminTheme';
  public USERDATA:string='userData';
//   public playSound = () => {
//     let sound = new Audio('assets/sounds/notify.mp3');
//     sound.currentTime = 0;
//     sound.play();
//   };
}
export let common = new CommonConstant();
