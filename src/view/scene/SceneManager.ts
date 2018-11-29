class SceneManager extends createjs.Container {
    private sceneDataList: SceneData[];
    private sceneCount: number;
    //
    private sceneContainer: SceneContainer;
    private removeSceneContainer: SceneContainer;

    constructor() {
        super();

        const shape = new createjs.Shape();
        this.addChild(shape);
        const g = shape.graphics;
        g.beginFill("red");
        g.drawCircle(200, 200, 20);
    }

    public start() {
        const modelManager = ModelManager.getInstance();
        this.sceneDataList = modelManager.sceneDataList;
        this.sceneCount = 0;
        this.addScene();
    }

    private addScene() {
        const handler = () => {
            this.sceneContainerCompleteHandler();
        }
        const sceneData = this.sceneDataList[this.sceneCount];
        this.sceneContainer = new SceneContainer();
        this.sceneContainer.setSceneData(sceneData);
        this.sceneContainer.addEventListener("scene_container_complete", handler);
        this.sceneContainer.y = -480;
        this.addChild(this.sceneContainer);

        this.setTween();
    }

    private setTween() {
        const handler = (event) => {
            this.tweenCompleteHandler(event);
        };

        if (this.removeSceneContainer) {
            const timeline = new createjs.Timeline();
            timeline.addTween(createjs.Tween.get(this.removeSceneContainer).to({y: -480}, 1200, createjs.Ease.cubicIn));
            timeline.addTween(createjs.Tween.get(this.sceneContainer).
            wait(800).to({y: 0}, 1200, createjs.Ease.cubicOut).call(handler));
        } else {
            createjs.Tween.get(this.sceneContainer).to({y: 0}, 1200, createjs.Ease.cubicOut).call(handler);
        }
    }
    private tweenCompleteHandler(event) {
        this.sceneContainer.startTween();

        if (this.removeSceneContainer) {
            this.removeChild(this.removeSceneContainer);
        }
        this.removeSceneContainer = this.sceneContainer;
    }
    private sceneContainerCompleteHandler() {
        this.nextScene();
    }

    private nextScene() {
        this.sceneCount++;
        if (this.sceneCount >= this.sceneDataList.length) {
            this.sceneCount = 0;
        }
        this.addScene();
    }
}
