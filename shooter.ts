enum RemotePlayerCommands {
    shotA = 100,
    shotB,
    goRight,
    goLeft,
}

class Player {
    position: number[];
    movingSpeed: number;
    shootingASpeed: number;
    shootingBSpeed: number;
    brightness: number;
    isEnd: boolean;
    direction: number; // 0: Down, 1: Up
    shouldSendCommand: boolean;

    constructor() {
        this.position = [2, 4];
        this.movingSpeed = 4;
        this.shootingASpeed = 1.2;
        this.shootingBSpeed = 0.5;
        this.brightness = 50;
        this.isEnd = false;
        this.direction = 1;
        this.shouldSendCommand = false;
    }

    startLoopInBackground(bullets: Bullet[]) {
        control.inBackground(() => {this.startMovingLoop()});
        control.inBackground(() => {this.startShootingLoop(bullets)});
    }

    startMovingLoop() {
        while (!this.isEnd) {
            this.movingAction();
            basic.pause(1000 / this.movingSpeed);
        }
    }

    startShootingLoop(bullets: Bullet[]) {
        while (!this.isEnd) {
            this.shootingAction(bullets);
            basic.pause(1000 / this.shootingASpeed);
        }
    }

    movingAction() {
        if (input.isGesture(Gesture.TiltRight)) {
            this.goRight();
        } else if (input.isGesture(Gesture.TiltLeft)) {
            this.goLeft();
        }
    }

    shootingAction(bullets: Bullet[]) {
        while (!this.isEnd) {
            if (input.buttonIsPressed(Button.A)) {
                bullets.push(this.shotA());
                break;
            } else if (input.buttonIsPressed(Button.B)) {
                bullets.push(this.shotB());
                basic.pause(1000/this.shootingBSpeed);
            }
            basic.pause(1);
        }
    }

    goRight() {
        this.sendCommand(RemotePlayerCommands.goRight);
        if (this.position[0] < LED_NUMBER-1) {
            this.position[0]++;
        }
    }

    goLeft() {
        this.sendCommand(RemotePlayerCommands.goLeft);
        if (0 < this.position[0]) {
            this.position[0]--;
        }
    }

    shotA(): Bullet {
        this.sendCommand(RemotePlayerCommands.shotA);
        let bullet = new Bullet();
        bullet.position = this.position.slice();
        bullet.position[1] += this.direction == 0 ? bullet.size : -bullet.size;
        bullet.direction = this.direction;
        control.inBackground(() => {bullet.loop()});
        return bullet;
    }

    shotB(): Bullet {
        this.sendCommand(RemotePlayerCommands.shotB);
        let bullet = new Shield();
        bullet.position = this.position.slice();
        bullet.position[1] += this.direction == 0 ? bullet.size : -bullet.size;
        bullet.direction = this.direction;
        control.inBackground(() => { bullet.loop() });
        return bullet;
    }

    sendCommand(command: RemotePlayerCommands) {
        if (this.shouldSendCommand) {
            radio.sendNumber(command);
        }
    }
}

class Bot extends Player {
    constructor() {
        super();
        this.direction = 0;
        this.position = [2, 0];
    }

    startShootingLoop(bullets: Bullet[]) {
        basic.pause(500);
        super.startShootingLoop(bullets);
    }

    movingAction() {
        let movingFlag = randint(1, 100);
        if (movingFlag <= 25) {
            this.goRight();
        } else if (movingFlag <= 65) {
            this.goLeft();
        } else if (movingFlag <= 75) {
            for (let i = 0; i < 3; i++) {
                this.goRight();
                basic.pause(1000/this.movingSpeed);
            }
        } else if (movingFlag <= 80) {
            for (let i = 0; i < 3; i++) {
                this.goLeft();
                basic.pause(1000 / this.movingSpeed);
            }
        }
    }

    shootingAction(bullets: Bullet[]) {
        let flag = randint(1, 100);
        if (flag <= 15) {
            bullets.push(this.shotB());
        } else if (flag <= 70) {
            bullets.push(this.shotA());
        }
    }

}

class RemotePlayer extends Bot {
    startLoopInBackground(bullets: Bullet[]) {
        control.inBackground(() => {
            while (!this.isEnd) {
                const command = radio.receiveNumber();
                switch (command) {
                    case RemotePlayerCommands.goLeft:
                        this.goRight();
                        break;
                    case RemotePlayerCommands.goRight:
                        this.goLeft();
                        break;
                    case RemotePlayerCommands.shotA:
                        bullets.push(this.shotA());
                        break;
                    case RemotePlayerCommands.shotB:
                        bullets.push(this.shotB());
                        break;
                }
                basic.pause(1);
            }
        });
    }
}