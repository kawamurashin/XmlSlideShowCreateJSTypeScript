class ControllerManager extends createjs.Container {
    private readonly modelManager: ModelManager;
    private readonly viewManager: ViewManager;
    constructor() {
        super();
        this.name = "ControllerManager";
        const handler = () => {
            this.modelLoadCompleteHandler();
        };
        this.modelManager = ModelManager.getInstance();
        this.modelManager.addEventListener("load_complete", handler);
        this.viewManager = new ViewManager();
        this.addChild(this.viewManager);
        this.modelManager.loadStart();
    }

    public enterFrame() {
        this.viewManager.enterFrame();
    }

   private  modelLoadCompleteHandler() {
        this.viewManager.start();
    }
}
