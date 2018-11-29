class XmlImageData {
    private id: string;
    private path: string;
    private imageData: ImageData;
    public setXmlNode(xmlNode: Element) {
        if (xmlNode.getAttribute("id")) {
            this.id = xmlNode.getAttribute("id");
        }
        if (xmlNode.firstChild) {
            this.path = xmlNode.firstChild.nodeValue;
        }
    }
    public setImageData(value: ImageData) {
        this.imageData = value;
    }

    public getPath(): string {
        return this.path;
    }

    public getImageData(): ImageData {
        return this.imageData;
    }
}
