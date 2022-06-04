enum RemotePlayerCommands {
    shot = 100,
    goRight,
    goLeft,
}

class Player {
    position: number[];
    moveSpeed: number;
    shootingSpeed: number;
    brightness: number;
    isEnd: boolean;
    direction: number; // 0: Down, 1: Up
    shouldSendCommand: boolean;

    constructor() {
        this.position = [2, 4];
        this.moveSpeed = 6;
        this.shootingSpeed = 1.5;
        this.brightness = 100;
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
            basic.pause(1000 / this.moveSpeed);
        }
    }

    startShootingLoop(bullets: Bullet[]) {
        while (!this.isEnd) {
            this.shootingAction(bullets);
            basic.pause(1000 / this.shootingSpeed);
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
                bullets.push(this.shot());
                break;
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

    shot(): Bullet {
        this.sendCommand(RemotePlayerCommands.shot);
        let bullet = new Bullet();
        bullet.position = this.position.slice();
        bullet.position[1] += this.direction == 0 ? bullet.size-1 : -bullet.size+1;
        bullet.direction = this.direction;
        control.inBackground(() => {bullet.loop()});
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

    movingAction() {
        let movingFlag = randint(1, 100);
        if (movingFlag <= 40) {
            this.goRight();
        } else if (movingFlag <= 80) {
            this.goLeft();
        }
    }

    shootingAction(bullets: Bullet[]) {
        if (randint(1, 100) <= 70) {
            bullets.push(this.shot());
        }
    }

}

class RemotePlayer extends Bot {
    startLoopInBackground(bullets: Bullet[]) {
        control.inBackground(() => {
            while (!this.isEnd) {
                const command = radio.receiveNumber();
                switch (command) {
                    case RemotePlayerCommands.goRight:
                        this.goRight();
                        break;
                    case RemotePlayerCommands.goLeft:
                        this.goLeft();
                        break;
                    case RemotePlayerCommands.shot:
                        bullets.push(this.shot());
                }
                basic.pause(1);
            }
        });
    }
}