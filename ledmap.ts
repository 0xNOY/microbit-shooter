class LEDMap {
    map: number[][];

    constructor(map: number[][] | null) {
        if (map == null || !this.isValidMap(map)) {
            map = this.generateEmptyMap();
        }
        this.map = map;
    }

    show() {
        for (let x = 0; x < LED_NUMBER; x++) {
            for (let y = 0; y < LED_NUMBER; y++) {
                led.plotBrightness(x, y, this.map[x][y]);
            }
        }
    }

    plotBrightness(x: number, y: number, brightness: number) {
        if (
            0 <= x && x < LED_NUMBER &&
            0 <= y && y < LED_NUMBER
        ) {
            this.map[x][y] = brightness;
        }
    }

    plot(x: number, y: number) {
        this.plotBrightness(x, y, 255);
    }

    clear() {
        this.map = this.generateEmptyMap();
    }

    stack(newLEDMap: LEDMap) {
        for (let x = 0; x < LED_NUMBER; x++) {
            for (let y = 0; y < LED_NUMBER; y++) {
                this.map[x][y] += newLEDMap.map[x][y];
            }
        }
    }

    changeBrightness(brightness: number) {
        for (let x = 0; x < LED_NUMBER; x++) {
            for (let y = 0; y < LED_NUMBER; y++) {
                this.map[x][y]
                    = this.map[x][y] == 0 ? 0 : brightness; 
            }
        }
    }

    private isValidMap(map: number[][]): boolean {
        let x = 0;
        if (map.length == LED_NUMBER) {
            for (; x < LED_NUMBER; x++) {
                if (map[x].length != LED_NUMBER) {
                    break;
                }
            }
        }
        if (x == LED_NUMBER) {
            return true;
        }
        return false;
    }

    private generateEmptyMap(): number[][] {
        let emptyMap: number[][] = [];
        for (let x = 0; x < LED_NUMBER; x++) {
            emptyMap.push([]);
            for (let y = 0; y < LED_NUMBER; y++) {
                emptyMap[x].push(0);
            }
        }
        return emptyMap;
    }
}
