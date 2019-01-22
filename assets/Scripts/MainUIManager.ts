import GameOverBg from "./GameOverBg";

const { ccclass, property } = cc._decorator;


@ccclass
export default class MainUIManager extends cc.Component {

	private gameOverBg: GameOverBg;
	private scoreText: cc.Label;
	private itemProgress: cc.ProgressBar;
	private dangerousTip: cc.Node;

	onLoad() {
		this.gameOverBg = cc.find("GameOverBg", this.node).getComponent(GameOverBg);
		this.scoreText = cc.find("ScoreLabel/ScoreText", this.node).getComponent(cc.Label);
		this.itemProgress = cc.find("ItemProgress", this.node).getComponent(cc.ProgressBar);
		this.dangerousTip = cc.find("DangerousTip", this.node);
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

	public ShowDangerousTip(posX: number) {
		this.dangerousTip.active = true;
		this.dangerousTip.x = posX;
	}

	public HideDangerousTip() {
		this.dangerousTip.active = false;
	}
}
