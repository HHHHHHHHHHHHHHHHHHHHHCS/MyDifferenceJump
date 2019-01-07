import Player from "./Player";

const { ccclass, property } = cc._decorator;

/** 主游戏场景控制 */
@ccclass
export default class MainGameManager extends cc.Component {

	isStart: boolean = false;

	//游戏开始的时候
	onLoad() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.StartGame, this);
	}

	//第一帧开始
	start() {
		let x = this.node.position.x;
		Player.Instance.SetXBorder(-x, x);
	}

	//游戏开始
	StartGame() {
		this.isStart = true;
		this.node.off(cc.Node.EventType.TOUCH_START, this.StartGame, this);
		Player.Instance.StartJump();
	}
}
