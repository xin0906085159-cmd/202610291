// 宣告全域變數
let stopImg;           // 儲存站立精靈圖 (Spritesheet)
let walkImg;           // 儲存行走精靈圖 (Spritesheet)
let stopFrames = [];   // 存放切割後的站立動畫影格陣列
let walkFrames = [];   // 存放切割後的行走動畫影格陣列

let currentAnim = 'stop';     // 記錄當前角色的動作狀態 ('stop', 'walkRight', 'walkLeft')
let frameIndex = 0;           // 記錄當前播放到第幾個影格
let frameRateCounter = 0;     // 用於控制動畫播放速度的計數器

let posX, posY;               // 角色的 X 與 Y 座標位置
let moveSpeed = 3.5;          // 角色的移動速度

function preload() {
  // 預先載入站立精靈圖檔 (共14張，尺寸 1955x212)
  stopImg = loadImage('1/stop/stop.png');
  
  // 預先載入行走精靈圖檔 (共9張，尺寸 1246x198)
  walkImg = loadImage('1/walk/walk.png');
}

function setup() {
  // 建立符合全螢幕大小的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色位置在畫布正中間
  posX = width / 2;
  posY = height / 2;

  // --- 切割站立精靈圖 ---
  let stopFrameWidth = stopImg.width / 14;   // 計算每張站立圖的寬度
  let stopFrameHeight = stopImg.height;      // 取得站立圖的高度
  for (let i = 0; i < 14; i++) {
    // 使用 get() 函式依序裁切出每一個影格並存入陣列
    let frame = stopImg.get(i * stopFrameWidth, 0, stopFrameWidth, stopFrameHeight);
    stopFrames.push(frame);
  }

  // --- 切割行走精靈圖 ---
  let walkFrameWidth = walkImg.width / 9;    // 計算每張行走圖的寬度
  let walkFrameHeight = walkImg.height;      // 取得行走圖的高度
  for (let i = 0; i < 9; i++) {
    // 使用 get() 函式依序裁切出每一個影格並存入陣列
    let frame = walkImg.get(i * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
    walkFrames.push(frame);
  }

  // 設定圖片繪製的對齊點為中心 (CENTER)，方便定位與翻轉
  imageMode(CENTER);
}

function draw() {
  // 設定畫布背景顏色為指定的 #D4C1EC
  background('#D4C1EC');

  // 偵測鍵盤輸入並更新角色狀態與座標
  handleKeyboardInput();

  // 更新動畫影格並在畫面上繪製角色
  renderAnimation();
}

function handleKeyboardInput() {
  let isMoving = false; // 預設角色沒有移動

  // 當使用者按下鍵盤右鍵
  if (keyIsDown(RIGHT_ARROW)) {
    currentAnim = 'walkRight'; // 設定狀態為向右走
    posX += moveSpeed;         // 角色座標向右移動
    isMoving = true;           // 標記為移動中
  } 
  // 當使用者按下鍵盤左鍵
  else if (keyIsDown(LEFT_ARROW)) {
    currentAnim = 'walkLeft';  // 設定狀態為向左走
    posX -= moveSpeed;         // 角色座標向左移動
    isMoving = true;           // 標記為移動中
  }

  // 如果沒有按左右方向鍵，則切回停止狀態
  if (!isMoving) {
    currentAnim = 'stop';
  }
}

function renderAnimation() {
  // 透過計數器降低動畫播放速度，數字越大播放越慢
  frameRateCounter++;
  if (frameRateCounter % 6 === 0) {
    if (currentAnim === 'stop') {
      // 循環播放站立動畫影格 (0 到 13)
      frameIndex = (frameIndex + 1) % stopFrames.length;
    } else {
      // 循環播放行走動畫影格 (0 到 8)
      frameIndex = (frameIndex + 1) % walkFrames.length;
    }
  }

  // 儲存當前的繪圖狀態
  push();
  // 將座標原點移動到角色的目前位置
  translate(posX, posY);

  // 根據不同的動作狀態繪製對應的圖像
  if (currentAnim === 'stop') {
    // 繪製站立畫面
    image(stopFrames[frameIndex], 0, 0);
  } 
  else if (currentAnim === 'walkRight') {
    // 繪製向右行走的畫面
    image(walkFrames[frameIndex], 0, 0);
  } 
  else if (currentAnim === 'walkLeft') {
    // 繪製向左行走的畫面（水平翻轉 -1）
    scale(-1, 1);
    image(walkFrames[frameIndex], 0, 0);
  }

  // 恢復先前的繪圖狀態
  pop();
}

function windowResized() {
  // 當瀏覽器視窗大小改變時，自動調整畫布大小填滿全螢幕
  resizeCanvas(windowWidth, windowHeight);
}