import Player from "./Player";
import TileManager from "./TileManager";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class MainGameManager extends cc.Component {
	public static Instance: MainGameManager;

	public tileManager: TileManager;

	private isStart: boolean = false;
	private lastRecoveryY: number = Number.MIN_SAFE_INTEGER;

	//游戏开始的时候
	onLoad() {
		MainGameManager.Instance = this;
		this.tileManager = new TileManager();
	}

	//第一帧开始
	start() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	//游戏开始
	public StartGame() {
		this.isStart = true;
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
		Player.Instance.StartJump();
	}

	public Recovery(cameraY: number) {
		if (cameraY > this.lastRecoveryY) {
			this.lastRecoveryY = cameraY;
			this.tileManager.OnRecovery(cameraY);
		}
	}
}
