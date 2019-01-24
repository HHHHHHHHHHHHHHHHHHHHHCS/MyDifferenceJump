import GameOverBg from "./GameOverBg";
import MyU, { ClickEvent } from "./My/MyU";
import MainGameManager from "./MainGameManager";
import { GameState } from "./GameData";

const { ccclass, property } = cc._decorator;


@ccclass
export default class MainUIManager extends cc.Component {
	public static Instance: MainUIManager;

	private pauseBg: cc.Node;
	private pauseButton: cc.Node;
	private resumeButton: cc.Node;
	private scoreText: cc.Label;
	private itemProgress: cc.ProgressBar;
	private dangerousTip: cc.Node;

	private gameOverBg: GameOverBg;

	protected onLoad() {
		MainUIManager.Instance = this;

		this.pauseBg = cc.find("PauseBg", this.node);
		this.pauseButton = cc.find("PauseButton", this.node);
		this.resumeButton = cc.find("ResumeButton", this.node);
		this.gameOverBg = cc.find("GameOverBg", this.node).getComponent(GameOverBg);
		this.scoreText = cc.find("ScoreText", this.node).getComponent(cc.Label);
		this.itemProgress = cc.find("ItemProgress", this.node).getComponent(cc.ProgressBar);
		this.dangerousTip = cc.find("DangerousTip", this.node);

		this.pauseButton.on(ClickEvent, this.ClickPause, this);
		this.resumeButton.on(ClickEvent, this.ClickResume, this);
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

	/** 点击暂停按钮 */
	public ClickPause(event?: cc.Button) {
		this.pauseBg.active = true;
		this.pauseButton.active = false;
		this.resumeButton.active = true;
		MainGameManager.Instance.PauseGame();
	}

	/** 点击继续按钮 */
	public ClickResume(event?: cc.Button) {
		this.pauseBg.active = false;
		this.pauseButton.active = true;
		this.resumeButton.active = false;
		MainGameManager.Instance.ResumeGame();
	}
}
