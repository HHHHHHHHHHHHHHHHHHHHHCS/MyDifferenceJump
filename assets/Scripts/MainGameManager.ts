import Player from "./Player";
import TileManager from "./TileManager";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class MainGameManager extends cc.Component {


	public tileManager: TileManager;

	isStart: boolean = false;

	//游戏开始的时候
	onLoad() {

		this.tileManager = new TileManager();
	}

	//第一帧开始
	start() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	//游戏开始
	StartGame() {
		this.isStart = true;
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
		Player.Instance.StartJump();
	}
}
