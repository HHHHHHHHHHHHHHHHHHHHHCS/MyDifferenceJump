import GameOverBg from "./GameOverBg";

const { ccclass, property } = cc._decorator;


@ccclass
export default class MainUIManager extends cc.Component {

	private gameOverBg: GameOverBg;
	private scoreText: cc.Label;

	onLoad() {
		this.gameOverBg = cc.find("GameOverBg", this.node).getComponent(GameOverBg);
		this.scoreText = cc.find("ScoreLabel/ScoreText", this.node).getComponent(cc.Label);
	}

	public UpdateScore(val: number): void {
		this.scoreText.string = Math.ceil(val).toString();
	}

	public ShowGameOverBg(): void {
		this.gameOverBg.Show();
	}
}
