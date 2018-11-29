let canvas: Element;
let stage: createjs.Stage;

class Main {
    private readonly controllerManager: ControllerManager;

    constructor() {
        canvas = document.getElementById("main");
        stage = new createjs.Stage(canvas);

        this.controllerManager = new ControllerManager();
        stage.addChild(this.controllerManager);

        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update);
    }

    public update = (): void => {
        this.controllerManager.enterFrame();
        stage.update();
    }
}
window.addEventListener("load", () => {
    const main = new Main();
});
