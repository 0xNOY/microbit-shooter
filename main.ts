const LED_NUMBER = 5;

enum RemoteSystemCommands {
    StartGame = 10,
}

const menu = new Menu();
menu.addSpacer();
menu.addEntry({
    icon: new LEDMap([
        [0, 0, 0, 0, 0],
        [0, 1, 0 ,0 ,0],
        [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ]),
    value: 1,
    isVisible: true,
});
menu.addSpacer();
menu.addEntry({
    icon:new LEDMap([
        [0, 0, 0, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 0, 1, 0, 1],
        [1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0]
    ]),
    value: 2,
    isVisible: true,
});
const playerNumber = menu.startLoop().value;

const stage = new Stage();
if (playerNumber == 1) {
    stage.startLoop();
} else {
    const loadingScreen = new LoadingScreen();
    control.inBackground(() => loadingScreen.startLoop());
    
    stage.enemy = new RemotePlayer();
    stage.player.shouldSendCommand = true;

    radio.setGroup(1);
    while (true) {
        if (radio.receiveNumber() == RemoteSystemCommands.StartGame) {
            radio.sendNumber(RemoteSystemCommands.StartGame);
            break;
        }
        radio.sendNumber(RemoteSystemCommands.StartGame);
        basic.pause(1);
    }

    loadingScreen.isEnd = true;
    basic.pause(1);

    for (let i = 3; 0 <= i; i--) {
        basic.showNumber(i, 200);
    }
    basic.clearScreen();

    stage.startLoop();
}