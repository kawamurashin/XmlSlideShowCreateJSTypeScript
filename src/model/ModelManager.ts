class ModelManager extends createjs.EventDispatcher {

    public static getInstance() {
        if (this.instance == null) {
            this.instance = new ModelManager();
        }
        return this.instance;
    }

    private static instance: ModelManager;

    private static handleFileProgress() {
        return null;
    }

    public sceneDataList: SceneData[];

    constructor() {
        super();
    }

    public loadStart() {
        const handler = (e) => {
            this.dataXmlLoadCompleteHandler(e);
        };
        const path: string = "data/data.xml?random=" + Math.random();
        const preload: createjs.LoadQueue = new createjs.LoadQueue();
        preload.addEventListener("fileprogress", ModelManager.handleFileProgress);
        preload.addEventListener("fileload", handler);
        preload.loadFile({src: path, type: "xml"});
    }

    private dataXmlLoadCompleteHandler(event) {
        const xml: XMLDocument = event.result;
        this.sceneDataList = [];
        //
        const scenesNode: Element = xml.getElementsByTagName("scenes")[0];
        const sceneNodeList: HTMLCollection = scenesNode.getElementsByTagName("scene");
        const n = sceneNodeList.length;
        for (let i = 0; i < n; i++) {
            const sceneNode: Element = sceneNodeList[i];

            const sceneData: SceneData = new SceneData();
            sceneData.setXmlNode(sceneNode);
            //
            this.sceneDataList.push(sceneData);
        }
        const handler = () => {
            this.imageLoadCompleteHandler();
        };
        const imageLoaderManager: ImageLoaderManager = new ImageLoaderManager();
        imageLoaderManager.addEventListener("complete", handler);
        imageLoaderManager.loadStart(this.sceneDataList);
    }

    private imageLoadCompleteHandler() {
        const createJSEvent: createjs.Event = new createjs.Event("load_complete", false, false);
        this.dispatchEvent(createJSEvent);
    }
}
