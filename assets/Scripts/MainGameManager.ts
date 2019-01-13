import Player from "./Player";
import TileManager from "./TileManager";
import { GameState } from "./GameData";
import MyU from "./My/MyU";
import MainUIManager from "./MainUIManager";
import BackgroundManager from "./BackgroundManager";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class MainGameManager extends cc.Component {
	public static Instance: MainGameManager;


	public lastRecoveryY: number = Number.MIN_SAFE_INTEGER;//摄像机的最高Y

	public mainUIManager: MainUIManager;
	public tileManager: TileManager;
	public backgroundManager: BackgroundManager;

	public isPlaying: boolean;
	public gameState: GameState;

	private score: number = -1;


	//游戏开始的时候
	onLoad() {
		MainGameManager.Instance = this;
		this.mainUIManager = cc.find("World/UIRoot").getComponent(MainUIManager);
		this.backgroundManager = cc.find("World/Backgrounds").getComponent(BackgroundManager);
		this.tileManager = new TileManager();
	}

	//第一帧开始
	start() {
		this.UpdateNowScore(0);
		this.gameState = GameState.Ready;
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	//游戏开始
	public StartGame() {
		this.gameState = GameState.Playing;
		this.isPlaying = true;
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
		Player.Instance.StartJump();
	}

	public UpdateNowScore(val: number) {
		val = Math.ceil(val / 100);
		if (val > this.score) {
			this.score = val;
			this.mainUIManager.UpdateScore(val);
		}
	}

	public Recovery(cameraY: number) {
		if (this.isPlaying) {
			if (cameraY > this.lastRecoveryY) {
				this.lastRecoveryY = cameraY;
				this.tileManager.OnRecovery(cameraY);
				this.backgroundManager.OnRecovery(cameraY);
			}
		}
	}

	public GameOver() {
		this.gameState = GameState.GameOver;
		this.isPlaying = false;
		this.mainUIManager.ShowGameOverBg();
	}
}
