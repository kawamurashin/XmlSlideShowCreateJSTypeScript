var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var canvas;
var stage;
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.update = function () {
            _this.controllerManager.enterFrame();
            stage.update();
        };
        canvas = document.getElementById("main");
        stage = new createjs.Stage(canvas);
        this.controllerManager = new ControllerManager();
        stage.addChild(this.controllerManager);
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", this.update);
    }
    return Main;
}());
window.addEventListener("load", function () {
    var main = new Main();
});
var ControllerManager = /** @class */ (function (_super) {
    __extends(ControllerManager, _super);
    function ControllerManager() {
        var _this = _super.call(this) || this;
        _this.name = "ControllerManager";
        var handler = function () {
            _this.modelLoadCompleteHandler();
        };
        _this.modelManager = ModelManager.getInstance();
        _this.modelManager.addEventListener("load_complete", handler);
        _this.viewManager = new ViewManager();
        _this.addChild(_this.viewManager);
        _this.modelManager.loadStart();
        return _this;
    }
    ControllerManager.prototype.enterFrame = function () {
        this.viewManager.enterFrame();
    };
    ControllerManager.prototype.modelLoadCompleteHandler = function () {
        this.viewManager.start();
    };
    return ControllerManager;
}(createjs.Container));
var ModelManager = /** @class */ (function (_super) {
    __extends(ModelManager, _super);
    function ModelManager() {
        return _super.call(this) || this;
    }
    ModelManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ModelManager();
        }
        return this.instance;
    };
    ModelManager.handleFileProgress = function () {
        return null;
    };
    ModelManager.prototype.loadStart = function () {
        var _this = this;
        var handler = function (e) {
            _this.dataXmlLoadCompleteHandler(e);
        };
        var path = "data/data.xml?random=" + Math.random();
        var preload = new createjs.LoadQueue();
        preload.addEventListener("fileprogress", ModelManager.handleFileProgress);
        preload.addEventListener("fileload", handler);
        preload.loadFile({ src: path, type: "xml" });
    };
    ModelManager.prototype.dataXmlLoadCompleteHandler = function (event) {
        var _this = this;
        var xml = event.result;
        this.sceneDataList = [];
        //
        var scenesNode = xml.getElementsByTagName("scenes")[0];
        var sceneNodeList = scenesNode.getElementsByTagName("scene");
        var n = sceneNodeList.length;
        for (var i = 0; i < n; i++) {
            var sceneNode = sceneNodeList[i];
            var sceneData = new SceneData();
            sceneData.setXmlNode(sceneNode);
            //
            this.sceneDataList.push(sceneData);
        }
        var handler = function () {
            _this.imageLoadCompleteHandler();
        };
        var imageLoaderManager = new ImageLoaderManager();
        imageLoaderManager.addEventListener("complete", handler);
        imageLoaderManager.loadStart(this.sceneDataList);
    };
    ModelManager.prototype.imageLoadCompleteHandler = function () {
        var createJSEvent = new createjs.Event("load_complete", false, false);
        this.dispatchEvent(createJSEvent);
    };
    return ModelManager;
}(createjs.EventDispatcher));
var SceneData = /** @class */ (function () {
    function SceneData() {
    }
    SceneData.prototype.getText = function () {
        return this.text;
    };
    SceneData.prototype.getXmlImageDataList = function () {
        return this.xmlImageDataList;
    };
    SceneData.prototype.setXmlNode = function (xmlNode) {
        if (xmlNode.getAttribute("id")) {
            this.id = xmlNode.getAttribute("id");
        }
        var elements = xmlNode.getElementsByTagName("text");
        if (elements[0]) {
            if (elements[0].firstChild) {
                this.text = elements[0].firstChild.nodeValue;
            }
        }
        this.xmlImageDataList = [];
        var childs = xmlNode.getElementsByTagName("images");
        if (childs[0]) {
            if (childs[0].firstChild) {
                var values = childs[0].getElementsByTagName("image");
                var n = values.length;
                for (var i = 0; i < n; i++) {
                    var childNode = values[i];
                    if (childNode.firstChild) {
                        var xmlImageData = new XmlImageData();
                        xmlImageData.setXmlNode(childNode);
                        this.xmlImageDataList.push(xmlImageData);
                    }
                }
            }
        }
    };
    return SceneData;
}());
var XmlImageData = /** @class */ (function () {
    function XmlImageData() {
    }
    XmlImageData.prototype.setXmlNode = function (xmlNode) {
        if (xmlNode.getAttribute("id")) {
            this.id = xmlNode.getAttribute("id");
        }
        if (xmlNode.firstChild) {
            this.path = xmlNode.firstChild.nodeValue;
        }
    };
    XmlImageData.prototype.setImageData = function (value) {
        this.imageData = value;
    };
    XmlImageData.prototype.getPath = function () {
        return this.path;
    };
    XmlImageData.prototype.getImageData = function () {
        return this.imageData;
    };
    return XmlImageData;
}());
var ImageLoaderManager = /** @class */ (function (_super) {
    __extends(ImageLoaderManager, _super);
    function ImageLoaderManager() {
        var _this = _super.call(this) || this;
        _this.imageCount = 0;
        _this.sceneCount = 0;
        return _this;
    }
    ImageLoaderManager.prototype.loadStart = function (sceneDataList) {
        this.sceneDataList = sceneDataList;
        this.initSceneLoad();
    };
    ImageLoaderManager.prototype.initSceneLoad = function () {
        this.sceneCount = 0;
        this.setSceneLoad();
    };
    ImageLoaderManager.prototype.setSceneLoad = function () {
        this.initImageLoad();
    };
    ImageLoaderManager.prototype.initImageLoad = function () {
        this.imageCount = 0;
        this.setImageLoad();
    };
    ImageLoaderManager.prototype.setImageLoad = function () {
        var _this = this;
        var handleFileCompleted = function (event) {
            _this.imageLoadCompleteHandler(event);
        };
        var sceneData = this.sceneDataList[this.sceneCount];
        var xmlImageData = sceneData.getXmlImageDataList()[this.imageCount];
        var path = xmlImageData.getPath();
        var loader = new createjs.LoadQueue();
        loader.addEventListener("fileload", handleFileCompleted);
        loader.loadFile({ src: path, type: "image" });
    };
    ImageLoaderManager.prototype.imageLoadCompleteHandler = function (event) {
        var imagData = event.result;
        var xmlImageData = this.sceneDataList[this.sceneCount].getXmlImageDataList()[this.imageCount];
        xmlImageData.setImageData(imagData);
        this.imageCount++;
        if (this.imageCount >= this.sceneDataList[this.sceneCount].getXmlImageDataList().length) {
            this.sceneLoadComplete();
        }
        else {
            this.setImageLoad();
        }
    };
    ImageLoaderManager.prototype.sceneLoadComplete = function () {
        this.sceneCount++;
        if (this.sceneCount >= this.sceneDataList.length) {
            this.loadComplete();
        }
        else {
            this.setSceneLoad();
        }
    };
    ImageLoaderManager.prototype.loadComplete = function () {
        var event = new createjs.Event("complete", false, false);
        this.dispatchEvent(event);
    };
    return ImageLoaderManager;
}(createjs.EventDispatcher));
var ViewManager = /** @class */ (function (_super) {
    __extends(ViewManager, _super);
    function ViewManager() {
        var _this = _super.call(this) || this;
        _this.count = 0;
        _this.RADIUS = 150;
        _this.name = "ViewManager";
        var sky = new createjs.Shape();
        stage.addChild(sky);
        sky.graphics.beginLinearGradientFill(["#0069A0", "#00AAE4"], [0, 1], 0, 0, 0, 480);
        sky.graphics.drawRect(0, 0, 640, 480);
        return _this;
    }
    ViewManager.prototype.start = function () {
        this.sceneManager = new SceneManager();
        this.addChild(this.sceneManager);
        this.sceneManager.start();
        this.ball = new createjs.Container();
        stage.addChild(this.ball);
        var shape = new createjs.Shape();
        this.ball.addChild(shape);
        var g = shape.graphics;
        g.beginFill("red");
        g.drawCircle(0, 0, 20);
        this.ball.x = 320 + this.RADIUS * Math.cos(this.count);
        this.ball.y = 240 + this.RADIUS * Math.sin(this.count);
    };
    ViewManager.prototype.enterFrame = function () {
        if (this.ball) {
            this.count += 0.01;
            this.ball.x = 320 + this.RADIUS * Math.cos(8 * this.count);
            this.ball.y = 240 + this.RADIUS * Math.sin(16 * this.count);
        }
    };
    return ViewManager;
}(createjs.Container));
var SceneContainer = /** @class */ (function (_super) {
    __extends(SceneContainer, _super);
    function SceneContainer() {
        var _this = _super.call(this) || this;
        _this.backgroundContainer = new createjs.Container();
        _this.addChild(_this.backgroundContainer);
        return _this;
    }
    SceneContainer.prototype.setSceneData = function (value) {
        this.sceneData = value;
        this.imageCount = 0;
        var textField = new createjs.Text();
        textField.color = "#CCCCCC";
        textField.font = "64px Futura PT Book";
        textField.text = this.sceneData.getText();
        this.addChild(textField);
    };
    SceneContainer.prototype.startTween = function () {
        this.addImage();
    };
    SceneContainer.prototype.addImage = function () {
        var imageData = this.sceneData.getXmlImageDataList()[this.imageCount].getImageData();
        this.bitmap = new createjs.Bitmap(imageData);
        this.bitmap.x = 640;
        this.backgroundContainer.addChild(this.bitmap);
        this.setTween();
    };
    SceneContainer.prototype.setTween = function () {
        var _this = this;
        var handler = function () {
            _this.tweenCompleteHandler();
        };
        if (this.removeBitmap) {
            var timeline = new createjs.Timeline();
            timeline.addTween(createjs.Tween.get(this.removeBitmap).to({ x: -640 }, 1200, createjs.Ease.cubicIn));
            timeline.addTween(createjs.Tween.get(this.bitmap).
                wait(800).to({ x: 0 }, 1200, createjs.Ease.cubicOut).call(handler));
        }
        else {
            createjs.Tween.get(this.bitmap).to({ x: 0 }, 1200, createjs.Ease.cubicOut).call(handler);
        }
    };
    SceneContainer.prototype.tweenCompleteHandler = function () {
        if (this.removeBitmap) {
            this.backgroundContainer.removeChild(this.removeBitmap);
        }
        this.removeBitmap = this.bitmap;
        this.imageCount++;
        if (this.imageCount >= this.sceneData.getXmlImageDataList().length) {
            var event_1 = new createjs.Event("scene_container_complete", false, false);
            this.dispatchEvent(event_1);
        }
        else {
            this.addImage();
        }
    };
    return SceneContainer;
}(createjs.Container));
var SceneManager = /** @class */ (function (_super) {
    __extends(SceneManager, _super);
    function SceneManager() {
        var _this = _super.call(this) || this;
        var shape = new createjs.Shape();
        _this.addChild(shape);
        var g = shape.graphics;
        g.beginFill("red");
        g.drawCircle(200, 200, 20);
        return _this;
    }
    SceneManager.prototype.start = function () {
        var modelManager = ModelManager.getInstance();
        this.sceneDataList = modelManager.sceneDataList;
        this.sceneCount = 0;
        this.addScene();
    };
    SceneManager.prototype.addScene = function () {
        var _this = this;
        var handler = function () {
            _this.sceneContainerCompleteHandler();
        };
        var sceneData = this.sceneDataList[this.sceneCount];
        this.sceneContainer = new SceneContainer();
        this.sceneContainer.setSceneData(sceneData);
        this.sceneContainer.addEventListener("scene_container_complete", handler);
        this.sceneContainer.y = -480;
        this.addChild(this.sceneContainer);
        this.setTween();
    };
    SceneManager.prototype.setTween = function () {
        var _this = this;
        var handler = function (event) {
            _this.tweenCompleteHandler(event);
        };
        if (this.removeSceneContainer) {
            var timeline = new createjs.Timeline();
            timeline.addTween(createjs.Tween.get(this.removeSceneContainer).to({ y: -480 }, 1200, createjs.Ease.cubicIn));
            timeline.addTween(createjs.Tween.get(this.sceneContainer).
                wait(800).to({ y: 0 }, 1200, createjs.Ease.cubicOut).call(handler));
        }
        else {
            createjs.Tween.get(this.sceneContainer).to({ y: 0 }, 1200, createjs.Ease.cubicOut).call(handler);
        }
    };
    SceneManager.prototype.tweenCompleteHandler = function (event) {
        this.sceneContainer.startTween();
        if (this.removeSceneContainer) {
            this.removeChild(this.removeSceneContainer);
        }
        this.removeSceneContainer = this.sceneContainer;
    };
    SceneManager.prototype.sceneContainerCompleteHandler = function () {
        this.nextScene();
    };
    SceneManager.prototype.nextScene = function () {
        this.sceneCount++;
        if (this.sceneCount >= this.sceneDataList.length) {
            this.sceneCount = 0;
        }
        this.addScene();
    };
    return SceneManager;
}(createjs.Container));
//# sourceMappingURL=ts.js.map