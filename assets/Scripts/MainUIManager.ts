import GameOverBg from "./GameOverBg";
import MyU, { ClickEvent } from "./My/MyU";

const { ccclass, property } = cc._decorator;


@ccclass
export default class MainUIManager extends cc.Component {

	private pauseBg: cc.Node;
	private pauseButton: cc.Button;
	private resumeButton: cc.Button;
	private scoreText: cc.Label;
	private itemProgress: cc.ProgressBar;
	private dangerousTip: cc.Node;

	private gameOverBg: GameOverBg;

	protected onLoad() {

		this.pauseBg = cc.find("PauseBg", this.node);
		this.pauseButton = cc.find("PauseButton", this.node).getComponent(cc.Button);
		this.resumeButton = cc.find("ResumeButton", this.node).getComponent(cc.Button);
		this.gameOverBg = cc.find("GameOverBg", this.node).getComponent(GameOverBg);
		this.scoreText = cc.find("ScoreText", this.node).getComponent(cc.Label);
		this.itemProgress = cc.find("ItemProgress", this.node).getComponent(cc.ProgressBar);
		this.dangerousTip = cc.find("DangerousTip", this.node);

		this.pauseButton.node.on(ClickEvent, this.ClickPauseButton, this);

	}

	/** 更新分数 */
	public UpdateScore(val: number) {
		this.scoreText.string = Math.ceil(val).toString();
	}

	/** 更新游戏结束背景 */
	public ShowGameOverBg() {
		this.gameOverBg.Show();
	}

	/** 更新物品进度条 */
	public UpdateItemProgress(val: number) {
		if (val >= 0 && !this.itemProgress.node.active) {
			this.itemProgress.node.active = true;
		}
		if (val < 0 && this.itemProgress.node.active) {
			this.itemProgress.node.active = false;
		}
		else {
			this.itemProgress.progress = val;
		}
	}

	/** 显示危险提示 */
	public ShowDangerousTip(posX: number) {
		this.dangerousTip.active = true;
		this.dangerousTip.x = posX;
	}

	/** 隐藏危险提示 */
	public HideDangerousTip() {
		this.dangerousTip.active = false;
	}

	private ClickPauseButton(event: cc.Button) {
		MyU.Log(event);
MyU.Log(this);
	}
}
