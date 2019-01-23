import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverBg extends cc.Component {
	private scoreText: cc.Label;
	private reviveButton: cc.Button;
	private againButton: cc.Button;
	private backMenuButton: cc.Button;

	protected onLoad() {

		this.scoreText = cc.find("ScoreText", this.node).getComponent(cc.Label);
		this.reviveButton = cc.find("ReviveButton", this.node).getComponent(cc.Button);
		this.againButton = cc.find("AgainButton", this.node).getComponent(cc.Button);
		this.backMenuButton = cc.find("BackMenuButton", this.node).getComponent(cc.Button);

	}


	public Show() {
		this.node.active = true;
		this.node.on(cc.Node.EventType.TOUCH_START, this.GameOver, this);
	}

	public GameOver() {
		cc.director.loadScene(cc.director.getScene().name);
	}

}
