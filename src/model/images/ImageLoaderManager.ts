class ImageLoaderManager extends createjs.EventDispatcher {
    private imageCount: number = 0;
    private sceneCount: number = 0;
    private sceneDataList: SceneData[];

    constructor() {
        super();
    }

    public loadStart(sceneDataList: SceneData[]): void {
        this.sceneDataList = sceneDataList;
        this.initSceneLoad();
    }

    private initSceneLoad(): void {
        this.sceneCount = 0;
        this.setSceneLoad();
    }

    private setSceneLoad(): void {
        this.initImageLoad();
    }

    private initImageLoad(): void {
        this.imageCount = 0;
        this.setImageLoad();
    }

    private setImageLoad(): void {
        const handleFileCompleted = (event) => {
            this.imageLoadCompleteHandler(event);
        };
        const sceneData: SceneData = this.sceneDataList[this.sceneCount];
        const xmlImageData: XmlImageData = sceneData.getXmlImageDataList()[this.imageCount];
        const path: string = xmlImageData.getPath();
        const loader: createjs.LoadQueue = new createjs.LoadQueue();
        loader.addEventListener("fileload", handleFileCompleted);
        loader.loadFile({src: path, type: "image"});
    }

    private imageLoadCompleteHandler(event): void {
        const imagData: ImageData = event.result;
        const xmlImageData: XmlImageData = this.sceneDataList[this.sceneCount].getXmlImageDataList()[this.imageCount];
        xmlImageData.setImageData(imagData);
        this.imageCount++;
        if (this.imageCount >= this.sceneDataList[this.sceneCount].getXmlImageDataList().length) {
            this.sceneLoadComplete();
        } else {
            this.setImageLoad();
        }
    }

    private sceneLoadComplete(): void {
        this.sceneCount++;
        if (this.sceneCount >= this.sceneDataList.length) {
            this.loadComplete();
        } else {
            this.setSceneLoad();
        }
    }

    private loadComplete(): void {
        const event = new createjs.Event("complete", false, false);
        this.dispatchEvent(event);
    }
}
