class SceneContainer extends createjs.Container {
    private sceneData: SceneData;
    private imageCount: number;
    private readonly backgroundContainer: createjs.Container;
    private bitmap: createjs.Bitmap;
    private removeBitmap: createjs.Bitmap;

    constructor() {
        super();
        this.backgroundContainer = new createjs.Container();
        this.addChild(this.backgroundContainer);
    }

    public setSceneData(value: SceneData) {
        this.sceneData = value;
        this.imageCount = 0;

        const textField = new createjs.Text();
        textField.color = "#CCCCCC";
        textField.font = "64px Futura PT Book";
        textField.text = this.sceneData.getText();
        this.addChild(textField);
    }

    public startTween() {
        this.addImage();
    }

    private addImage() {
        const imageData = this.sceneData.getXmlImageDataList()[this.imageCount].getImageData();
        this.bitmap = new createjs.Bitmap(imageData);
        this.bitmap.x = 640;
        this.backgroundContainer.addChild(this.bitmap);

        this.setTween();
    }

    private setTween() {
        const handler = () => {
            this.tweenCompleteHandler();
        };

        if (this.removeBitmap) {
            const timeline = new createjs.Timeline();
            timeline.addTween(createjs.Tween.get(this.removeBitmap).to({x: -640}, 1200, createjs.Ease.cubicIn));
            timeline.addTween(createjs.Tween.get(this.bitmap).
            wait(800).to({x: 0}, 1200, createjs.Ease.cubicOut).call(handler));
        } else {
            createjs.Tween.get(this.bitmap).to({x: 0}, 1200, createjs.Ease.cubicOut).call(handler);
        }
    }

    private tweenCompleteHandler() {
        if (this.removeBitmap) {
            this.backgroundContainer.removeChild(this.removeBitmap)
        }
        this.removeBitmap = this.bitmap;
        this.imageCount++;
        if (this.imageCount >= this.sceneData.getXmlImageDataList().length) {
            const event = new createjs.Event("scene_container_complete", false , false);
            this.dispatchEvent(event);
        } else {
            this.addImage();
        }
    }
}
