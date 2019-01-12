import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverBg extends cc.Component {

	public Show() {
		this.node.active = true;
		this.node.on(cc.Node.EventType.TOUCH_START, this.GameOver, this);
	}

	public GameOver() {
		cc.director.loadScene(cc.director.getScene().name);
	}

}
