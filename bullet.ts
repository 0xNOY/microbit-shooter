class Bullet {
    speed: number;
    direction: number; // 0: down, 1: up
    position: number[];
    size: number;
    brightness: number;
    isEnd: boolean;

    constructor() {
        this.speed = 5;
        this.direction = 1;
        this.position = [0, 0];
        this.size = 1;
        this.brightness = 255;
        this.isEnd = false;
    }

    loop() {
        while (!this.isEnd) {
            this.proceed();
            basic.pause(1000 / this.speed);
        }
    }

    getLEDMap(): LEDMap {
        if (this.isEnd) {
            return new LEDMap(null);
        }

        let ledMap = new LEDMap(null);
        if (this.direction == 0){
            for (
                let y = this.position[1];
                this.position[1] - this.size < y &&
                0 <= y;
                y--
            ) {
                ledMap.plotBrightness(this.position[0], y, this.brightness);
            }
        } else {
            for (
                let y = this.position[1];
                y < this.position[1] + this.size &&
                y < LED_NUMBER;
                y++
            ) {
                ledMap.plotBrightness(this.position[0], y, this.brightness);
            }
        }
        return ledMap;
    }

    proceed() {
            if (this.direction == 0) {
                if (this.position[1] < LED_NUMBER-1) {
                    this.position[1]++;
                } else {
                    this.isEnd = true;
                    this.size = 0;
                }
           } else {
               if (0 < this.position[1]) {
                   this.position[1]--;
               } else {
                   this.isEnd = true;
                   this.size = 0;
               }
           }
    }
}       