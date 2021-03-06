class Stage {
    player: Player;
    enemy: Player;
    bullets: Bullet[];
    shieldIndex: {[position: string]: number};
    ledMap: LEDMap;
    isEnd: boolean;
    fps: number;

    constructor() {
        this.player = new Player();
        this.enemy = new Bot();
        this.bullets = [];
        this.shieldIndex = {};
        this.ledMap = new LEDMap(null);
        this.isEnd = false;
        this.fps = 240;

        this.enemy.goLeft();
    }

    startLoop() {
        this.player.goRight();
        this.player.startLoopInBackground(this.bullets);
        this.enemy.startLoopInBackground(this.bullets);

        while (!this.isEnd) {
            this.plotPlayerOnLEDMap();
            this.plotEnemyOnLEDMap();
            this.plotBulletsOnLEDMap();
            this.ledMap.show();
            this.judgeIssue();
            this.ledMap.clear();

            basic.pause(1000/this.fps);
        }
    }

    exitLoop() {
        this.player.isEnd = true;
        this.enemy.isEnd = true;
        this.bullets.forEach((b, i) => {
            if (b != null) {
                b.isEnd = true;
            }
        });
        this.isEnd = true;
    }

    plotBulletsOnLEDMap() {
        for (let i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i] == null) {
                continue;
            } else if (this.bullets[i].isEnd) {
                this.bullets.splice(i, 1);
            } else if (this.bullets[i].speed == 0) {
                this.shieldIndex[this.bullets[i].position.join(",")] = i;
                this.ledMap.stack(this.bullets[i].getLEDMap());
            } else {
                if (this.shieldIndex[this.bullets[i].position.join(",")] != null) {
                    // this.bullets.splice(this.shieldIndex[this.bullets[i].position.join(",")], 1);
                    this.bullets[this.shieldIndex[this.bullets[i].position.join(",")]] = null;
                    this.bullets[i].isEnd = true;
                    delete this.shieldIndex[this.bullets[i].position.join(",")];
                } else {
                    this.ledMap.stack(this.bullets[i].getLEDMap());
                }
            }
        }
    }

    plotPlayerOnLEDMap() {
        this.ledMap.plotBrightness(
            this.player.position[0],
            this.player.position[1],
            this.player.brightness
        );
    }

    plotEnemyOnLEDMap() {
        this.ledMap.plotBrightness(
            this.enemy.position[0],
            this.enemy.position[1],
            this.enemy.brightness
        );
    }

    judgeIssue() {
        if (
            this.player.brightness <
            this.ledMap.map[this.player.position[0]][this.player.position[1]]
        ) {
            basic.pause(500);
            basic.showIcon(IconNames.Sad, 500);
            this.exitLoop();
        } else if (
            this.enemy.brightness <
            this.ledMap.map[this.enemy.position[0]][this.enemy.position[1]]
        ) {
            basic.pause(500);
            basic.showIcon(IconNames.Happy, 500);
            this.exitLoop();
        }
    }
}

interface MenuEntry {
    icon: LEDMap,
    value: any,
    isVisible: boolean
}

class Menu extends Stage {
    entries: MenuEntry[];
    entryDotBrightness: number;
    iconBrightness: number;

    constructor() {
        super();
        this.entries = [];
        this.entryDotBrightness =50;
        this.iconBrightness = 180;
    }

    startLoop(): MenuEntry {
        this.player.startLoopInBackground(this.bullets);
        this.entries.forEach((e, i) => {
            e.icon.changeBrightness(this.iconBrightness);
        });

        let entry: MenuEntry;
        while (!this.isEnd) {
            this.plotEntriesOnLEDMap();
            this.plotPlayerOnLEDMap();
            this.plotBulletsOnLEDMap();
            this.ledMap.show();
            
            for (
                let x = 0;
                x < LED_NUMBER &&
                x < this.entries.length;
                x++
            ) {
                if (
                    255 < this.ledMap.map[x][0] &&
                    this.entries[x].isVisible
                ) {
                    basic.pause(500);
                    entry = this.entries[x];
                    this.exitLoop();
                }
            }
            
            this.ledMap.clear();
            basic.pause(1000 / this.fps);
        }

        return entry;
    }

    plotEntriesOnLEDMap() {
        for (
            let x = 0;
            x < LED_NUMBER &&
            x < this.entries.length;
            x++
        ) {
            if (this.entries[x].isVisible) {
                this.ledMap.plotBrightness(x, 0, this.entryDotBrightness);
            }
        }

        if (
            this.player.position[0] < this.entries.length &&
            this.entries[this.player.position[0]].isVisible
        ) {
            this.ledMap.stack(this.entries[this.player.position[0]].icon);
        }
    }

    addEntry(entry: MenuEntry) {
        entry.icon.changeBrightness(this.iconBrightness);
        this.entries.push(entry);
    }

    addSpacer() {
        this.entries.push({
            icon: new LEDMap(null),
            value: null,
            isVisible: false,
        });
    }
}

class LoadingScreen {
    isEnd: boolean;
    ledMap: LEDMap;
    point: number[];
    fps: number;

    constructor() {
        this.isEnd = false;
        this.ledMap = new LEDMap(null);
        this.point = [1, 1];
        this.fps = 8;
    }

    startLoop() {
        for (let i = 0; i < 9 && !this.isEnd; i++) {
            if (i < 2) {
                this.point[0]++;
            } else if (i < 4) {
                this.point[1]++;
            } else if (i < 6) {
                this.point[0]--;
            } else if (i < 8) {
                this.point[1]--;
            } else {
                i = -1;
                continue;
            }
            this.reshowPoint();
            basic.pause(1000 / this.fps);
        }
    }

    reshowPoint() {
        this.ledMap = new LEDMap([
            [0,   0,   0,   0, 0],
            [0, 255, 255, 255, 0],
            [0, 255,   0, 255, 0],
            [0, 255, 255, 255, 0],
            [0,   0,   0,   0, 0],
        ]);
        this.ledMap.plotBrightness(this.point[0], this.point[1], 50);
        this.ledMap.show();
    }
}