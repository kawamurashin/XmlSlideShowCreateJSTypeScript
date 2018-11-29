class SceneData {
    private xmlImageDataList: XmlImageData[];
    private id: string;
    private text: string;

    public getText() {
        return this.text;
    }

    public getXmlImageDataList() {
        return this.xmlImageDataList;
    }

    public setXmlNode(xmlNode: Element): void {
        if (xmlNode.getAttribute("id")) {
            this.id = xmlNode.getAttribute("id");
        }
        const elements = xmlNode.getElementsByTagName("text");
        if (elements[0]) {
            if (elements[0].firstChild) {
                this.text = elements[0].firstChild.nodeValue;
            }
        }
        this.xmlImageDataList = [];
        const childs = xmlNode.getElementsByTagName("images");
        if (childs[0]) {
            if (childs[0].firstChild) {
                const values = childs[0].getElementsByTagName("image");
                const n = values.length;
                for (let i = 0; i < n; i++) {
                    const childNode = values[i];
                    if (childNode.firstChild) {
                        const xmlImageData: XmlImageData = new XmlImageData();
                        xmlImageData.setXmlNode(childNode);
                        this.xmlImageDataList.push(xmlImageData);
                    }
                }
            }
        }
    }
}
