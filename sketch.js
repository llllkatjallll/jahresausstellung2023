let sketch = function (p) {

  //Hier werden Variablen erstellt/definiert
  let canvas;
  let width = 0;
  let height = 0;
  let currentSketch = 1;
  let timerStart = 0; //variable to hold the start time of each iteration of the timer
  let timerLength = 20000; //length of the timer (in milliseconds)
  let timerCount = 0; //number of times the timer has reset


  // TASCHENMESSER ////////////////////

  // Bilder für das Messer
  let messerbild; // Körper
  let objekt1; // 1. Objekt
  let finger; // flutschfinger
  let ken; // ken
  let zigarette; // zigarette

  let punktA = p.createVector(0, 0);
  let punktB = p.createVector(0, 0);
  let punktD = p.createVector(0, 0);
  let punktC = p.createVector(0, 0);
  let punktE = p.createVector(0, 0);


  // FLIEGOLIN ////////////////////
  let mittelpunkt = p.createVector(0, 0);
  let distanz = 0;
  let bild;
  let hintergrundBild;

  let aktuellesBild = 0;
  let aktBildgrenze = 0;

  let imgs = [],
    num_imgs = 3;

  let letztePosition = p.createVector(0, 0);
  let kreisGroesse;

  let bildY;
  let bildYsmooth;

  let zielErreicht = false;

  let punktF = p.createVector(0, 0);
  let punktG = p.createVector(0, 0);
  let punktH = p.createVector(0, 0);
  let punktI = p.createVector(0, 0);
  let punktJ = p.createVector(0, 0);
  let punktK = p.createVector(0, 0);
  let punktL = p.createVector(0, 0);
  let punktM = p.createVector(0, 0);
  let punktN = p.createVector(0, 0);
  let punktO = p.createVector(0, 0);
  let punktP = p.createVector(0, 0);
  let punktQ = p.createVector(0, 0);
  let ratio;

  let easing = 0.05;
  let easingBild = 0.1;


  // RAIN /////////////////////////
  let zeigefinger = p.createVector(0, 0);//var für Zeigefinger
  let letztePositionRain = p.createVector(0, 0); //var für Funktion Geschwindigkeit
  let regenStaerke = 1; //var für regenstärke
  let drops = [];
  let geschwindigkeit;
  let sound;
  let volumeRain = 0;

  // RATAVA ////////////////////

  //Variablen für Animationsvideos  
  let windGif;
  let wind2Gif;
  let water1Gif;
  let water2Gif;
  let fireLGif;
  let fireRGif;
  let earth1Gif;
  let earth2Gif;


  //Tracking + Animations
  let wristL_lastPosition = p.createVector(0, 0);
  let wristR_lastPosition = p.createVector(0, 0);
  let ankleL_lastPosition = p.createVector(0, 0);
  let ankleR_lastPosition = p.createVector(0, 0);

  let wristCenter = p.createVector(0, 0);
  let shoulderCenter = p.createVector(0, 0);

  let windCounter = 0;
  let windWasActive = false;



  //Hier bereiten wir Variablen für Finger/Hand-Punkte vor
  let wristL = p.createVector(0, 0);
  let wristR = p.createVector(0, 0);
  let fingerL = p.createVector(0, 0);
  let fingerR = p.createVector(0, 0);
  let ankleL = p.createVector(0, 0);
  let ankleR = p.createVector(0, 0);
  let shoulderL = p.createVector(0, 0);
  let shoulderR = p.createVector(0, 0);


  // HTML container
  let container = document.getElementById("p5sketch");

  // Webcam (üblicherweise 16:9)
  let webcamWidth = container.offsetHeight * 1.78;
  let webcamHeight = container.offsetHeight;
  let webcam; // Webcam
  let webcamCanvas; // Fläche für die Webcam


  p.preload = function () {

    //Preload Taschenmesser
    messerbild = p.loadImage("victori_body.png");
    objekt1 = p.loadImage("gabel.png");
    finger = p.loadImage("Flutschfinger1.png");
    ken = p.loadImage("ken.png");
    zigarette = p.loadImage("zigarette.png");

    //Preload FLIGOLIN
    bild = p.loadImage("data/FLIEGolin-1.png");

    hintergrundBild = p.loadImage("data/htg_2.png");

    for (let i = 1; i < num_imgs + 1; i++) {
      imgs[i - 1] = p.loadImage("datafliegen/fliegen(" + i + ").png");
    }

    //Preload RAIN
    sound = p.loadSound('sound.mp3');

    // preload RATAVA
    //hier können Inhalte wie Bilder/Bildsequenzen,Sound-Files,Videos vorgeladen werden
    windGif = p.loadImage('Animations/Wind/wind.gif');
    wind2Gif = p.loadImage('Animations/Wind/wind2.gif');
    fireLGif = p.loadImage('Animations/Fire/fireL.gif');
    fireRGif = p.loadImage('Animations/Fire/fireR.gif');
    water1Gif = p.loadImage('Animations/Water/water1.gif');
    water2Gif = p.loadImage('Animations/Water/water2.gif');
    earth1Gif = p.loadImage('Animations/Earth/earth1.gif');
    earth2Gif = p.loadImage('Animations/Earth/earth2.gif');

    //Alle Gifs auf frame 0 setzen
    windGif.setFrame(0);
    wind2Gif.setFrame(0);
    fireLGif.setFrame(0);
    fireRGif.setFrame(0);
    water1Gif.setFrame(0);
    water2Gif.setFrame(0);
    earth1Gif.setFrame(0);
    earth2Gif.setFrame(0);
  }

  p.setup = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas = p.createCanvas(width, height);
    canvas.parent("p5sketch");

    //FLIGOLIN
    ratio = width / hintergrundBild.width;
    bildY = -(10000 * ratio) / 2 + height;
    bildYsmooth = -(10000 * ratio) / 2 + height;
    mittelpunkt.x = width / 2;

    // setup RAIN
    sound.setVolume(volumeRain);
    sound.loop();

    for (let i = 0; i < 5000; i++) {
      drops.push(new Drop());
    }
  }


  p.ratavaSetup = function () {
    width = container.offsetHeight * 1.78;
    height = container.offsetHeight;
    canvas = p.createCanvas(width, height);
    canvas.parent("p5sketch");

    p.imageMode(p.CORNER);
    // Webcam
    webcam = p.createCapture(p.VIDEO);
    webcam.size(webcamWidth, webcamHeight);
    webcam.hide();

    // Fläche für die Webcam
    webcamCanvas = p.createGraphics(webcamWidth, webcamHeight);
    ratavaSetupActive = true;
  }

  let ratavaSetupActive = false;
  let fligolinSetupActive = false;

  p.draw = function () {

    if (p.millis() - timerStart > timerLength){ 
      timerCount++; //increment the number of times the timer has reset
      console.log(timerCount); //print number of timer resets to console

      if (currentSketch < 1) {
        currentSketch = currentSketch + 1;
      } else {
        currentSketch = 0;
      }

      timerStart = p.millis(); //reset start time of timer to new current time
    }



    if (currentSketch == 0) {
      p.taschenmesserDraw();
    }

    if (currentSketch == 1) {
      if (!fligolinSetupActive) {
        p.fligolinSetup();
        
      }
      p.fligolinDraw();
    } else {
      fligolinSetupActive = false;
    }

    if (currentSketch == 3) {
      //p.rainDraw();
    }

    if (currentSketch == 2) {
      if (!ratavaSetupActive) {
        p.ratavaSetup();
      }
      p.ratavaDraw();
    }

  }

  p.fligolinSetup = function () {
    bildY = -(10000 * ratio) / 2 + height;
    bildYsmooth = -(10000 * ratio) / 2 + height;
    fligolinSetupActive = true;
    zielErreicht = false;
    console.log("zielErreicht", zielErreicht);
    console.log("fligolinSetupActive", fligolinSetupActive);
  }

  p.ratavaDraw = function () {
    //hintergrundfarbe einstellen
    p.background(212, 230, 255);

    //Gif abspielen
    //p.image(windGif, width/2-600, height/2-450, 1200, 900);

    p.push();
    p.translate(-webcamWidth / 2 + width / 2, 0); // Webcam zentrieren
    p.scale(-1, 1); // Webcam spiegeln
    webcamCanvas.image(webcam, 0, 0, webcamWidth, webcamHeight); // Webcam platzieren    
    p.image(webcamCanvas, -webcamCanvas.width, 0); // Webcamfläche zeichnen
    //p.filter(p.GRAY);
    p.scale(-1, 1); // Spiegelung aufheben
    p.pop();

    //sichergehen, dass wie werte der Finger nicht unbekannt sind
    if (
      bodyPositionen != undefined &&
      bodyPositionen[11] != undefined &&
      bodyPositionen[12] != undefined &&
      bodyPositionen[15] != undefined &&
      bodyPositionen[16] != undefined &&
      bodyPositionen[19] != undefined &&
      bodyPositionen[20] != undefined &&
      bodyPositionen[27] != undefined &&
      bodyPositionen[28] != undefined
    ) {

      //Punkte erkennen
      wristL.x = p.map(bodyPositionen[15].x, 1, 0, 0, width);
      wristL.y = p.map(bodyPositionen[15].y, 0, 1, 0, height);

      wristR.x = p.map(bodyPositionen[16].x, 1, 0, 0, width);
      wristR.y = p.map(bodyPositionen[16].y, 0, 1, 0, height);

      fingerL.x = p.map(bodyPositionen[19].x, 1, 0, 0, width);
      fingerL.y = p.map(bodyPositionen[19].y, 0, 1, 0, height);

      fingerR.x = p.map(bodyPositionen[20].x, 1, 0, 0, width);
      fingerR.y = p.map(bodyPositionen[20].y, 0, 1, 0, height);

      ankleL.x = p.map(bodyPositionen[27].x, 1, 0, 0, width);
      ankleL.y = p.map(bodyPositionen[27].y, 0, 1, 0, height);

      ankleR.x = p.map(bodyPositionen[28].x, 1, 0, 0, width);
      ankleR.y = p.map(bodyPositionen[28].y, 0, 1, 0, height);

      shoulderL.x = p.map(bodyPositionen[11].x, 1, 0, 0, width);
      shoulderL.y = p.map(bodyPositionen[11].y, 0, 1, 0, height);

      shoulderR.x = p.map(bodyPositionen[12].x, 1, 0, 0, width);
      shoulderR.y = p.map(bodyPositionen[12].y, 0, 1, 0, height);


      //(Tracking-)Punkte zeichnen
      //p.punkteZeichnen();



      // ***Wasser***
      let wristL_Yspeed = wristL_lastPosition.y - wristL.y;
      let wristR_Yspeed = wristR_lastPosition.y - wristR.y;
      //let wirsts_avg_Yspeed = (wristL_Yspeed + wristR_Yspeed) /2;
      let wrists_avg_y = (wristL.y + wristR.y) / 2

      let wristDist = p.dist(wristL.x, wristL.y, wristR.x, wristR.y);
      let waterWidthFactor = p.map(wristDist, 0, 500, 0, 2);
      let waterHeightFactor = p.map(wrists_avg_y, 0, 500, 2, 0);

      shoulderCenter = p.createVector(((shoulderR.x + shoulderL.x) / 2), ((shoulderR.y + shoulderL.y) / 2))
      wristCenter = p.createVector(((wristR.x + wristL.x) / 2), ((wristR.y + wristL.y) / 2))

      wristL_lastPosition.y = wristL.y;
      wristR_lastPosition.y = wristR.y;

      if (((wristL.y - wristR.y) < 100) && wristL_Yspeed > 20 && wristR_Yspeed > 20) {
        water1Gif.setFrame(0);
        water1Gif.play();
        water2Gif.setFrame(0);
        water2Gif.play();
      }

      p.image(water1Gif, wristCenter.x - (600 * waterWidthFactor), height - (900 * waterHeightFactor), 1600 * waterWidthFactor, 900 * waterHeightFactor);
      p.image(water2Gif, wristCenter.x - (1000 * waterWidthFactor), height - (900 * waterHeightFactor), 1600 * waterWidthFactor, 900 * waterHeightFactor);


      // ***Erde*** 
      // linker Fuß
      let ankleL_speed = ankleL.y - ankleL_lastPosition.y;
      ankleL_lastPosition.y = ankleL.y;

      if (ankleL_speed >= 50) {
        earth1Gif.setFrame(0);
        earth1Gif.play();
      }
      p.image(earth1Gif, ankleL.x - 100 - 450, ankleL.y - 750, 450, 800);

      // rechter Fuß
      let ankleR_speed = ankleR.y - ankleR_lastPosition.y;
      ankleR_lastPosition.y = ankleR.y;

      if (ankleR_speed >= 50) {
        earth2Gif.setFrame(0);
        earth2Gif.play();
      }
      p.image(earth2Gif, ankleR.x + 100 - 0, ankleR.y - 750, 450, 800);


      // ***Feuer***
      //linke Hand
      let wristL_Xspeed = wristL_lastPosition.x - wristL.x;
      wristL_lastPosition.x = wristL.x;

      if (wristL_Xspeed >= 80) {
        fireLGif.setFrame(0);
        fireLGif.play();
      }
      p.image(fireLGif, wristL.x - 450, wristL.y - 150, 400, 225);

      //rechte Hand
      let wristR_Xspeed = wristR.x - wristR_lastPosition.x;
      wristR_lastPosition.x = wristR.x;

      if (wristR_Xspeed >= 80) {
        fireRGif.setFrame(0);
        fireRGif.play();
      }
      p.image(fireRGif, wristR.x + 50, wristR.y - 150, 400, 225);


      // ***Luft***

      // Größe berechnen
      let windSizeFactor = p.map(wristDist, 0, 500, 0, 2);

      wristCenter = p.createVector(((wristR.x + wristL.x) / 2), ((wristR.y + wristL.y) / 2));



      if (p.abs(fingerL.x - fingerR.x) < 50) {
        windCounter++;
        if (windCounter >= 20) {
          // Mitte berechnen und anzeigen
          windWasActive = true;
          p.image(windGif, wristCenter.x - (700 * windSizeFactor), wristCenter.y - (450 * windSizeFactor), 1600 * windSizeFactor, 900 * windSizeFactor);
        }

      } else {
        if (windWasActive) {
          wind2Gif.setFrame(0);
          wind2Gif.play();
        }
        if (windCounter > 0) {
          windCounter--;
        }
        p.image(wind2Gif, wristCenter.x - (700 * windSizeFactor), wristCenter.y - (450 * windSizeFactor), 1600 * windSizeFactor, 900 * windSizeFactor);
        windWasActive = false;
      }


    }
  }

  p.rainDraw = function () {
    p.background(0, 0, 0);     //hintergrundfarbe einstellen
    if (handPositionen[4] != undefined && handPositionen[8] != undefined) //prüfen, dass wie werte der Finger nicht unbekannt sind


    {
      zeigefinger.x = p.map(handPositionen[8].x, 1, 0, 0, width);
      zeigefinger.y = p.map(handPositionen[8].y, 0, 1, 0, height); /*---Hier wurde festgelegt, was passieren soll, wenn Finger von der Webcan erkannt wurden. als erstes werden die aktuelle Positionen der Finger eingelesen. die Zahlen [4] und [8] geben an, welche Punkte genau abgelesen werden. mit der MAP funktion wird die Position der Punkte an die Größe des Bildschirms angepasst---*/



      //p.punkteZeichnen(); //Funktion Kreise zeichnen, wo finger sind
      p.geschwindigkeitBerechnenRain(); // Funktion Geschwindigkeit
      p.regen();


    }
  }

  p.geschwindigkeitBerechnenRain = function () {

    let geschwindigkeit = p.abs(zeigefinger.y - letztePositionRain.y);
    letztePositionRain.y = zeigefinger.y;
    //p.text(p.int(geschwindigkeit), 100,100);
    if (geschwindigkeit <= 20) {
      if (regenStaerke <= 10) {
        regenStaerke = 0;
      } else {
        regenStaerke = regenStaerke - 10;
      }

    } else {
      regenStaerke = regenStaerke + geschwindigkeit / 5;
    }

    volumeRain = p.map(regenStaerke, 0, 50, 0, 1);
    sound.setVolume(volumeRain);
  }

  /*----------------------------------------------------
  Regen: hier definieren wir i darstellung des regens */

  p.regen = function () {
    for (let i = 0; i < regenStaerke; i++) {
      drops[i].fall();
      drops[i].show();
      //let bgColor = p.map(regenStaerke, 0, 499, 255, 2); // calculate background color based on rain intensity
      // p.background(bgColor);
    }
  }






  class Drop {
    constructor() {
      this.x = p.random(width);
      this.y = p.random(-500, -50);
      this.z = p.random(0, 20);
      this.len = p.map(this.z, 0, 20, 10, 20);
      this.yspeed = p.map(this.z, 0, 20, 1, 20);
      this.positions = [this.y, this.y, this.y, this.y];
    }

    fall() {
      this.positions.shift();
      this.positions.push(this.y);
      this.y += this.yspeed;
      let grav = p.map(this.z, 0, 20, 0, 0.2);
      this.yspeed += grav;
      if (this.y > height) {
        this.y = p.random(-200, -100);
        this.yspeed = p.map(this.z, 0, 20, 1, 20);
      }
    }

    show() {
      let thick = p.map(this.z, 0, 20, 1, 3);
      p.noStroke();
      for (let i = 0; i < 4; i++) {
        let alpha = p.map(i, 0, 2, 100, 255);
        let dropColor = p.color(180, alpha);
        p.fill(dropColor);
        p.ellipse(this.x, this.positions[i], thick, 20 + this.positions[i] * 0.05);
      }
    }
  }

  // FLIGOLIN START/////


  p.fligolinDraw = function () {
    //hintergrundfarbe einstellen
    p.background(255, 255, 255);

    p.imageMode(p.CENTER);

    let targetX = bildY;
    let dx = targetX - bildYsmooth;
    bildYsmooth += dx * easingBild;

    p.image(
      hintergrundBild,
      (400 * ratio) / 2,
      bildYsmooth,
      400 * ratio,
      10000 * ratio
    );

    //sichergehen, dass wie werte der Finger nicht unbekannt sind
    if (
      bodyPositionen != undefined &&
      bodyPositionen[19] != undefined &&
      bodyPositionen[20] != undefined &&
      bodyPositionen[13] != undefined &&
      bodyPositionen[14] != undefined &&
      bodyPositionen[11] != undefined &&
      bodyPositionen[12] != undefined &&
      bodyPositionen[15] != undefined &&
      bodyPositionen[16] != undefined &&
      bodyPositionen[23] != undefined &&
      bodyPositionen[24] != undefined &&
      bodyPositionen[0] != undefined &&
      bodyPositionen[25] != undefined &&
      bodyPositionen[26] != undefined &&
      bodyPositionen[27] != undefined &&
      bodyPositionen[28] != undefined &&
      bodyPositionen[29] != undefined &&
      bodyPositionen[30] != undefined
    ) {
      //Hier kann festgelegt, was passieren soll, wenn Finger von der Webcan erkannt wurden

      //als erstes werden die aktuelle Positionen der Finger eingelesen
      //(die Zahlen [4] und [8] geben an, welche Punkte genau abgelesen werden)
      //mit der MAP funktion wird die Position der Punkte an die Größe des Bildschirms angepasst
      punktA.x = p.map(bodyPositionen[19].x, 1, 0, 0, width);
      punktA.y = p.map(bodyPositionen[19].y, 0, 1, 0, height);

      punktB.x = p.map(bodyPositionen[20].x, 1, 0, 0, width);
      punktB.y = p.map(bodyPositionen[20].y, 0, 1, 0, height);

      punktC.x = p.map(bodyPositionen[13].x, 1, 0, 0, width);
      punktC.y = p.map(bodyPositionen[13].y, 0, 1, 0, height);

      punktD.x = p.map(bodyPositionen[14].x, 1, 0, 0, width);
      punktD.y = p.map(bodyPositionen[14].y, 0, 1, 0, height);

      punktE.x = p.map(bodyPositionen[11].x, 1, 0, 0, width);
      punktE.y = p.map(bodyPositionen[11].y, 0, 1, 0, height);

      punktF.x = p.map(bodyPositionen[12].x, 1, 0, 0, width);
      punktF.y = p.map(bodyPositionen[12].y, 0, 1, 0, height);

      punktG.x = p.map(bodyPositionen[15].x, 1, 0, 0, width);
      punktG.y = p.map(bodyPositionen[15].y, 0, 1, 0, height);

      punktH.x = p.map(bodyPositionen[16].x, 1, 0, 0, width);
      punktH.y = p.map(bodyPositionen[16].y, 0, 1, 0, height);

      punktI.x = p.map(bodyPositionen[23].x, 1, 0, 0, width);
      punktI.y = p.map(bodyPositionen[23].y, 0, 1, 0, height);

      punktJ.x = p.map(bodyPositionen[24].x, 1, 0, 0, width);
      punktJ.y = p.map(bodyPositionen[24].y, 0, 1, 0, height);

      punktK.x = p.map(bodyPositionen[0].x, 1, 0, 0, width);
      punktK.y = p.map(bodyPositionen[0].y, 0, 1, 0, height);

      punktL.x = p.map(bodyPositionen[25].x, 1, 0, 0, width);
      punktL.y = p.map(bodyPositionen[25].y, 0, 1, 0, height);

      punktM.x = p.map(bodyPositionen[26].x, 1, 0, 0, width);
      punktM.y = p.map(bodyPositionen[26].y, 0, 1, 0, height);

      punktN.x = p.map(bodyPositionen[27].x, 1, 0, 0, width);
      punktN.y = p.map(bodyPositionen[27].y, 0, 1, 0, height);

      punktO.x = p.map(bodyPositionen[28].x, 1, 0, 0, width);
      punktO.y = p.map(bodyPositionen[28].y, 0, 1, 0, height);

      punktP.x = p.map(bodyPositionen[29].x, 1, 0, 0, width);
      punktP.y = p.map(bodyPositionen[29].y, 0, 1, 0, height);

      punktQ.x = p.map(bodyPositionen[30].x, 1, 0, 0, width);
      punktQ.y = p.map(bodyPositionen[30].y, 0, 1, 0, height);

      //als nächstes führen wir eine selbst-geschriebene Funktion aus,die kreise dort zeichnet, wo gerade die Finger sind

      p.punkteZeichnen();
      p.abstandBerechnen();
      p.bildZwischenPunkten();
      p.geschwindigkeitBerechnen();
    }
  }

  p.punkteZeichnen = function () {
    //Kreise dort zeichnen, wo die finger gerade sind
    //funktion FILL gibt an, mit welcher farbe die kreise gefüllt werden soll
    //p.fill(66, 99, 245);
    //p.ellipse(punktA.x, punktA.y, 30, 30);
    //p.ellipse(punktB.x, punktB.y, 30, 30);
    //p.ellipse(punktC.x, punktC.y, 30, 30);
    //p.ellipse(punktD.x, punktD.y, 30, 30);
    //p.ellipse(punktE.x, punktE.y, 30, 30);
    //p.ellipse(punktF.x, punktF.y, 30, 30);
    //p.ellipse(punktG.x, punktG.y, 30, 30);
    //p.ellipse(punktH.x, punktH.y, 30, 30);
    //p.ellipse(punktI.x, punktI.y, 30, 30);
    //p.ellipse(punktJ.x, punktJ.y, 30, 30);
    //p.ellipse(punktK.x, punktK.y, 30, 30);
    //p.ellipse(punktL.x, punktL.y, 30, 30);
    //p.ellipse(punktM.x, punktM.y, 30, 30);
    //p.ellipse(punktN.x, punktN.y, 30, 30);
    //p.ellipse(punktO.x, punktO.y, 30, 30);
    //p.ellipse(punktP.x, punktP.y, 30, 30);
    //p.ellipse(punktQ.x, punktQ.y, 30, 30);
  };

  p.abstandBerechnen = function () {
    distanz = p.dist(punktE.x, punktE.y, punktF.x, punktF.y);
  };

  p.bildZwischenPunkten = function () {
    let mittelpunktRoh = p5.Vector.add(punktE, punktF).div(2);

    let targetX = mittelpunktRoh.x;
    let dx = targetX - mittelpunkt.x;
    mittelpunkt.x += dx * easing;

    let targetY = mittelpunktRoh.y;
    let dy = targetY - mittelpunkt.y;
    mittelpunkt.y += dy * easing;
  };

  p.bildZeichnen = function () {
    let distanz = p.dist(punktA.x, punktA.y, punktB.x, punktB.y);

    aktuellesBild = p.int(p.map(punktE.x, 0, width, 0, num_imgs - 1));
    aktBildgrenze = p.constrain(aktuellesBild, 0, num_imgs - 1);

    // p.image(imgs[aktBildgrenze], 0, 0, width, height);
  };

  p.geschwindigkeitBerechnen = function () {
    //hier berechnen wir geschwindigkeit von dem y-Wert von einer hand (wie doll bewegt sich die hand auf und ab?)
    let geschwindigkeit = p.abs(punktA.y - letztePosition.y);
    letztePosition.y = punktA.y;

    if (zielErreicht == false) {
      if (geschwindigkeit <= 20) {
        if (bildY <= -(10000 * ratio) / 2 + height) {

          bildY = -(10000 * ratio) / 2 + height;

          let breiteZuhoehe = bild.width / bild.height;

          let neigungswinkel = p.atan2(
            punktF.y - punktE.y,
            punktF.x - punktE.x
          );

          p.push();
          p.translate(mittelpunkt.x, mittelpunkt.y);
          p.rotate(neigungswinkel);
          p.image(bild, 0, 0, breiteZuhoehe * distanz*1.4, distanz*1.4);
          p.pop();

        } else {
          bildY = bildY - 20;

          let breiteZuhoehe = bild.width / bild.height;

          let neigungswinkel = p.atan2(
            punktF.y - punktE.y,
            punktF.x - punktE.x
          );

          p.push();
          p.translate(mittelpunkt.x, mittelpunkt.y);
          p.rotate(neigungswinkel);
          p.image(bild, 0, 0, breiteZuhoehe * distanz*1.4, distanz*1.4);
          p.pop();
        }
      } else {
        bildY = bildY + 120;
        aktuellesBild = p.frameCount % 3;

        let breiteZuhoehe = bild.width / bild.height;

        let neigungswinkel = p.atan2(punktF.y - punktE.y, punktF.x - punktE.x);

        p.push();
        p.translate(mittelpunkt.x, mittelpunkt.y);
        p.rotate(neigungswinkel);
        p.image(imgs[aktuellesBild], 0, 0, breiteZuhoehe * distanz*1.4, distanz*1.4);
        p.pop();
      }
    } else {

      bildY = (10000 * ratio) / 2;


      let breiteZuhoehe = bild.width / bild.height;

      let neigungswinkel = p.atan2(punktF.y - punktE.y, punktF.x - punktE.x);

      p.push();
      p.translate(mittelpunkt.x, mittelpunkt.y);
      p.rotate(neigungswinkel);
      p.image(imgs[aktuellesBild], 0, 0, breiteZuhoehe * distanz*1.4, distanz*1.4);
      p.pop();


    }

    if (bildY >= (10000 * ratio) / 2) {
      zielErreicht = true;


    }

    //p.text(bildY, 20, 20);
    //p.text((10000 * ratio) / 2, 20, 50);
    //p.fill(255);
    //p.ellipse(punktA.x, height-hintergrund, 30, 30);
  };


  // FLIGOLIN END

  p.mousePressed = function () {

    //p.fligolinSetup();
/*     if (currentSketch < 3) {
      currentSketch = currentSketch + 1;
    } else {
      currentSketch = 0;
    } */

  }


  p.taschenmesserDraw = function () {
    p.background("#38E6FF");

    if (bodyPositionen != undefined && bodyPositionen[16] != undefined && bodyPositionen[15] != undefined) {

      punktA.x = p.map(bodyPositionen[20].x, 1, 0, 0, width);
      punktA.y = p.map(bodyPositionen[20].y, 0, 1, 0, height);

      punktB.x = p.map(bodyPositionen[26].x, 1, 0, 0, width);
      punktB.y = p.map(bodyPositionen[26].y, 0, 1, 0, height);

      punktD.x = p.map(bodyPositionen[15].x, 1, 0, 0, width);
      punktD.y = p.map(bodyPositionen[15].y, 0, 1, 0, height);

      punktC.x = p.map(bodyPositionen[27].x, 1, 0, 0, width);
      punktC.y = p.map(bodyPositionen[27].y, 0, 1, 0, height);
      //ken fuß links

      punktE.x = p.map(bodyPositionen[28].x, 1, 0, 0, width);
      punktE.y = p.map(bodyPositionen[28].y, 0, 1, 0, height);

      let gabelrotation = p.map(punktA.x, width / 2, width, 0, -360);

      // Gabel
      p.imageMode(p.CORNER);

      p.push(); // ab hier wird rotiert
      p.translate(width / 2 + 50, height*0.35);
      p.rotate(p.radians(gabelrotation)); // rotieren um 20 Grad
      p.image(objekt1, 0, 0, 45, 250); // Gabel
      p.pop(); // rotieren beenden



      // bild wird von Handbewegung links nach rechts zu Rotatin von 180 bis 0 Grad übersetzt
      let fingerrotation = p.map(punktD.x, width / 2, 0, 0, 360);

      //flutschfinger 
      p.imageMode(p.CORNER);
      p.push(); // ab hier wird rotiert
      p.translate(width / 2 + 50, height*0.34);
      p.rotate(p.radians(fingerrotation)); // rotieren um 20 Grad
      p.image(finger, 0, 0, 90, 250); // Größe vom Finger
      p.pop(); // rotieren beenden


      let kenrotation = p.map(punktC.x, width / 2, width, 0, -140);

      //ken
      p.imageMode(p.CORNER);

      p.push(); // ab hier wird rotiert
      p.translate(width / 2 + 15, height*0.45);
      p.rotate(p.radians(kenrotation)); // rotieren um 20 Grad
      p.image(ken, 0, 0, 120, 250); // Gabel
      p.pop(); // rotieren beenden


      let zigarettenrotation = p.map(punktE.x, width / 2, width, -90, 90);

      //zigartette rechtes knie
      p.imageMode(p.CORNER);

      p.push(); // ab hier wird rotiert
      p.translate(width / 2 + 50, height*0.55);
      p.rotate(p.radians(zigarettenrotation)); // rotieren um 20 Grad
      p.image(zigarette, 0, 0, 200, 80); // zigarette

      p.pop(); // rotieren beenden

    }

    // zeichne den Körper vom Messer über allem anderen
    p.imageMode(p.CENTER);
    p.image(messerbild, width / 2, height / 2, 700, 450); // Messerkörper
  }

  p.windowResized = function () {
    width = window.innerWidth;
    height = window.innerHeight;
  }

}

let myp5 = new p5(sketch);