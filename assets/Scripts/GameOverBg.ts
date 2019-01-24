import MyU, { ClickEvent } from "./My/MyU";
import SceneManager from "./SceneManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverBg extends cc.Component {
	private scoreText: cc.Label;

	protected onLoad() {
		this.scoreText = cc.find("ScoreText", this.node).getComponent(cc.Label);
		let reviveButton = cc.find("ReviveButton", this.node);
		let againButton = cc.find("AgainButton", this.node);
		let backMenuButton = cc.find("BackMenuButton", this.node);

		reviveButton.on(ClickEvent, this.ClickReivive, this);
		againButton.on(ClickEvent, this.ClickAgain, this);
		backMenuButton.on(ClickEvent, this.ClickBackMenu, this);
	}


	public Show() {
		this.node.active = true;
	}

	public ClickReivive(event: cc.Button) {
		MyU.Log("ClickReivive");
	}


	public ClickAgain(event: cc.Button) {
		SceneManager.ReLoadScene();
	}

	public ClickBackMenu(event: cc.Button) {
		SceneManager.LoadMenuScene();
	}
}
