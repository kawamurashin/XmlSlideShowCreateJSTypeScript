class ViewManager extends createjs.Container {
    private ball: createjs.Container;
    private count: number = 0;
    private RADIUS: number = 150;
    private  sceneManager: SceneManager;

    constructor() {
        super();

        this.name = "ViewManager";
        const sky: createjs.Shape = new createjs.Shape();
        stage.addChild(sky);
        sky.graphics.beginLinearGradientFill(["#0069A0", "#00AAE4"], [0, 1], 0, 0, 0, 480);
        sky.graphics.drawRect(0, 0, 640, 480);
    }

    public start() {
        this.sceneManager = new SceneManager();
        this.addChild(this.sceneManager);
        this.sceneManager.start();

        this.ball = new createjs.Container();
        stage.addChild(this.ball);

        const shape = new createjs.Shape();
        this.ball.addChild(shape);
        const g = shape.graphics;
        g.beginFill("red");
        g.drawCircle(0, 0, 20);

        this.ball.x = 320 + this.RADIUS * Math.cos(this.count);
        this.ball.y = 240 + this.RADIUS * Math.sin(this.count);
    }

    public enterFrame() {
        if (this.ball) {
            this.count += 0.01;
            this.ball.x = 320 + this.RADIUS * Math.cos(8 * this.count);
            this.ball.y = 240 + this.RADIUS * Math.sin(16 * this.count);
        }
    }
}
