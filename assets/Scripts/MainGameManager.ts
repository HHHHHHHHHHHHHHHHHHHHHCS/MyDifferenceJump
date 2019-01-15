import Player from "./Player";
import TileManager from "./TileManager";
import { GameState } from "./GameData";
import MyU from "./My/MyU";
import MainUIManager from "./MainUIManager";
import BackgroundManager from "./BackgroundManager";
import GameData from "./GameData";

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

	private nowScore: number = 0;//当前的分数
	private hardNumber: number = 1;//当前的难度系数

	public get HardNumber() {
		return this.hardNumber;
	}

	/** 游戏开始的时候 */
	onLoad() {
		MainGameManager.Instance = this;
		this.mainUIManager = cc.find("World/UIRoot").getComponent(MainUIManager);
		this.backgroundManager = cc.find("World/Backgrounds").getComponent(BackgroundManager);
		this.tileManager = new TileManager();
	}

	/** 第一帧开始 */
	start() {
		this.UpdateNowScore(0);
		this.gameState = GameState.Ready;
		this.AddHard(1);
		this.tileManager.OnStart();
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	/** 游戏开始 */
	public StartGame() {
		this.gameState = GameState.Playing;
		this.isPlaying = true;
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
		Player.Instance.StartJump();
	}

	/** 更新分数 */
	public UpdateNowScore(val: number) {
		val = Math.ceil(val / 100);
		if (val > this.nowScore) {
			this.nowScore = val;
			this.mainUIManager.UpdateScore(val);
		}
	}

	/** 回收 */
	public Recovery(cameraY: number) {
		if (this.isPlaying) {
			if (cameraY > this.lastRecoveryY) {
				this.lastRecoveryY = cameraY;
				this.tileManager.OnRecovery(cameraY);
				this.backgroundManager.OnRecovery(cameraY);
			}
		}
	}

	/** 游戏结束 */
	public GameOver() {
		this.gameState = GameState.GameOver;
		this.isPlaying = false;
		this.mainUIManager.ShowGameOverBg();
	}

	/** 添加难度 */
	public AddHard(val?: number): void {
		if (val) {
			this.hardNumber = val;
		}
		else {
			this.hardNumber *= GameData.hardBase;
		}
		Player.Instance.AddHard(this.hardNumber);
	}
}
