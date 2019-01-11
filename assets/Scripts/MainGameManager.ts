import Player from "./Player";
import TileManager from "./TileManager";
import { GameState } from "./GameData";
import GameOverBg from "./GameOverBg";
import MyU from "./My/MyU";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class MainGameManager extends cc.Component {
	public static Instance: MainGameManager;

	public lastRecoveryY: number = Number.MIN_SAFE_INTEGER;//摄像机的最高Y

	public isPlaying: boolean;
	public gameState: GameState;
	public tileManager: TileManager;

	private gameOverBg:GameOverBg;


	//游戏开始的时候
	onLoad() {
		MainGameManager.Instance = this;
		this.node.position=cc.Camera.main.node.position;
		this.gameOverBg=cc.find("UIRoot/GameOverBg").getComponent(GameOverBg);
		this.tileManager = new TileManager();
	}

	//第一帧开始
	start() {
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

	public Recovery(cameraY: number) {
		if(this.isPlaying){
			if (cameraY > this.lastRecoveryY) {
				this.lastRecoveryY = cameraY;
				this.tileManager.OnRecovery(cameraY);
			}
		}
	}

	public GameOver() {
		this.gameState = GameState.GameOver;
		this.isPlaying = false;
		this.gameOverBg.Show();
	}
}
