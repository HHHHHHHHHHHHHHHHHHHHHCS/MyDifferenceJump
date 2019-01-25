import MyU, { ClickEvent } from "./My/MyU";
import SceneManager from "./SceneManager";
import GameGameManager from "./GameGameManager";
import MyStorageManager, { StorageEnum } from "./My/MyStorageManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverBg extends cc.Component {
	private nowScoreText: cc.Label;
	private highScoreText: cc.Label;
	private reviveButton: cc.Button;
	protected onLoad() {
		this.nowScoreText = cc.find("NowScoreText", this.node).getComponent(cc.Label);
		this.highScoreText = cc.find("HighScoreText", this.node).getComponent(cc.Label);
		this.reviveButton = cc.find("ReviveButton", this.node).getComponent(cc.Button);
		let againButton = cc.find("AgainButton", this.node);
		let backMenuButton = cc.find("BackMenuButton", this.node);

		this.reviveButton.node.on(ClickEvent, this.ClickReivive, this);
		againButton.on(ClickEvent, this.ClickAgain, this);
		backMenuButton.on(ClickEvent, this.ClickBackMenu, this);
	}


	public Show() {
		this.node.active = true;
		this.nowScoreText.string = GameGameManager.Instance.NowScore.toString();
		this.reviveButton.interactable = !GameGameManager.Instance.IsReivived;
		let highScore = MyStorageManager.GetFloat(StorageEnum.HighScore);
		if (isNaN(highScore)) {
			highScore = 0;
		}
		this.highScoreText.string = highScore.toString();
	}

	public ClickReivive(event: cc.Button) {
		this.node.active = false;
		GameGameManager.Instance.DoReivive();
	}


	public ClickAgain(event: cc.Button) {
		SceneManager.ReLoadScene();
	}

	public ClickBackMenu(event: cc.Button) {
		SceneManager.LoadMenuScene();
	}
}
